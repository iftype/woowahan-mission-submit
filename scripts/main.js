import { CodeBlock } from "./codeblock.js";

const codes = [
  { code: "git clone https://github.com/iftype/repo", lang: "bash" },
  { code: "git checkout -b iftype", lang: "bash" },
  { code: "git push origin iftype", lang: "bash" },
];

for (const item of codes) {
  const block = await CodeBlock.create(item.code, item.lang);
  document.getElementById("code-container").appendChild(block);
}

lucide.createIcons();
