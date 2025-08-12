'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Menu, X, Globe, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'
import { supportedLanguages, languageNames } from '@/lib/i18n'
import { useAuth } from '@/lib/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user, isAuthenticated, logout } = useAuth()

  const navigation = isAuthenticated ? [
    { name: t('nav.home'), href: '/' },
    { name: 'Dashboard', href: user?.userType === 'brand' ? '/dashboard/brands' : '/dashboard/influencers' },
    { name: t('nav.campaigns'), href: '/campaigns' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ] : [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.brands'), href: '/brands' },
    { name: t('nav.influencers'), href: '/influencers' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ME-IN</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span>{languageNames[language]}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      language === lang ? 'text-primary-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <button className="text-gray-600 hover:text-gray-900 p-2 transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user?.profile.name}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">
                      {t('nav.register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-500">Language</span>
                  <div className="flex space-x-2">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`text-sm px-2 py-1 rounded ${
                          language === lang 
                            ? 'bg-primary-100 text-primary-600 font-medium' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {languageNames[lang]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="px-3 py-2 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <span className="text-sm text-gray-600 px-3 py-2">{user?.profile.name}</span>
                      <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                        {t('nav.logout')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          {t('nav.login')}
                        </Button>
                      </Link>
                      <Link href="/auth/register" className="w-full">
                        <Button size="sm" className="w-full">
                          {t('nav.register')}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
