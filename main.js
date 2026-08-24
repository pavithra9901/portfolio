/**
 * main.js
 * Progressive enhancement only. Every page must remain usable,
 * navigable, and (for the form) understandable with this file absent.
 */

/* ---------------------------- Mobile nav toggle --------------------------- */
(function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.setAttribute("data-open", String(open));
    toggle.querySelector(".nav-toggle-label").textContent = open ? "Close menu" : "Menu";
  };

  // Start closed on small screens; CSS shows nav by default on wide screens.
  setOpen(false);

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false);
    }
  });
})();

/* ---------------------------- Contact form validation ---------------------- */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const messageField = document.getElementById("message");
  const charCount = document.getElementById("char-count");
  const MAX_CHARS = 800;

  const fieldRules = {
    name: (value) => (value.trim().length === 0 ? "Enter your name." : ""),
    email: (value) => {
      if (value.trim().length === 0) return "Enter your email address.";
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return pattern.test(value) ? "" : "Enter a valid email address, like name@example.com.";
    },
    message: (value) => {
      if (value.trim().length === 0) return "Enter a message.";
      if (value.length > MAX_CHARS) return `Message is over the ${MAX_CHARS}-character limit.`;
      return "";
    },
  };

  function showFieldError(fieldName, errorMessage) {
    const field = form.elements.namedItem(fieldName);
    const row = field.closest(".form-row");
    const errorEl = document.getElementById(`${fieldName}-error`);
    if (errorMessage) {
      row.setAttribute("data-invalid", "true");
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = errorMessage;
    } else {
      row.removeAttribute("data-invalid");
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  function validateField(fieldName) {
    const field = form.elements.namedItem(fieldName);
    const rule = fieldRules[fieldName];
    if (!rule) return true;
    const errorMessage = rule(field.value);
    showFieldError(fieldName, errorMessage);
    return !errorMessage;
  }

  ["name", "email", "message"].forEach((fieldName) => {
    const field = form.elements.namedItem(fieldName);
    field.addEventListener("blur", () => validateField(fieldName));
  });

  if (messageField && charCount) {
    const updateCount = () => {
      const remaining = MAX_CHARS - messageField.value.length;
      charCount.textContent = `${remaining} characters remaining`;
    };
    messageField.addEventListener("input", updateCount);
    updateCount();
  }

  function setStatus(kind, text) {
    status.dataset.state = kind;
    status.textContent = text;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Honeypot: if a bot filled the hidden field, silently drop the submit.
    const honeypot = form.elements.namedItem("company_website");
    if (honeypot && honeypot.value) return;

    const fieldsValid = ["name", "email", "message"].map(validateField);
    const allValid = fieldsValid.every(Boolean);

    if (!allValid) {
      setStatus("error", "There are errors in the form. Please review the highlighted fields below.");
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend is wired up in this skeleton — this simulates a submit.
    setStatus("", "Sending…");
    window.setTimeout(() => {
      setStatus("success", "Thanks — your message has been sent. I'll reply within two business days.");
      form.reset();
      if (charCount) charCount.textContent = `${MAX_CHARS} characters remaining`;
    }, 600);
  });
})();
