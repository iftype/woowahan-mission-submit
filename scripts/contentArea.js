import { replacePlaceholders } from "./stateManager.js";

export const ContentArea = {
  el: null,

  init() {
    this.el = document.getElementById("content-area");
  },

  update(content) {
    if (!content) return;

    const body = this.el.querySelector(".window-body");
    body.style.background = content?.background ?? "";

    if (content.type === "image") {
      body.innerHTML = `
        <div class="window-stage">
          <img class="window-image" src="${content.src}" alt="" />
        </div>
      `;
      const img = body.querySelector(".window-image");
      img.style.cssText = content.imageSize ?? "";
      return;
    }

    const actionHtml = content?.action ? parseAction(content.action) : "";

    body.innerHTML = `
      <div class="window-stage">
        <div class="visual-card">
          <span class="visual-icon">${content.icon}</span>
          <p class="visual-label">${content.label}</p>
          ${actionHtml}
        </div>
       </div>
      `;
  },
};

function parseAction(action) {
  if (!action) return;
  const url = replacePlaceholders(action.url);
  const text = replacePlaceholders(action.text);
  return `<a href="${url}" target="_blank" class="visual-btn">${text}</a>`;
}
