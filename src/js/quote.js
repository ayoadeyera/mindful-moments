// Fetches a mood-matched quote from the Quotable API, falling back to a
// local quote bank if the API is unreachable or returns an error.

const MOOD_TAGS = {
  Anxious: 'courage',
  Tired: 'inspirational',
  Peaceful: 'wisdom',
  Grateful: 'happiness',
}

const FALLBACK_QUOTES = {
  Anxious: [
    { content: 'Breathe. You are stronger than your anxiety.', author: 'Unknown' },
    { content: 'This feeling is a wave, not the ocean. It will pass.', author: 'Unknown' },
    { content: "You don't have to control the storm, just steady the boat.", author: 'Unknown' },
    { content: 'One breath at a time is still moving forward.', author: 'Unknown' },
  ],
  Tired: [
    { content: 'Rest is not idleness — it is the foundation of renewal.', author: 'Unknown' },
    { content: "You don't have to earn your rest.", author: 'Unknown' },
    { content: 'Slow down. The world will wait for you to catch up.', author: 'Unknown' },
    { content: 'Tired is not the same as broken.', author: 'Unknown' },
  ],
  Peaceful: [
    { content: 'In stillness, we find what the noise was hiding.', author: 'Unknown' },
    { content: 'Peace is not the absence of chaos, but calm within it.', author: 'Unknown' },
    { content: 'Let this moment be enough.', author: 'Unknown' },
    { content: 'Stillness is its own kind of strength.', author: 'Unknown' },
  ],
  Grateful: [
    { content: 'Gratitude turns what we have into enough.', author: 'Unknown' },
    { content: 'Notice the small good things — they add up.', author: 'Unknown' },
    { content: 'What you appreciate, appreciates.', author: 'Unknown' },
    { content: 'Gratitude is a lens that makes everything look brighter.', author: 'Unknown' },
  ],
}

function getFallbackQuote(mood) {
  const pool = FALLBACK_QUOTES[mood] || FALLBACK_QUOTES.Peaceful
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function getQuote(mood) {
  const tag = MOOD_TAGS[mood] || 'wisdom'

  try {
    const response = await fetch(`https://api.quotable.io/random?tags=${tag}`)

    if (!response.ok) {
      throw new Error(`Quotable responded with ${response.status}`)
    }

    const data = await response.json()
    return { content: data.content, author: data.author }
  } catch (error) {
    console.warn('Quotable API unavailable, using fallback quote:', error.message)
    return getFallbackQuote(mood)
  }
}