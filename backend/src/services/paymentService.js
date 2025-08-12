const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const User = require('../models/User'); // Added missing import for User

class PaymentService {
  // Create payment intent for campaign
  async createPaymentIntent(campaignId, amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: {
          campaignId: campaignId
        }
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Process campaign payment
  async processCampaignPayment(campaignId, brandId, amount, paymentMethodId) {
    try {
      // Create payment intent
      const paymentIntent = await this.createPaymentIntent(campaignId, amount);

      // Confirm payment
      const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: paymentMethodId
      });

      if (confirmedPayment.status === 'succeeded') {
        // Save payment record
        const payment = new Payment({
          campaignId,
          brandId,
          amount,
          currency: 'USD',
          status: 'completed',
          stripePaymentIntentId: confirmedPayment.id,
          paymentMethod: 'stripe'
        });

        await payment.save();
        return payment;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Process influencer payout
  async processInfluencerPayout(influencerId, amount, currency = 'usd') {
    try {
      // Get influencer's connected account
      const influencer = await User.findById(influencerId);
      if (!influencer.stripeAccountId) {
        throw new Error('Influencer not connected to Stripe');
      }

      // Create transfer to influencer's connected account
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: currency,
        destination: influencer.stripeAccountId,
        description: 'Campaign payment'
      });

      // Save payout record
      const payout = new Payment({
        influencerId,
        amount,
        currency: currency.toUpperCase(),
        status: 'completed',
        stripeTransferId: transfer.id,
        paymentMethod: 'stripe_transfer'
      });

      await payout.save();
      return payout;
    } catch (error) {
      console.error('Error processing payout:', error);
      throw error;
    }
  }

  // Create Stripe Connect account for influencer
  async createInfluencerAccount(influencerId, email, country = 'US') {
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        country: country,
        email: email,
        capabilities: {
          transfers: { requested: true }
        }
      });

      // Update influencer with Stripe account ID
      await User.findByIdAndUpdate(influencerId, {
        stripeAccountId: account.id
      });

      return account;
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  // Refund payment
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refundParams = {
        payment_intent: paymentIntentId
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundParams);
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Calculate platform fees
  calculatePlatformFees(amount) {
    const platformFeeRate = 0.10; // 10% platform fee
    const platformFee = amount * platformFeeRate;
    const influencerAmount = amount - platformFee;

    return {
      total: amount,
      platformFee,
      influencerAmount
    };
  }

  // Get payment history for user
  async getPaymentHistory(userId, userType) {
    try {
      const query = userType === 'brand' ? { brandId: userId } : { influencerId: userId };
      const payments = await Payment.find(query)
        .sort({ createdAt: -1 })
        .populate('campaignId', 'title');

      return payments;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  // Generate invoice
  async generateInvoice(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .populate('campaignId', 'title')
        .populate('brandId', 'profile.name');

      if (!payment) {
        throw new Error('Payment not found');
      }

      // This would typically generate a PDF invoice
      // For now, return invoice data
      return {
        invoiceNumber: `INV-${payment._id}`,
        date: payment.createdAt,
        dueDate: payment.createdAt,
        customer: payment.brandId.profile.name,
        items: [{
          description: `Campaign: ${payment.campaignId.title.en}`,
          amount: payment.amount,
          currency: payment.currency
        }],
        total: payment.amount,
        currency: payment.currency
      };
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
