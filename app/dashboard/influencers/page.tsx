'use client';

import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { 
  Users, 
  DollarSign, 
  Heart,
  BarChart3,
  Plus,
  Search,
  Calendar,
  Award,
  Instagram,
  Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const InfluencerDashboard = () => {
  const { user } = useAuth();
  // const { t } = useLanguage();

  const stats = [
    {
      title: 'Total Followers',
      value: '156K',
      change: '+2.4K this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Avg. Engagement',
      value: '4.8%',
      change: '+0.3% from last month',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Monthly Earnings',
      value: '$3,240',
      change: '+18% from last month',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Campaigns',
      value: '5',
      change: '2 completed this month',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const activeCampaigns = [
    {
      id: 1,
      brand: 'K-Beauty Co.',
      title: 'Summer Skincare Collection',
      type: 'Instagram Post + Story',
      deadline: '2024-02-15',
      payment: '$850',
      status: 'In Progress',
      completion: 60
    },
    {
      id: 2,
      brand: 'Seoul Fashion',
      title: 'Spring Fashion Trends',
      type: 'YouTube Video',
      deadline: '2024-02-20',
      payment: '$1,200',
      status: 'Content Review',
      completion: 80
    },
    {
      id: 3,
      brand: 'Korean Cosmetics',
      title: 'Makeup Tutorial Series',
      type: 'Instagram Reel',
      deadline: '2024-02-25',
      payment: '$650',
      status: 'Planning',
      completion: 20
    }
  ];

  const recentPerformance = [
    {
      id: 1,
      content: 'Korean Skincare Routine',
      platform: 'Instagram',
      date: '2024-01-28',
      views: '45.2K',
      likes: '2.1K',
      comments: '156',
      engagement: '4.9%'
    },
    {
      id: 2,
      content: 'K-Pop Makeup Look',
      platform: 'YouTube',
      date: '2024-01-25',
      views: '89.5K',
      likes: '4.3K',
      comments: '287',
      engagement: '5.2%'
    },
    {
      id: 3,
      content: 'Korean Street Food',
      platform: 'Instagram',
      date: '2024-01-22',
      views: '32.8K',
      likes: '1.8K',
      comments: '94',
      engagement: '5.8%'
    }
  ];

  const brandOpportunities = [
    {
      id: 1,
      brand: 'Seoul Skincare',
      category: 'Beauty',
      budget: '$800 - $1,200',
      requirements: 'Instagram Post + Story',
      matchScore: 95,
      deadline: '2024-02-18'
    },
    {
      id: 2,
      brand: 'K-Fashion Hub',
      category: 'Fashion',
      budget: '$600 - $900',
      requirements: 'YouTube Short',
      matchScore: 87,
      deadline: '2024-02-22'
    },
    {
      id: 3,
      brand: 'Korean Food Co.',
      category: 'Food & Lifestyle',
      budget: '$500 - $800',
      requirements: 'Instagram Reel',
      matchScore: 82,
      deadline: '2024-02-25'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Influencer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.profile.name}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button size="sm">
                <Search className="w-4 h-4 mr-2" />
                Find Campaigns
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
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
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
          {/* Active Campaigns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Active Campaigns</h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                          <p className="text-sm text-gray-600">{campaign.brand}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          campaign.status === 'In Progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : campaign.status === 'Content Review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>{campaign.type}</span>
                        <span>Due: {campaign.deadline}</span>
                        <span className="font-medium text-green-600">{campaign.payment}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${campaign.completion}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{campaign.completion}% Complete</span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Opportunities */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">New Opportunities</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {brandOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{opportunity.brand}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          opportunity.matchScore >= 90 
                            ? 'bg-green-100 text-green-800'
                            : opportunity.matchScore >= 80
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {opportunity.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{opportunity.category}</p>
                      <p className="text-sm font-medium text-green-600 mb-2">{opportunity.budget}</p>
                      <p className="text-xs text-gray-600 mb-3">{opportunity.requirements}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Due: {opportunity.deadline}</span>
                        <Button size="sm">
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Search className="w-4 h-4 mr-2" />
                  Browse More Campaigns
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Content Performance</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600 border-b">
                      <th className="pb-3">Content</th>
                      <th className="pb-3">Platform</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3">Likes</th>
                      <th className="pb-3">Comments</th>
                      <th className="pb-3">Engagement</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentPerformance.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-900">{item.content}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            {item.platform === 'Instagram' ? 
                              <Instagram className="w-4 h-4 text-pink-600 mr-1" /> : 
                              <Youtube className="w-4 h-4 text-red-600 mr-1" />
                            }
                            {item.platform}
                          </div>
                        </td>
                        <td className="py-3 text-gray-600">{item.date}</td>
                        <td className="py-3">{item.views}</td>
                        <td className="py-3">{item.likes}</td>
                        <td className="py-3">{item.comments}</td>
                        <td className="py-3">
                          <span className="text-green-600 font-medium">{item.engagement}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <Search className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Find Campaigns</div>
                  <div className="text-sm opacity-90">Discover new brand partnerships</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <Plus className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Upload Content</div>
                  <div className="text-sm">Add to your portfolio</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
                <Award className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Update Profile</div>
                  <div className="text-sm">Keep your info current</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerDashboard;

