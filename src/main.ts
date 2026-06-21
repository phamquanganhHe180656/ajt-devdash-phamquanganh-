import '../styles.css';
import { getProducts, getProductById, getCategories } from './api';

document.addEventListener('DOMContentLoaded', async () => {
  const appElement = document.querySelector<HTMLDivElement>('#app');
  if (appElement) {
    appElement.innerHTML = `
      <div class="state-container">
        <div class="spinner"></div>
        <h2 class="state-title">Testing API Endpoints...</h2>
        <p class="state-message">Calling getProducts, getProductById, and getCategories. Check output below!</p>
        <div id="test-results" style="margin-top: 1.5rem; text-align: left; background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; max-width: 600px; width: 100%; border: 1px solid var(--border-glass); overflow: auto; max-height: 250px;">
          Initializing test...
        </div>
      </div>
    `;
  }

  const resultsElement = document.getElementById('test-results');
  const appendResult = (text: string) => {
    if (resultsElement) {
      resultsElement.innerHTML += `<br>${text}`;
    }
  };

  try {
    appendResult('⏳ Fetching products list...');
    const productsData = await getProducts(5);
    appendResult(`✅ Success! Fetched ${productsData.products.length} products. Total count: ${productsData.total}`);

    appendResult('⏳ Fetching categories...');
    const categoriesData = await getCategories();
    appendResult(`✅ Success! Fetched ${categoriesData.length} categories.`);

    appendResult('⏳ Fetching details for Product ID: 1...');
    const singleProduct = await getProductById(1);
    appendResult(`✅ Success! Title: "${singleProduct.title}", Price: $${singleProduct.price}`);
    
    appendResult('<span style="color: var(--success); font-weight: bold;">🎉 All API Integration tests completed successfully!</span>');
  } catch (error) {
    console.error('API Test Error:', error);
    appendResult(`<span style="color: var(--danger); font-weight: bold;">❌ Test failed! Error: ${error instanceof Error ? error.message : String(error)}</span>`);
  }
});
