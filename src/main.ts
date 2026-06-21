import '../styles.css';
import { initApp } from './state';

// Bootstrap the DevDash application
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  console.log('DevDash Application launched successfully!');
});
