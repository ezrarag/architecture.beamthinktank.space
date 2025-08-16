'use client'

import { createClient } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

// Create optional Supabase client - only if environment variables are available
const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
    return null
  }
}

// Create context for Supabase client
const SupabaseContext = createContext<ReturnType<typeof createSupabaseClient>>(null)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

// City context for the city selector
interface City {
  id: string
  name: string
  country: string
  coordinates: [number, number]
  projects: number
}

const CityContext = createContext<{
  selectedCity: City | null
  setSelectedCity: (city: City | null) => void
  cities: City[]
}>({
  selectedCity: null,
  setSelectedCity: () => {},
  cities: []
})

export const useCity = () => {
  const context = useContext(CityContext)
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider')
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [cities] = useState<City[]>([
    {
      id: '1',
      name: 'New York',
      country: 'USA',
      coordinates: [40.7128, -74.0060],
      projects: 12
    },
    {
      id: '2',
      name: 'London',
      country: 'UK',
      coordinates: [51.5074, -0.1278],
      projects: 8
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan',
      coordinates: [35.6762, 139.6503],
      projects: 15
    },
    {
      id: '4',
      name: 'Sydney',
      country: 'Australia',
      coordinates: [-33.8688, 151.2093],
      projects: 6
    },
    {
      id: '5',
      name: 'Dubai',
      country: 'UAE',
      coordinates: [25.2048, 55.2708],
      projects: 20
    }
  ])

  const [selectedCity, setSelectedCity] = useState<City | null>(cities[0])

  return (
    <SupabaseContext.Provider value={createSupabaseClient()}>
      <CityContext.Provider value={{ selectedCity, setSelectedCity, cities }}>
        {children}
      </CityContext.Provider>
    </SupabaseContext.Provider>
  )
}
