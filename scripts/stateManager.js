import { initState } from "../data/initState.js";

export const state = {
  userA: initState.userA,
  userB: initState.userB,
  repoUrl: initState.repoUrl,
  step: initState.step,
};

export function replacePlaceholders(text) {
  const repoUrl = state.repoUrl || initState.repoUrl;
  const parts = repoUrl.split("/");

  const repoOwner = parts[3];
  const repoName = parts[4].replace(".git", "");

  return String(text)
    .replace(/\{A\}/g, state.userA || initState.userA)
    .replace(/\{B\}/g, state.userB || initState.userB)
    .replace(/\{STEP\}/g, state.step || initState.step)
    .replace(/\{REPO\}/g, repoUrl)
    .replace(/\{REPO_OWNER\}/g, repoOwner)
    .replace(/\{REPO_NAME\}/g, repoName);
}
