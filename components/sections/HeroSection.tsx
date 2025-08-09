'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Play, Globe, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'

const HeroSection = () => {
  const { t } = useLanguage()
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
            >
              <Globe className="w-4 h-4 mr-2" />
              {t('hero.badge')}
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 leading-relaxed max-w-2xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="xl" className="group">
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="group">
                <Play className="w-5 h-5 mr-2" />
                {t('hero.cta.secondary')}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center space-x-6 pt-8"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">500+ Influencers</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-accent-600" />
                <span className="text-sm text-gray-600">95% Success Rate</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Platform Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            {/* Main Platform Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ME-IN Platform</h3>
                    <p className="text-sm text-gray-500">AI Matching System</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search influencers by category, location..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Influencer Cards */}
              <div className="space-y-4">
                {/* Card 1 */}
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">A</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Aisha Al-Rashid</h4>
                    <p className="text-sm text-gray-600">Beauty & Lifestyle • 150K Followers</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Match: 95%</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Saudi Arabia</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </div>

                {/* Card 2 */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">M</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Mohammed Hassan</h4>
                    <p className="text-sm text-gray-600">Food & Travel • 89K Followers</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Match: 87%</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">UAE</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Connect
                  </Button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Active Campaigns: 24</span>
                  <span>Total Reach: 2.1M</span>
                  <span>Success Rate: 95%</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Live Analytics</p>
                  <p className="text-xs text-gray-500">Real-time data</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">23 Countries</p>
                  <p className="text-xs text-gray-500">Middle East</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
