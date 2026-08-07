// Manages the mood picker: the list of moods, which one is currently
// selected, and rendering the picker buttons into a container element.

const MOODS = ['Anxious', 'Tired', 'Peaceful', 'Grateful']

let currentMood = null

export function getCurrentMood() {
  return currentMood
}

export function renderMoodPicker(container, onSelect) {
  container.innerHTML = ''

  MOODS.forEach((mood) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'mood-btn'
    button.textContent = mood
    button.dataset.mood = mood

    if (mood === currentMood) {
      button.classList.add('selected')
    }

    button.addEventListener('click', () => {
      currentMood = mood
      renderMoodPicker(container, onSelect)
      onSelect(mood)
    })

    container.appendChild(button)
  })
}