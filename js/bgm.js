import { bgmToggleBtn } from "./dom.js";

export const bgms = [
  new Audio("assets/audio/EAT.BGM.mp3"),
  new Audio("assets/audio/EAT.BGM2.mp3"),
];
bgms.forEach((b) => (b.loop = true));

export let bgmIndex = 0;

export function updateBgmButton() {
  if (bgmIndex === 0) {
    bgmToggleBtn.innerText = "ナウなBGM";
    bgmToggleBtn.style.background =
      "linear-gradient(135deg, #f6a91aff, #ee521aff)";
  } else if (bgmIndex === 1) {
    bgmToggleBtn.innerText = "ヤングなBGM";
    bgmToggleBtn.style.background =
      "linear-gradient(135deg, #45d745ff, #49d9a2ff)";
  } else {
    bgmToggleBtn.innerText = "BGM: OFF";
    bgmToggleBtn.style.background = "linear-gradient(135deg, #1e3e7b, #4da6ff)";
  }
}

export function toggleBgm() {
  if (bgmIndex < 2) bgms[bgmIndex].pause();
  bgmIndex = (bgmIndex + 1) % 3;
  if (bgmIndex < 2) {
    bgms[bgmIndex].currentTime = 0;
    bgms[bgmIndex].play().catch(() => {});
  }
  updateBgmButton();
}
