import { CodeBlock } from "./codeblock.js";

export const Card = {
  async create(guide) {
    const { title, desc, lang, codes, image } = guide;

    const card = document.createElement("div");
    card.className = "card";

    const textArea = document.createElement("div");
    textArea.className = "card-text";
    textArea.innerHTML = `
      <h2 class="card-title">${title}</h2>
      <p class="card-desc">${desc}</p>
    `;

    if (codes && codes.length > 0) {
      const renderCode = codes.join("\n");
      const block = await CodeBlock.create({ code: renderCode, lang });
      textArea.appendChild(block);
    }

    card.appendChild(textArea);

    if (image) {
      const contentArea = document.createElement("div");
      contentArea.className = "card-content";
      contentArea.innerHTML = `
        <div class="window-bar">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="window-body">
          <img src="${image}" alt="step ${title}" />
        </div>
      `;
      card.appendChild(contentArea);
    }

    return card;
  },
};
