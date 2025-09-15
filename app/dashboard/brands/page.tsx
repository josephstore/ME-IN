'use client';

import React, { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/lib/SimpleAuthContext';
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
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

const BrandDashboard = () => {
  const { user, isAuthenticated } = useSimpleAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const { t } = useLanguage();

  // 대시보드 통계 로드
  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const response = await fetch('/api/analytics/dashboard?user_id=demo&user_type=brand');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const statsData = [
    {
      title: 'Active Campaigns',
      value: stats?.active_campaigns?.toString() || '12',
      change: '+23%',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Reach',
      value: stats?.total_reach ? `${(stats.total_reach / 1000000).toFixed(1)}M` : '2.1M',
      change: '+15%',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Engagement Rate',
      value: stats?.engagement_rate ? `${stats.engagement_rate}%` : '4.2%',
      change: '+8%',
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'ROI',
      value: stats?.roi ? `${stats.roi}%` : '285%',
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
      <Header />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-0 sm:h-16 gap-4 sm:gap-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-navy-600 truncate">Brand Dashboard</h1>
              <p className="text-sm text-navy-500 truncate">Welcome back, {user?.name || 'User'}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="border-navy-200 text-navy-600 hover:bg-navy-50 w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
              </Button>
              <Button size="sm" className="bg-salmon-500 hover:bg-salmon-600 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Campaign</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // 로딩 상태
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-beige-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0 ml-2"></div>
                </div>
              </div>
            ))
          ) : (
            statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-beige-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-navy-500 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-navy-600 mt-1 sm:mt-2">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-salmon-600 mt-1 truncate">{stat.change} from last month</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
                    <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Campaigns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-beige-200">
              <div className="p-6 border-b border-beige-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-navy-600">Recent Campaigns</h2>
                  <Button variant="outline" size="sm" className="border-navy-200 text-navy-600 hover:bg-navy-50">
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-beige-50 rounded-lg gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-navy-600 truncate">{campaign.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-navy-500">
                          <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                            campaign.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : campaign.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {campaign.status}
                          </span>
                          <span className="whitespace-nowrap">{campaign.influencers} influencers</span>
                          <span className="whitespace-nowrap">{campaign.reach} reach</span>
                          <span className="whitespace-nowrap">{campaign.engagement} engagement</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <p className="font-medium text-navy-600">{campaign.budget}</p>
                        <Button variant="outline" size="sm" className="mt-2 border-navy-200 text-navy-600 hover:bg-navy-50 w-full sm:w-auto">
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
            <div className="bg-white rounded-lg shadow-sm border border-beige-200">
              <div className="p-6 border-b border-beige-200">
                <h2 className="text-lg font-semibold text-navy-600">Top Performing Influencers</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topInfluencers.map((influencer) => (
                    <div key={influencer.id} className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-navy-500 to-salmon-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-xs sm:text-sm">
                          {influencer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-navy-600 text-sm truncate">{influencer.name}</h3>
                        <p className="text-xs text-navy-500 truncate">{influencer.category}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-navy-400 whitespace-nowrap">{influencer.followers}</span>
                          <span className="text-xs text-salmon-600 whitespace-nowrap">{influencer.engagement}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-navy-200 text-navy-600 hover:bg-navy-50 flex-shrink-0">
                        <span className="hidden sm:inline">Contact</span>
                        <span className="sm:hidden">Msg</span>
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-navy-200 text-navy-600 hover:bg-navy-50">
                  <Search className="w-4 h-4 mr-2" />
                  Find More Influencers
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-beige-200 p-6">
            <h2 className="text-lg font-semibold text-navy-600 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button className="flex items-center justify-center p-4 h-auto bg-salmon-500 hover:bg-salmon-600">
                <Plus className="w-5 h-5 mr-2 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-medium truncate">Create Campaign</div>
                  <div className="text-sm opacity-90 truncate">Start a new influencer campaign</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto border-navy-200 text-navy-600 hover:bg-navy-50">
                <Search className="w-5 h-5 mr-2 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-medium truncate">Find Influencers</div>
                  <div className="text-sm truncate">Discover new content creators</div>
                </div>
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4 h-auto border-navy-200 text-navy-600 hover:bg-navy-50 sm:col-span-2 lg:col-span-1">
                <BarChart3 className="w-5 h-5 mr-2 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <div className="font-medium truncate">View Analytics</div>
                  <div className="text-sm truncate">Deep dive into performance</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default BrandDashboard;

