'use client';

import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { 
  TrendingUp, 
  Target,
  BarChart3,
  Eye,
  MessageCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const BrandDashboard = () => {
  const { user } = useAuth();
  // const { t } = useLanguage();

  const stats = [
    {
      title: 'Active Campaigns',
      value: '12',
      change: '+23%',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Reach',
      value: '2.1M',
      change: '+15%',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Engagement Rate',
      value: '4.2%',
      change: '+8%',
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'ROI',
      value: '285%',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: 'K-Beauty Summer Collection',
      status: 'Active',
      influencers: 8,
      reach: '450K',
      engagement: '3.8%',
      budget: '$5,000'
    },
    {
      id: 2,
      name: 'Korean Skincare Routine',
      status: 'Completed',
      influencers: 12,
      reach: '680K',
      engagement: '4.5%',
      budget: '$8,000'
    },
    {
      id: 3,
      name: 'K-Fashion Trends 2024',
      status: 'Planning',
      influencers: 0,
      reach: '0',
      engagement: '0%',
      budget: '$3,500'
    }
  ];

  const topInfluencers = [
    {
      id: 1,
      name: 'Aisha Al-Rashid',
      category: 'Beauty & Lifestyle',
      followers: '150K',
      engagement: '4.2%',
      location: 'Saudi Arabia',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 2,
      name: 'Mohammed Hassan',
      category: 'Fashion',
      followers: '89K',
      engagement: '3.8%',
      location: 'UAE',
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 3,
      name: 'Layla Ahmed',
      category: 'Food & Travel',
      followers: '210K',
      engagement: '5.1%',
      location: 'Qatar',
      avatar: '/api/placeholder/40/40'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Brand Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.profile.name}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Campaigns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            campaign.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : campaign.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {campaign.status}
                          </span>
                          <span>{campaign.influencers} influencers</span>
                          <span>{campaign.reach} reach</span>
                          <span>{campaign.engagement} engagement</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{campaign.budget}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Influencers */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Top Performing Influencers</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topInfluencers.map((influencer) => (
                    <div key={influencer.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {influencer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{influencer.name}</h3>
                        <p className="text-xs text-gray-600">{influencer.category}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{influencer.followers}</span>
                          <span className="text-xs text-green-600">{influencer.engagement}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Search className="w-4 h-4 mr-2" />
                  Find More Influencers
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="flex items-center justify-center p-4 h-auto">
                <Plus className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Create Campaign</div>
                  <div className="text-sm opacity-90">Start a new influencer campaign</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <Search className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Find Influencers</div>
                  <div className="text-sm">Discover new content creators</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <BarChart3 className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm">Deep dive into performance</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;

