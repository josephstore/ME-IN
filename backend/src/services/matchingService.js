const Campaign = require('../models/Campaign');
const User = require('../models/User');

class MatchingService {
  // Calculate match score between influencer and campaign
  calculateMatchScore(influencer, campaign) {
    let totalScore = 0;
    let weights = {
      contentSimilarity: 0.3,
      audienceOverlap: 0.25,
      performanceHistory: 0.25,
      locationFit: 0.2
    };

    // Content similarity (30%)
    const contentScore = this.calculateContentSimilarity(influencer, campaign);
    totalScore += contentScore * weights.contentSimilarity;

    // Audience overlap (25%)
    const audienceScore = this.calculateAudienceOverlap(influencer, campaign);
    totalScore += audienceScore * weights.audienceOverlap;

    // Performance history (25%)
    const performanceScore = this.calculatePerformanceScore(influencer);
    totalScore += performanceScore * weights.performanceHistory;

    // Location fit (20%)
    const locationScore = this.calculateLocationFit(influencer, campaign);
    totalScore += locationScore * weights.locationFit;

    return Math.min(totalScore, 1.0);
  }

  // Calculate content similarity based on expertise and category
  calculateContentSimilarity(influencer, campaign) {
    const influencerExpertise = influencer.profile?.expertise || [];
    const campaignCategory = campaign.category;

    // Category mapping
    const categoryMapping = {
      beauty: ['beauty', 'skincare', 'makeup', 'cosmetics'],
      fashion: ['fashion', 'style', 'clothing', 'accessories'],
      food: ['food', 'cooking', 'restaurant', 'cuisine'],
      lifestyle: ['lifestyle', 'wellness', 'fitness', 'health'],
      tech: ['technology', 'gadgets', 'software', 'apps'],
      travel: ['travel', 'tourism', 'adventure', 'destinations']
    };

    const campaignKeywords = categoryMapping[campaignCategory] || [campaignCategory];
    
    // Check if influencer expertise matches campaign category
    const matchingKeywords = influencerExpertise.filter(expertise =>
      campaignKeywords.some(keyword => 
        expertise.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    return matchingKeywords.length / Math.max(influencerExpertise.length, 1);
  }

  // Calculate audience overlap (simplified)
  calculateAudienceOverlap(influencer, campaign) {
    // This would typically involve analyzing follower demographics
    // For now, we'll use a simplified approach based on follower count
    const influencerFollowers = influencer.profile?.followers || 0;
    const campaignMinFollowers = campaign.requirements?.minFollowers || 0;
    const campaignMaxFollowers = campaign.requirements?.maxFollowers || Infinity;

    if (influencerFollowers < campaignMinFollowers || influencerFollowers > campaignMaxFollowers) {
      return 0;
    }

    // Higher score for influencers within the target range
    const range = campaignMaxFollowers - campaignMinFollowers;
    if (range === 0) return 1;

    const distance = Math.abs(influencerFollowers - (campaignMinFollowers + range / 2));
    return Math.max(0, 1 - (distance / range));
  }

  // Calculate performance score based on historical data
  calculatePerformanceScore(influencer) {
    // This would typically analyze past campaign performance
    // For now, we'll use engagement rate as a proxy
    const avgEngagement = influencer.profile?.avgEngagement || 0;
    
    // Normalize engagement rate (typical range: 1-10%)
    return Math.min(avgEngagement / 10, 1.0);
  }

  // Calculate location fit
  calculateLocationFit(influencer, campaign) {
    const influencerLocations = influencer.profile?.locations || [];
    const campaignLocations = campaign.requirements?.locations || [];

    if (campaignLocations.length === 0) return 1; // No location requirement

    const matchingLocations = influencerLocations.filter(location =>
      campaignLocations.some(campaignLocation =>
        location.toLowerCase().includes(campaignLocation.toLowerCase()) ||
        campaignLocation.toLowerCase().includes(location.toLowerCase())
      )
    );

    return matchingLocations.length / Math.max(campaignLocations.length, 1);
  }

  // Get recommendations for a campaign
  async getRecommendationsForCampaign(campaignId, limit = 20) {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Get all influencers
      const influencers = await User.find({ 
        userType: 'influencer',
        isActive: true 
      });

      // Calculate match scores
      const recommendations = influencers.map(influencer => ({
        influencer,
        matchScore: this.calculateMatchScore(influencer, campaign)
      }));

      // Sort by match score and return top results
      return recommendations
        .filter(rec => rec.matchScore > 0.3) // Minimum threshold
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  // Get recommendations for an influencer
  async getRecommendationsForInfluencer(influencerId, limit = 20) {
    try {
      const influencer = await User.findById(influencerId);
      if (!influencer || influencer.userType !== 'influencer') {
        throw new Error('Influencer not found');
      }

      // Get active campaigns
      const campaigns = await Campaign.find({ 
        status: 'active',
        isPublic: true 
      });

      // Calculate match scores
      const recommendations = campaigns.map(campaign => ({
        campaign,
        matchScore: this.calculateMatchScore(influencer, campaign)
      }));

      // Sort by match score and return top results
      return recommendations
        .filter(rec => rec.matchScore > 0.3) // Minimum threshold
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  // Apply to campaign
  async applyToCampaign(influencerId, campaignId, proposal) {
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Check if already applied
      const existingApplication = campaign.applications.find(
        app => app.influencerId.toString() === influencerId
      );

      if (existingApplication) {
        throw new Error('Already applied to this campaign');
      }

      // Add application
      campaign.applications.push({
        influencerId,
        proposal,
        status: 'pending'
      });

      await campaign.save();
      return campaign;
    } catch (error) {
      console.error('Error applying to campaign:', error);
      throw error;
    }
  }
}

module.exports = new MatchingService();
