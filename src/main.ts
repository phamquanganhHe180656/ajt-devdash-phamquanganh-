import '../styles.css';

// The main entry point of the DevDash application
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.querySelector<HTMLDivElement>('#app');
  if (appElement) {
    appElement.innerHTML = `
      <div class="state-container">
        <div class="spinner"></div>
        <h2 class="state-title">Loading Application...</h2>
        <p class="state-message">Initializing DevDash workspace and modules.</p>
      </div>
    `;
  }
  console.log('DevDash App successfully initialized!');
});
