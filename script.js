/**
 * ============================================================================
 * Color Flipper - Main Application Script
 * ============================================================================
 * Beginner-friendly vanilla JavaScript implementation demonstrating:
 * 1. DOM selection & manipulation
 * 2. Event listeners (click, input)
 * 3. Color generation & hexadecimal math
 * 4. Perceived brightness & contrast calculation (WCAG accessibility)
 * 5. Clipboard API with backward-compatible fallback
 * 6. Timed notification feedback with timeout cleanup
 * ============================================================================
 */

// Wrap in an IIFE to keep the global scope clean
(() => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Constants & State Variables
  // --------------------------------------------------------------------------
  const DEFAULT_COLOR = '#F4F6FB'; // Light default background color
  let copyTimeoutId = null;        // Tracks active timeout for the "Copied!" notification

  // --------------------------------------------------------------------------
  // 2. DOM Elements Selection
  // --------------------------------------------------------------------------
  const body = document.body;
  const colorPreview = document.getElementById('color-preview');
  const previewLabel = document.getElementById('preview-label');
  const hexCodeDisplay = document.getElementById('hex-code');
  const copyStatus = document.getElementById('copy-status');
  const colorPicker = document.getElementById('color-picker');
  const startScreen = document.getElementById('startScreen');
  const app = document.getElementById('app');
  const btnStart = document.getElementById('btn-start');
  const btnRandom = document.getElementById('btn-random');
  const btnCopy = document.getElementById('btn-copy');
  const btnReset = document.getElementById('btn-reset');

  // --------------------------------------------------------------------------
  // 3. Helper Functions
  // --------------------------------------------------------------------------

  /**
   * Generates a random 6-digit hexadecimal color code (#RRGGBB).
   * A hex color is formed by a hash '#' followed by 6 characters from 0-9 and A-F.
   * @returns {string} Formatted uppercase HEX string (e.g., "#4F46E5")
   */
  function getRandomHex() {
    const hexCharacters = '0123456789ABCDEF';
    let hex = '#';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * hexCharacters.length);
      hex += hexCharacters[randomIndex];
    }
    return hex;
  }

  /**
   * Determines whether dark or light text should be used on top of a given color
   * based on perceived brightness (YIQ luminance formula).
   * Brightness = (Red * 299 + Green * 587 + Blue * 114) / 1000
   * Range: 0 (pitch black) to 255 (bright white).
   * @param {string} hex - 6-digit hex color code (#RRGGBB)
   * @returns {string} Highly visible text color ('#1E293B' or '#FFFFFF')
   */
  function getTextColor(hex) {
    // Remove '#' if present
    const cleanHex = hex.replace('#', '');

    // Parse R, G, B decimal values from hex (base 16)
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Calculate perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // If bright (>= 128), use dark text; otherwise, use white text
    return brightness >= 128 ? '#1E293B' : '#FFFFFF';
  }

  /**
   * Normalizes a hex string to guarantee uppercase '#RRGGBB' format.
   * @param {string} hex
   * @returns {string}
   */
  function normalizeHex(hex) {
    if (!hex) return DEFAULT_COLOR;
    let formatted = hex.trim();
    if (!formatted.startsWith('#')) {
      formatted = '#' + formatted;
    }
    return formatted.toUpperCase();
  }

  // --------------------------------------------------------------------------
  // 4. Core Application Functions
  // --------------------------------------------------------------------------

  /**
   * Central state updater: applies the new color across all components.
   * - Updates page background color
   * - Updates preview swatch color
   * - Updates the displayed HEX text
   * - Calculates and sets accessible text contrast color
   * - Syncs the native color picker input
   * @param {string} hex - The target HEX color code
   */
  function updateColor(hex) {
    const normalizedColor = normalizeHex(hex);

    // 1. Update the document body background
    body.style.backgroundColor = normalizedColor;

    // 2. Update the color preview swatch inside the card
    colorPreview.style.backgroundColor = normalizedColor;

    // 3. Update the displayed HEX value
    hexCodeDisplay.textContent = normalizedColor;

    // 4. Adjust text color inside the preview box for contrast
    const contrastColor = getTextColor(normalizedColor);
    hexCodeDisplay.style.color = contrastColor;
    previewLabel.style.color = contrastColor;

    // 5. Keep the color picker input in sync
    colorPicker.value = normalizedColor;
  }

  /**
   * Fallback clipboard copy method using temporary textarea & document.execCommand.
   * Guarantees copying works on older browsers or local file:// protocols without HTTPS.
   * @param {string} text - The text to copy
   * @returns {boolean} Whether copy operation succeeded
   */
  function copyToClipboardFallback(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Ensure textarea is not visible and does not cause scrolling
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Fallback clipboard copy failed:', err);
    }

    document.body.removeChild(textArea);
    return success;
  }

  /**
   * Displays the "Copied to clipboard!" notification for exactly 2 seconds.
   * Resets any running timer so repeated rapid clicks do not glitch.
   */
  function showCopyFeedback() {
    // Clear any previous active timer
    if (copyTimeoutId !== null) {
      clearTimeout(copyTimeoutId);
    }

    // Show the notification message
    copyStatus.classList.add('visible');

    // Automatically hide after exactly 2000 milliseconds (2 seconds)
    copyTimeoutId = setTimeout(() => {
      copyStatus.classList.remove('visible');
      copyTimeoutId = null;
    }, 2000);
  }

  /**
   * Copies the current HEX code to the clipboard.
   * Uses the modern navigator.clipboard API when available, falling back safely.
   */
  async function copyColor() {
    const hex = hexCodeDisplay.textContent;

    // Attempt modern Clipboard API if supported
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(hex);
        showCopyFeedback();
        return;
      } catch (err) {
        console.warn('navigator.clipboard write failed, attempting fallback:', err);
      }
    }

    // Fallback for file:// origin, non-HTTPS, or older browsers
    const fallbackSuccess = copyToClipboardFallback(hex);
    if (fallbackSuccess) {
      showCopyFeedback();
    }
  }

  /**
   * Restores the light default background color and resets all synced controls.
   */
  function resetColor() {
    updateColor(DEFAULT_COLOR);
  }

  /**
   * Starts the application: hides the initial start card, reveals the main
   * Color Flipper card, and moves keyboard focus to the "Change Color" button.
   */
  function startApp() {
    startScreen.classList.add('hidden');
    app.classList.remove('hidden');
    btnRandom.focus();
  }

  // --------------------------------------------------------------------------
  // 5. Event Listeners & Lifecycle Setup
  // --------------------------------------------------------------------------

  function setupEventListeners() {
    // "Start" button -> reveals main app card and focuses "Change Color" button
    btnStart.addEventListener('click', startApp);

    // "Change Color" button -> generates random hex code
    btnRandom.addEventListener('click', () => {
      updateColor(getRandomHex());
    });

    // Color picker input -> updates color in real-time as user chooses/drags
    colorPicker.addEventListener('input', (event) => {
      updateColor(event.target.value);
    });

    // "Copy Color Code" button -> copies HEX to clipboard
    btnCopy.addEventListener('click', copyColor);

    // "Reset" button -> resets to default color
    btnReset.addEventListener('click', resetColor);
  }

  /**
   * App initialization: registers listeners and sets initial state.
   */
  function init() {
    setupEventListeners();
    updateColor(DEFAULT_COLOR);
  }

  // Execute initialization once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
