// ---------- NAVBAR SCROLL ANIMATION ----------
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ---------- BACK TO TOP BUTTON ----------
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------- MOBILE NAV TOGGLE ----------
(function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const body = document.body;

  if (!hamburger || !navLinks) return;

  const openMenu = () => {
    navLinks.classList.add("show");
    hamburger.classList.add("active"); // Animate to X
    hamburger.setAttribute("aria-expanded", "true");
    body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    navLinks.classList.remove("show");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    body.style.overflow = "";
  };

  hamburger.addEventListener("click", () => {
    if (navLinks.classList.contains("show")) closeMenu();
    else openMenu();
  });

  // Close when clicking a link
  navItems.forEach((link) => link.addEventListener("click", closeMenu));

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    const insideClick =
      navLinks.contains(e.target) || hamburger.contains(e.target);
    if (navLinks.classList.contains("show") && !insideClick) closeMenu();
  });

  // Reset on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && navLinks.classList.contains("show")) {
      closeMenu();
    }
  });

  hamburger.setAttribute("aria-expanded", "false");
})();

// ---------- FADE-IN ON SCROLL ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".section").forEach((section) => {
  observer.observe(section);
});

// ---------- SMOOTH SCROLL FOR NAV LINKS ----------
document.querySelectorAll('.nav-links a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth",
      });
    }
  });
});


// Hero Slideshow
let slides = document.querySelectorAll('.hero-slideshow img');
let currentSlide = 0;

function changeSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(changeSlide, 5000); // changes every 5 seconds
