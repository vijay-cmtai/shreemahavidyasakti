"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TranslationContextType {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, fallbackOrInterpolation?: string | Record<string, any>) => string
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [locale, setLocale] = useState('en')
  const [translations, setTranslations] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en'
    setLocale(savedLocale)
    loadTranslations(savedLocale)
  }, [])

  const loadTranslations = async (newLocale: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/locales/${newLocale}/common.json`)
      if (response.ok) {
        const data = await response.json()
        setTranslations(data)
      } else {
        console.error('Failed to fetch translations:', response.status)
      }
    } catch (error) {
      console.error('Failed to load translations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetLocale = (newLocale: string) => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    // Force reload translations
    setTranslations({})
    loadTranslations(newLocale)
  }

  const t = (key: string, fallbackOrInterpolation?: string | Record<string, any>): string => {
    if (isLoading) {
      return typeof fallbackOrInterpolation === 'string' ? fallbackOrInterpolation : key
    }
    
    // If translations are empty, return the key
    if (!translations || Object.keys(translations).length === 0) {
      return typeof fallbackOrInterpolation === 'string' ? fallbackOrInterpolation : key
    }
    
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return typeof fallbackOrInterpolation === 'string' ? fallbackOrInterpolation : key
      }
    }
    
    if (typeof value === 'string') {
      // Handle interpolation if fallbackOrInterpolation is an object
      if (typeof fallbackOrInterpolation === 'object' && fallbackOrInterpolation !== null) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
          return fallbackOrInterpolation[placeholder] || match
        })
      }
      return value
    } else {
      return typeof fallbackOrInterpolation === 'string' ? fallbackOrInterpolation : key
    }
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale: handleSetLocale, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}
