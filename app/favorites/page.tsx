'use client'

import React, { useState } from 'react'
import { Heart, Search, Filter, Star, MapPin, Users, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface FavoriteItem {
  id: string
  type: 'influencer' | 'campaign'
  title: string
  subtitle: string
  image: string
  location?: string
  followers?: number
  rating?: number
  budget?: string
  participants?: number
}

export default function FavoritesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'influencers' | 'campaigns'>('influencers')

  // Sample favorites data
  const favoriteInfluencers: FavoriteItem[] = [
    {
      id: '1',
      type: 'influencer',
      title: 'Sarah Ahmed',
      subtitle: 'Beauty & Lifestyle',
      image: '/images/avatar1.jpg',
      location: 'Dubai, UAE',
      followers: 125000,
      rating: 4.8
    },
    {
      id: '2',
      type: 'influencer',
      title: 'Mohammed Al-Rashid',
      subtitle: 'Fashion & Travel',
      image: '/images/avatar2.jpg',
      location: 'Abu Dhabi, UAE',
      followers: 89000,
      rating: 4.6
    },
    {
      id: '3',
      type: 'influencer',
      title: 'Fatima Hassan',
      subtitle: 'Food & Culture',
      image: '/images/avatar3.jpg',
      location: 'Sharjah, UAE',
      followers: 156000,
      rating: 4.9
    }
  ]

  const favoriteCampaigns: FavoriteItem[] = [
    {
      id: '1',
      type: 'campaign',
      title: 'Beauty Product Launch',
      subtitle: 'Cosmetics & Skincare',
      image: '/images/campaign1.jpg',
      budget: '$5,000',
      participants: 8
    },
    {
      id: '2',
      type: 'campaign',
      title: 'Fashion Week Campaign',
      subtitle: 'Fashion & Style',
      image: '/images/campaign2.jpg',
      budget: '$12,000',
      participants: 15
    },
    {
      id: '3',
      type: 'campaign',
      title: 'Food Review Series',
      subtitle: 'Food & Beverage',
      image: '/images/campaign3.jpg',
      budget: '$3,500',
      participants: 5
    }
  ]

  const handleRemoveFavorite = (id: string, type: 'influencer' | 'campaign') => {
    // Handle remove favorite logic here
    console.log(`Remove ${type} with id: ${id}`)
  }

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-beige-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-salmon-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-navy-600">Favorites</h1>
          </div>
          <button className="p-2 hover:bg-beige-100 rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-navy-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input
            type="text"
            placeholder="Search favorites..."
            className="w-full bg-beige-100 border border-beige-200 rounded-lg pl-10 pr-4 py-3 text-navy-600 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-salmon-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex bg-white rounded-lg p-1 border border-beige-200">
          <button
            onClick={() => setActiveTab('influencers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'influencers'
                ? 'bg-salmon-500 text-white'
                : 'text-navy-600 hover:bg-beige-100'
            }`}
          >
            Influencers
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-salmon-500 text-white'
                : 'text-navy-600 hover:bg-beige-100'
            }`}
          >
            Campaigns
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        {activeTab === 'influencers' && (
          <div className="space-y-3">
            {favoriteInfluencers.map(influencer => (
              <div key={influencer.id} className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={influencer.image}
                      alt={influencer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <span className="text-white font-semibold hidden">
                      {influencer.title.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-navy-600">{influencer.title}</h3>
                    <p className="text-sm text-navy-500">{influencer.subtitle}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      {influencer.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-navy-400" />
                          <span className="text-xs text-navy-500">{influencer.location}</span>
                        </div>
                      )}
                      {influencer.followers && (
                        <span className="text-xs text-navy-500">
                          {influencer.followers.toLocaleString()} followers
                        </span>
                      )}
                      {influencer.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-navy-500">{influencer.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => router.push(`/influencers/${influencer.id}`)}
                      className="bg-navy-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-navy-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(influencer.id, 'influencer')}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-3">
            {favoriteCampaigns.map(campaign => (
              <div key={campaign.id} className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-salmon-500 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <span className="text-white font-semibold text-sm hidden">
                      {campaign.title.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-navy-600">{campaign.title}</h3>
                    <p className="text-sm text-navy-500">{campaign.subtitle}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      {campaign.budget && (
                        <span className="text-xs text-navy-500">{campaign.budget}</span>
                      )}
                      {campaign.participants && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-navy-400" />
                          <span className="text-xs text-navy-500">{campaign.participants} participants</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => router.push(`/campaigns/${campaign.id}`)}
                      className="bg-navy-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-navy-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(campaign.id, 'campaign')}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'influencers' && favoriteInfluencers.length === 0) ||
          (activeTab === 'campaigns' && favoriteCampaigns.length === 0)) && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-navy-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-600 mb-2">No favorites yet</h3>
            <p className="text-navy-500 mb-4">
              {activeTab === 'influencers' 
                ? 'Start following influencers to see them here'
                : 'Save campaigns to see them here'
              }
            </p>
            <button
              onClick={() => router.push(activeTab === 'influencers' ? '/influencers/search' : '/')}
              className="bg-salmon-500 text-white px-6 py-2 rounded-lg hover:bg-salmon-600 transition-colors"
            >
              {activeTab === 'influencers' ? 'Browse Influencers' : 'Browse Campaigns'}
            </button>
          </div>
        )}
      </div>

      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
