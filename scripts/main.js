import { CodeBlock } from "./codeblock.js";
import { GUIDE_DATA } from "../data/guide.js";

async function render() {
  for (const guide of GUIDE_DATA) {
    const { lang, codes } = guide;

    const renderCode = codes.join("\n");
    const block = await CodeBlock.create({ code: renderCode, lang });
    document.getElementById("card-container").appendChild(block);
  }
  lucide.createIcons();
}

render();
