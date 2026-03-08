import { ContentArea } from "./contentArea.js";
import { GUIDE_DATA } from "../data/guide.js";
import { Card } from "./card.js";

async function render() {
  ContentArea.init();
  const container = document.getElementById("card-container");

  for (const guide of GUIDE_DATA) {
    const card = await Card.create(guide);
    container.appendChild(card);
  }

  lucide.createIcons();
  observeCards();
}

function observeCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const step = entry.target.dataset.step;
          const guide = GUIDE_DATA.find((g) => g.step === Number(step));
          ContentArea.update(guide?.content);
        }
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll(".card").forEach((card) => observer.observe(card));
}

render();
