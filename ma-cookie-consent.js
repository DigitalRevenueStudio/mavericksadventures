/*! Maverick's Adventures - cookie consent (UK PECR style).
 *  Google Analytics (GA4) is only loaded after the visitor clicks Accept.
 *  Choice is remembered in localStorage (cookie fallback). */
(function () {
  'use strict';

  var GA_ID = 'G-SS5VR0KGVT';
  var KEY = 'ma_cookie_consent';
  var PRIVACY_URL = 'ma-privacy.html';

  function read() {
    try { var v = window.localStorage.getItem(KEY); if (v) return v; } catch (e) {}
    var m = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  function write(v) {
    try { window.localStorage.setItem(KEY, v); } catch (e) {}
    try {
      document.cookie = KEY + '=' + encodeURIComponent(v) + '; max-age=15552000; path=/; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '');
    } catch (e) {}
  }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function clearGACookies() {
    var host = location.hostname.replace(/^www\./, '');
    var domains = ['', location.hostname, '.' + host];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name === '_gat') {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  function injectStyles() {
    if (document.getElementById('ma-consent-css')) return;
    var css =
      '#ma-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:760px;margin:0 auto;' +
      'background:#3D1F0A;color:#FDF6EC;border-radius:14px;padding:18px 20px;box-shadow:0 8px 30px rgba(0,0,0,.35);' +
      'font-family:Nunito,system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.55;' +
      'display:flex;flex-wrap:wrap;gap:14px 20px;align-items:center;border:2px solid #C9841A}' +
      '#ma-consent p{margin:0;flex:1 1 320px}' +
      '#ma-consent a{color:#F0A830;text-decoration:underline}' +
      '#ma-consent .ma-consent-btns{display:flex;gap:10px;flex:0 0 auto}' +
      '#ma-consent button{font:inherit;font-weight:700;cursor:pointer;border-radius:999px;padding:10px 22px;min-width:104px;' +
      'border:2px solid #C9841A;background:#C9841A;color:#fff}' +
      '#ma-consent button.ma-decline{background:#FDF6EC;color:#3D1F0A}' +
      '#ma-consent button:hover,#ma-consent button:focus-visible{filter:brightness(1.1);outline:2px solid #F0A830;outline-offset:2px}' +
      '@media(max-width:520px){#ma-consent .ma-consent-btns{width:100%}#ma-consent button{flex:1}}';
    var st = document.createElement('style');
    st.id = 'ma-consent-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function hideBanner() {
    var b = document.getElementById('ma-consent');
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function showBanner() {
    if (document.getElementById('ma-consent')) return;
    injectStyles();
    var b = document.createElement('div');
    b.id = 'ma-consent';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie consent');
    b.innerHTML =
      '<p>🐾 We use cookies from Google Analytics to see how visitors use this site and make it better. ' +
      'They are only set if you accept. <a href="' + PRIVACY_URL + '">Read our privacy &amp; cookie policy</a>.</p>' +
      '<div class="ma-consent-btns">' +
      '<button type="button" class="ma-accept">Accept</button>' +
      '<button type="button" class="ma-decline">Decline</button></div>';
    document.body.appendChild(b);
    b.querySelector('.ma-accept').addEventListener('click', function () {
      write('accepted'); hideBanner(); loadGA();
    });
    b.querySelector('.ma-decline').addEventListener('click', function () {
      write('declined'); hideBanner(); clearGACookies();
    });
  }

  // Lets any link/button with data-cookie-settings reopen the banner.
  function wireSettingsLinks() {
    var els = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('click', function (ev) { ev.preventDefault(); showBanner(); });
    }
  }
  window.maCookieSettings = showBanner;

  function init() {
    wireSettingsLinks();
    var choice = read();
    if (choice === 'accepted') loadGA();
    else if (choice !== 'declined') showBanner();
  }

  if (read() === 'accepted') loadGA(); // start analytics as early as possible for returning, consenting visitors
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
