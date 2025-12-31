/* --- CONFIG & UTILS --- */
const PASSWORD = "DNC";
const SESSION_KEY = "dnc_logged_in";

/* =========================================================
   1) Auth Check (Chạy ngay lập tức)
   ========================================================= */
function checkAuth() {
  const isLoginPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/");

  const isLoggedIn = sessionStorage.getItem(SESSION_KEY) === "true";

  if (!isLoggedIn && !isLoginPage) {
    window.location.href = "index.html";
  }
}
checkAuth();

/* =========================================================
   2) Page Transition
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = 0;
  setTimeout(() => (document.body.style.opacity = 1), 50);

  // Xử lý link để tạo hiệu ứng chuyển trang
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href !== "#" && !href.startsWith("javascript")) {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(() => (window.location.href = href), 500);
      }
    });
  });
});

/* =========================================================
   3) Login Logic (Chỉ dùng cho index.html)
   ========================================================= */
function handleLogin() {
  const input = document.getElementById("pass-input");
  const toast = document.getElementById("toast");
  if (!input) return;

  if (input.value === PASSWORD) {
    // Kích hoạt quyền phát nhạc ngay khi người dùng click "Bắt đầu"
    localStorage.setItem("dnc_bgm_on", "true");

    sessionStorage.setItem(SESSION_KEY, "true");
    document.body.style.opacity = 0;
    setTimeout(() => (window.location.href = "stars.html"), 500);
  } else {
    input.style.animation = "shake 0.3s";
    setTimeout(() => (input.style.animation = ""), 300);

    if (toast) {
      toast.style.opacity = 1;
      setTimeout(() => (toast.style.opacity = 0), 2000);
    }
  }
}

