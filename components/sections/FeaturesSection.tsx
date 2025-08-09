'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Users, 
  TrendingUp, 
  Globe, 
  Shield, 
  BarChart3,
  MessageSquare,
  Zap
} from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms match brands with the perfect influencers based on audience, content style, and campaign goals.',
      color: 'primary'
    },
    {
      icon: Users,
      title: 'Verified Influencers',
      description: 'All influencers are verified and authenticated through our rigorous screening process.',
      color: 'accent'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Track campaign performance with detailed analytics and insights in real-time.',
      color: 'primary'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Full support for Korean, English, and Arabic languages with cultural localization.',
      color: 'accent'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with escrow protection for both parties.',
      color: 'primary'
    },
    {
      icon: BarChart3,
      title: 'Performance Tracking',
      description: 'Comprehensive reporting on reach, engagement, and ROI for every campaign.',
      color: 'accent'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Built-in messaging system for seamless communication between brands and influencers.',
      color: 'primary'
    },
    {
      icon: Zap,
      title: 'Quick Campaign Setup',
      description: 'Launch campaigns in minutes with our streamlined onboarding process.',
      color: 'accent'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for{' '}
            <span className="text-gradient">Successful Campaigns</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to connect, collaborate, and create impactful influencer marketing campaigns
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  feature.color === 'primary' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-accent-100 text-accent-600'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 border border-primary-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Campaign?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of brands and influencers who are already using ME-IN to create successful partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Free Trial
              </button>
              <button className="btn-secondary">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
