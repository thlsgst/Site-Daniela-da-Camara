const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

const projectsMenu = document.getElementById("projectsMenu");
const submenuToggle = document.getElementById("submenuToggle");
const submenu = document.getElementById("projectsSubmenu");

const projectLinks = document.querySelectorAll(".project-filter");
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

projectLinks.forEach((link) => {
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

/* FORMULÁRIO */
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Mensagem enviada com sucesso! Depois você pode integrar este formulário com Formspree, EmailJS ou backend próprio.");
    contactForm.reset();
  });
}