/* CSS Animation for Input Shake */
(() => {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
    100% { transform: translateX(0); }
  }`;
  document.head.appendChild(styleSheet);
})();

/* =========================================================
   4) Gallery Logic (Dùng cho các trang Album)
   ========================================================= */
let currentGalleryImages = [];
let currentImageIndex = 0;

function initGallery(images, folderPath) {
  const grid = document.getElementById("gallery-grid");
  const totalSpan = document.getElementById("total-img");

  if (!grid || !Array.isArray(images)) return;

  currentGalleryImages = images.map((img) => folderPath + img);
  if (totalSpan) totalSpan.innerText = currentGalleryImages.length;

  grid.innerHTML = "";
  currentGalleryImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.className = "gallery-item";
    img.dataset.src = src;

    img.src =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjwvc3ZnPg==";
    img.style.opacity = 0;

    img.onload = () => (img.style.opacity = 1);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(img);

    img.addEventListener("click", () => openLightbox(index));
    grid.appendChild(img);
  });
}

/* =========================================================
   5) Lightbox Logic
   ========================================================= */
function getLightboxEls() {
  return {
    lb: document.getElementById("lightbox"),
    lbImg: document.getElementById("lb-img"),
  };
}

function openLightbox(index) {
  const { lb } = getLightboxEls();
  if (!lb) return;
  currentImageIndex = index;
  updateLightbox();
  lb.classList.add("active");
}

function updateLightbox() {
  const { lbImg } = getLightboxEls();
  if (!lbImg) return;

  lbImg.src = currentGalleryImages[currentImageIndex];

  const countSpan = document.getElementById("current-img-idx");
  if (countSpan) countSpan.innerText = currentImageIndex + 1;
}

function closeLightbox() {
  const { lb } = getLightboxEls();
  if (!lb) return;
  lb.classList.remove("active");
}

function nextImage(e) {
  if (e) e.stopPropagation();
  if (!currentGalleryImages.length) return;
  currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
  updateLightbox();
}

function prevImage(e) {
  if (e) e.stopPropagation();
  if (!currentGalleryImages.length) return;
  currentImageIndex =
    (currentImageIndex - 1 + currentGalleryImages.length) %
    currentGalleryImages.length;
  updateLightbox();
}

// Keyboard nav
document.addEventListener("keydown", (e) => {
  const { lb } = getLightboxEls();
  if (!lb || !lb.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

/* =========================================================
   6) TYPEWRITER EFFECT CHO LETTER OVERLAY (AoDo/SH/VuiChoi)
   - Chỉ chạy nếu trang có window.INTRO_MSG
   - Gõ xong thì hiện nút 📸
   - Bấm 📸 chỉ ẩn overlay (KHÔNG autoplay nhạc)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  if (!window.INTRO_MSG) return;

  const textContainer = document.getElementById("typewriter-text");
  const btn = document.getElementById("enter-gallery-btn");
  const overlay = document.getElementById("letter-overlay");

  if (!textContainer || !btn || !overlay) return;

  let i = 0;
  const speed = 40; // ms / ký tự

  function typeWriter() {
    if (i < window.INTRO_MSG.length) {
      const ch = window.INTRO_MSG.charAt(i);

      if (ch === "\n") textContainer.innerHTML += "<br>";
      else textContainer.innerHTML += ch;

      i++;
      setTimeout(typeWriter, speed);
    } else {
      btn.classList.remove("hidden");
      const cursor = document.querySelector(".cursor");
      if (cursor) cursor.style.display = "none";
    }
  }

  setTimeout(typeWriter, 500);

  btn.addEventListener("click", () => {
    overlay.classList.add("hidden-overlay");
    setTimeout(() => (overlay.style.display = "none"), 800);
  });
});

/* =========================================================
   7) BGM TOGGLE (OFF->Play, ON->Pause) + lưu time qua trang
   - Yêu cầu: bấm OFF là phát, bấm ON là tắt
   - Có lưu currentTime để tiếp tục khi sang trang
   ========================================================= */
// ===== BGM: OFF -> Play, ON -> Pause (giống lệnh anh test) =====
// ===== BGM: Đồng bộ ON/OFF giữa các trang + nhớ thời gian =====
(function () {
  const KEY_ON = "dnc_bgm_on"; // true/false
  const KEY_T = "dnc_bgm_time"; // currentTime
  const KEY_V = "dnc_bgm_vol"; // volume

  function safeNum(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function setBtn(btn, on) {
    if (!btn) return;
    btn.textContent = on ? "Nhạc: ON" : "Nhạc: OFF";
    btn.classList.toggle("on", on);
  }

  async function tryPlay(audio) {
    if (!audio) return false;
    try {
      audio.muted = false;
      if (audio.readyState < 2) audio.load();
      await audio.play();
      return true;
    } catch (e) {
      return false;
    }
  }

  function initBGM() {
    const audio = document.getElementById("bgm");
    const btn = document.getElementById("musicBtn");
    if (!audio || !btn) return;

    // Volume restore
    const vol = safeNum(localStorage.getItem(KEY_V), 0.5);
    audio.volume = Math.min(1, Math.max(0.05, vol));
    audio.muted = false;

    // Restore time
    const savedTime = safeNum(localStorage.getItem(KEY_T), 0);
    audio.addEventListener(
      "loadedmetadata",
      () => {
        if (savedTime > 0) {
          try {
            audio.currentTime = Math.min(
              savedTime,
              Math.max(0, audio.duration - 0.25)
            );
          } catch {}
        }
      },
      { once: true }
    );

    // Lưu thời gian để sang trang tiếp tục
    audio.addEventListener("timeupdate", () => {
      localStorage.setItem(KEY_T, String(audio.currentTime || 0));
    });
    window.addEventListener("pagehide", () => {
      localStorage.setItem(KEY_T, String(audio.currentTime || 0));
    });

    // Trạng thái ban đầu (đồng bộ từ trang trước)
    const isOn = localStorage.getItem(KEY_ON) === "true";
    setBtn(btn, isOn);

    // Nếu đang ON từ trang trước -> tự phát tiếp
    if (isOn) {
      tryPlay(audio).then((ok) => {
        if (!ok) {
          // Nếu bị chặn autoplay, chỉ cần 1 lần chạm/click bất kỳ là phát
          const resume = () => {
            tryPlay(audio);
            window.removeEventListener("pointerdown", resume);
          };
          window.addEventListener("pointerdown", resume);
        }
      });
    } else {
      audio.pause();
    }

    // Toggle: OFF->Play, ON->Pause (và lưu trạng thái cho các trang khác)
    btn.addEventListener("click", () => {
      const nowOn = !(localStorage.getItem(KEY_ON) === "true");

      localStorage.setItem(KEY_ON, nowOn ? "true" : "false");
      setBtn(btn, nowOn);

      if (nowOn) {
        // Bật nhạc
        audio.muted = false;
        audio.volume = Math.min(1, Math.max(0.05, audio.volume || 0.5));
        const p = audio.play();
        if (p && p.catch) {
          p.catch(() => {
            // Nếu play fail thì trả về OFF cho đúng
            localStorage.setItem(KEY_ON, "false");
            setBtn(btn, false);
          });
        }
      } else {
        // Tắt nhạc
        audio.pause();
      }
    });

    // Nếu anh mở nhiều tab, đổi trạng thái ở tab này tab kia cũng cập nhật
    window.addEventListener("storage", (e) => {
      if (e.key !== KEY_ON) return;
      const on = localStorage.getItem(KEY_ON) === "true";
      setBtn(btn, on);
      if (on) {
        tryPlay(audio).catch(() => {});
      } else {
        audio.pause();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBGM);
  } else {
    initBGM();
  }
})();
