(function () {
  window.__faithfulLoaded = true;
  const root = document.querySelector(".faithful-static-wp");
  if (!root) return;
  root.dataset.faithfulJsLoaded = "true";

  const dropdownWrappers = root.querySelectorAll(".relative > [data-testid^='desktop-dropdown']");
  dropdownWrappers.forEach((dropdown) => {
    const wrapper = dropdown.parentElement;
    if (!wrapper || !dropdown || !wrapper.addEventListener || !dropdown.addEventListener) return;

    let closeTimer = null;
    let clickLocked = false;
    const setDropdownVisible = (visible) => {
      wrapper.dataset.faithfulDropdownOpen = visible ? "true" : "false";
      dropdown.style.display = visible ? "block" : "";
      dropdown.style.visibility = visible ? "visible" : "";
      dropdown.style.opacity = visible ? "1" : "";
      dropdown.style.pointerEvents = visible ? "auto" : "";
      dropdown.style.transform = visible ? "translateX(-50%) translateY(0)" : "";
    };
    const open = () => {
      if (closeTimer) window.clearTimeout(closeTimer);
      dropdownWrappers.forEach((otherDropdown) => {
        if (otherDropdown === dropdown || !otherDropdown.parentElement) return;
        otherDropdown.parentElement.dataset.faithfulDropdownOpen = "false";
        otherDropdown.style.display = "";
        otherDropdown.style.visibility = "";
        otherDropdown.style.opacity = "";
        otherDropdown.style.pointerEvents = "";
        otherDropdown.style.transform = "";
      });
      setDropdownVisible(true);
    };
    const closeSoon = () => {
      if (clickLocked) return;
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        setDropdownVisible(false);
      }, 1000);
    };

    wrapper.addEventListener("mouseenter", open);
    wrapper.addEventListener("mouseleave", closeSoon);
    dropdown.addEventListener("mouseenter", open);
    dropdown.addEventListener("mouseleave", closeSoon);
    wrapper.addEventListener("pointerenter", open);
    wrapper.addEventListener("pointerleave", closeSoon);
    dropdown.addEventListener("pointerenter", open);
    dropdown.addEventListener("pointerleave", closeSoon);
    wrapper.addEventListener("focusin", open);
    wrapper.addEventListener("focusout", closeSoon);
    const trigger = wrapper.querySelector("a");
    if (trigger) {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        clickLocked = wrapper.dataset.faithfulDropdownOpen !== "true";
        setDropdownVisible(clickLocked);
      });
    }
  });

  const buildMobileMenu = () => {
    const header = root.querySelector('[data-testid="header"]');
    const nav = header && header.querySelector("nav");
    const toggle = root.querySelector('[data-testid="mobile-menu-toggle"]');
    if (!header || !nav || !toggle || typeof document.createElement !== "function") return;

    let panel = root.querySelector('[data-testid="mobile-menu"]');
    if (!panel) {
      panel = document.createElement("div");
      panel.setAttribute("data-testid", "mobile-menu");
      panel.setAttribute("data-faithful-mobile-panel", "true");
      panel.setAttribute("data-faithful-mobile-open", "false");
      panel.className = "faithful-mobile-panel";

      const inner = document.createElement("div");
      inner.className = "faithful-mobile-panel__inner";

      const navItems = Array.from(nav.children).filter((item) => item && item.querySelector);
      navItems.forEach((item) => {
        const topLink = Array.from(item.children).find((child) => child.tagName === "A");
        const dropdown = Array.from(item.children).find((child) =>
          child.matches && child.matches('[data-testid^="desktop-dropdown"]')
        );
        const label = topLink ? topLink.textContent.trim() : "";
        if (!label) return;

        if (!dropdown) {
          const link = document.createElement("a");
          link.className = "faithful-mobile-link";
          link.href = topLink.getAttribute("href") || "#";
          link.textContent = label;
          inner.appendChild(link);
          return;
        }

        const section = document.createElement("section");
        section.className = "faithful-mobile-section";
        section.setAttribute("data-faithful-mobile-section", "true");

        const button = document.createElement("button");
        button.type = "button";
        button.className = "faithful-mobile-section__toggle";
        button.setAttribute("aria-expanded", "false");
        button.innerHTML = `<span>${label}</span><span aria-hidden="true">⌄</span>`;

        const content = document.createElement("div");
        content.className = "faithful-mobile-section__content";

        const overview = document.createElement("a");
        overview.className = "faithful-mobile-overview";
        overview.href = topLink.getAttribute("href") || "#";
        overview.textContent = "Panoramica";
        content.appendChild(overview);

        const seen = new Set([overview.href]);
        Array.from(dropdown.querySelectorAll("a[href]")).forEach((sourceLink) => {
          const href = sourceLink.getAttribute("href");
          if (!href || href === "#") return;

          const primaryText =
            sourceLink.querySelector(".leading-snug")?.textContent ||
            sourceLink.querySelector(".block.text-sm")?.textContent ||
            sourceLink.querySelector("span")?.textContent ||
            sourceLink.textContent;
          const text = primaryText.replace(/\s+/g, " ").trim();
          if (!text || text === "Panoramica" || text === "Vedi panoramica") return;

          const absolute = new URL(href, window.location.href).href;
          if (seen.has(absolute)) return;
          seen.add(absolute);

          const link = document.createElement("a");
          link.className = "faithful-mobile-sublink";
          link.href = href;
          link.textContent = text;
          content.appendChild(link);
        });

        button.addEventListener("click", () => {
          const nextOpen = section.dataset.faithfulOpen !== "true";
          section.dataset.faithfulOpen = nextOpen ? "true" : "false";
          button.setAttribute("aria-expanded", nextOpen ? "true" : "false");
        });

        section.appendChild(button);
        section.appendChild(content);
        inner.appendChild(section);
      });

      const contacts = document.createElement("div");
      contacts.className = "faithful-mobile-contacts";
      contacts.innerHTML = `
        <a href="tel:+390559107621">Chiama</a>
        <a href="/api/fast-contact?to=3926578067&text=Ciao%2C%20vorrei%20informazioni%20sulle%20pellicole%20per%20vetri." target="_blank" rel="noopener noreferrer">WhatsApp</a>
      `;
      inner.appendChild(contacts);
      panel.appendChild(inner);
      header.appendChild(panel);
    }

    const setMobileOpen = (open) => {
      panel.dataset.faithfulMobileOpen = open ? "true" : "false";
      toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.classList.toggle("faithful-mobile-lock", open);
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      setMobileOpen(panel.dataset.faithfulMobileOpen !== "true");
    });

    panel.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => setMobileOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    });
  };

  buildMobileMenu();

  const buildStaticChat = () => {
    const toggle = root.querySelector('[data-testid="chatbot-toggle"]');
    if (!toggle || root.querySelector('[data-testid="chatbot-window"]')) return;

    const panel = document.createElement("div");
    panel.className = "faithful-chatbot";
    panel.setAttribute("data-testid", "chatbot-window");
    panel.setAttribute("data-faithful-chat-open", "false");
    panel.setAttribute("aria-hidden", "true");

    const messages = document.createElement("div");
    messages.className = "faithful-chatbot__messages";

    const addMessage = (type, text) => {
      const row = document.createElement("div");
      row.className = `faithful-chatbot__row faithful-chatbot__row--${type}`;
      const bubble = document.createElement("div");
      bubble.className = `faithful-chatbot__bubble faithful-chatbot__bubble--${type}`;
      bubble.textContent = text;
      row.appendChild(bubble);
      messages.appendChild(row);
      messages.scrollTop = messages.scrollHeight;
    };

    const localAnswer = (value) => {
      const text = String(value || "").toLowerCase();
      if (text.includes("preventivo") || text.includes("prezzo") || text.includes("costo")) {
        return "Per preparare un preventivo servono tipo di edificio, citta, metri quadri indicativi e qualche foto delle vetrate. Puoi aprire il modulo preventivo o scriverci su WhatsApp.";
      }
      if (text.includes("sicurezza") || text.includes("12600") || text.includes("vetro")) {
        return "Per la sicurezza si parte dal vetro esistente, dalla destinazione d'uso e dalla classe richiesta. Solaris verifica compatibilita, prodotto e documentazione dell'intervento.";
      }
      if (text.includes("calore") || text.includes("sole") || text.includes("antisolare")) {
        return "Per ridurre calore e abbaglio bisogna verificare esposizione, tipo di vetro e risultato estetico desiderato. Da questi dati si sceglie la famiglia Madico corretta.";
      }
      return "Posso aiutarti a orientarti tra controllo solare, sicurezza, privacy e verifica tecnica. Scrivi l'esigenza principale oppure usa WhatsApp per parlare con Solaris.";
    };

    panel.innerHTML = `
      <div class="faithful-chatbot__header">
        <div>
          <strong>Assistente Solaris</strong>
          <span>Assistente tecnico</span>
        </div>
        <button type="button" data-faithful-chat-close aria-label="Chiudi assistente Solaris">x</button>
      </div>
      <div class="faithful-chatbot__quick" data-faithful-chat-quick>
        <button type="button" data-message="Vorrei ridurre calore e abbaglio">Ridurre calore</button>
        <button type="button" data-message="Vorrei mettere in sicurezza una vetrata">Sicurezza vetri</button>
        <button type="button" data-message="Vorrei un preventivo">Preventivo</button>
      </div>
      <div class="faithful-chatbot__form">
        <input type="text" data-testid="chatbot-input" placeholder="Scrivi un messaggio..." maxlength="500" />
        <button type="button" data-testid="chatbot-send" aria-label="Invia messaggio">Invia</button>
      </div>
      <div class="faithful-chatbot__links">
        <a href="/api/fast-contact?to=3926578067&text=Ciao%2C%20vorrei%20informazioni%20sulle%20pellicole%20per%20vetri." target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="/preventivo/">Preventivo</a>
      </div>
      <p class="faithful-chatbot__privacy">I dati inseriti servono solo per orientare la richiesta e facilitare il ricontatto Solaris.</p>
    `;
    panel.insertBefore(messages, panel.querySelector("[data-faithful-chat-quick]"));
    root.appendChild(panel);

    addMessage("bot", "Ciao! Sono l'assistente Solaris. Dimmi che problema vuoi risolvere sulla vetrata.");

    const setOpen = (open) => {
      panel.dataset.faithfulChatOpen = open ? "true" : "false";
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.classList.toggle("hidden", open);
      window.dispatchEvent(new CustomEvent("solaris-chatbot-state", { detail: { isOpen: open } }));
    };

    const input = panel.querySelector('[data-testid="chatbot-input"]');
    const send = panel.querySelector('[data-testid="chatbot-send"]');
    const sendMessage = (forcedMessage) => {
      const message = String(forcedMessage || input.value || "").trim();
      if (!message) return;
      addMessage("user", message);
      input.value = "";
      window.setTimeout(() => addMessage("bot", localAnswer(message)), 180);
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      setOpen(true);
      window.setTimeout(() => input.focus(), 60);
    });
    panel.querySelector("[data-faithful-chat-close]").addEventListener("click", () => setOpen(false));
    send.addEventListener("click", () => sendMessage());
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") sendMessage();
    });
    panel.querySelectorAll("[data-message]").forEach((button) => {
      button.addEventListener("click", () => sendMessage(button.dataset.message));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  };

  buildStaticChat();

  const faqButtons = root.querySelectorAll('[data-testid^="faq-item"] > button');
  faqButtons.forEach((button) => {
    const item = button.parentElement;
    if (!item) return;

    let answer = item.querySelector("[data-faithful-faq-answer]");
    if (!answer && typeof document.createElement === "function") {
      answer = document.createElement("div");
      answer.setAttribute("data-faithful-faq-answer", "true");
      answer.className = "px-6 pb-6 text-sm leading-relaxed text-[#475569]";
      answer.textContent = "Risposta gestita nel sito dinamico. Questo prototipo replica la struttura visuale della home.";
      item.appendChild(answer);
    }

    button.addEventListener("click", () => {
      item.dataset.faithfulFaqOpen = item.dataset.faithfulFaqOpen === "true" ? "false" : "true";
    });
  });
})();
