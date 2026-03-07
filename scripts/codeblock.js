import { codeToHtml } from "https://esm.sh/shiki@3.0.0";
const CodeBlock = {
  async create(code, lang) {
    const highlighted = await codeToHtml(code, {
      lang,
      theme: "one-dark-pro",
    });

    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";
    wrapper.innerHTML = `
      <button class="copy-btn">
        <i data-lucide="copy" class="icon-copy"></i>
        <i data-lucide="check" class="icon-check" style="display:none"></i>
      </button>
      ${highlighted}
    `;

    this._bindCopy(wrapper, code);
    return wrapper;
  },

  _bindCopy(wrapper, code) {
    const btn = wrapper.querySelector(".copy-btn");
    btn.addEventListener("click", function () {
      const iconCopy = this.querySelector(".icon-copy");
      const iconCheck = this.querySelector(".icon-check");

      navigator.clipboard.writeText(code).then(() => {
        iconCopy.style.display = "none";
        iconCheck.style.display = "block";
        setTimeout(() => {
          iconCopy.style.display = "block";
          iconCheck.style.display = "none";
        }, 1500);
      });
    });
  },
};

const TEST_MSG = `git clone https://github.com/iftype/repo`;
const block = await CodeBlock.create(TEST_MSG, "bash");
document.getElementById("code-container").appendChild(block);
lucide.createIcons();
