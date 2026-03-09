import { state } from "./stateManager.js";
import { refreshCards, render } from "./guideHandler.js";
import { initState } from "../data/initState.js";

let debounceTimer;

export function initInputs() {
  const inputA = document.getElementById("input-user-me");
  const inputB = document.getElementById("input-user-pair");
  const inputRepo = document.getElementById("input-repo");

  [inputA, inputB, inputRepo].forEach((el) => {
    el.addEventListener("input", () => {
      state.userA = inputA.value.trim() || initState.userA;
      state.userB = inputB.value.trim() || initState.userB;
      state.repoUrl = inputRepo.value.trim() || initState.repoUrl;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        refreshCards();
      }, 400);
    });
  });

  const inputStep = document.getElementById("input-step");
  inputStep.addEventListener("change", () => {
    state.step = inputStep.value || initState.initState;
    const inputB = document.getElementById("input-user-pair");
    if (state.step === "step2") {
      inputB.classList.add("input-disabled");
    } else {
      inputB.classList.remove("input-disabled");
    }

    render();
    refreshCards();
    return;
  });
}
