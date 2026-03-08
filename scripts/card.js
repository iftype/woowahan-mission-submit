import { CodeBlock } from "./codeblock.js";

export const Card = {
  async create(guide) {
    const { step, title, desc, lang, codes } = guide;

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.step = step;

    const textArea = document.createElement("div");
    textArea.className = "card-text";
    textArea.innerHTML = `
      <h2 class="card-title">${title}</h2>
      <p class="card-desc">${desc}</p>
    `;

    if (codes?.length > 0) {
      const block = await CodeBlock.create({ code: codes.join("\n"), lang });
      textArea.appendChild(block);
    }

    card.appendChild(textArea);
    return card;
  },
};
