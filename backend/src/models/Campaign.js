const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    ko: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    ko: String,
    en: String,
    ar: String
  },
  category: {
    type: String,
    enum: ['beauty', 'fashion', 'food', 'lifestyle', 'tech', 'travel', 'other'],
    required: true
  },
  requirements: {
    influencerTypes: [{
      type: String,
      enum: ['micro', 'macro', 'mega', 'celebrity']
    }],
    minFollowers: Number,
    maxFollowers: Number,
    languages: [{
      type: String,
      enum: ['ko', 'en', 'ar']
    }],
    locations: [String],
    contentTypes: [{
      type: String,
      enum: ['post', 'story', 'reel', 'video', 'live']
    }],
    platforms: [{
      type: String,
      enum: ['instagram', 'tiktok', 'youtube', 'twitter']
    }]
  },
  budget: {
    total: { type: Number, required: true },
    perInfluencer: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  timeline: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    contentDeadline: Date
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  applications: [{
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending'
    },
    proposal: {
      content: String,
      price: Number,
      timeline: String
    },
    appliedAt: { type: Date, default: Date.now }
  }],
  selectedInfluencers: [{
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedBudget: Number,
    status: {
      type: String,
      enum: ['assigned', 'in_progress', 'content_submitted', 'approved', 'published', 'completed'],
      default: 'assigned'
    },
    assignedAt: { type: Date, default: Date.now }
  }],
  contentGuidelines: {
    ko: String,
    en: String,
    ar: String
  },
  hashtags: [String],
  mentions: [String],
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  metrics: {
    totalReach: { type: Number, default: 0 },
    totalEngagement: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    roi: { type: Number, default: 0 }
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
campaignSchema.index({ brandId: 1, status: 1 });
campaignSchema.index({ category: 1, status: 1 });
campaignSchema.index({ 'requirements.locations': 1 });
campaignSchema.index({ 'timeline.startDate': 1, 'timeline.endDate': 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
