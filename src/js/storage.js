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