// Domain logic for the Mood History screen: which 7 days to show,
// color-coding by mood, and summarizing the week in a caption.

export const MOOD_COLORS = {
  Anxious: '#c97b4a',
  Tired: '#c9973f',
  Peaceful: '#6b8e5a',
  Grateful: '#4a7c59',
}

export function formatDateKey(date) {
  return date.toISOString().slice(0, 10)
}

// Returns the 7 days of the current week (Monday through Sunday).
export function getWeekDays() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = Sunday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return labels.map((label, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return { dateKey: formatDateKey(date), label }
  })
}

export function summarizeWeek(days, log) {
  const loggedMoods = days.map(({ dateKey }) => log[dateKey]).filter(Boolean)

  if (loggedMoods.length === 0) {
    return 'No check-ins yet this week.'
  }

  const counts = loggedMoods.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1
    return acc
  }, {})

  const parts = Object.entries(counts).map(([mood, count]) => `${count} ${mood.toLowerCase()}`)
  return `${parts.join(', ')} this week \u2014 keep going`
}