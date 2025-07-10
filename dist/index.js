import { m as mdRender } from './markdown-0nNLAyVa.js';

const mdBody = document.querySelector('.markdown-body');
const readmeURL = 'https://raw.githubusercontent.com/fsegurai/scrollspy/refs/heads/main/README.md';
document.addEventListener('DOMContentLoaded', () => {
    if (mdBody) {
        fetch(readmeURL)
            .then(response => response.text())
            .then(text => {
            mdRender(text, mdBody);
        })
            .catch(error => {
            mdBody.innerHTML = `
          <p>Failed to load README.md</p>
          
          <p>${error}</p>
          `;
        });
    }
});
