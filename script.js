/* ANIMAÇÃO HOME */
const scriptOverlay = document.getElementById("scriptOverlay");
if (scriptOverlay) {
  scriptOverlay.addEventListener("animationend", (e) => {
    if (e.animationName === "overlayLifecycle") {
      scriptOverlay.remove();
    }
  });
}

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const projectsMenu = document.getElementById("projectsMenu");
const submenuToggle = document.getElementById("submenuToggle");
const submenu = document.getElementById("projectsSubmenu");

const galleryItems = document.querySelectorAll(".project-card");
const contactForm = document.querySelector(".contact-form");
const navLinks = document.querySelectorAll(".nav-link");

function isMobileMenu() {
  return window.innerWidth <= 980;
}

/* MENU MOBILE */
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* SUBMENU */
function openSubmenu() {
  if (!projectsMenu || !submenuToggle) return;
  projectsMenu.classList.add("open");
  submenuToggle.setAttribute("aria-expanded", "true");
}

function closeSubmenu() {
  if (!projectsMenu || !submenuToggle) return;
  projectsMenu.classList.remove("open");
  submenuToggle.setAttribute("aria-expanded", "false");
}

function toggleSubmenu() {
  if (!projectsMenu) return;
  const isOpen = projectsMenu.classList.contains("open");
  isOpen ? closeSubmenu() : openSubmenu();
}

if (submenuToggle && projectsMenu) {
  submenuToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSubmenu();
  });
}

if (submenu) {
  submenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

document.addEventListener("click", (event) => {
  if (projectsMenu && !projectsMenu.contains(event.target)) {
    closeSubmenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSubmenu();

    if (mainNav && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeSubmenu();

    if (isMobileMenu() && mainNav) {
      mainNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

window.addEventListener("resize", () => {
  if (!isMobileMenu()) {
    if (mainNav) {
      mainNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
});

/* FILTRO VIA URL EM PROJETOS */
function filterProjects(category) {
  if (!galleryItems.length) return;

  galleryItems.forEach((item) => {
    const itemCategory = item.dataset.category;
    const shouldShow = category === "all" || itemCategory === category;
    item.classList.toggle("hidden", !shouldShow);
  });
}

(function applyCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("categoria");

  const allowedCategories = [
    "all",
    "residenciais",
    "corporativos",
    "interiores"
  ];

  if (galleryItems.length) {
    if (category && allowedCategories.includes(category)) {
      filterProjects(category);
    } else {
      filterProjects("all");
    }
  }
})();

/* GALERIA HOME — rotação aleatória sem repetir imagem visível */
(function rotateHomeGallery() {
  const gallery = document.getElementById("homeGallery");
  if (!gallery) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const counts = {
    "apto-areta-e-fabio": 13,
    "casa-eliana": 6,
    "interiores": 5,
    "sutti-advogados": 16,
  };
  const pool = [];
  Object.keys(counts).forEach((slug) => {
    for (let i = 1; i <= counts[slug]; i++) {
      pool.push(`./assets/galeria/${slug}-${String(i).padStart(2, "0")}.webp`);
    }
  });

  const tiles = Array.from(gallery.querySelectorAll(".home-tile"));
  // imagens atualmente visíveis (uma por tile)
  const shown = tiles.map((tile) => {
    const active = tile.querySelector(".home-tile-img.is-active");
    return active ? new URL(active.getAttribute("src"), location.href).pathname : null;
  });

  function isVisible(src) {
    const path = new URL(src, location.href).pathname;
    return shown.some((s) => s && new URL(s, location.href).pathname === path);
  }

  function pickUnused() {
    const candidates = pool.filter((src) => !isVisible(src));
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function swapTile(index) {
    const tile = tiles[index];
    const current = tile.querySelector(".home-tile-img.is-active");
    const next = tile.querySelector(".home-tile-img:not(.is-active)");
    if (!current || !next) return;

    const newSrc = pickUnused();
    if (!newSrc) return;

    next.onload = () => {
      next.classList.add("is-active");
      current.classList.remove("is-active");
      shown[index] = new URL(newSrc, location.href).pathname;
    };
    next.src = newSrc;
  }

  if (reduceMotion) return;

  let tick = 0;
  setInterval(() => {
    // alterna o tile de forma pseudo-aleatória, um por vez
    const index = (Math.floor(Math.random() * tiles.length) + tick) % tiles.length;
    tick++;
    swapTile(index);
  }, 3500);
})();

/* FORMULÁRIO */
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Mensagem enviada com sucesso! Depois você pode integrar este formulário com Formspree, EmailJS ou backend próprio.");
    contactForm.reset();
  });
}