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

/* HOME — 6 tiles aleatórios, cada um leva ao seu projeto */
(function homeRandom() {
  const g = document.getElementById("homeGallery");
  if (!g) return;
  const tiles = Array.from(g.querySelectorAll(".home-tile"));

  const items = [
    { name: "Apartamento - Terraço Vila Bela", href: "projeto-apartamento-terraco-vila-bela.html", slug: "apartamento-terraco-vila-bela", count: 13 },
    { name: "Casa Eliana", href: "projeto-casa-eliana.html", slug: "casa-eliana", count: 6 },
    { name: "Casa Jatobás", href: "projeto-casa-jatobas.html", slug: "casa-jatobas", count: 7 },
    { name: "Sutti Advogados Associados", href: "projeto-sutti-advogados.html", slug: "sutti-advogados", count: 16 },
    { name: "Casa Messina", href: "projetos.html?categoria=interiores", slug: "interiores", fixed: 1 },
    { name: "Café Decor", href: "projetos.html?categoria=interiores", slug: "interiores", fixed: 3 },
    { name: "Lavanderia - Jundiaí Decor", href: "projetos.html?categoria=interiores", slug: "interiores", fixed: 4 },
  ];

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  items.slice(0, tiles.length).forEach((p, idx) => {
    const t = tiles[idx];
    const n = p.fixed || (Math.floor(Math.random() * p.count) + 1);
    const src = `./assets/galeria/${p.slug}-${String(n).padStart(2, "0")}.webp`;
    t.setAttribute("href", p.href);
    t.setAttribute("aria-label", "Ver projeto " + p.name);
    const img = t.querySelector(".home-tile-img");
    if (img) { img.setAttribute("src", src); img.setAttribute("alt", p.name + " — Daniela da Camara"); }
    const h = t.querySelector(".home-tile-caption h2");
    if (h) h.textContent = p.name;
  });
})();

/* FORMULÁRIO */
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Mensagem enviada com sucesso! Depois você pode integrar este formulário com Formspree, EmailJS ou backend próprio.");
    contactForm.reset();
  });
}