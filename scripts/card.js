import { CodeBlock } from "./codeblock.js";
import { replacePlaceholders } from "./stateManager.js";
import { renderMacWindow } from "./contentArea.js";

function renderAlert(alert) {
  if (!alert) return "";

  const kindClass = alert.kind ? `card-alert-${alert.kind}` : "card-alert-note";
  const title = replacePlaceholders(alert.title || "NOTE" || "WARNING");
  const message = replacePlaceholders(alert.message || "");

  return `
    <div class="card-alert ${kindClass}">
      <div class="card-alert-header">
        <span class="card-alert-icon">ⓘ</span>
        <span class="card-alert-title">${title}</span>
      </div>
      <p class="card-alert-message">${message}</p>
    </div>
  `;
}

function renderLinks(links, target) {
  if (!links || !target) return;

  const ul = document.createElement("ul");
  ul.className = "card-link-list";

  links.forEach(({ text, url }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = url;
    a.textContent = text;
    a.target = "_blank";

    li.appendChild(a);
    ul.appendChild(li);
  });

  target.appendChild(ul);
}

function renderMobileContent(content, target) {
  if (!target || !content) return;

  target.innerHTML = renderMacWindow();

  const body = target.querySelector(".window-body");

  body.style.backgroundColor = content?.background ?? "";
  body.innerHTML = renderContentBody(content);

  if (content.type === "image") {
    const img = target.querySelector(".window-image");
    if (img) img.style.cssText = content.imageSize ?? "";
  }
}

function renderContentBody(content) {
  if (!content) return "";

  if (content.type === "image") {
    return `
      <div class="window-stage">
        <img class="window-image" src="${replacePlaceholders(content.src)}" />
      </div>
    `;
  }

  const actionHtml = content?.action
    ? `<a href="${replacePlaceholders(content.action.url)}" target="_blank" class="visual-btn">${replacePlaceholders(content.action.text)}</a>`
    : "";

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

async function intro(card, title, desc) {
  card.classList.add("card-intro");

  card.innerHTML = `
        <div class="card-text card-intro-text">
      <div class="card-mobile-content"></div>

          <h1 class="card-intro-title">
            ${replacePlaceholders(title)}
          </h1>
          <p class="card-intro-desc">
            ${replacePlaceholders(desc)}
          </p>
          <div class="card-intro-helper">
            <span class="card-intro-arrow">↓</span>
            아래로 스크롤하여 과정을 확인하세요
          </div>
        </div>
      `;
}

export const Card = {
  async create(guide) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.step = guide.step;

    await this.update(card, guide);
    return card;
  },

  async update(card, guide) {
    const { step, title, desc, lang, codes = [], alert, links, content } = guide;

    card.classList.remove("card-intro");

    card.innerHTML = `
    <div class="card-mobile-content"></div>
      <div class="card-text">
        <h2 class="card-title"></h2>
        <p class="card-desc"></p>
        <div class="card-code"></div>
        <div class="card-alert-area"></div>
      </div>

    `;

    const titleEl = card.querySelector(".card-title");
    const descEl = card.querySelector(".card-desc");
    const codeArea = card.querySelector(".card-code");
    const alertArea = card.querySelector(".card-alert-area");
    const textEl = card.querySelector(".card-text");

    titleEl.textContent = replacePlaceholders(title);
    descEl.textContent = replacePlaceholders(desc);

    alertArea.innerHTML = renderAlert(alert);
    renderLinks(links, textEl);

    const codeText = codes.map(replacePlaceholders).join("\n");
    if (codeText) {
      const block = await CodeBlock.create({ code: codeText, lang });
      codeArea.appendChild(block);
    }

    if (step === 0) {
      await intro(card, title, desc);
    }
    const mobileContent = card.querySelector(".card-mobile-content");
    renderMobileContent(content, mobileContent);
  },
};
