const socketIo = require('socket.io');
const User = require('../models/User');

class NotificationService {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // userId -> socketId
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Authenticate user
      socket.on('authenticate', async (token) => {
        try {
          // Verify token and get user
          const user = await this.verifyToken(token);
          if (user) {
            this.userSockets.set(user._id.toString(), socket.id);
            socket.userId = user._id.toString();
            socket.emit('authenticated', { userId: user._id });
          }
        } catch (error) {
          socket.emit('auth_error', { message: 'Authentication failed' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
        }
        console.log('User disconnected:', socket.id);
      });
    });
  }

  // Send notification to specific user
  async sendToUser(userId, notification) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
    }
  }

  // Send notification to multiple users
  async sendToUsers(userIds, notification) {
    userIds.forEach(userId => {
      this.sendToUser(userId, notification);
    });
  }

  // Send notification to all connected users
  async sendToAll(notification) {
    this.io.emit('notification', notification);
  }

  // Campaign-related notifications
  async notifyCampaignCreated(campaign) {
    const notification = {
      type: 'campaign_created',
      title: 'New Campaign Available',
      message: `New campaign: ${campaign.title.en}`,
      data: { campaignId: campaign._id },
      timestamp: new Date()
    };

    // Notify relevant influencers
    const influencers = await this.getRelevantInfluencers(campaign);
    await this.sendToUsers(influencers.map(i => i._id.toString()), notification);
  }

  async notifyApplicationReceived(campaign, influencer) {
    const notification = {
      type: 'application_received',
      title: 'New Application',
      message: `${influencer.profile.name} applied to your campaign`,
      data: { 
        campaignId: campaign._id,
        influencerId: influencer._id 
      },
      timestamp: new Date()
    };

    await this.sendToUser(campaign.brandId.toString(), notification);
  }

  async notifyApplicationAccepted(campaign, influencer) {
    const notification = {
      type: 'application_accepted',
      title: 'Application Accepted',
      message: `Your application for "${campaign.title.en}" was accepted!`,
      data: { campaignId: campaign._id },
      timestamp: new Date()
    };

    await this.sendToUser(influencer._id.toString(), notification);
  }

  async notifyContentSubmitted(campaign, influencer) {
    const notification = {
      type: 'content_submitted',
      title: 'Content Submitted',
      message: `${influencer.profile.name} submitted content for review`,
      data: { 
        campaignId: campaign._id,
        influencerId: influencer._id 
      },
      timestamp: new Date()
    };

    await this.sendToUser(campaign.brandId.toString(), notification);
  }

  async notifyContentApproved(campaign, influencer) {
    const notification = {
      type: 'content_approved',
      title: 'Content Approved',
      message: `Your content for "${campaign.title.en}" was approved!`,
      data: { campaignId: campaign._id },
      timestamp: new Date()
    };

    await this.sendToUser(influencer._id.toString(), notification);
  }

  // Get relevant influencers for a campaign
  async getRelevantInfluencers(campaign) {
    // This would use the matching service to find relevant influencers
    // For now, return all active influencers
    return await User.find({ 
      userType: 'influencer',
      isActive: true 
    });
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findById(decoded.userId);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new NotificationService();
