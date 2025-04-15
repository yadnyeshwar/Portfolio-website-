document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Navigation Toggle ---
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const menuIcon = mobileNavToggle.querySelector(".icon-menu");
  const closeIcon = mobileNavToggle.querySelector(".icon-x");

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener("click", () => {
      const isExpanded =
        mobileNavToggle.getAttribute("aria-expanded") === "true";
      mobileNavToggle.setAttribute("aria-expanded", !isExpanded);
      navMenu.classList.toggle("active");
      document.body.classList.toggle("mobile-menu-active"); // Toggle overlay class on body

      // Toggle icons
      if (navMenu.classList.contains("active")) {
        menuIcon.style.display = "none";
        closeIcon.style.display = "block";
      } else {
        menuIcon.style.display = "block";
        closeIcon.style.display = "none";
      }
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("active")) {
          mobileNavToggle.click(); // Simulate a click on the toggle button
        }
      });
    });

    // Close mobile menu if user clicks outside the menu (on the overlay)
    document.body.addEventListener("click", (event) => {
      // Check if the menu is active and the click was outside the menu and toggle button
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(event.target) &&
        !mobileNavToggle.contains(event.target)
      ) {
        mobileNavToggle.click(); // Simulate click to close
      }
    });
  }

  // --- Fade-in Animation on Scroll ---
  const fadeElements = document.querySelectorAll(".fade-in");

  const observerOptions = {
    root: null, // Use the viewport as the root
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of the element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: Unobserve after animation to save resources
        // observer.unobserve(entry.target);
      }
      // Optional: remove class if you want fade-out on scroll away
      // else {
      //     entry.target.classList.remove('visible');
      // }
    });
  }, observerOptions);

  fadeElements.forEach((element) => {
    observer.observe(element);
  });

  // --- Active Navigation Link Highlighting on Scroll ---
  const sections = document.querySelectorAll("section[id]"); // Select all sections with an ID
  const allNavLinks = document.querySelectorAll(".nav-link"); // Select all nav links

  // Function to remove active class from all links
  const removeActiveClasses = () => {
    allNavLinks.forEach((link) => link.classList.remove("active"));
  };

  // Function to add active class to the corresponding link
  const addActiveClass = (id) => {
    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
    if (activeLink) {
      removeActiveClasses(); // Remove from others first
      activeLink.classList.add("active");
    }
  };

  // Listen for scroll events
  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    const scrollPosition = window.pageYOffset;
    const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 70; // Get navbar height or default

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbarHeight - 50; // Adjust offset for navbar and trigger point
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Handle edge case for top of the page (Hero section)
    if (scrollPosition < sections[0].offsetTop - navbarHeight - 50) {
      currentSectionId = sections[0].getAttribute("id"); // Assume first section is hero
    }
    // Handle edge case for bottom of the page (Contact section)
    const totalHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    if (scrollPosition + windowHeight >= totalHeight - 50) {
      // Near the bottom
      currentSectionId = sections[sections.length - 1].getAttribute("id"); // Last section
    }

    if (currentSectionId) {
      addActiveClass(currentSectionId);
    } else {
      removeActiveClasses(); // No section is active (e.g., between sections)
    }
  });

  // Initial check in case the page loads scrolled to a section
  window.dispatchEvent(new Event("scroll"));

  // --- Update Footer Year ---
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}); // End DOMContentLoaded
