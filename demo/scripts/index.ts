import { mdRender } from './utils/markdown';

const mdBody = document.querySelector('.markdown-body') as HTMLElement;
const readmeURL =
  'https://raw.githubusercontent.com/fsegurai/ngx-markdown/refs/heads/main/README.md';

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
