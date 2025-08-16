'use client'

import { motion } from 'framer-motion'
import { useCity } from '@/components/providers'
import { MapPin, Building2, Users, Calendar } from 'lucide-react'

export default function CitySelector() {
  const { selectedCity, setSelectedCity, cities } = useCity()

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-beam-primary mb-6">
            Explore Cities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover innovative architectural projects and sustainable design solutions 
            across major cities around the world.
          </p>
        </motion.div>

        {/* City Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cities.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedCity(city)}
              className={`card cursor-pointer transition-all duration-300 ${
                selectedCity?.id === city.id 
                  ? 'ring-4 ring-beam-accent scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <MapPin className="w-8 h-8 text-beam-accent" />
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {city.country}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-beam-primary mb-3">
                  {city.name}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-5 h-5 mr-3 text-beam-warm" />
                    <span>{city.projects} Projects</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3 text-beam-accent" />
                    <span>Active Development</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-green-500" />
                    <span>2024-2025</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected City Details */}
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-beam-primary to-beam-secondary rounded-2xl p-8 text-white"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-display font-bold mb-4">
                  {selectedCity.name}, {selectedCity.country}
                </h3>
                <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                  Discover cutting-edge architectural innovations and sustainable building 
                  solutions in {selectedCity.name}. Our projects here showcase the future 
                  of urban development and environmental consciousness.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary">
                    View Projects
                  </button>
                  <button className="btn-secondary border-white text-white hover:bg-white hover:text-beam-primary">
                    Learn More
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <h4 className="text-xl font-semibold mb-4">City Highlights</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-beam-warm rounded-full mr-3"></div>
                      <span>Innovative Skyscrapers</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                      <span>Sustainable Infrastructure</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-beam-accent rounded-full mr-3"></div>
                      <span>Smart City Integration</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                      <span>Green Building Standards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
