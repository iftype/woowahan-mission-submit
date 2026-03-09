import { ContentArea } from "./contentArea.js";
import { GUIDE_DATA } from "../data/guide.js";
import { Card } from "./card.js";

let observer = null;
let currentStep = 1;

function waitForLucide() {
  return new Promise((resolve) => {
    if (typeof lucide !== "undefined") {
      resolve();
      return;
    }

    const interval = setInterval(() => {
      if (typeof lucide !== "undefined") {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

export async function render() {
  ContentArea.init();

  const container = document.getElementById("card-container");
  container.innerHTML = "";

  for (const guide of GUIDE_DATA) {
    const card = await Card.create(guide);
    container.appendChild(card);
  }

  await waitForLucide();
  lucide.createIcons();

  observeCards();

  const firstCard = document.querySelector(`.card[data-step="${currentStep}"]`) || document.querySelector(".card");

  if (firstCard) {
    setActiveCard(firstCard);
  }
}

function setActiveCard(card) {
  const step = Number(card.dataset.step);
  currentStep = step;

  const guide = GUIDE_DATA.find((g) => g.step === step);
  ContentArea.update(guide?.content);

  document.querySelectorAll(".card").forEach((c) => {
    c.classList.remove("active");
  });

  card.classList.add("active");
}

function observeCards() {
  if (observer) observer.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visibleEntries.length === 0) return;

      const nextCard = visibleEntries[0].target;
      const nextStep = Number(nextCard.dataset.step);

      if (nextStep === currentStep) return;

      setActiveCard(nextCard);
    },
    {
      threshold: 0,
      rootMargin: "-30% 0px -69% 0px",
    },
  );

  document.querySelectorAll(".card").forEach((card) => observer.observe(card));
}

export async function refreshCards() {
  const cards = [...document.querySelectorAll(".card")];

  for (const card of cards) {
    const step = Number(card.dataset.step);
    const guide = GUIDE_DATA.find((g) => g.step === step);
    if (!guide) continue;

    await Card.update(card, guide);
  }

  await waitForLucide();
  lucide.createIcons();

  const activeCard =
    document.querySelector(`.card[data-step="${currentStep}"]`) ||
    document.querySelector(".card.active") ||
    document.querySelector(".card");

  if (activeCard) {
    activeCard.classList.add("active");
  }

  const activeGuide = GUIDE_DATA.find((g) => g.step === currentStep);
  ContentArea.update(activeGuide?.content);
}

export function initGuide() {
  render();

  document.getElementById("content-area").addEventListener("wheel", (e) => {
    e.preventDefault();
    document.getElementById("card-container").scrollBy({ top: e.deltaY });
  });
}
