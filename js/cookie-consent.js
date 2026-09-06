(function () {
  var GA_ID = 'G-K3FJC98B6B';
  var META_PIXEL_ID = '1414168173997582';
  var CONSENT_KEY = 'meuganhoreal_cookie_consent';

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function loadMetaPixel() {
    if (window.__fbPixelLoaded) return;
    window.__fbPixelLoaded = true;

    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function privacyHref() {
    return location.pathname.indexOf('/blog/') !== -1 ? '../privacidade.html' : 'privacidade.html';
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML =
      '<div class="cookie-consent-inner">' +
        '<p>Usamos cookies para entender o tráfego do site (Google Analytics, Meta Pixel) e melhorar sua experiência. Você pode aceitar ou recusar os cookies não essenciais. ' +
        '<a href="' + privacyHref() + '">Saiba mais na Política de Privacidade</a>.</p>' +
        '<div class="cookie-consent-actions">' +
          '<button type="button" id="cookie-reject" class="btn-cookie btn-cookie-secondary">Recusar</button>' +
          '<button type="button" id="cookie-accept" class="btn-cookie btn-cookie-primary">Aceitar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      setConsent('accepted');
      loadGA();
      loadMetaPixel();
      banner.remove();
    });
    document.getElementById('cookie-reject').addEventListener('click', function () {
      setConsent('rejected');
      banner.remove();
    });
  }

  var consent = getConsent();
  if (consent === 'accepted') {
    loadGA();
    loadMetaPixel();
  } else if (consent !== 'rejected') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
