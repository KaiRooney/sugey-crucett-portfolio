const header = document.querySelector(".site-header");
const year = document.querySelector("#year");
const contactForm = document.querySelector("[data-contact-form]");

let portfolioData;
let currentLanguage = localStorage.getItem("portfolioLanguage") || "en";
let revealObserver;

// stage the cinematic intro: hide the portrait until the text sequence lands
document.body.classList.add("has-intro");

const setText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
};

const setMailLinks = (email) => {
  document.querySelectorAll('[data-field="emailLink"]').forEach((link) => {
    link.href = `mailto:${email}`;
  });
};

const setResumeLinks = (resumeUrl) => {
  document.querySelectorAll('[data-field="resumeLink"]').forEach((link) => {
    link.href = resumeUrl;
  });
};

const renderHeroTitle = (segments = []) => {
  const title = document.querySelector('[data-field="heroTitle"]');
  if (!title) {
    return;
  }
  title.replaceChildren();
  segments.forEach((segment) => {
    const line = createElement("span", "line");
    if (segment.italic) {
      line.append(createElement("em", "", segment.text));
    } else {
      line.textContent = segment.text;
    }
    title.append(line);
  });
};

const renderNavigation = (items = []) => {
  const left = document.querySelector('[data-nav="left"]');
  const right = document.querySelector('[data-nav="right"]');
  left.replaceChildren();
  right.replaceChildren();

  const half = Math.ceil(items.length / 2);
  items.forEach((item, index) => {
    const link = createElement("a", "", item.label);
    link.href = item.href;
    (index < half ? left : right).append(link);
  });
};

const renderMetrics = (items = []) => {
  const metrics = document.querySelector('[data-list="metrics"]');
  const floats = ["float-a", "float-b", "float-c"];
  metrics.replaceChildren();

  items.forEach((item, index) => {
    const card = createElement("div", `glass-card ${floats[index % floats.length]}`);
    card.append(createElement("strong", "", item.value));
    card.append(createElement("span", "", item.label));
    metrics.append(card);
  });
};

const renderExperience = (items = []) => {
  const grid = document.querySelector('[data-list="experience"]');
  grid.replaceChildren();

  items.forEach((item, index) => {
    const card = createElement("article", "project-card reveal");
    card.style.setProperty("--d", String(index));
    const image = createElement("img");
    const body = createElement("div", "project-body");

    image.src = item.image;
    image.alt = item.imageAlt;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      card.classList.add("no-image");
    });
    body.append(createElement("p", "project-tag", `${item.organization} | ${item.dates}`));
    body.append(createElement("h3", "", item.role));
    body.append(createElement("p", "", item.description));
    card.append(image, body);
    grid.append(card);
  });
};

const renderSkills = (items = []) => {
  const skills = document.querySelector('[data-list="skills"]');
  skills.replaceChildren();

  items.forEach((item, index) => {
    const chip = createElement("span", "reveal", item);
    chip.style.setProperty("--d", String(index % 6));
    skills.append(chip);
  });
};

const renderCredentials = (items = []) => {
  const credentials = document.querySelector('[data-list="credentials"]');
  credentials.replaceChildren();

  items.forEach((item, index) => {
    const credential = createElement("div", "reveal");
    credential.style.setProperty("--d", String(index));
    credential.append(createElement("h3", "", item.title));
    credential.append(createElement("p", "", item.description));
    credentials.append(credential);
  });
};

const renderLanguages = (languages = {}) => {
  const languageList = document.querySelector('[data-list="languages"]');
  languageList.replaceChildren();

  Object.entries(languages).forEach(([key, language]) => {
    const button = createElement("button", "", language.shortName);
    button.type = "button";
    button.dataset.language = key;
    button.title = language.name;
    button.classList.toggle("is-active", key === currentLanguage);
    button.setAttribute("aria-pressed", String(key === currentLanguage));
    languageList.append(button);
  });
};

const observeReveals = () => {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  const reveals = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  reveals.forEach((element) => revealObserver.observe(element));
};

