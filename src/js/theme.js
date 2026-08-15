// Shifts the app's accent color based on the selected mood, so the
// interface itself feels responsive — not just the content on it.
// Uses a darker, WCAG-AA-safe variant of each mood's color rather than
// the same vivid shade as the History dots — the brighter dot colors
// fail contrast requirements when used behind white text or as text.

const ACCENT_COLORS = {
  Anxious: '#91532b',
  Tired: '#7e5e24',
  Peaceful: '#4f6942',
  Grateful: '#406c4e',
}

export function applyMoodTheme(mood) {
  const color = ACCENT_COLORS[mood]
  if (color) {
    document.documentElement.style.setProperty('--color-accent', color)
  }
}