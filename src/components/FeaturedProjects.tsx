'use client'

import { motion } from 'framer-motion'
import { Building2, MapPin, Calendar, Users, DollarSign, Eye } from 'lucide-react'
import { useCity } from '@/components/providers'
import Model3D from './Model3D'

interface Project {
  id: string
  name: string
  city: string
  type: string
  status: 'planning' | 'in-progress' | 'completed'
  funding: number
  target: number
  description: string
  image: string
  supporters: number
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Eco-Tower Complex',
    city: 'New York',
    type: 'Mixed-Use',
    status: 'in-progress',
    funding: 2500000,
    target: 5000000,
    description: 'A revolutionary 50-story sustainable tower featuring vertical gardens, solar integration, and smart building technology.',
    image: '/api/placeholder/600/400',
    supporters: 1247
  },
  {
    id: '2',
    name: 'Green Community Hub',
    city: 'London',
    type: 'Community',
    status: 'planning',
    funding: 800000,
    target: 2000000,
    description: 'A net-zero community center with renewable energy systems, urban farming spaces, and educational facilities.',
    image: '/api/placeholder/600/400',
    supporters: 892
  },
  {
    id: '3',
    name: 'Smart Office District',
    city: 'Tokyo',
    type: 'Commercial',
    status: 'completed',
    funding: 3500000,
    target: 3500000,
    description: 'An intelligent office complex with AI-powered climate control, automated parking, and green roof systems.',
    image: '/api/placeholder/600/400',
    supporters: 2156
  }
]

export default function FeaturedProjects() {
  const { selectedCity } = useCity()

  const filteredProjects = selectedCity 
    ? projects.filter(p => p.city === selectedCity.name)
    : projects

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'planning': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'planning': return 'Planning'
      default: return 'Unknown'
    }
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-beam-primary mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our most innovative architectural projects featuring cutting-edge design, 
            sustainable technology, and community-focused solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group"
            >
              {/* 3D Model Placeholder */}
              <div className="relative h-64 bg-gradient-to-br from-beam-primary to-beam-secondary rounded-t-xl overflow-hidden">
                <Model3D 
                  modelPath={`/models/${project.type.toLowerCase()}`}
                  className="w-full h-full"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>

                {/* View 3D Button */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors">
                    <Eye className="w-4 h-4" />
                    View 3D
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-beam-primary">{project.name}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {project.type}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-beam-accent" />
                  <span className="text-sm">{project.city}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Funding Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Funding Progress</span>
                    <span className="font-semibold text-beam-primary">
                      ${(project.funding / 1000000).toFixed(1)}M / ${(project.target / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-beam-accent to-beam-warm h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(project.funding / project.target) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{project.supporters} supporters</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>2024</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="btn-primary flex-1">
                    Support Project
                  </button>
                  <button className="btn-secondary flex-1">
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="btn-primary text-lg px-8 py-4">
            View All Projects
          </button>
        </motion.div>
      </div>
    </section>
  )
}
