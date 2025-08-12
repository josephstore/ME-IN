'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Kim',
      role: 'Marketing Director',
      company: 'Korean Beauty Brand',
      content: 'ME-IN helped us connect with authentic Middle Eastern influencers who truly understand our brand values. The AI matching was incredibly accurate!',
      rating: 5,
      avatar: 'SK',
      type: 'brand'
    },
    {
      name: 'Aisha Al-Rashid',
      role: 'Lifestyle Influencer',
      company: 'Saudi Arabia',
      content: 'The platform made it so easy to find brands that align with my content. The payment system is secure and the support team is amazing.',
      rating: 5,
      avatar: 'AR',
      type: 'influencer'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Food & Travel Creator',
      company: 'UAE',
      content: 'I love how ME-IN bridges the cultural gap. Working with Korean brands has opened up amazing opportunities for my content.',
      rating: 5,
      avatar: 'AH',
      type: 'influencer'
    },
    {
      name: 'Min-Jung Park',
      role: 'Brand Manager',
      company: 'Korean Fashion Brand',
      content: 'The analytics and reporting features are outstanding. We can track ROI in real-time and optimize our campaigns effectively.',
      rating: 5,
      avatar: 'MP',
      type: 'brand'
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
        duration: 0.6
      }
    }
  }

  return (
    <section className="py-20 bg-gray-50">
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
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from brands and influencers who have found success through ME-IN
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-primary-400" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4 ${
                    testimonial.type === 'brand' 
                      ? 'bg-primary-500' 
                      : 'bg-accent-500'
                  }`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    testimonial.type === 'brand'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-accent-100 text-accent-700'
                  }`}>
                    {testimonial.type === 'brand' ? 'Brand' : 'Influencer'}
                  </span>
                </div>
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
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join Them?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start your journey with ME-IN and discover the perfect partnerships for your brand or content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Get Started Today
              </button>
              <button className="btn-secondary">
                View More Stories
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection

