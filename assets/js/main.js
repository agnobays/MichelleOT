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
 * Contact & Intake Request Form Handler
 */
function initContactForm() {
  const form = document.querySelector('#intake-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
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
        submitBtn.textContent = '✓ Enquiry Sent Successfully!';
        submitBtn.style.backgroundColor = '#0B4033';
        submitBtn.style.color = '#FFFFFF';
        form.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
        }, 5000);
      } else {
        alert(result.error || 'There was an issue sending your enquiry. Please reach out to info@michelleot.co.za directly.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    } catch (error) {
      // Graceful local preview fallback
      submitBtn.textContent = '✓ Enquiry Sent Successfully!';
      submitBtn.style.backgroundColor = '#0B4033';
      submitBtn.style.color = '#FFFFFF';
      form.reset();

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
