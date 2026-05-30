const forms = document.querySelectorAll("[data-waitlist-form]");
const heroVideo = document.querySelector("[data-video-playlist]");
const audioToggle = document.querySelector("[data-audio-toggle]");
const playerModal = document.querySelector("[data-player-modal]");
const openPlayerButton = document.querySelector("[data-open-player]");
const closePlayerButton = document.querySelector("[data-close-player]");

if (heroVideo) {
  const playlist = heroVideo.dataset.videoPlaylist.split("|").filter(Boolean);
  let videoIndex = 0;
  const canOfferSound = window.matchMedia("(min-width: 760px)").matches;
  const softVolume = 0.18;

  heroVideo.muted = true;
  heroVideo.setAttribute("muted", "");
  heroVideo.volume = softVolume;

  if (audioToggle && !canOfferSound) {
    audioToggle.hidden = true;
  }

  const setSoundState = (soundOn) => {
    heroVideo.muted = !soundOn;
    if (soundOn) {
      heroVideo.removeAttribute("muted");
      heroVideo.volume = softVolume;
    } else {
      heroVideo.setAttribute("muted", "");
    }

    if (audioToggle) {
      audioToggle.setAttribute("aria-pressed", String(soundOn));
      audioToggle.textContent = soundOn ? "Sound On" : "Sound Off";
    }
  };

  const enableSoundFromInteraction = () => {
    if (!canOfferSound || !heroVideo.muted) {
      return;
    }

    setSoundState(true);
    heroVideo.play().catch(() => setSoundState(false));
  };

  const advanceHeroVideo = () => {
    videoIndex = (videoIndex + 1) % playlist.length;
    heroVideo.src = playlist[videoIndex];
    heroVideo.play().catch(() => {});
  };

  window.tspAdvanceHeroVideo = advanceHeroVideo;
  heroVideo.addEventListener("ended", advanceHeroVideo);
  heroVideo.addEventListener("canplay", () => {
    heroVideo.play().catch(() => {});
  });

  heroVideo.play().catch(() => {});

  if (canOfferSound) {
    setSoundState(true);
    heroVideo.play().catch(() => setSoundState(false));
    window.addEventListener("pointerdown", enableSoundFromInteraction, { once: true });
    window.addEventListener("keydown", enableSoundFromInteraction, { once: true });
  }

  if (audioToggle && canOfferSound) {
    audioToggle.addEventListener("click", () => {
      const shouldPlaySound = heroVideo.muted;
      setSoundState(shouldPlaySound);
      heroVideo.play().catch(() => {});
    });
  }
}

forms.forEach((form) => {
  const note = form.parentElement.querySelector("[data-form-note]");

  form.addEventListener("submit", () => {
    if (note) {
      note.textContent = "Joining the Founder List...";
    }
  });
});

if (playerModal && openPlayerButton && closePlayerButton) {
  const closePlayerModal = () => {
    playerModal.hidden = true;
    document.body.classList.remove("modal-open");
    openPlayerButton.focus();
  };

  openPlayerButton.addEventListener("click", () => {
    playerModal.hidden = false;
    document.body.classList.add("modal-open");
    closePlayerButton.focus();
  });

  closePlayerButton.addEventListener("click", closePlayerModal);

  playerModal.addEventListener("click", (event) => {
    if (event.target === playerModal) {
      closePlayerModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !playerModal.hidden) {
      closePlayerModal();
    }
  });
}
