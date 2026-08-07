import '../css/style.css'
import { renderMoodPicker } from './mood.js'

function renderToday(container) {
  container.innerHTML = `
    <h1>How are you feeling today?</h1>
    <div id="mood-picker" class="mood-picker"></div>
    <div id="today-result"></div>
  `

  const pickerEl = container.querySelector('#mood-picker')
  renderMoodPicker(pickerEl, (mood) => {
    console.log('Mood selected:', mood)
    // Quote + image fetching hooks in here in the next step
  })
}

function renderSanctuary(container) {
  container.innerHTML = '<h1>My sanctuary</h1><p>Saved favorites go here.</p>'
}

function renderHistory(container) {
  container.innerHTML = '<h1>Mood history</h1><p>7-day view goes here.</p>'
}

const views = {
  today: renderToday,
  sanctuary: renderSanctuary,
  history: renderHistory,
}

const viewContainer = document.querySelector('#view-container')
const navButtons = document.querySelectorAll('.nav-item')

function showView(viewName) {
  views[viewName](viewContainer)

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewName)
  })
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showView(button.dataset.view)
  })
})

showView('today')