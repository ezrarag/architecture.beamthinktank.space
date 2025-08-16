'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Building2, Leaf, Users } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-beam-primary via-beam-secondary to-beam-accent overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%g fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="text-gradient">BEAM</span>
            <br />
            <span className="text-4xl md:text-5xl">Architecture</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Shaping the future through innovative design, sustainable building practices, 
            and visionary urban planning that harmonizes with our environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="btn-primary text-lg px-8 py-4">
              Explore Projects
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              View Portfolio
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-beam-warm" />
            <div className="text-3xl font-bold text-white">150+</div>
            <div className="text-gray-300">Projects Completed</div>
          </div>
          <div className="text-center">
            <Leaf className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <div className="text-3xl font-bold text-white">95%</div>
            <div className="text-gray-300">Sustainable Design</div>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-beam-accent" />
            <div className="text-3xl font-bold text-white">25+</div>
            <div className="text-gray-300">Cities Worldwide</div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-8 h-8 text-white opacity-70" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
