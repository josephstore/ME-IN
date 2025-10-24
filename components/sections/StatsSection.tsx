'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Globe, TrendingUp, Award } from 'lucide-react'

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      title: '500+',
      subtitle: 'Verified Influencers',
      description: 'Active creators across Middle East',
      color: 'primary'
    },
    {
      icon: Globe,
      title: '23',
      subtitle: 'Countries Covered',
      description: 'Middle Eastern markets',
      color: 'accent'
    },
    {
      icon: TrendingUp,
      title: '95%',
      subtitle: 'Success Rate',
      description: 'Campaign completion rate',
      color: 'primary'
    },
    {
      icon: Award,
      title: '2.1M+',
      subtitle: 'Total Reach',
      description: 'Combined audience reach',
      color: 'accent'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Brands and Influencers
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Our platform has facilitated successful partnerships across the Middle East
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 ${
                  stat.color === 'primary' 
                    ? 'bg-primary-500/20 text-primary-300' 
                    : 'bg-accent-500/20 text-accent-300'
                }`}>
                  <stat.icon className="w-8 h-8" />
                </div>

                {/* Stats */}
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.title}
                  </div>
                  <div className="text-lg font-semibold text-primary-100">
                    {stat.subtitle}
                  </div>
                </div>

                {/* Description */}
                <p className="text-primary-200 text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">
              Join the Growing Community
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Be part of the revolution in influencer marketing. Connect with authentic creators 
              and build meaningful partnerships that drive real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                For Brands
              </button>
              <button className="bg-transparent border border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors duration-200">
                For Influencers
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection














