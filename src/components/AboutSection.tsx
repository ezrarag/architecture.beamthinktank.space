'use client'

import { motion } from 'framer-motion'
import { Award, Target, Users, Globe, Leaf, Zap } from 'lucide-react'

const values = [
  {
    icon: Leaf,
    title: 'Sustainability First',
    description: 'Every project prioritizes environmental responsibility and long-term ecological impact.'
  },
  {
    icon: Target,
    title: 'Innovation Driven',
    description: 'Pushing boundaries with cutting-edge technology and creative design solutions.'
  },
  {
    icon: Users,
    title: 'Community Focused',
    description: 'Designing spaces that enhance human connection and community well-being.'
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    description: 'Drawing inspiration from diverse cultures and architectural traditions worldwide.'
  }
]

const stats = [
  { number: '150+', label: 'Projects Completed' },
  { number: '25+', label: 'Cities Worldwide' },
  { number: '95%', label: 'Sustainable Design' },
  { number: '50+', label: 'Team Members' }
]

export default function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-beam-primary mb-6">
              About BEAM Architecture
            </h2>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              We are a forward-thinking architectural firm dedicated to creating sustainable, 
              innovative, and human-centered design solutions. Our mission is to shape the 
              future of urban development through thoughtful architecture that respects both 
              people and planet.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Founded in 2010, BEAM Architecture has grown from a small studio to a 
              globally recognized firm, working on projects that range from sustainable 
              residential complexes to cutting-edge commercial developments and community spaces.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">
                Our Story
              </button>
              <button className="btn-secondary">
                Meet the Team
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-beam-primary to-beam-secondary rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Our Approach</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Zap className="w-6 h-6 mr-3 mt-1 text-beam-warm flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Research-Driven Design</h4>
                    <p className="text-gray-200 text-sm">Every project begins with extensive research into local context, climate, and community needs.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-6 h-6 mr-3 mt-1 text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Excellence in Execution</h4>
                    <p className="text-gray-200 text-sm">We maintain the highest standards throughout the design and construction process.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-6 h-6 mr-3 mt-1 text-beam-accent flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Collaborative Process</h4>
                    <p className="text-gray-200 text-sm">We work closely with clients, communities, and stakeholders to ensure successful outcomes.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-display font-bold text-center text-beam-primary mb-12">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-beam-accent to-beam-warm rounded-full flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-beam-primary mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-beam-primary to-beam-secondary rounded-2xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-display font-bold mb-12">
            Our Impact in Numbers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 text-beam-warm">
                  {stat.number}
                </div>
                <div className="text-gray-200">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
