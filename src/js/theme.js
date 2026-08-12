// Shifts the app's accent color based on the selected mood, so the
// interface itself feels responsive — not just the content on it.
// Reuses the same mood-color mapping as the History dots, so the
// palette stays consistent app-wide instead of introducing new colors.

import { MOOD_COLORS } from './history.js'

export function applyMoodTheme(mood) {
  const color = MOOD_COLORS[mood]
  if (color) {
    document.documentElement.style.setProperty('--color-accent', color)
  }
}