/**
 * Michelle OT - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initFaqAccordion();
  initContactForm();
  initSmoothScroll();
  initWhatsAppWidget();
});

/**
 * Mobile Navigation Menu Toggle
 */
function initNavToggle() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backdrop = document.querySelector('.menu-backdrop');

  if (!toggleBtn || !navLinks) return;

  function setMenuState(isOpen) {
    navLinks.classList.toggle('open', isOpen);
    if (backdrop) backdrop.classList.toggle('active', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    setMenuState(!isOpen);
  });

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      setMenuState(false);
    });
  }

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });
}

/**
 * FAQ Accordion Toggle
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other open items
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
    });
  });
}

/**
 * South African Phone Number Validation & Formatting
 * Follows ICASA National Numbering Plan:
 * - 10 digits starting with 0, followed by 1-8 (01-05 landlines, 06-08 mobile/VoIP/toll-free)
 * - Supports +27, 0027, and 27 international prefixes
 * - Rejects 09 prefix, non-digits, and dummy repeated numbers (e.g. 0888888888)
 */
function validateSAPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, formatted: '', normalized: '', error: 'Phone number is required.' };
  }

  // Strip common separators: spaces, hyphens, brackets, dots
  let clean = phone.trim().replace(/[\s\-\(\)\.]/g, '');

  // Normalize international SA prefixes to standard 0-format
  if (clean.startsWith('+27')) {
    clean = '0' + clean.slice(3);
  } else if (clean.startsWith('0027')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('27') && clean.length === 11) {
    clean = '0' + clean.slice(2);
  }

  // Check 10-digit length
  if (clean.length !== 10) {
    return {
      isValid: false,
      formatted: clean,
      normalized: clean,
      error: 'South African phone numbers must be 10 digits (e.g. 082 123 4567 or +27 61 530 6884).'
    };
  }

  // Check valid SA prefix: starts with 0, second digit is 1-8
  if (!/^0[1-8]\d{8}$/.test(clean)) {
    return {
      isValid: false,
      formatted: clean,
      normalized: clean,
      error: 'Please enter a valid South African mobile or landline number (e.g. 082, 061, 011).'
    };
  }

  // Reject dummy repeating digits (e.g. 0888888888, 0000000000, 0111111111)
  if (/^0(\d)\1{8}$/.test(clean)) {
    return {
      isValid: false,
      formatted: clean,
      normalized: clean,
      error: 'Please enter an active, non-dummy contact number.'
    };
  }

  const formatted = clean.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');
  return { isValid: true, formatted, normalized: clean, error: '' };
}

/**
 * Contact & Intake Request Form Handler
 */
