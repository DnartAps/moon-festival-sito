/* Moon Festival · finestre "Scrivici" e "Newsletter" (ambito: Simone)
   Si aprono dai link con data-dialogo="scrivici" o "newsletter" (footer e altre pagine), senza cambiare pagina.
   Senza JavaScript i link restano normali link email.
   Le risposte vanno allo stesso script Google dei moduli delle call (url in js/moduli-config.js):
   fogli "Moon <anno> · Contatti dal sito" e "Moon <anno> · Iscrizioni newsletter".
   Accessibilità: <dialog> nativo (focus dentro la finestra, Esc chiude, il focus torna al link),
   etichette visibili, errori scritti accanto al campo e riassunti in cima. */
(function () {
  var CONF = window.MOON_MODULI_CONFIG || {};
  var L = function () { return document.documentElement.lang === 'en' ? 'en' : 'it'; };
  var tx = function (o) { return typeof o === 'string' ? o : (o[L()] || o.it); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var t = function (it, en) { return { it: it, en: en }; };

  var PRIVACY = t('Ho letto l’<a href="privacy.html">informativa privacy</a> e acconsento al trattamento dei miei dati per ricevere una risposta.',
                  'I have read the <a href="privacy.html">privacy notice</a> and agree to my data being processed so you can reply.');
  var MODULI = {
    scrivici: {
      titolo: t('Scrivici', 'Write to us'),
      intro: t('Una domanda, una proposta, un’idea? Ti rispondiamo appena possibile.', 'A question, a proposal, an idea? We will reply as soon as we can.'),
      campi: [
        { id: 'nome', tipo: 'text', et: t('Nome', 'First name'), obbl: true, auto: 'given-name' },
        { id: 'nome-elezione', tipo: 'text', et: t('Nome di elezione', 'Chosen name'), aiuto: t('Se usi un nome diverso da quello anagrafico, scrivilo qui: useremo questo.', 'If you use a name other than your legal one, write it here: we will use this one.') },
        { id: 'cognome', tipo: 'text', et: t('Cognome', 'Surname'), obbl: true, auto: 'family-name' },
        { id: 'email', tipo: 'email', et: t('Email', 'Email'), obbl: true, auto: 'email' },
        { id: 'cellulare', tipo: 'tel', et: t('Cellulare', 'Mobile phone'), auto: 'tel' },
        { id: 'messaggio', tipo: 'area', et: t('Messaggio', 'Message'), obbl: true },
        { id: 'privacy', tipo: 'consenso', et: PRIVACY, breve: t('Consenso privacy', 'Privacy consent'), obbl: true },
        { id: 'newsletter', tipo: 'consenso', et: t('Voglio iscrivermi anche alla newsletter del Moon Festival.', 'I also want to join the Moon Festival newsletter.'), breve: t('Newsletter', 'Newsletter') }
      ],
      invia: t('Invia il messaggio', 'Send the message'),
      ok: t('Grazie, il tuo messaggio è arrivato. Ti rispondiamo all’indirizzo email che hai indicato.', 'Thank you, your message has arrived. We will reply to the email address you gave us.')
    },
    newsletter: {
      titolo: t('Iscriviti alla newsletter', 'Join the newsletter'),
      intro: t('Aggiornamenti, call e opportunità per partecipare. Poche email, quando serve.', 'News, open calls and ways to take part. Few emails, only when needed.'),
      campi: [
        { id: 'nome', tipo: 'text', et: t('Nome', 'First name'), obbl: true, auto: 'given-name' },
        { id: 'email', tipo: 'email', et: t('Email', 'Email'), obbl: true, auto: 'email' },
        { id: 'privacy', tipo: 'consenso', et: t('Ho letto l’<a href="privacy.html">informativa privacy</a> e voglio ricevere la newsletter. Posso cancellarmi quando voglio.', 'I have read the <a href="privacy.html">privacy notice</a> and want to receive the newsletter. I can unsubscribe at any time.'), breve: t('Consenso privacy', 'Privacy consent'), obbl: true }
      ],
      invia: t('Iscrivimi', 'Sign me up'),
      ok: t('Grazie, sei nella lista. Ci sentiamo alla prossima notizia.', 'Thank you, you are on the list. Talk soon.')
    }
  };
  var U = {
    chiudi: t('Chiudi', 'Close'), obbl: t('obbligatorio', 'required'), facolt: t('facoltativo', 'optional'),
    errTit: t('Controlla questi campi:', 'Please check these fields:'),
    errVuoto: t('Questo campo è obbligatorio.', 'This field is required.'),
    errEmail: t('Scrivi un indirizzo email valido, ad esempio nome@esempio.it.', 'Enter a valid email address, for example name@example.com.'),
    errTel: t('Scrivi un numero di telefono valido, solo cifre, spazi e +.', 'Enter a valid phone number: digits, spaces and + only.'),
    errConsenso: t('Per inviare serve il tuo consenso.', 'We need your consent to send this.'),
    invio: t('Invio in corso…', 'Sending…'),
    ko: t('Non siamo riusciti a inviare. Riprova tra poco oppure scrivi a moonfestival2022@gmail.com.', 'We could not send this. Try again shortly or write to moonfestival2022@gmail.com.'),
    prova: t('Modalità prova: il sito non è ancora collegato al foglio Google, quindi nulla è stato inviato.', 'Test mode: the site is not yet connected to the Google sheet, so nothing was sent.'),
    altro: t('Chiudi', 'Close')
  };

  var dlg, attuale, apertoDa, valori = {};

  function campo(c) {
    var id = 'd-' + c.id, req = c.obbl ? ' required aria-required="true"' : '';
    var v = valori[c.id] || '';
    var etich = '<span class="dlg-et">' + (c.tipo === 'consenso' ? tx(c.et) : esc(tx(c.et))) + '</span>' +
      (c.tipo !== 'consenso' ? ' <span class="dlg-nota">(' + esc(tx(c.obbl ? U.obbl : U.facolt)) + ')</span>' : '');
    var aiuto = c.aiuto ? '<p class="dlg-aiuto" id="' + id + '-aiuto">' + esc(tx(c.aiuto)) + '</p>' : '';
    var desc = ' aria-describedby="' + (c.aiuto ? id + '-aiuto ' : '') + id + '-err"';
    var err = '<p class="dlg-errore" id="' + id + '-err" hidden></p>';
    if (c.tipo === 'consenso') {
      return '<div class="dlg-campo dlg-campo--consenso" data-campo="' + c.id + '"><input type="checkbox" id="' + id + '" name="' + c.id + '"' + (v ? ' checked' : '') + req + desc + '>' +
        '<label for="' + id + '">' + etich + '</label>' + err + '</div>';
    }
    var input = c.tipo === 'area'
      ? '<textarea id="' + id + '" name="' + c.id + '" rows="5" class="dlg-input dlg-area"' + req + desc + '>' + esc(v) + '</textarea>'
      : '<input id="' + id + '" name="' + c.id + '" type="' + c.tipo + '" class="dlg-input" value="' + esc(v) + '"' + (c.auto ? ' autocomplete="' + c.auto + '"' : '') + req + desc + '>';
    return '<div class="dlg-campo" data-campo="' + c.id + '"><label for="' + id + '">' + etich + '</label>' + aiuto + input + err + '</div>';
  }

  function disegna() {
    var M = MODULI[attuale];
    dlg.innerHTML = '<div class="dlg-cornice">' +
      '<div class="dlg-testa"><h2 class="dlg-titolo" id="dlg-titolo">' + esc(tx(M.titolo)) + '</h2>' +
      '<button type="button" class="dlg-chiudi" data-chiudi><span aria-hidden="true">×</span><span class="sr">' + esc(tx(U.chiudi)) + '</span></button></div>' +
      '<p class="dlg-intro">' + esc(tx(M.intro)) + '</p>' +
      '<div id="dlg-riepilogo" tabindex="-1"></div>' +
      '<form class="dlg-form" novalidate>' +
      '<div class="dlg-trappola" aria-hidden="true"><label for="d-sito2">Lascia vuoto</label><input id="d-sito2" name="sito2" tabindex="-1" autocomplete="off"></div>' +
      M.campi.map(campo).join('') +
      '<div class="dlg-azioni"><button type="submit" class="bottone dlg-invia">' + esc(tx(M.invia)) + '<svg class="bottone__freccia" aria-hidden="true"><use href="#freccia"/></svg></button></div>' +
      '<p class="dlg-stato" role="status" aria-live="polite"></p></form></div>';
  }

  function leggi() {
    MODULI[attuale].campi.forEach(function (c) {
      var el = dlg.querySelector('#d-' + c.id);
      if (el) valori[c.id] = c.tipo === 'consenso' ? el.checked : el.value.trim();
    });
  }
  function controlla() {
    var errori = [];
    MODULI[attuale].campi.forEach(function (c) {
      var v = valori[c.id], msg = '';
      if (c.tipo === 'consenso') { if (c.obbl && !v) msg = tx(U.errConsenso); }
      else if (c.obbl && !v) msg = tx(U.errVuoto);
      else if (v && c.tipo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = tx(U.errEmail);
      else if (v && c.tipo === 'tel' && !/^\+?[0-9 ]{6,20}$/.test(v)) msg = tx(U.errTel);
      var el = dlg.querySelector('#d-' + c.id), p = dlg.querySelector('#d-' + c.id + '-err');
      if (msg) { el.setAttribute('aria-invalid', 'true'); p.textContent = msg; p.hidden = false; errori.push({ c: c, msg: msg }); }
      else { el.removeAttribute('aria-invalid'); p.hidden = true; p.textContent = ''; }
    });
    return errori;
  }
  function riepilogo(errori) {
    var r = dlg.querySelector('#dlg-riepilogo');
    if (!errori.length) { r.innerHTML = ''; r.className = ''; return; }
    r.className = 'dlg-riepilogo';
    r.innerHTML = '<p class="dlg-riepilogo__titolo">' + esc(tx(U.errTit)) + '</p><ul>' + errori.map(function (e) {
      var et = document.createElement('div'); et.innerHTML = tx(e.c.breve || e.c.et);
      return '<li><a href="#d-' + e.c.id + '">' + esc(et.textContent) + '</a>: ' + esc(e.msg) + '</li>';
    }).join('') + '</ul>';
    r.focus();
  }
  function esito(testo, ok) {
    var c = dlg.querySelector('.dlg-cornice');
    c.querySelector('.dlg-form').remove(); c.querySelector('#dlg-riepilogo').remove();
    var intro = c.querySelector('.dlg-intro');
    intro.className = 'dlg-esito' + (ok ? ' dlg-esito--ok' : ''); intro.textContent = testo; intro.setAttribute('tabindex', '-1');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'bottone dlg-fine'; b.setAttribute('data-chiudi', '');
    b.textContent = tx(U.altro); c.appendChild(b);
    intro.focus();
  }

  function invia(e) {
    e.preventDefault();
    if (dlg.querySelector('#d-sito2').value) return;              // trappola anti-spam
    leggi();
    var errori = controlla(); riepilogo(errori);
    if (errori.length) return;
    var M = MODULI[attuale];
    var campi = M.campi.map(function (c) {
      var et = document.createElement('div'); et.innerHTML = c.et.it;
      return { id: c.id, etichetta: c.tipo === 'consenso' ? 'Consenso · ' + c.id : et.textContent, valore: c.tipo === 'consenso' ? (valori[c.id] ? 'Sì' : 'No') : valori[c.id] || '' };
    });
    var modulo = attuale === 'scrivici' ? 'contatti' : 'newsletter';
    if (!CONF.url) { valori = {}; esito(tx(M.ok) + ' ' + tx(U.prova), true); return; }
    var stato = dlg.querySelector('.dlg-stato'), btn = dlg.querySelector('.dlg-invia');
    stato.textContent = tx(U.invio); btn.disabled = true;
    fetch(CONF.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ modulo: modulo, edizione: String(CONF.edizione || ''), titolo: tx(M.titolo), lingua: L(), pagina: location.pathname, campi: campi, file: [] }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (!d || !d.ok) throw new Error(d && d.errore); valori = {}; esito(tx(M.ok), true); })
      .catch(function () { btn.disabled = false; stato.textContent = tx(U.ko); });
  }

  function apri(quale, da) {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'dlg'; dlg.setAttribute('aria-labelledby', 'dlg-titolo');
      document.body.appendChild(dlg);
      dlg.addEventListener('click', function (e) {
        if (e.target.closest('[data-chiudi]') || e.target === dlg) dlg.close();
        var a = e.target.closest('#dlg-riepilogo a');
        if (a) { e.preventDefault(); var el = dlg.querySelector(a.getAttribute('href')); if (el) el.focus(); }
      });
      dlg.addEventListener('submit', invia);
      dlg.addEventListener('close', function () { if (attuale && dlg.querySelector('.dlg-form')) leggi(); if (apertoDa) apertoDa.focus(); });
    }
    if (attuale !== quale) valori = {};
    attuale = quale; apertoDa = da;
    disegna();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    var primo = dlg.querySelector('.dlg-input'); if (primo) primo.focus();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-dialogo]');
    if (!a || !MODULI[a.getAttribute('data-dialogo')] || typeof HTMLDialogElement === 'undefined') return;
    e.preventDefault(); apri(a.getAttribute('data-dialogo'), a);
  });
  document.addEventListener('moon:lingua', function () { if (dlg && dlg.open && dlg.querySelector('.dlg-form')) { leggi(); disegna(); } });
})();
