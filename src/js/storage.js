import { formatDateKey } from './history.js'



// Wraps localStorage reads/writes for saved favorites, so the rest of
// the app never touches localStorage directly.

const FAVORITES_KEY = 'mindful-moments-favorites'

export function getFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveFavorite(favorite) {
  const favorites = getFavorites()
  favorites.push({ ...favorite, id: Date.now() })
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function removeFavorite(id) {
  const favorites = getFavorites().filter((item) => item.id !== id)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

const MOOD_LOG_KEY = 'mindful-moments-mood-log'


export function getMoodLog() {
  const raw = localStorage.getItem(MOOD_LOG_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function logMood(mood) {
  const log = getMoodLog()
  log[formatDateKey(new Date())] = mood
  localStorage.setItem(MOOD_LOG_KEY, JSON.stringify(log))
}

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

export function getLastMood() {
  return localStorage.getItem(LAST_MOOD_KEY)
}

export function setLastMood(mood) {
  localStorage.setItem(LAST_MOOD_KEY, mood)
}