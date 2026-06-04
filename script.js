document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  /* --- THEME SWAP SWITCHER & SYSTEM PREFERENCE --- */
  const themeToggle = document.getElementById("theme-toggle");
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)");

  // Initial Theme Initialization
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  } else if (savedTheme === "dark") {
    document.documentElement.classList.remove("light-theme");
  } else {
    // If no manual preference, fall back to device/system theme
    if (systemPrefersLight.matches) {
      document.documentElement.classList.add("light-theme");
    }
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
    const isLight = document.documentElement.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Listen for live system theme changes (sync if user hasn't overridden it manually)
  systemPrefersLight.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.documentElement.classList.add("light-theme");
      } else {
        document.documentElement.classList.remove("light-theme");
      }
    }
  });

  /* --- STICKY HEADER --- */
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check on load

  /* --- INTERSECTION OBSERVER FOR FADE-UP / FADE-IN --- */
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Once visible, we can unobserve if we only want animate-once behavior
        observer.unobserve(entry.target);
      }
    });
  };

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  
  const fadeElements = document.querySelectorAll(".fade-up, .fade-in");
  fadeElements.forEach(el => revealObserver.observe(el));

  /* --- ACTIVE SECTION NAV LINK HIGHLIGHTING & BACKGROUND TINT SHIFT --- */
  const activeSectionOptions = {
    threshold: 0.3,
    rootMargin: "-20% 0px -60% 0px" // Focus on the middle section of the screen
  };

  const activeSectionCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        
        // Update active class on nav links
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });

        // Update background tint class on body
        document.body.classList.remove(
          "hero-active",
          "about-active",
          "experience-active",
          "projects-active",
          "leadership-active",
          "achievements-active",
          "resume-active",
          "connect-active"
        );
        if (id) {
          document.body.classList.add(`${id}-active`);
        }
      }
    });
  };

  const activeSectionObserver = new IntersectionObserver(activeSectionCallback, activeSectionOptions);
  sections.forEach(sec => activeSectionObserver.observe(sec));
});
