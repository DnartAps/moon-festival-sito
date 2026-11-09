/* Moon Festival · script del sito (ambito: Simone, funzioni)
   - Lingua IT/EN: cambia tutti i testi con data-t (dizionario in js/testi.js),
     i testi alternativi (data-t-alt), le etichette (data-t-aria) e i segnaposto (data-t-ph).
     La scelta resta memorizzata; ?lang=en nell'indirizzo apre direttamente l'inglese.
   - Versione accessibile: bianco e nero, memorizzata.
   - Menu mobile: apre e chiude il menu sotto i 960 px (Esc per chiudere).
   - Ricerca: il bottone a icona porta il focus nel campo.
   - Periodi: base / prima / durante, in base alle date di js/periodi.js. */
(function () {
  var TESTI = window.MOON_TESTI || {};
  var html = document.documentElement;

  function leggi(chiave) { try { return window.localStorage.getItem(chiave); } catch (e) { return null; } }
  function scrivi(chiave, valore) { try { window.localStorage.setItem(chiave, valore); } catch (e) { /* niente */ } }

  /* ---------- Lingua ---------- */
  function applicaLingua(lingua) {
    if (lingua !== 'en') lingua = 'it';
    html.setAttribute('lang', lingua);
    document.querySelectorAll('[data-t]').forEach(function (el) {
      var t = TESTI[el.getAttribute('data-t')]; if (t && t[lingua] != null) el.innerHTML = t[lingua];
    });
    document.querySelectorAll('[data-t-alt]').forEach(function (el) {
      var t = TESTI[el.getAttribute('data-t-alt')]; if (t) el.setAttribute('alt', t[lingua]);
    });
    document.querySelectorAll('[data-t-aria]').forEach(function (el) {
      var t = TESTI[el.getAttribute('data-t-aria')]; if (t) el.setAttribute('aria-label', t[lingua]);
    });
    document.querySelectorAll('[data-t-ph]').forEach(function (el) {
      var t = TESTI[el.getAttribute('data-t-ph')]; if (t) el.setAttribute('placeholder', t[lingua]);
    });
    var titolo = document.querySelector('title[data-t-titolo]');
    if (titolo) { var tt = TESTI[titolo.getAttribute('data-t-titolo')]; if (tt) document.title = tt[lingua]; }
    document.querySelectorAll('.lingue button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('lang') === lingua));
    });
    /* i link interni portano con sé la lingua scelta */
    document.querySelectorAll('a[data-interno]').forEach(function (a) {
      var base = a.getAttribute('data-interno'), q = [];
      if (lingua === 'en') q.push('lang=en');
      if (window.MOON_PERIODO_FORZATO) q.push('periodo=' + window.MOON_PERIODO_FORZATO);
      a.setAttribute('href', q.length ? base.replace(/(#|$)/, '?' + q.join('&') + '$1') : base);
    });
    scrivi('moon-lingua', lingua);
    document.dispatchEvent(new CustomEvent('moon:lingua', { detail: lingua }));
  }

  /* ---------- Versione accessibile ---------- */
  function applicaAccessibile(attiva) {
    html.classList.toggle('accessibile', attiva);
    document.querySelectorAll('input[data-accessibile]').forEach(function (c) { c.checked = attiva; });
    scrivi('moon-accessibile', attiva ? '1' : '0');
  }

  /* ---------- Periodi: base, prima, durante (dati in js/periodi.js) ---------- */
  function oggiISO(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function calcolaPeriodo() {
    var P = window.MOON_PERIODI || {}, par = new URLSearchParams(window.location.search);
    var forzato = par.get('periodo');
    if (forzato === 'base' || forzato === 'prima' || forzato === 'durante') return { stato: forzato, forzato: true };
    var oggi = oggiISO(new Date());
    if (P.festival && oggi >= P.festival.dal && oggi <= P.festival.al) return { stato: 'durante' };
    if (P.prima && P.prima.dal && P.festival && oggi >= P.prima.dal && oggi < P.festival.dal) return { stato: 'prima' };
    return { stato: 'base' };
  }
  function applicaPeriodo() {
    var p = calcolaPeriodo();
    html.setAttribute('data-periodo', p.stato);
    window.MOON_STATO = p.stato;
    document.querySelectorAll('[data-periodi]').forEach(function (el) {
      var attivo = el.getAttribute('data-periodi').split(/\s+/).indexOf(p.stato) !== -1;
      /* la voce della pagina in cui ti trovi resta sempre visibile */
      if (el.querySelector('[aria-current="page"]')) attivo = true;
      el.hidden = !attivo;
    });
    if (p.forzato) {
      var barra = document.createElement('p');
      barra.className = 'anteprima-periodo';
      barra.setAttribute('role', 'status');
      barra.textContent = 'Anteprima · stato del sito: ' + p.stato;
      document.body.insertBefore(barra, document.body.firstChild);
      window.MOON_PERIODO_FORZATO = p.stato; /* i link interni mantengono l'anteprima */
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applicaPeriodo();
    var daIndirizzo = (new URLSearchParams(window.location.search)).get('lang');
    applicaLingua(daIndirizzo || leggi('moon-lingua') || 'it');
    applicaAccessibile(leggi('moon-accessibile') === '1');

    document.querySelectorAll('.lingue button').forEach(function (b) {
      b.addEventListener('click', function () { applicaLingua(b.getAttribute('lang')); });
    });
    document.querySelectorAll('input[data-accessibile]').forEach(function (c) {
      c.addEventListener('change', function () { applicaAccessibile(c.checked); });
    });

    /* Ricerca */
    document.querySelectorAll('.cerca').forEach(function (form) {
      var bottone = form.querySelector('button'), campo = form.querySelector('input');
      if (bottone && campo) bottone.addEventListener('click', function () { campo.focus(); });
    });

    /* Menu mobile */
    var header = document.querySelector('.header');
    var bottoneMenu = document.querySelector('.menu-bottone');
    if (header && bottoneMenu) {
      var chiudi = function (rimettiFocus) {
        header.classList.remove('menu-aperto');
        bottoneMenu.setAttribute('aria-expanded', 'false');
        if (rimettiFocus) bottoneMenu.focus();
      };
      bottoneMenu.addEventListener('click', function () {
        var aperto = header.classList.toggle('menu-aperto');
        bottoneMenu.setAttribute('aria-expanded', String(aperto));
        if (aperto) { var primo = header.querySelector('.menu a'); if (primo) primo.focus(); }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.classList.contains('menu-aperto')) chiudi(true);
      });
      header.querySelectorAll('.menu a').forEach(function (a) { a.addEventListener('click', function () { chiudi(false); }); });
    }

    // Sottomenu con ancore (es. Il festival): la voce della sezione che si sta leggendo diventa
    // "corrente" (aria-current="location", grassetto) mentre si scorre la pagina.
    var voci = [].slice.call(document.querySelectorAll('.sottomenu a[href^="#"]')).filter(function (a) {
      return a.getAttribute('href').length > 1 && document.getElementById(a.getAttribute('href').slice(1));
    });
    if (voci.length > 1 && 'IntersectionObserver' in window) {
      var segna = function (id) {
        voci.forEach(function (a) {
          if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'location');
          else if (a.getAttribute('aria-current') === 'location') a.removeAttribute('aria-current');
        });
      };
      var oss = new IntersectionObserver(function (righe) {
        righe.forEach(function (r) { if (r.isIntersecting) segna(r.target.id); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      voci.forEach(function (a) { oss.observe(document.getElementById(a.getAttribute('href').slice(1))); });
    }
  });
})();