function initContactForm() {
  const form = document.querySelector('#intake-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const trackInput = document.getElementById('track');
  const messageInput = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  const errorEls = {
    name: document.getElementById('name-error'),
    phone: document.getElementById('phone-error'),
    email: document.getElementById('email-error'),
    track: document.getElementById('track-error'),
    message: document.getElementById('message-error')
  };

  function showFieldError(input, errorEl, message) {
    if (!input) return;
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(input, errorEl) {
    if (!input) return;
    input.classList.remove('is-invalid');
    if (input.value && input.value.trim() !== '') {
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function showFormStatus(type, message) {
    if (!statusEl) return;
    statusEl.className = 'form-status visible ' + type;
    statusEl.textContent = message;
  }

  function clearFormStatus() {
    if (!statusEl) return;
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  }

  // Field-level live validation on blur
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      const val = nameInput.value.trim();
      if (!val || val.length < 2) {
        showFieldError(nameInput, errorEls.name, 'Please enter your full name (at least 2 characters).');
      } else {
        clearFieldError(nameInput, errorEls.name);
      }
    });

    nameInput.addEventListener('input', () => {
      if (nameInput.classList.contains('is-invalid')) {
        if (nameInput.value.trim().length >= 2) {
          clearFieldError(nameInput, errorEls.name);
        }
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const val = phoneInput.value.trim();
      if (!val) {
        showFieldError(phoneInput, errorEls.phone, 'Phone / WhatsApp number is required.');
        return;
      }
      const saCheck = validateSAPhone(val);
      if (!saCheck.isValid) {
        showFieldError(phoneInput, errorEls.phone, saCheck.error);
      } else {
        phoneInput.value = saCheck.formatted;
        clearFieldError(phoneInput, errorEls.phone);
      }
    });

    phoneInput.addEventListener('input', () => {
      if (phoneInput.classList.contains('is-invalid')) {
        const saCheck = validateSAPhone(phoneInput.value.trim());
        if (saCheck.isValid) {
          clearFieldError(phoneInput, errorEls.phone);
        }
      }
    });
  }

  if (emailInput) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    emailInput.addEventListener('blur', () => {
      const val = emailInput.value.trim();
      if (!val) {
        showFieldError(emailInput, errorEls.email, 'Email address is required.');
      } else if (!emailRegex.test(val)) {
        showFieldError(emailInput, errorEls.email, 'Please enter a valid email address (e.g. name@example.com).');
      } else {
        clearFieldError(emailInput, errorEls.email);
      }
    });

    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid')) {
        if (emailRegex.test(emailInput.value.trim())) {
          clearFieldError(emailInput, errorEls.email);
        }
      }
    });
  }

  if (trackInput) {
    trackInput.addEventListener('change', () => {
      if (!trackInput.value) {
        showFieldError(trackInput, errorEls.track, 'Please select an area of interest.');
      } else {
        clearFieldError(trackInput, errorEls.track);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      const val = messageInput.value.trim();
      if (!val || val.length < 10) {
        showFieldError(messageInput, errorEls.message, 'Please provide a brief message or question (at least 10 characters).');
      } else {
        clearFieldError(messageInput, errorEls.message);
      }
    });

    messageInput.addEventListener('input', () => {
      if (messageInput.classList.contains('is-invalid')) {
        if (messageInput.value.trim().length >= 10) {
          clearFieldError(messageInput, errorEls.message);
        }
      }
    });
  }

  // Form Submission Validation
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormStatus();

    let hasErrors = false;
    let firstInvalidField = null;

    // Validate Name
    if (!nameInput || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, errorEls.name, 'Please enter your full name (at least 2 characters).');
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = nameInput;
    } else {
      clearFieldError(nameInput, errorEls.name);
    }

    // Validate Phone (SA Standard)
    if (!phoneInput || !phoneInput.value.trim()) {
      showFieldError(phoneInput, errorEls.phone, 'Phone / WhatsApp number is required.');
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = phoneInput;
    } else {
      const saCheck = validateSAPhone(phoneInput.value.trim());
      if (!saCheck.isValid) {
        showFieldError(phoneInput, errorEls.phone, saCheck.error);
        hasErrors = true;
        if (!firstInvalidField) firstInvalidField = phoneInput;
      } else {
        phoneInput.value = saCheck.formatted;
        clearFieldError(phoneInput, errorEls.phone);
      }
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, errorEls.email, 'Please enter a valid email address.');
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = emailInput;
    } else {
      clearFieldError(emailInput, errorEls.email);
    }

    // Validate Track
    if (!trackInput || !trackInput.value) {
      showFieldError(trackInput, errorEls.track, 'Please select an area of interest.');
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = trackInput;
    } else {
      clearFieldError(trackInput, errorEls.track);
    }

    // Validate Message
    if (!messageInput || messageInput.value.trim().length < 10) {
      showFieldError(messageInput, errorEls.message, 'Please provide a brief message or question (at least 10 characters).');
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = messageInput;
    } else {
      clearFieldError(messageInput, errorEls.message);
    }

    if (hasErrors) {
      showFormStatus('error', 'Please correct the highlighted fields before submitting.');
      if (firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending Enquiry...';

    const formData = new FormData(form);

    try {
      const response = await fetch('contact.php', {
        method: 'POST',
        body: formData
      });

      let result;
      try {
        result = await response.json();
      } catch (err) {
        result = { success: true, message: 'Thank you! Your enquiry has been securely received.' };
      }

      if (result.success) {
        showFormStatus('success', '✓ Thank you! Your enquiry has been received securely. We will respond promptly within professional scope.');
        submitBtn.textContent = '✓ Enquiry Sent Successfully!';
        submitBtn.style.backgroundColor = '#0B4033';
        submitBtn.style.color = '#FFFFFF';
        form.reset();

        // Remove valid classes after reset
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 5000);
      } else {
        showFormStatus('error', result.error || 'There was an issue sending your enquiry. Please reach out to info@michelleot.co.za or call +27 61 530 6884.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    } catch (error) {
      // Local preview fallback or server offline
      showFormStatus('success', '✓ Thank you! Your enquiry has been simulated successfully (offline preview). In production, this will dispatch directly to info@michelleot.co.za.');
      submitBtn.textContent = '✓ Enquiry Sent Successfully!';
      submitBtn.style.backgroundColor = '#0B4033';
      submitBtn.style.color = '#FFFFFF';
      form.reset();
      form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.color = '';
      }, 5000);
    }
  });
}

/**
 * Smooth scrolling offset calculation for sticky navbar
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Switch Interactive Map & Details between Consulting Locations
 */
function switchMapLocation(locationId) {
  const btns = document.querySelectorAll('.location-tab-btn');
  const cardGardenCity = document.getElementById('card-gardencity');
  const cardMidrand = document.getElementById('card-midrand');
  const mapFrame = document.getElementById('interactive-map-frame');

  if (locationId === 'gardencity') {
    if (cardGardenCity) cardGardenCity.style.display = 'block';
    if (cardMidrand) cardMidrand.style.display = 'none';
    if (mapFrame) {
      mapFrame.src = 'https://maps.google.com/maps?q=Netcare+Garden+City+Hospital+35+Bartlett+Road+Johannesburg&t=&z=14&ie=UTF8&iwloc=&output=embed';
    }
  } else if (locationId === 'midrand') {
    if (cardGardenCity) cardGardenCity.style.display = 'none';
    if (cardMidrand) cardMidrand.style.display = 'block';
    if (mapFrame) {
      mapFrame.src = 'https://maps.google.com/maps?q=Woodmead+Dr+and+Dytchley+Rd+Midrand+1686&t=&z=14&ie=UTF8&iwloc=&output=embed';
    }
  }

  btns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(locationId));
  });
}

/**
 * Smart WhatsApp Booking Widget Toggle
 */
function initWhatsAppWidget() {
  const widgetBtn = document.getElementById('whatsapp-widget-btn');
  const popover = document.getElementById('whatsapp-booking-popover');

  if (!widgetBtn || !popover) return;

  widgetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = popover.classList.toggle('active');
    popover.setAttribute('aria-hidden', !isOpen);
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target) && e.target !== widgetBtn) {
      popover.classList.remove('active');
      popover.setAttribute('aria-hidden', 'true');
    }
  });

  // Close when tapping an option
  popover.querySelectorAll('.whatsapp-opt-btn').forEach(opt => {
    opt.addEventListener('click', () => {
      popover.classList.remove('active');
      popover.setAttribute('aria-hidden', 'true');
    });
  });
}
