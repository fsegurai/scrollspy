import { g as generateTOC, s as setupMobileToggle, a as setupSmoothScroll, i as initScrollspy, m as mdRender } from './toc-BaAAtinT.js';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const mdBody = document.querySelector('.md-body');
const readmeURL = 'https://raw.githubusercontent.com/fsegurai/scrollspy/refs/heads/main/README.md';
const fetchReadme = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(readmeURL);
        const text = yield response.text();
        mdRender(text, mdBody);
    }
    catch (error) {
        mdBody.innerHTML = `
        <p>Failed to load README.md</p>
        
        <p>${error}</p>
        `;
    }
});
const stripContent = () => {
    // Remove the "Table of Contents" heading and the next sibling (the list)
    const tocHeading = Array.from(mdBody.querySelectorAll('h2')).find((h) => { var _a; return (_a = h.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase().includes('table of contents'); });
    if (tocHeading) {
        const tocList = tocHeading.nextElementSibling;
        tocHeading.remove();
        if (tocList && tocList.tagName.toLowerCase() === 'ul')
            tocList.remove();
    }
};
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    if (mdBody) {
        yield fetchReadme().then(() => {
            // Hide the TOC for the README.md
            stripContent();
            // Generate TOC from rendered content
            generateTOC(mdBody);
            // Setup functionality
            setupMobileToggle();
            setupSmoothScroll();
            // Initialize scrollspy after TOC is generated
            initScrollspy(); // Start with the progressive mode
        }).catch(error => {
            mdBody.innerHTML = `
          <p>Failed to load README.md</p>
          
          <p>${error}</p>
          `;
        });
    }
}));
