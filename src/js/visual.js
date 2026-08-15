// Fetches a mood-matched image from the Unsplash API. Falls back to
// leaving the gray placeholder box in place if the API is unreachable,
// rather than breaking the layout. Caches one image per mood per
// session to avoid burning the 50-requests/hour demo quota.

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

const MOOD_QUERIES = {
  Anxious: 'calm',
  Tired: 'cozy',
  Peaceful: 'peaceful nature',
  Grateful: 'sunrise',
}

const imageCache = {}

// Returns a cached image if one exists this session, otherwise fetches a new one.
export async function getImage(mood) {
  if (imageCache[mood]) {
    return imageCache[mood]
  }

  const query = MOOD_QUERIES[mood] || 'calm nature'

  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&w=800`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    )

    if (!response.ok) {
      throw new Error(`Unsplash responded with ${response.status}`)
    }

    const data = await response.json()

    const result = {
      url: data.urls.regular,
      altText: data.alt_description || `${mood} themed photo`,
      photographerName: data.user.name,
      photographerLink: `${data.user.links.html}?utm_source=mindful_moments&utm_medium=referral`,
      unsplashLink: `${data.links.html}?utm_source=mindful_moments&utm_medium=referral`,
      downloadLocation: data.links.download_location,
    }

    imageCache[mood] = result
    return result
  } catch (error) {
    console.warn('Unsplash API unavailable, keeping placeholder:', error.message)
    return null
  }
}

// Pings Unsplash's download endpoint, required by their API terms whenever a photo is shown.
export function triggerDownload(downloadLocation) {
  fetch(downloadLocation, {
    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
  }).catch(() => {
    // Non-critical if this fails — don't block the UI over a tracking ping
  })
}