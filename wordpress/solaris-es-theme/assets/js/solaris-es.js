(function () {
  const toggle = document.querySelector('[data-sf-menu-toggle]');
  const nav = document.querySelector('[data-sf-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', function () {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    nav.classList.toggle('is-open', !expanded);
    document.documentElement.classList.toggle('sf-menu-open', !expanded);
  });
})();
