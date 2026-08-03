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

  const buildStaticChat = () => {
    const toggle = root.querySelector('[data-testid="chatbot-toggle"]');
    if (!toggle || toggle.dataset.faithfulChatBound === "true" || typeof document.createElement !== "function") return;
    toggle.dataset.faithfulChatBound = "true";

    const whatsapp = root.querySelector('[data-testid="floating-contact-btn"]');
    const panel = document.createElement("aside");
    panel.className = "faithful-chatbot-window";
    panel.setAttribute("data-testid", "chatbot-window");
    panel.setAttribute("data-faithful-chat-open", "false");
    panel.innerHTML = `
      <div class="faithful-chatbot-window__header">
        <div>
          <p>Assistente Solaris</p>
          <span>Assistente tecnico</span>
        </div>
        <button type="button" data-testid="chatbot-close" aria-label="Chiudi assistente Solaris">×</button>
      </div>
      <div class="faithful-chatbot-window__messages" data-faithful-chat-messages></div>
      <div class="faithful-chatbot-window__quick">
        <button type="button">Voglio ridurre calore e abbaglio</button>
        <button type="button">Mi serve sicurezza sul vetro</button>
        <button type="button">Vorrei più privacy</button>
      </div>
      <form class="faithful-chatbot-window__form" data-faithful-chat-form>
        <textarea data-testid="chatbot-input" rows="1" placeholder="Scrivi un messaggio..."></textarea>
        <button type="submit" data-testid="chatbot-send" aria-label="Invia messaggio">Invia</button>
      </form>
    `;
    document.body.appendChild(panel);

    const messages = panel.querySelector("[data-faithful-chat-messages]");
    const input = panel.querySelector('[data-testid="chatbot-input"]');
    const form = panel.querySelector("[data-faithful-chat-form]");
    const quickButtons = panel.querySelectorAll(".faithful-chatbot-window__quick button");

    const emitChatState = (isOpen) => {
      window.dispatchEvent(new CustomEvent("solaris-chatbot-state", { detail: { isOpen } }));
      if (whatsapp) {
        if (isOpen) {
          whatsapp.style.setProperty("opacity", "0", "important");
          whatsapp.style.setProperty("pointer-events", "none", "important");
          whatsapp.style.setProperty("transform", "scale(0.9)", "important");
        } else {
          whatsapp.style.removeProperty("opacity");
          whatsapp.style.removeProperty("pointer-events");
          whatsapp.style.removeProperty("transform");
        }
      }
    };

    const appendMessage = (type, text) => {
      const message = document.createElement("div");
      message.className = `faithful-chatbot-window__message faithful-chatbot-window__message--${type}`;
      message.textContent = text;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    };

    const openChat = () => {
      panel.dataset.faithfulChatOpen = "true";
      toggle.classList.add("hidden");
      emitChatState(true);
      if (!messages.dataset.faithfulInitialized) {
        appendMessage("bot", "Ciao! Sono l'assistente Solaris. Posso aiutarti a capire quale pellicola è più adatta al tuo edificio.");
        messages.dataset.faithfulInitialized = "true";
      }
      window.setTimeout(() => input && input.focus(), 80);
    };

    const closeChat = () => {
      panel.dataset.faithfulChatOpen = "false";
      toggle.classList.remove("hidden");
      emitChatState(false);
    };

    const respond = (text) => {
      const lower = text.toLowerCase();
      if (lower.includes("sicurezza") || lower.includes("antisfondamento") || lower.includes("certificat")) {
        return "Per la sicurezza si verifica prima il vetro e poi si sceglie la pellicola certificata, per esempio serie CL o SafetyShield in base al rischio. Puoi inviare foto e misure dal modulo preventivo.";
      }
      if (lower.includes("privacy") || lower.includes("decor")) {
        return "Per privacy e design valutiamo quanta luce vuoi mantenere, il livello di copertura e l'effetto estetico. Le soluzioni possono essere satinate, decorative o vetrofanie su misura.";
      }
      if (lower.includes("calore") || lower.includes("abbaglio") || lower.includes("sole")) {
        return "Per calore e abbaglio si parte da esposizione, tipo di vetro e luminosità desiderata. Le famiglie antisolari Solaris permettono di bilanciare respinta energetica, trasparenza ed estetica.";
      }
      return "Ho capito. Per orientarti meglio servono città, tipo di edificio, obiettivo e qualche foto delle vetrate. Puoi continuare qui o aprire la richiesta preventivo.";
    };

    const sendMessage = (value) => {
      const text = String(value || "").trim();
      if (!text) return;
      appendMessage("user", text);
      if (input) input.value = "";
      window.setTimeout(() => appendMessage("bot", respond(text)), 250);
    };

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      openChat();
    });
    panel.querySelector('[data-testid="chatbot-close"]').addEventListener("click", closeChat);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input && input.value);
    });
    quickButtons.forEach((button) => {
      button.addEventListener("click", () => sendMessage(button.textContent));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.dataset.faithfulChatOpen === "true") closeChat();
    });
  };

  buildStaticChat();
})();
