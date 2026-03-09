import { CodeBlock } from "./codeblock.js";
import { replacePlaceholders } from "./stateManager.js";

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

async function intro(card, title, desc) {
  card.classList.add("card-intro");

  card.innerHTML = `
        <div class="card-text card-intro-text">
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
    const { step, title, desc, lang, codes = [], alert, links } = guide;

    if (step === 0) {
      await intro(card, title, desc);
      return;
    }

    card.classList.remove("card-intro");

    card.innerHTML = `
      <div class="card-text">
        <h2 class="card-title"></h2>
        <p class="card-desc"></p>
        <div class="card-code"></div>
        <div class="card-alert-area"></div>
      </div>
    `;

    const textEl = card.querySelector(".card-text");
    const titleEl = card.querySelector(".card-title");
    const descEl = card.querySelector(".card-desc");
    const codeArea = card.querySelector(".card-code");
    const alertArea = card.querySelector(".card-alert-area");

    const nextTitle = replacePlaceholders(title);
    const nextDesc = replacePlaceholders(desc);
    const nextCode = codes.map(replacePlaceholders).join("\n");
    const prevCode = card.dataset.renderedCode || "";

    titleEl.textContent = nextTitle;
    descEl.textContent = nextDesc;
    alertArea.innerHTML = renderAlert(alert);
    renderLinks(links, textEl);

    if (nextCode === prevCode && codeArea.children.length > 0) return;

    const newBlock = nextCode ? await CodeBlock.create({ code: nextCode, lang }) : null;

    codeArea.replaceChildren(...(newBlock ? [newBlock] : []));
    card.dataset.renderedCode = nextCode;
  },
};
