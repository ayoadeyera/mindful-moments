// Reads and writes all localStorage data — favorites, mood log, and
// last-selected mood — so the rest of the app never touches localStorage directly.

import { formatDateKey } from './history.js'

const FAVORITES_KEY = 'mindful-moments-favorites'

// Returns all saved favorites, or an empty array if none exist.
export function getFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY)
  return raw ? JSON.parse(raw) : []
}

// Adds a favorite with a unique id and persists the updated list.
export function saveFavorite(favorite) {
  const favorites = getFavorites()
  favorites.push({ ...favorite, id: Date.now() })
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

// Removes a favorite by id and persists the updated list.
export function removeFavorite(id) {
  const favorites = getFavorites().filter((item) => item.id !== id)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

const MOOD_LOG_KEY = 'mindful-moments-mood-log'

// Returns the mood log as a date-keyed object, or an empty object if none exists.
export function getMoodLog() {
  const raw = localStorage.getItem(MOOD_LOG_KEY)
  return raw ? JSON.parse(raw) : {}
}

// Records today's mood in the log.
export function logMood(mood) {
  const log = getMoodLog()
  log[formatDateKey(new Date())] = mood
  localStorage.setItem(MOOD_LOG_KEY, JSON.stringify(log))
}

// Counts consecutive logged days up to today (or yesterday, if today isn't logged yet).
export function getStreak() {
  const log = getMoodLog()
  const date = new Date()

  // If today isn't logged yet, count backward from yesterday instead,
  // so an unlogged "today" doesn't wipe out a real streak in progress.
  if (!log[formatDateKey(date)]) {
    date.setDate(date.getDate() - 1)
  }

  let streak = 0
  while (log[formatDateKey(date)]) {
    streak++
    date.setDate(date.getDate() - 1)
  }
  return streak
}

const LAST_MOOD_KEY = 'mindful-moments-last-mood'

// Reads the most recently selected mood, used to restore theming on reload.
export function getLastMood() {
  return localStorage.getItem(LAST_MOOD_KEY)
}

// Persists the most recently selected mood.
export function setLastMood(mood) {
  localStorage.setItem(LAST_MOOD_KEY, mood)
}