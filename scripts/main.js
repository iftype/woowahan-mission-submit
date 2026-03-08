import { GUIDE_DATA } from "../data/guide.js";
import { Card } from "./Card.js";

async function render() {
  const container = document.getElementById("card-container");

  for (const guide of GUIDE_DATA) {
    const card = await Card.create(guide);
    container.appendChild(card);
  }

  lucide.createIcons();
}

render();
