import './style.css'

const views = {
  today: () => '<h1> How are you feeling today?</h1><p>Mood picker goes here.</p>',
  sanctuary: () => '<h1>Sanctuary</h1>Saved favorites go here.</p>',
  history: () => '<h1>Mood History</h1><p>7-day view goes here.</p>',
}


const viewContainer = document.querySelector('#view-container')
const navButtons = document.querySelectorAll('.nav-item')

function showView(viewName) {
  viewContainer.innerHTML = views[viewName]()

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewName)
  })
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showView(button.dataset.view)
  })
})