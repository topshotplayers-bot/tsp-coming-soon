const forms = document.querySelectorAll("[data-waitlist-form]");
const heroVideo = document.querySelector("[data-video-playlist]");
const audioToggle = document.querySelector("[data-audio-toggle]");

if (heroVideo) {
  const playlist = heroVideo.dataset.videoPlaylist.split("|").filter(Boolean);
  let videoIndex = 0;
  const canOfferSound = window.matchMedia("(min-width: 760px)").matches;

  heroVideo.muted = true;
  heroVideo.setAttribute("muted", "");
  heroVideo.volume = 0.32;

  if (audioToggle && !canOfferSound) {
    audioToggle.hidden = true;
  }

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

  if (audioToggle && canOfferSound) {
    audioToggle.addEventListener("click", () => {
      const shouldPlaySound = heroVideo.muted;
      heroVideo.muted = !shouldPlaySound;
      audioToggle.setAttribute("aria-pressed", String(shouldPlaySound));
      audioToggle.textContent = shouldPlaySound ? "Sound On" : "Sound Off";
      heroVideo.play().catch(() => {});
    });
  }
}

forms.forEach((form) => {
  const note = form.parentElement.querySelector("[data-form-note]");

  form.addEventListener("submit", () => {
    const email = new FormData(form).get("email");

    if (email) {
      const signups = JSON.parse(localStorage.getItem("tsp_waitlist_signups") || "[]");
      signups.push({ email, createdAt: new Date().toISOString() });
      localStorage.setItem("tsp_waitlist_signups", JSON.stringify(signups));
    }

    if (note) {
      note.textContent = "You're on the Founder List. Welcome to TSP.";
    }
  });
});
