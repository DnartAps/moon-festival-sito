/* Moon Festival · moduli di candidatura (ambito: Simone, funzioni)
   - Disegna il modulo indicato da data-modulo partendo da js/moduli-dati.js, in italiano o inglese.
   - A passi: una sezione alla volta (Chi sei, Il progetto, …) con Avanti/Indietro e la barra dei passi;
     "Avanti" controlla solo le domande della sezione. Domande grandi, scelte a bottoni.
   - Campi che compaiono solo in base a una risposta ("se"), contatore dei caratteri, controllo dei link
     (niente WeTransfer), file fino a 10 MB.
   - Errori: riepilogo in alto con i link ai campi + messaggio sotto ogni campo (WCAG 3.3.1, 3.3.3).
   - Bozza salvata su questo dispositivo mentre si compila (i file no).
   - Invio a Google Apps Script (indirizzo in js/moduli-config.js): una riga nel foglio Google
     e i file in una cartella Drive. Senza indirizzo il modulo funziona in modalità prova e non invia nulla.
   - Antispam: campo nascosto ("trappola") al posto del CAPTCHA (WCAG 3.3.8). */
(function () {
  var MAX_FILE = 10 * 1024 * 1024, MAX_TOTALE = 25 * 1024 * 1024;
  var root = document.getElementById('modulo');
  if (!root) return;
  var ID = root.getAttribute('data-modulo'), F = (window.MOON_MODULI || {})[ID];
  if (!F) return;
  var CONF = window.MOON_MODULI_CONFIG || {};
  var L = function () { return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'it'; };
  var tx = function (o) { return o ? (o[L()] || o.it) : ''; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var UI = {
    it: { obbl: 'obbligatoria', nota: 'Le domande con * sono obbligatorie. Le risposte restano salvate su questo dispositivo finché non invii.',
      altro: 'Altro', altroQuale: 'Specifica', caratteri: function (n, m) { return n + ' di ' + m + ' caratteri'; },
      scegliFile: 'Scegli i file', scegliUno: 'Scegli il file', togli: 'Togli', nessunFile: 'Nessun file scelto.',
      invia: 'Invia la candidatura', inviaBreve: 'Invia', svuota: 'Svuota il modulo', confermaSvuota: 'Sicur*? Tocca di nuovo per svuotare.',
      erroriTit: function (n) { return n === 1 ? 'C’è una risposta da sistemare' : 'Ci sono ' + n + ' risposte da sistemare'; },
      errVuoto: 'Questa risposta manca.', errScelta: 'Scegli almeno un’opzione.', errConsenso: 'Serve il tuo consenso per inviare.',
      errEmail: 'Controlla l’email: deve avere la forma nome@esempio.it.', errTel: 'Controlla il numero: solo cifre, spazi e +.',
      errLink: 'Controlla il link: deve cominciare con https://', errWe: 'I link di WeTransfer scadono: usa Drive, Dropbox, Vimeo o YouTube.',
      errNumero: 'Scrivi un numero.', errFileGrande: function (n) { return n + ' supera i 10 MB.'; }, errFileTroppi: function (m) { return 'Al massimo ' + m + (m === 1 ? ' file.' : ' file.'); },
      errTotale: 'I file insieme superano i 25 MB: togline qualcuno o usa un link.', errAltro: 'Scrivi cosa intendi con “Altro”.',
      invio: 'Invio in corso, non chiudere la pagina…', okTit: 'Grazie, abbiamo ricevuto la tua candidatura.',
      okTesto: function (e) { return 'Ti scriveremo ' + (e ? 'all’indirizzo ' + e : 'via email') + '. Se non trovi la nostra risposta, controlla anche nello spam.'; },
      koTit: 'L’invio non è riuscito.', koTesto: 'Le tue risposte sono ancora qui. Riprova tra poco; se il problema continua scrivici a info@associazionednart.it.',
      provaTit: 'Modulo di prova: niente è stato inviato.', provaTesto: 'Quando il sito sarà collegato al foglio Google, queste risposte arriveranno lì. Ecco cosa verrebbe inviato:',
      chiuso: 'Le candidature per questa call sono chiuse.', bozza: 'Bozza salvata su questo dispositivo.',
      avanti: 'Avanti', indietro: 'Indietro', passo: function (i, n) { return 'Passo ' + i + ' di ' + n; }, passi: 'Passi del modulo', fatto: 'completato', attuale: 'passo attuale' },
    en: { obbl: 'required', nota: 'Questions marked * are required. Your answers are saved on this device until you send them.',
      altro: 'Other', altroQuale: 'Please specify', caratteri: function (n, m) { return n + ' of ' + m + ' characters'; },
      scegliFile: 'Choose files', scegliUno: 'Choose file', togli: 'Remove', nessunFile: 'No file chosen.',
      invia: 'Send your application', inviaBreve: 'Send', svuota: 'Clear the form', confermaSvuota: 'Sure? Tap again to clear.',
      erroriTit: function (n) { return n === 1 ? 'One answer needs fixing' : n + ' answers need fixing'; },
      errVuoto: 'This answer is missing.', errScelta: 'Choose at least one option.', errConsenso: 'We need your consent to send the form.',
      errEmail: 'Check the email: it should look like name@example.com.', errTel: 'Check the number: digits, spaces and + only.',
      errLink: 'Check the link: it must start with https://', errWe: 'WeTransfer links expire: use Drive, Dropbox, Vimeo or YouTube.',
      errNumero: 'Enter a number.', errFileGrande: function (n) { return n + ' is larger than 10 MB.'; }, errFileTroppi: function (m) { return 'Up to ' + m + (m === 1 ? ' file.' : ' files.'); },
      errTotale: 'The files together exceed 25 MB: remove some or use a link.', errAltro: 'Tell us what you mean by “Other”.',
      invio: 'Sending, please do not close the page…', okTit: 'Thank you, we have received your application.',
      okTesto: function (e) { return 'We will write to you ' + (e ? 'at ' + e : 'by email') + '. If you cannot find our reply, check your spam folder too.'; },
      koTit: 'Sending failed.', koTesto: 'Your answers are still here. Try again shortly; if the problem continues write to info@associazionednart.it.',
      provaTit: 'Test form: nothing has been sent.', provaTesto: 'Once the website is connected to the Google Sheet, these answers will go there. This is what would be sent:',
      chiuso: 'Applications for this call are closed.', bozza: 'Draft saved on this device.',
      avanti: 'Next', indietro: 'Back', passo: function (i, n) { return 'Step ' + i + ' of ' + n; }, passi: 'Form steps', fatto: 'completed', attuale: 'current step' }
  };
  var u = function () { return UI[L()]; };

  /* ---------- stato: valori, file scelti ---------- */
  var KEY = 'moon-modulo-' + ID, valori = {}, files = {}, errori = {}, mostraErrori = false, passo = 0, passoMax = 0;
  try { valori = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { valori = {}; }
  var campi = [], bloccoDi = {}; F.blocchi.forEach(function (b, i) { b.campi.forEach(function (c) { campi.push(c); bloccoDi[c.id] = i; }); });
  try { var pp = JSON.parse(localStorage.getItem(KEY + '-passo') || '{}'); passo = Math.min(pp.passo || 0, F.blocchi.length - 1); passoMax = Math.max(passo, Math.min(pp.max || 0, F.blocchi.length - 1)); } catch (e) {}
  var salvaPasso = function () { try { localStorage.setItem(KEY + '-passo', JSON.stringify({ passo: passo, max: passoMax })); } catch (e) {} };
  campi.forEach(function (c) { if (c.val && valori[c.id] == null) valori[c.id] = c.val.it; });
  var salva = (function () { var t; return function () { clearTimeout(t); t = setTimeout(function () { try { localStorage.setItem(KEY, JSON.stringify(valori)); } catch (e) {} }, 400); }; })();

  function visibile(c) {
    if (!c.se) return true;
    var v = valori[c.se.campo];
    if (c.se.piuDi != null) return Number(v) > c.se.piuDi;
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) return false;
    if (c.se.vale != null) return Array.isArray(v) ? v.indexOf(c.se.vale) !== -1 : v === c.se.vale;
    if (c.se.non != null) return Array.isArray(v) ? !(v.length === 1 && v[0] === c.se.non) : v !== c.se.non;
    return true;
  }

  /* ---------- disegno ---------- */
  var fid = function (c) { return 'm-' + c.id; };
  function aiuto(c) { return c.aiuto ? '<p class="mod-aiuto" id="' + fid(c) + '-aiuto">' + esc(tx(c.aiuto)) + '</p>' : ''; }
  function erroreHtml(c) { return '<p class="mod-errore" id="' + fid(c) + '-err"' + (errori[c.id] && mostraErrori ? '' : ' hidden') + '>' + esc(errori[c.id] || '') + '</p>'; }
  function descr(c) { return (c.aiuto ? fid(c) + '-aiuto ' : '') + fid(c) + '-err'; }
  var stella = function (c) { return c.obbl ? ' <span class="mod-stella" aria-hidden="true">*</span>' : ''; };
  var inv = function (c) { return errori[c.id] && mostraErrori ? ' aria-invalid="true"' : ''; };

  function campo(c) {
    var x = u(), id = fid(c), v = valori[c.id], req = c.obbl ? ' required aria-required="true"' : '';
    var et = esc(tx(c.et)), h = '';
    var tipoInput = { testo: 'text', email: 'email', tel: 'tel', data: 'date', numero: 'number', link: 'url' }[c.tipo];
    if (tipoInput && !(c.tipo === 'link' && c.righe)) {
      h = '<label class="mod-domanda" for="' + id + '">' + et + stella(c) + '</label>' + aiuto(c) +
        '<input class="mod-input' + (c.tipo === 'numero' ? ' mod-input--corto' : '') + '" id="' + id + '" name="' + c.id + '" type="' + tipoInput + '"' +
        (c.auto ? ' autocomplete="' + c.auto + '"' : '') + (c.tipo === 'numero' ? ' inputmode="numeric" min="' + (c.min || 0) + '"' : '') +
        (c.tipo === 'link' ? ' placeholder="https://" inputmode="url"' : '') +
        ' value="' + esc(v || '') + '" aria-describedby="' + descr(c) + '"' + req + inv(c) + '>';
    } else if (c.tipo === 'area' || (c.tipo === 'link' && c.righe)) {
      var n = (v || '').length;
      h = '<label class="mod-domanda" for="' + id + '">' + et + stella(c) + '</label>' + aiuto(c) +
        '<textarea class="mod-input mod-area" id="' + id + '" name="' + c.id + '" rows="' + (c.righe ? 3 : 5) + '"' + (c.max ? ' maxlength="' + c.max + '"' : '') +
        ' aria-describedby="' + descr(c) + (c.max ? ' ' + id + '-conta' : '') + '"' + req + inv(c) + '>' + esc(v || '') + '</textarea>' +
        (c.max ? '<p class="mod-conta" id="' + id + '-conta" aria-live="polite">' + esc(x.caratteri(n, c.max)) + '</p>' : '');
    } else if (c.tipo === 'scelta' || c.tipo === 'scelte') {
      var multi = c.tipo === 'scelte', sel = multi ? (v || []) : v;
      var opz = c.opz.slice(); if (c.altro) opz.push({ it: 'Altro', en: 'Other', altro: true });
      h = '<fieldset class="mod-gruppo" aria-describedby="' + descr(c) + '"' + (multi ? '' : ' role="radiogroup"') + (c.obbl && !multi ? ' aria-required="true"' : '') + inv(c) + '><legend class="mod-domanda">' + et + stella(c) + '</legend>' + aiuto(c) +
        '<div class="mod-bottoni">' + opz.map(function (o, i) {
          var val = o.it, on = multi ? sel.indexOf(val) !== -1 : sel === val;
          return '<label class="mod-bottone"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="' + c.id + '" id="' + id + '-' + i + '" value="' + esc(val) + '"' + (on ? ' checked' : '') + '><span>' + esc(o.altro ? x.altro : tx(o)) + '</span></label>';
        }).join('') + '</div>' +
        (c.altro ? '<div class="mod-altro"' + ((multi ? sel.indexOf('Altro') !== -1 : sel === 'Altro') ? '' : ' hidden') + '><label class="mod-etichetta" for="' + id + '-altro">' + esc(x.altroQuale) + '</label><input class="mod-input" id="' + id + '-altro" name="' + c.id + '__altro" type="text" value="' + esc(valori[c.id + '__altro'] || '') + '"></div>' : '') +
        '</fieldset>';
    } else if (c.tipo === 'file') {
      var lista = files[c.id] || [], max = c.multipli || 1;
      h = '<label class="mod-domanda" for="' + id + '">' + et + stella(c) + '</label>' + aiuto(c) +
        '<div class="mod-file"><input class="mod-file__input" id="' + id + '" name="' + c.id + '" type="file"' + (max > 1 ? ' multiple' : '') + (c.accetta ? ' accept="' + c.accetta + '"' : '') + ' aria-describedby="' + descr(c) + ' ' + id + '-lista"' + inv(c) + '>' +
        '<ul class="mod-file__lista" id="' + id + '-lista" aria-live="polite">' + (lista.length ? lista.map(function (f, i) {
          return '<li><span>' + esc(f.name) + ' · ' + (f.size / 1048576).toFixed(1).replace('.', L() === 'it' ? ',' : '.') + ' MB</span><button type="button" class="mod-file__togli" data-togli="' + c.id + '" data-i="' + i + '">' + esc(x.togli) + '<span class="sr"> ' + esc(f.name) + '</span></button></li>';
        }).join('') : '<li class="mod-file__vuoto">' + esc(x.nessunFile) + '</li>') + '</ul></div>';
    } else if (c.tipo === 'consenso') {
      h = '<div class="mod-consenso"><input type="checkbox" id="' + id + '" name="' + c.id + '" value="Sì"' + (v ? ' checked' : '') + ' aria-describedby="' + descr(c) + '"' + req + inv(c) + '>' +
        '<label for="' + id + '">' + et + stella(c) + (c.link ? ' <a href="' + c.link + '" target="_blank" rel="noopener">' + (L() === 'en' ? 'Privacy notice' : 'Informativa privacy') + '<span class="sr"> ' + (L() === 'en' ? '(opens in a new tab)' : '(si apre in una nuova scheda)') + '</span></a>' : '') + '</label></div>';
    }
    return '<div class="mod-campo mod-campo--' + c.tipo + '" data-campo="' + c.id + '"' + (visibile(c) ? '' : ' hidden') + '>' + h + erroreHtml(c) + '</div>';
  }

  function disegna() {
    var x = u();
    var info = document.getElementById('modulo-info');
    if (info && F.info) info.innerHTML = F.info.map(function (r) { return '<div><dt>' + esc(tx(r[0])) + '</dt><dd>' + esc(tx(r[1])) + '</dd></div>'; }).join('');
    var stato = (CONF.stato || {})[ID] || {}, oggi = new Date().toISOString().slice(0, 10);
    if ((stato.chiude && oggi > stato.chiude) || (stato.apre && oggi < stato.apre)) {
      root.innerHTML = '<div class="mod-esito" tabindex="-1"><p class="mod-esito__titolo">' + esc(x.chiuso) + '</p></div>';
      return;
    }
    var n = F.blocchi.length;
    var html = '<p class="mod-nota">' + esc(x.nota) + '</p>' +
      '<nav class="mod-passi" aria-label="' + esc(x.passi) + '"><ol>' + F.blocchi.map(function (b, i) {
        var stato = i === passo ? ' aria-current="step"' : '';
        var et = '<span class="mod-passi__n">' + (i + 1) + '</span><span class="mod-passi__t">' + esc(tx(b.titolo)) + '</span>';
        var sr = i === passo ? ' <span class="sr">(' + esc(x.attuale) + ')</span>' : (i < passo ? ' <span class="sr">(' + esc(x.fatto) + ')</span>' : '');
        return '<li class="' + (i < passo ? 'fatto' : i === passo ? 'ora' : '') + '"' + stato + '>' + (i <= passoMax && i !== passo ? '<button type="button" data-passo="' + i + '">' + et + sr + '</button>' : '<span>' + et + sr + '</span>') + '</li>';
      }).join('') + '</ol><div class="mod-passi__barra" aria-hidden="true"><span style="width:' + Math.round((passo + 1) / n * 100) + '%"></span></div></nav>' +
      '<div id="mod-riepilogo"></div>' +
      '<form class="mod-form" id="mod-form" novalidate>' +
      '<div class="mod-trappola" aria-hidden="true"><label for="m-sito2">Lascia vuoto</label><input id="m-sito2" name="sito2" type="text" tabindex="-1" autocomplete="off"></div>';
    F.blocchi.forEach(function (b, i) {
      html += '<fieldset class="mod-blocco"' + (i === passo ? '' : ' hidden') + '><legend class="mod-blocco__titolo" id="mod-passo-' + i + '" tabindex="-1"><span class="mod-blocco__num">' + esc(x.passo(i + 1, n)) + '</span> ' + esc(tx(b.titolo)) + '</legend>' +
        (b.intro ? '<p class="mod-blocco__intro">' + esc(tx(b.intro)) + '</p>' : '') + b.campi.map(campo).join('') + '</fieldset>';
    });
    var ultimo = passo === n - 1;
    html += '<div class="mod-azioni">' +
      (passo > 0 ? '<button type="button" class="mod-indietro" id="mod-indietro"><span aria-hidden="true">←</span> ' + esc(x.indietro) + '</button>' : '') +
      (ultimo ? '<button type="submit" class="bottone mod-invia">' + esc(x.invia) + '<svg class="bottone__freccia" aria-hidden="true"><use href="#freccia"/></svg></button>'
              : '<button type="button" class="bottone mod-avanti" id="mod-avanti">' + esc(x.avanti) + ' <span aria-hidden="true">→</span></button>') +
      '<button type="button" class="mod-svuota" id="mod-svuota">' + esc(x.svuota) + '</button></div>' +
      '<p class="mod-stato" id="mod-stato" role="status" aria-live="polite"></p></form>';
    root.innerHTML = html;
  }

  /* ---------- lettura dei valori e aggiornamenti ---------- */
  function aggiornaDa(el) {
    var nome = el.name; if (!nome || nome === 'sito2') return;
    var c = campi.filter(function (k) { return k.id === nome.replace('__altro', ''); })[0]; if (!c) return;
    if (nome.indexOf('__altro') !== -1) { valori[nome] = el.value; }
    else if (c.tipo === 'scelte') { valori[nome] = [].slice.call(root.querySelectorAll('input[name="' + nome + '"]:checked')).map(function (i) { return i.value; }); }
    else if (c.tipo === 'scelta') { var s = root.querySelector('input[name="' + nome + '"]:checked'); valori[nome] = s ? s.value : ''; }
    else if (c.tipo === 'consenso') { valori[nome] = el.checked; }
    else if (c.tipo !== 'file') { valori[nome] = el.value; }
    if (c.tipo === 'scelta' || c.tipo === 'scelte') {
      var box = root.querySelector('[data-campo="' + c.id + '"] .mod-altro');
      if (box) { var on = c.tipo === 'scelte' ? valori[c.id].indexOf('Altro') !== -1 : valori[c.id] === 'Altro'; box.hidden = !on; }
    }
    if (c.tipo === 'area' && c.max) { var cc = document.getElementById(fid(c) + '-conta'); if (cc) cc.textContent = u().caratteri(el.value.length, c.max); }
    campi.forEach(function (k) { if (k.se) { var w = root.querySelector('[data-campo="' + k.id + '"]'); if (w) w.hidden = !visibile(k); } });
    if (mostraErrori) { controlla(passo); aggiornaErrore(c); }
    salva();
  }
  function aggiornaErrore(c) {
    var w = root.querySelector('[data-campo="' + c.id + '"]'); if (!w) return;
    var p = w.querySelector('.mod-errore'), msg = errori[c.id];
    p.textContent = msg || ''; p.hidden = !msg;
    w.querySelectorAll('input, textarea, fieldset').forEach(function (n) { if (msg) n.setAttribute('aria-invalid', 'true'); else n.removeAttribute('aria-invalid'); });
  }

  /* ---------- controllo ---------- */
  function controlla(soloBlocco) {
    var x = u(); errori = {};
    var tot = 0;
    campi.forEach(function (c) {
      if (!visibile(c)) return;
      if (soloBlocco != null && bloccoDi[c.id] !== soloBlocco) return;
      var v = valori[c.id], vuoto = v == null || v === '' || v === false || (Array.isArray(v) && !v.length);
      if (c.tipo === 'file') {
        var l = files[c.id] || [];
        if (c.obbl && !l.length) errori[c.id] = x.errVuoto;
        if (l.length > (c.multipli || 1)) errori[c.id] = x.errFileTroppi(c.multipli || 1);
        l.forEach(function (f) { tot += f.size; if (f.size > MAX_FILE) errori[c.id] = x.errFileGrande(f.name); });
        return;
      }
      if (c.obbl && vuoto) { errori[c.id] = c.tipo === 'consenso' ? x.errConsenso : (c.tipo === 'scelte' ? x.errScelta : x.errVuoto); return; }
      if (vuoto) return;
      if (c.tipo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) errori[c.id] = x.errEmail;
      if (c.tipo === 'tel' && !/^[+0-9][0-9 ().\-\/]{5,}$/.test(v.trim())) errori[c.id] = x.errTel;
      if (c.tipo === 'numero' && isNaN(Number(v))) errori[c.id] = x.errNumero;
      if (c.tipo === 'link') {
        var righe = String(v).split(/\s+/).filter(Boolean);
        if (righe.some(function (r) { return /(^|\/\/|\.)(we\.tl|wetransfer\.com)/i.test(r); })) errori[c.id] = x.errWe;
        else if (righe.some(function (r) { return !/^https?:\/\/\S+\.\S+/i.test(r); })) errori[c.id] = x.errLink;
      }
      if (c.altro && (Array.isArray(v) ? v.indexOf('Altro') !== -1 : v === 'Altro') && !(valori[c.id + '__altro'] || '').trim()) errori[c.id] = x.errAltro;
    });
    if (tot > MAX_TOTALE) { var ultimo = campi.filter(function (c) { return c.tipo === 'file' && (files[c.id] || []).length; }).pop(); if (ultimo) errori[ultimo.id] = x.errTotale; }
    return Object.keys(errori);
  }
  function mostraRiepilogo(chiavi) {
    var x = u(), box = document.getElementById('mod-riepilogo');
    if (!chiavi.length) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="mod-riepilogo" tabindex="-1" role="alert"><p class="mod-riepilogo__titolo">' + esc(x.erroriTit(chiavi.length)) + '</p><ul>' +
      chiavi.map(function (k) { var c = campi.filter(function (z) { return z.id === k; })[0]; return '<li><a href="#' + primoControllo(c) + '">' + esc(tx(c.et).replace(/\s*\(.*$/, '')) + ': ' + esc(errori[k]) + '</a></li>'; }).join('') + '</ul></div>';
    box.firstChild.focus(); box.firstChild.scrollIntoView({ block: 'start' });
  }
  function primoControllo(c) { return (c.tipo === 'scelta' || c.tipo === 'scelte') ? fid(c) + '-0' : fid(c); }

  /* ---------- passi ---------- */
  function vaiA(i, conFocus) {
    passo = i; passoMax = Math.max(passoMax, i); salvaPasso();
    disegna();
    if (mostraErrori) { controlla(passo); campi.forEach(aggiornaErrore); }
    var tit = document.getElementById('mod-passo-' + passo);
    if (conFocus !== false && tit) { tit.focus(); root.scrollIntoView({ block: 'start' }); }
  }
  function avanti() {
    mostraErrori = true;
    var chiavi = controlla(passo);
    campi.forEach(aggiornaErrore);
    mostraRiepilogo(chiavi);
    if (chiavi.length) return;
    mostraErrori = false; errori = {};
    vaiA(passo + 1);
  }

  /* ---------- invio ---------- */
  function leggiFile(f) {
    return new Promise(function (ok, ko) {
      var r = new FileReader();
      r.onload = function () { ok({ nome: f.name, tipo: f.type || 'application/octet-stream', dati: String(r.result).split(',')[1] }); };
      r.onerror = ko; r.readAsDataURL(f);
    });
  }
  function righePerFoglio() {
    var out = [];
    campi.forEach(function (c) {
      if (c.tipo === 'file' || !visibile(c)) return;
      var v = valori[c.id];
      if (Array.isArray(v)) v = v.map(function (z) { return z === 'Altro' && valori[c.id + '__altro'] ? 'Altro: ' + valori[c.id + '__altro'] : z; }).join(', ');
      else if (v === 'Altro' && valori[c.id + '__altro']) v = 'Altro: ' + valori[c.id + '__altro'];
      if (c.tipo === 'consenso') v = v ? 'Sì' : 'No';
      out.push({ id: c.id, etichetta: c.tipo === 'consenso' ? 'Consenso · ' + c.id : c.et.it, valore: v == null ? '' : String(v) });
    });
    return out;
  }
  function esito(titolo, testo, extra, buono) {
    var box = document.createElement('div');
    box.className = 'mod-esito' + (buono ? ' mod-esito--ok' : '');
    box.setAttribute('tabindex', '-1');
    box.innerHTML = '<p class="mod-esito__titolo">' + esc(titolo) + '</p><p>' + esc(testo) + '</p>' + (extra || '');
    return box;
  }
  function invia(e) {
    e.preventDefault();
    var x = u();
    if (document.getElementById('m-sito2').value) return; /* trappola per i robot */
    mostraErrori = true;
    var chiavi = controlla();
    if (chiavi.length) {
      var primo = Math.min.apply(null, chiavi.map(function (k) { return bloccoDi[k]; }));
      if (primo !== passo) vaiA(primo, false);
      chiavi = controlla(primo); campi.forEach(aggiornaErrore); mostraRiepilogo(chiavi); return;
    }
    campi.forEach(aggiornaErrore);
    mostraRiepilogo(chiavi);
    var stato = document.getElementById('mod-stato'), bott = root.querySelector('.mod-invia');
    var payload = { modulo: ID, edizione: String(CONF.edizione || ''), titolo: F.titolo.it, lingua: L(), pagina: location.href.split('?')[0], campi: righePerFoglio(), file: [] };
    var daLeggere = [];
    campi.forEach(function (c) { if (c.tipo === 'file' && visibile(c)) (files[c.id] || []).forEach(function (f) { daLeggere.push(leggiFile(f).then(function (o) { o.campo = c.id; o.etichetta = c.et.it; payload.file.push(o); })); }); });
    if (!CONF.url) {
      var tab = '<dl class="mod-prova">' + payload.campi.filter(function (r) { return r.valore; }).map(function (r) { return '<div><dt>' + esc(r.etichetta) + '</dt><dd>' + esc(r.valore) + '</dd></div>'; }).join('') +
        Object.keys(files).map(function (k) { return (files[k] || []).map(function (f) { return '<div><dt>File</dt><dd>' + esc(f.name) + '</dd></div>'; }).join(''); }).join('') + '</dl>';
      var b = esito(x.provaTit, x.provaTesto, tab, false);
      document.getElementById('mod-riepilogo').innerHTML = ''; document.getElementById('mod-riepilogo').appendChild(b); b.focus(); b.scrollIntoView({ block: 'start' });
      return;
    }
    bott.disabled = true; stato.textContent = x.invio;
    Promise.all(daLeggere).then(function () {
      return fetch(CONF.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
    }).then(function (r) { return r.json(); }).then(function (r) {
      if (!r || !r.ok) throw new Error((r && r.errore) || 'errore');
      try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + '-passo'); } catch (z) {}
      var b = esito(x.okTit, x.okTesto(valori.email), '', true);
      root.innerHTML = ''; root.appendChild(b); b.focus();
      window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY - 120 });
    }).catch(function () {
      bott.disabled = false; stato.textContent = '';
      var b = esito(x.koTit, x.koTesto, '', false);
      var box = document.getElementById('mod-riepilogo'); box.innerHTML = ''; box.appendChild(b); b.focus(); b.scrollIntoView({ block: 'start' });
    });
  }

  /* ---------- eventi ---------- */
  root.addEventListener('input', function (e) { if (e.target.type !== 'file') aggiornaDa(e.target); });
  root.addEventListener('change', function (e) {
    var el = e.target;
    if (el.type === 'file') {
      var lista = files[el.name] || [];
      [].slice.call(el.files).forEach(function (f) { if (!lista.some(function (g) { return g.name === f.name && g.size === f.size; })) lista.push(f); });
      files[el.name] = lista; el.value = '';
      var c = campi.filter(function (k) { return k.id === el.name; })[0];
      if (mostraErrori) controlla(passo);
      var w = root.querySelector('[data-campo="' + c.id + '"]'); var nuovo = document.createElement('div'); nuovo.innerHTML = campo(c);
      w.replaceWith(nuovo.firstChild);
      document.getElementById(fid(c)).focus();
      return;
    }
    aggiornaDa(el);
  });
  root.addEventListener('click', function (e) {
    if (e.target.closest('#mod-avanti')) { avanti(); return; }
    if (e.target.closest('#mod-indietro')) { mostraErrori = false; errori = {}; vaiA(passo - 1); return; }
    var pb = e.target.closest('[data-passo]');
    if (pb) { mostraErrori = false; errori = {}; vaiA(Number(pb.getAttribute('data-passo'))); return; }
    var t = e.target.closest('[data-togli]');
    if (t) {
      var id = t.getAttribute('data-togli'); (files[id] || []).splice(Number(t.getAttribute('data-i')), 1);
      var c = campi.filter(function (k) { return k.id === id; })[0];
      if (mostraErrori) controlla(passo);
      var w = root.querySelector('[data-campo="' + id + '"]'); var nuovo = document.createElement('div'); nuovo.innerHTML = campo(c);
      w.replaceWith(nuovo.firstChild); document.getElementById(fid(c)).focus();
      return;
    }
    if (e.target.id === 'mod-svuota') {
      var b = e.target;
      if (!b.getAttribute('data-sicuro')) { b.setAttribute('data-sicuro', '1'); b.textContent = u().confermaSvuota; return; }
      valori = {}; files = {}; errori = {}; mostraErrori = false;
      try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + '-passo'); } catch (z) {}
      passo = 0; passoMax = 0;
      disegna(); document.getElementById('mod-form').querySelector('input:not([tabindex="-1"]), textarea').focus();
    }
  });
  root.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.key !== 'Enter' || passo >= F.blocchi.length - 1 || !t.matches || !t.matches('.mod-form input:not([type=checkbox]):not([type=radio]):not([type=file])')) return;
    e.preventDefault(); avanti();
  });
  root.addEventListener('submit', function (e) { if (passo < F.blocchi.length - 1) { e.preventDefault(); avanti(); return; } invia(e); });
  document.addEventListener('moon:lingua', function () { if (document.getElementById('mod-form')) { disegna(); if (mostraErrori) { controlla(passo); campi.forEach(aggiornaErrore); } } });
  disegna();
})();
