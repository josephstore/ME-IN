'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNavigation from '@/components/layout/BottomNavigation'

interface Event {
  id: string
  title: string
  time: string
  location: string
  participants: number
  type: 'campaign' | 'meeting' | 'deadline'
  date: string
}

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Sample events data
  const events: Event[] = [
    {
      id: '1',
      title: 'Beauty Campaign Meeting',
      time: '10:00 AM',
      location: 'Dubai Mall',
      participants: 3,
      type: 'meeting',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Fashion Campaign Deadline',
      time: '6:00 PM',
      location: 'Online',
      participants: 1,
      type: 'deadline',
      date: '2024-01-18'
    },
    {
      id: '3',
      title: 'Food Review Campaign',
      time: '2:00 PM',
      location: 'Abu Dhabi',
      participants: 5,
      type: 'campaign',
      date: '2024-01-20'
    },
    {
      id: '4',
      title: 'Travel Content Creation',
      time: '9:00 AM',
      location: 'Sharjah',
      participants: 2,
      type: 'campaign',
      date: '2024-01-22'
    }
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'campaign':
        return 'bg-salmon-500'
      case 'meeting':
        return 'bg-navy-600'
      case 'deadline':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const today = new Date()
  const days = getDaysInMonth(currentDate)
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <div className="bg-white border-b border-beige-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-navy-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-navy-600">Calendar</h1>
          </div>
          <button
            onClick={() => router.push('/campaigns/create')}
            className="bg-salmon-500 text-white p-2 rounded-lg hover:bg-salmon-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Calendar Navigation */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-beige-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-navy-600" />
            </button>
            <h2 className="text-lg font-semibold text-navy-600">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-beige-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-navy-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-navy-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2"></div>
              }

              const isToday = day.toDateString() === today.toDateString()
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
              const dayEvents = getEventsForDate(day)

              return (
                <button
                  key={day.getDate()}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 text-sm rounded-lg transition-colors relative ${
                    isSelected
                      ? 'bg-salmon-500 text-white'
                      : isToday
                      ? 'bg-navy-100 text-navy-600 font-semibold'
                      : 'hover:bg-beige-100 text-navy-600'
                  }`}
                >
                  {day.getDate()}
                  {dayEvents.length > 0 && (
                    <div className="flex justify-center mt-1 space-x-1">
                      {dayEvents.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200">
            <h3 className="text-lg font-semibold text-navy-600 mb-3">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="border border-beige-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-navy-600 mb-1">{event.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-navy-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.participants} people</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-navy-400 text-center py-4">No events scheduled for this day</p>
            )}
          </div>
        )}

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-beige-200 mt-4">
          <h3 className="text-lg font-semibold text-navy-600 mb-3">Upcoming Events</h3>
          <div className="space-y-3">
            {events.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center space-x-3 p-3 border border-beige-200 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-navy-600">{event.title}</h4>
                  <p className="text-sm text-navy-500">{event.time} • {event.location}</p>
                </div>
                <div className="text-sm text-navy-400">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Spacing for Navigation */}
      <div className="h-20"></div>
      
      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

