const forms = document.querySelectorAll("[data-waitlist-form]");
const heroVideo = document.querySelector("[data-video-playlist]");

if (heroVideo) {
  const playlist = heroVideo.dataset.videoPlaylist.split("|").filter(Boolean);
  let videoIndex = 0;

  heroVideo.muted = true;
  heroVideo.setAttribute("muted", "");

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
