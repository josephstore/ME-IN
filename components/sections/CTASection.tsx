'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle, Globe, Users, TrendingUp } from 'lucide-react'

const CTASection = () => {
  const benefits = [
    'AI-powered matching algorithm',
    'Verified influencers only',
    'Multi-language support',
    'Secure payment system',
    'Real-time analytics',
    '24/7 customer support'
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              <Globe className="w-4 h-4 mr-2" />
              Join 500+ Active Users
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to Transform Your{' '}
              <span className="text-gradient">Influencer Marketing</span>?
            </h2>

            <p className="text-xl text-primary-100 leading-relaxed">
              Start connecting with authentic Middle Eastern influencers or discover 
              Korean brands that align with your content. Join ME-IN today and 
              unlock new opportunities.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Why Choose ME-IN?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-accent-400 flex-shrink-0" />
                    <span className="text-primary-100">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="xl" variant="accent" className="group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-900">
                Schedule Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-accent-400" />
                <span className="text-sm text-primary-200">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-accent-400" />
                <span className="text-sm text-primary-200">Free 14-day trial</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Platform Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Platform Card */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-accent-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">ME-IN Dashboard</h3>
                    <p className="text-sm text-primary-200">Welcome back!</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">24</div>
                  <div className="text-sm text-primary-200">Active Campaigns</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">156</div>
                  <div className="text-sm text-primary-200">New Matches</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">A</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">New match with Aisha Al-Rashid</p>
                    <p className="text-xs text-primary-200">Beauty & Lifestyle • 95% match</p>
                  </div>
                  <button className="text-xs bg-accent-500 text-white px-2 py-1 rounded">
                    View
                  </button>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">M</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">Campaign "Summer Beauty" completed</p>
                    <p className="text-xs text-primary-200">2.1K reach • 15% engagement</p>
                  </div>
                  <button className="text-xs bg-primary-500 text-white px-2 py-1 rounded">
                    Report
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white/10 text-white text-sm py-2 px-3 rounded-lg hover:bg-white/20 transition-colors">
                    Create Campaign
                  </button>
                  <button className="flex-1 bg-white/10 text-white text-sm py-2 px-3 rounded-lg hover:bg-white/20 transition-colors">
                    Find Influencers
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Live Analytics</p>
                  <p className="text-xs text-primary-200">Real-time data</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">23 Countries</p>
                  <p className="text-xs text-primary-200">Middle East</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
