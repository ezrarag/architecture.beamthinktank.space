'use client'

import { useState } from 'react'

interface Model3DProps {
  modelPath?: string
  className?: string
}

export default function Model3D({ modelPath, className = '' }: Model3DProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* 3D Model Placeholder */}
      <div className="aspect-square flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-beam-primary to-beam-secondary rounded-lg flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">3D Model</h3>
          <p className="text-sm text-gray-600 mb-3">Interactive 3D visualization</p>
          <div className="flex space-x-2 justify-center">
            <button className="px-3 py-1 bg-beam-primary text-white text-xs rounded hover:bg-beam-primary/80 transition-colors">
              View
            </button>
            <button className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors">
              Download
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beam-primary"></div>
        </div>
      )}
    </div>
  )
}
