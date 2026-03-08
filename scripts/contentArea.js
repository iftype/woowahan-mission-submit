export const ContentArea = {
  el: null,

  init() {
    this.el = document.getElementById("content-area");
  },

  update(content) {
    if (!content) return;

    const body = this.el.querySelector(".window-body");

    if (content.type === "image") {
      body.innerHTML = `<img src="${content.src}" alt="" />`;
    } else if (content.type === "visual") {
      body.innerHTML = `
        <div class="visual-card">
          <span class="visual-icon">${content.icon}</span>
          <p class="visual-label">${content.label}</p>
          ${content.action ? `<a href="${content.action.url}" target="_blank">${content.action.text}</a>` : ""}
        </div>
      `;
    }
  },
};
