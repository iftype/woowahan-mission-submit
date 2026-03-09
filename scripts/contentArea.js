import { replacePlaceholders } from "./stateManager.js";

export function renderContentBody(content) {
  if (!content) return "";

  if (content.type === "image") {
    return `
      <div class="window-stage">
        <img class="window-image" src="${replacePlaceholders(content.src)}" alt="" />
      </div>
    `;
  }

  const actionHtml = content?.action ? parseAction(content.action) : "";

  return `
    <div class="window-stage">
      <div class="visual-card">
        <span class="visual-icon">${content.icon ?? ""}</span>
        <p class="visual-label">${replacePlaceholders(content.label ?? "")}</p>
        ${actionHtml}
      </div>
    </div>
  `;
}

export function renderMacWindow() {
  return `
    <div class="mac-window">
      <div class="window-bar">
        <div class="window-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="window-title">woowahan-tech-course</span>
        <div class="window-dots-placeholder"></div>
      </div>

      <div class="window-body"></div>
    </div>
  `;
}

export const ContentArea = {
  el: null,
  body: null,

  init() {
    this.el = document.getElementById("content-area");

    this.el.innerHTML = `
      <div class="blur-bg blur-top"></div>
      <div class="blur-bg blur-bottom"></div>
      ${renderMacWindow()}
    `;

    this.body = this.el.querySelector(".window-body");
  },

  update(content) {
    if (!content || !this.el) return;

    this.body.style.backgroundColor = content?.background ?? "";
    this.body.innerHTML = renderContentBody(content);

    if (content.type === "image") {
      const img = this.body.querySelector(".window-image");
      if (img) img.style.cssText = content.imageSize ?? "";
    }
  },
};

function parseAction(action) {
  if (!action) return "";

  const url = replacePlaceholders(action.url);
  const text = replacePlaceholders(action.text);

  return `<a href="${url}" target="_blank" rel="noreferrer noopener" class="visual-btn">${text}</a>`;
}