const renderPortfolio = (data, language = "en") => {
  const { profile } = data;
  const content = data.content?.[language] || data.content?.en || data;

  currentLanguage = language;
  localStorage.setItem("portfolioLanguage", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = `${profile.name} | ${content.title}`;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", content.metaDescription);

  setText('[data-field="name"]', profile.name);
  setText('[data-field="heroEyebrow"]', content.hero.eyebrow);
  setText('[data-field="summary"]', content.hero.summary);
  setText('[data-field="primaryAction"]', content.hero.primaryAction);
  setText('[data-field="resumeAction"]', content.hero.resumeAction);
  setText('[data-field="descendLabel"]', content.hero.descendLabel);
  setText('[data-field="email"]', profile.email);
  setText('[data-field="contactDetails"]', `${profile.location} | ${profile.phone}`);
  setText('[data-field="footerText"]', content.footer?.text || "Professional portfolio.");
  setText('[data-field="backToTop"]', content.footer?.backToTop || "Back to top");
  setMailLinks(profile.email);
  setResumeLinks(profile.resumeUrl);

  document.querySelector('[data-field="heroImage"]').src = profile.heroImage;

  renderHeroTitle(content.hero.title);

  setText('[data-field="aboutEyebrow"]', content.about.eyebrow);
  setText('[data-field="aboutTitle"]', content.about.title);
  setText('[data-field="aboutBody"]', content.about.body);
  setText('[data-field="experienceEyebrow"]', content.experienceSection.eyebrow);
  setText('[data-field="experienceTitle"]', content.experienceSection.title);
  setText('[data-field="skillsEyebrow"]', content.skillsSection.eyebrow);
  setText('[data-field="skillsTitle"]', content.skillsSection.title);
  setText('[data-field="credentialsEyebrow"]', content.credentials.eyebrow);
  setText('[data-field="credentialsTitle"]', content.credentials.title);
  setText('[data-field="contactEyebrow"]', content.contact.eyebrow);
  setText('[data-field="contactTitle"]', content.contact.title);
  setText('[data-field="directLabel"]', content.contact.directLabel);
  setText('[data-field="formTitle"]', content.contact.formTitle);
  setText('[data-field="nameLabel"]', content.contact.nameLabel);
  setText('[data-field="emailLabel"]', content.contact.emailLabel);
  setText('[data-field="messageLabel"]', content.contact.messageLabel);
  setText('[data-field="submitLabel"]', content.contact.submitLabel);

  const message = contactForm?.elements.message;
  if (message && !message.dataset.touched) {
    message.value = content.contact.defaultMessage;
  }

  renderLanguages(data.languages);
  renderNavigation(content.navigation);
  renderMetrics(content.metrics);
  renderExperience(content.experience);
  renderSkills(content.skills);
  renderCredentials(content.credentials.items);
  observeReveals();
};

const startIntro = () => {
  const heroImage = document.querySelector('[data-field="heroImage"]');
  let started = false;

  const begin = () => {
    if (started) {
      return;
    }
    started = true;
    requestAnimationFrame(() => {
      // stage 1: text sequence rises out of the void
      document.body.classList.add("is-loaded");
      // stage 2: once the words have landed, the portrait opens like a portal
      setTimeout(() => {
        document.body.classList.add("hero-revealed");
      }, 2100);
    });
  };

  if (heroImage && !heroImage.complete) {
    heroImage.addEventListener("load", begin, { once: true });
    setTimeout(begin, 1600);
  } else {
    setTimeout(begin, 250);
  }
};

const loadPortfolio = async () => {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Unable to load portfolio data.");
    }
    portfolioData = await response.json();
    if (!portfolioData.content?.[currentLanguage]) {
      currentLanguage = "en";
    }
    renderPortfolio(portfolioData, currentLanguage);
  } catch (error) {
    console.warn(error);
    observeReveals();
  } finally {
    startIntro();
  }
};

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

year.textContent = new Date().getFullYear();
syncHeader();
loadPortfolio();

window.addEventListener("scroll", syncHeader, { passive: true });

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-language]");
  if (!button || !portfolioData) {
    return;
  }

  renderPortfolio(portfolioData, button.dataset.language);
});

contactForm?.elements.message?.addEventListener("input", (event) => {
  event.currentTarget.dataset.touched = "true";
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const content = portfolioData?.content?.[currentLanguage];
  const email = portfolioData?.profile.email || "sugeycrucett@live.com";
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const senderEmail = formData.get("email");
  const message = formData.get("message");
  const body = [`Name: ${name}`, `Email: ${senderEmail}`, "", message].join("\n");
  const subject = content?.contact.subject || "Portfolio inquiry for Sugey Crucett";

  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
