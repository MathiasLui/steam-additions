// ==UserScript==
// @name         Steam Additions
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Add some features to the Steam website
// @author       Matty
// @match        https://steamcommunity.com/market/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @updateURL    https://github.com/MathiasLui/steam-additions/raw/main/steam-additions.user.js
// @downloadURL  https://github.com/MathiasLui/steam-additions/raw/main/steam-additions.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Holds the inspect link for the item last hovered over, or null
    let currentInspectLink = null;

    // Returns the last hovered inspect link on the market history,
    // or null if not fetched (e.g. nothing was hovered or Steam updated the UI and made breaking changes)
    function fetchInspectLinkFromLastHoveredItem() {
        const actionsDiv = document.getElementById('hover_item_actions');
        const link = actionsDiv ? actionsDiv.querySelector('a') : null;
        return link && link.href ? link.href : null;
    }

    document.addEventListener('mouseover', function(e) {
         // Change cursor to pointer when hovering name or image
         // of any market history item that has an inspect link
        if (e.target.classList.contains('economy_item_hoverable')) {
            e.target.style.cursor = 'pointer';
            e.target.setAttribute('title', 'Click to inspect item in-game\nCtrl+C to copy the inspect link'); // Set tooltip

            currentInspectLink = fetchInspectLinkFromLastHoveredItem();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'c') {
            if (currentInspectLink) {
                navigator.clipboard.writeText(currentInspectLink).then(() => {
                    console.log('Link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy link: ', err);
                });
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('economy_item_hoverable')) {
            if (currentInspectLink) {
                window.location.href = currentInspectLink; // Open inspect link
            }
        }
    });
})();