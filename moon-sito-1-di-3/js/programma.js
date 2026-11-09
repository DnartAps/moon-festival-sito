/* Moon Festival · pagina Programma (ambito: Simone, funzioni)
   - Elenco delle attività da js/programma-dati.js, in italiano e inglese.
   - Filtri: tipologia (spettacolo, installazione, talk, laboratorio, mostra) e ora di arrivo.
   - Mappa con i punti: i filtri accendono e spengono i punti; un punto filtra l'elenco per luogo.
   - Elenco a righe: sul telefono solo testo (nome, tipologia, orario; pin e freccia a destra),
     sul computer foto piccola e colonne. Con "Tutto" un titolo per tipologia.
   - Scheda di ogni attività in una finestra: foto, titolo e artista, informazioni principali subito
     visibili; alert, descrizione e bio in tendine (aperte sul computer, chiuse sul telefono);
     frecce per passare alla successiva.
   - Periodo "durante": l'ora di arrivo parte da adesso e le attività in corso sono segnalate. */
(function () {
  var D = window.MOON_PROGRAMMA;
  if (!D) return;
  var html = document.documentElement;
  var L = function () { return html.getAttribute('lang') === 'en' ? 'en' : 'it'; };

  var UI = {
    it: {
      colAtt: 'Attività', colTipo: 'Tipologia', colQuando: 'Quando', colDove: 'Dove', inGiro: 'In giro',
      tutte: 'Tutto', servCat: 'Servizi', servPunti: function (n) { return n === 1 ? '1 punto sulla mappa' : n + ' punti sulla mappa'; }, servConteggio: function (n) { return n + ' tipi di servizi'; }, itineranti: 'Itineranti', spettacolo: 'Spettacoli', installazione: 'Installazioni', talk: 'Talk', lab: 'Laboratori', mostra: 'Mostre',
      cat1: { spettacolo: 'Spettacolo', installazione: 'Installazione', talk: 'Talk', lab: 'Laboratorio', mostra: 'Mostra' },
      tipologia: 'Tipologia', arrivo: 'Arrivo alle', qualsiasi: 'Qualsiasi ora', giorno: 'Giorno', tuttiGiorni: 'Tutti i giorni',
      conteggio: function (n, t) { return t + ' attività · mostrate ' + n; },
      nessuna: 'Nessuna attività con questi filtri. Prova a cambiare tipologia o ora di arrivo.',
      azzera: 'Azzera i filtri', luogo: 'Luogo', togliLuogo: 'Mostra tutti i luoghi',
      itinerante: 'In giro per il borgo', senzaOra: 'Orario libero', permanente: 'Per tutto il festival',
      vediMappa: 'Vedi sulla mappa', alert: function (n) { return n === 1 ? '1 alert' : n + ' alert'; },
      quando: 'Quando', giorni: 'Giorni', orari: 'Orari', durata: 'Durata', dove: 'Dove', genere: 'Genere',
      dovePunto: function (c) { return (c.length > 1 ? 'Punti ' + c.join(', ') : 'Punto ' + c[0]) + ' della mappa'; }, doveItinerante: 'Itinerante: nessun punto fisso',
      info: 'Informazioni e alert', nessunAlert: 'Nessun alert segnalato.', alertTit: 'Alert', punto: function (ll) { return (ll.length > 1 ? 'Punti ' : 'Punto ') + ll.join(', '); },
      linkAcc: 'Accessibilità e servizi', linkInfo: 'Info utili',
      descrizione: 'Descrizione', bio: 'Bio', chiudi: 'Chiudi', prec: 'Attività precedente', succ: 'Attività successiva',
      foto: 'Foto in arrivo', inCorso: 'In corso', prossimo: 'Prossimo inizio',
      pin: function (c, titoli) { return 'Punto ' + c + ': ' + titoli.join(', '); },
      programma: function () { return 'Programma ' + D.anno; },
      servizi: 'Servizi sulla mappa', itinerante1: 'Itinerante',
      serv: { info: 'Info point', wc: 'Bagni', acqua: 'Acqua', sos: 'Punto di soccorso', bar: 'Bar / snack bar', ristorante: 'Ristorante', glutenfree: 'Punto gluten-free', rifiuti: 'Raccolta rifiuti', cappello: 'Cappello', navette: 'Navette', parcheggio: 'Parcheggio' },
      itinerantiNota: function (n) { return n + ' artist* itineranti senza punto fisso: li incontri per il borgo. Il significato delle icone è nel filtro Servizi.'; },
      schedaDi: function (n, t) { return n + ' di ' + t; }
    },
    en: {
      colAtt: 'Activity', colTipo: 'Type', colQuando: 'When', colDove: 'Where', inGiro: 'Roaming',
      tutte: 'All', servCat: 'Services', servPunti: function (n) { return n === 1 ? '1 spot on the map' : n + ' spots on the map'; }, servConteggio: function (n) { return n + ' types of services'; }, itineranti: 'Roaming', spettacolo: 'Shows', installazione: 'Installations', talk: 'Talks', lab: 'Workshops', mostra: 'Exhibitions',
      cat1: { spettacolo: 'Show', installazione: 'Installation', talk: 'Talk', lab: 'Workshop', mostra: 'Exhibition' },
      tipologia: 'Type', arrivo: 'Arriving at', qualsiasi: 'Any time', giorno: 'Day', tuttiGiorni: 'All days',
      conteggio: function (n, t) { return t + ' activities · ' + n + ' shown'; },
      nessuna: 'No activities match these filters. Try another type or arrival time.',
      azzera: 'Clear filters', luogo: 'Spot', togliLuogo: 'Show all spots',
      itinerante: 'Roaming the village', senzaOra: 'Any time', permanente: 'All festival long',
      vediMappa: 'Show on map', alert: function (n) { return n === 1 ? '1 alert' : n + ' alerts'; },
      quando: 'When', giorni: 'Days', orari: 'Times', durata: 'Duration', dove: 'Where', genere: 'Genre',
      dovePunto: function (c) { return (c.length > 1 ? 'Spots ' + c.join(', ') : 'Spot ' + c[0]) + ' on the map'; }, doveItinerante: 'Roaming: no fixed spot',
      info: 'Information and alerts', nessunAlert: 'No alerts reported.', alertTit: 'Alerts', punto: function (ll) { return (ll.length > 1 ? 'Spots ' : 'Spot ') + ll.join(', '); },
      linkAcc: 'Accessibility and services', linkInfo: 'Practical info',
      descrizione: 'Description', bio: 'Bio', chiudi: 'Close', prec: 'Previous activity', succ: 'Next activity',
      foto: 'Photo coming soon', inCorso: 'On now', prossimo: 'Next start',
      pin: function (c, titoli) { return 'Spot ' + c + ': ' + titoli.join(', '); },
      programma: function () { return D.anno + ' programme'; },
      servizi: 'Services on the map', itinerante1: 'Roaming',
      serv: { info: 'Info point', wc: 'Toilets', acqua: 'Water', sos: 'First aid', bar: 'Bar / snack bar', ristorante: 'Restaurant', glutenfree: 'Gluten-free point', rifiuti: 'Waste collection', cappello: 'Hat (donations)', navette: 'Shuttles', parcheggio: 'Car park' },
      itinerantiNota: function (n) { return n + ' roaming artists with no fixed spot: you’ll meet them around the village. The icons are explained under the Services filter.'; },
      schedaDi: function (n, t) { return n + ' of ' + t; }
    }
  };
  var CAT = ['spettacolo', 'installazione', 'talk', 'lab', 'mostra'];
  var FILTRI = ['tutte', 'spettacolo', 'itineranti', 'installazione', 'talk', 'lab', 'mostra', 'servizi'];
  var DISEGNO = { spettacolo: 31, installazione: 26, talk: 38, lab: 42, mostra: 33 };
  var u = function () { return UI[L()]; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var hhmm = function (m) { return String(Math.floor(m / 60) % 24).padStart(2, '0') + '.' + String(m % 60).padStart(2, '0'); };
  var tx = function (o) { return o ? (o[L()] || o.it) : ''; };
  /* un'attività può stare su più punti (es. GASP: C, G, I) */
  var luoghiDi = function (a) { return a.luoghi || (a.luogo ? [a.luogo] : []); };

  /* ---------- Stato dei filtri ---------- */
  var stato = { cat: 'tutte', arrivo: null, luogo: null, giorno: null };
  var adesso = null; /* minuti, solo nel periodo "durante" */

  function minutiDa(str) { var p = str.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function inCorso(a, t) {
    if (t == null) return false;
    if (a.inizi) return a.inizi.some(function (s) { return t >= s && t < s + (a.minuti || 30); });
    if (a.fascia) return t >= a.fascia[0] && t < a.fascia[1];
    return !!a.permanente;
  }
  function visibileDopo(a, t) {
    if (t == null) return true;
    if (a.inizi) return a.inizi.some(function (s) { return s >= t || (t >= s && t < s + (a.minuti || 30)); });
    if (a.fascia) return a.fascia[1] > t;
    return true; /* permanenti, itineranti senza orario, Moon Walk */
  }
  function prossimoInizio(a, t) {
    if (!a.inizi) return null;
    var p = a.inizi.filter(function (s) { return t == null || s >= t; });
    return p.length ? p[0] : null;
  }
  function passa(a, ignoraLuogo) {
    if (stato.cat === 'servizi') return false;
    if (stato.cat === 'itineranti') { if (!a.itinerante) return false; }
    else if (stato.cat !== 'tutte' && a.cat !== stato.cat) return false;
    if (!ignoraLuogo && stato.luogo && luoghiDi(a).indexOf(stato.luogo) === -1) return false;
    if (stato.giorno && a.date && a.date.indexOf(stato.giorno) === -1) return false;
    return visibileDopo(a, stato.arrivo);
  }
  function filtrate() {
    var r = D.attivita.filter(function (a) { return passa(a); });
    if (stato.arrivo != null) {
      r = r.slice().sort(function (x, y) {
        var px = prossimoInizio(x, stato.arrivo), py = prossimoInizio(y, stato.arrivo);
        return (px == null ? 9999 : px) - (py == null ? 9999 : py);
      });
    }
    return r;
  }

  /* ---------- Elementi della pagina ---------- */
  var el = {
    filtri: document.getElementById('prog-filtri'),
    elenco: document.getElementById('prog-elenco'),
    conteggio: document.getElementById('prog-conteggio'),
    mappa: document.getElementById('prog-punti'),
    nota: document.getElementById('prog-mappa-nota'),
    dialogo: document.getElementById('prog-scheda'),
    corpo: document.getElementById('prog-scheda-corpo')
  };
  if (!el.elenco) return;

  function disegnaFiltri() {
    var x = u();
    var bott = FILTRI.map(function (c) {
      return '<button type="button" class="filtro" data-cat="' + c + '" aria-pressed="' + (stato.cat === c) + '">' + esc(c === 'servizi' ? x.servCat : x[c]) + '</button>';
    }).join('');
    var ore = '<option value="">' + esc(x.qualsiasi) + '</option>';
    for (var m = 15 * 60; m <= 23 * 60 + 30; m += 30) ore += '<option value="' + m + '"' + (stato.arrivo === m ? ' selected' : '') + '>' + hhmm(m) + '</option>';
    var giorni = '<option value="">' + esc(x.tuttiGiorni) + '</option>' + D.giorni.map(function (g) {
      return '<option value="' + g.data + '"' + (stato.giorno === g.data ? ' selected' : '') + '>' + esc(g[L()]) + '</option>';
    }).join('');
    var luogo = stato.luogo ? '<button type="button" class="filtro filtro--luogo" data-togli-luogo aria-label="' + esc(x.togliLuogo) + '">' + esc(x.luogo) + ' ' + esc(stato.luogo) + ' <span aria-hidden="true">×</span></button>' : '';
    el.filtri.innerHTML =
      '<div class="filtri__gruppo" role="group" aria-labelledby="prog-tip"><p id="prog-tip" class="filtri__etichetta">' + esc(x.tipologia) + '</p><div class="filtri__bottoni">' + bott + '</div></div>' +
      '<div class="filtri__riga">' +
        '<p class="filtri__campo"><label for="prog-giorno">' + esc(x.giorno) + '</label><select id="prog-giorno">' + giorni + '</select></p>' +
        '<p class="filtri__campo"><label for="prog-arrivo">' + esc(x.arrivo) + '</label><select id="prog-arrivo">' + ore + '</select></p>' +
        luogo +
      '</div>';
  }

  function altFoto(a) {
    var x = u(), chi = a.artista || a.titolo;
    if (a.media && a.media.post) return L() === 'en' ? 'Moon Festival 2026 post: ' + chi + ', ' + a.titolo : 'Post del Moon Festival 2026: ' + chi + ', ' + a.titolo;
    return L() === 'en' ? 'Photo: ' + chi + ', ' + a.titolo : 'Foto: ' + chi + ', ' + a.titolo;
  }
  function foto(a, grande) {
    var M = a.media, P = 'assets/img/programma/';
    if (M && !grande) return '<span class="pfoto pfoto--' + a.cat + '" aria-hidden="true"><img class="pfoto__img" src="' + P + M.mini + '" alt="" loading="lazy"></span>';
    /* su telefono la scheda usa il ritaglio 4:3 (più corto), sul computer il post intero o la foto */
    var tel = M && M.medio ? '<source media="(max-width: 640px)" srcset="' + P + M.medio + '">' : '';
    if (M && grande && M.post) return '<picture class="scheda__img">' + tel + '<img class="scheda__post" src="' + P + M.post + '" alt="' + esc(altFoto(a)) + '" width="864" height="1080"></picture>';
    if (M && grande && M.foto) return '<picture class="scheda__img">' + tel + '<img class="scheda__foto' + (M.verticale ? ' scheda__foto--verticale' : '') + '" src="' + P + M.foto + '" alt="' + esc(altFoto(a)) + '"></picture>';
    /* Nessuna foto degli artisti ancora: segnaposto con il colore e il disegno della tipologia.
       Con le foto vere: <img> con un filtro uniforme che si toglie al passaggio del mouse. */
    return '<span class="pfoto pfoto--' + a.cat + (grande ? ' pfoto--grande' : '') + '" aria-hidden="true">' +
      '<img src="assets/svg/elementi/ELEMENTI_MoonFestival_Sito_-' + String(DISEGNO[a.cat]).padStart(2, '0') + '.svg" alt="">' +
      (grande ? '<span class="pfoto__nota">' + esc(u().foto) + '</span>' : '') + '</span>';
  }
  /* immagine della scheda nella griglia: ritaglio 4:3 del post o della foto */
  function copertina(a) {
    if (a.media && a.media.medio) return '<img class="carta__img" src="assets/img/programma/' + a.media.medio + '" alt="" width="600" height="450" loading="lazy">';
    return foto(a);
  }
  function quando(a) {
    var x = u(), p = [];
    if (a.giorni) p.push(tx(a.giorni));
    if (a.orariTesto) p.push(tx(a.orariTesto));
    else if (a.permanente) p.push(x.permanente);
    else p.push(x.senzaOra);
    if (a.durata && !a.permanente) p.push(tx(a.durata));
    return p.join(' · ');
  }

  /* Elenco: righe di testo. Sul telefono nome, tipologia e orario, a destra pin e freccia;
     sul computer foto piccola e colonne (attività, tipologia, quando, dove). Clic sulla riga = scheda. */
  function giorniBrevi(a) {
    if (!a.giorni) return '';
    var g = tx(a.giorni);
    return L() === 'en'
      ? g.replace('Saturday', 'Sat').replace('Sunday', 'Sun').replace('Friday', 'Fri').replace(' September', ' Sep').replace('saturday', 'sat').replace('sunday', 'sun')
      : g.replace('Venerdì', 'Ven').replace('Sabato', 'Sab').replace('Domenica', 'Dom').replace('domenica', 'dom').replace(' settembre', ' set');
  }
  function quandoBreve(a) {
    var x = u(), o = a.orariTesto ? tx(a.orariTesto) : (a.permanente ? x.permanente : x.senzaOra);
    return (a.giorni ? giorniBrevi(a) + ' · ' : '') + o;
  }
  function rigaFoto(a) {
    var M = a.media || {};
    if (M.disegno) return '<span class="riga__foto riga__foto--disegno" aria-hidden="true"><img src="' + M.disegno + '" alt=""></span>';
    if (M.riga) return '<img class="riga__foto" src="assets/img/programma/' + M.riga + '" alt="" width="168" height="105" loading="lazy">';
    return '<span class="riga__foto" aria-hidden="true"></span>';
  }
  function riga(a) {
    var x = u(), ll = luoghiDi(a);
    var corso = adesso != null && inCorso(a, adesso) ? ' <span class="etichetta-stato">' + esc(x.inCorso) + '</span>' : '';
    var tipo = '<span class="riga__tipo"><span class="legenda__segno legenda__segno--' + a.cat + '" aria-hidden="true"></span>' + esc(x.cat1[a.cat]) + '</span>';
    var pin = ll.length ? ll.map(function (c) { return '<span class="riga__pin punto--' + a.cat + '">' + esc(c) + '</span>'; }).join('') : '<span class="riga__giro">' + esc(x.inGiro) + '</span>';
    var dove = ll.length ? x.punto(ll) : x.itinerante1;
    return '<li class="riga" data-id="' + a.id + '" data-luogo="' + ll.join(' ') + '">' +
      '<button type="button" class="riga__apri" data-apri="' + a.id + '" aria-label="' + esc(a.titolo + (a.artista ? ', ' + a.artista : '') + '. ' + x.cat1[a.cat] + ', ' + quandoBreve(a) + ', ' + dove) + '"></button>' +
      '<div class="riga__dentro">' + rigaFoto(a) +
        '<div class="riga__testo"><p class="riga__nome">' + esc(a.titolo) + corso + '</p>' + (a.artista ? '<p class="riga__artista">' + esc(a.artista) + '</p>' : '') +
          '<p class="riga__info">' + tipo + '<span>' + esc(quandoBreve(a)) + '</span></p></div>' +
        '<span class="riga__col riga__col--tipo">' + tipo + '</span>' +
        '<span class="riga__col riga__col--quando">' + esc(quandoBreve(a)) + '</span>' +
        '<span class="riga__dove">' + pin + '</span>' +
        '<span class="riga__freccia" aria-hidden="true">→</span></div></li>';
  }
  function intestazione() {
    var x = u();
    return '<div class="righe-intest" aria-hidden="true"><span></span><span>' + esc(x.colAtt) + '</span><span>' + esc(x.colTipo) + '</span><span>' + esc(x.colQuando) + '</span><span>' + esc(x.colDove) + '</span><span></span></div>';
  }
  function disegnaElenco() {
    var x = u(), lista = filtrate();
    if (stato.cat === 'servizi') {
      var conta = {}; D.servizi.forEach(function (s) { conta[s.tipo] = (conta[s.tipo] || 0) + 1; });
      var tipi = Object.keys(conta);
      el.conteggio.textContent = x.servConteggio(tipi.length);
      el.elenco.innerHTML = '<ul class="carte carte--servizi">' + tipi.map(function (t) {
        return '<li class="carta carta--servizio"><span class="pfoto pfoto--servizio" aria-hidden="true"><img class="pfoto__icona" src="assets/img/servizi/' + t + '.png" alt=""></span>' +
          '<div class="carta__testo"><h3 class="carta__titolo">' + esc(x.serv[t]) + '</h3><p class="carta__quando">' + esc(x.servPunti(conta[t])) + '</p></div></li>';
      }).join('') + '</ul>';
      return;
    }
    el.conteggio.textContent = x.conteggio(lista.length, D.attivita.length);
    if (!lista.length) {
      el.elenco.innerHTML = '<div class="prog-vuoto"><p>' + esc(x.nessuna) + '</p><button type="button" class="bottone" data-azzera>' + esc(x.azzera) + '</button></div>';
      return;
    }
    /* con "Tutto" e senza ora di arrivo: un titolo per tipologia; altrimenti un elenco unico */
    var gruppi = stato.cat === 'tutte' && stato.arrivo == null && !stato.luogo;
    if (gruppi) {
      el.elenco.innerHTML = CAT.map(function (c) {
        var l = lista.filter(function (a) { return a.cat === c; });
        if (!l.length) return '';
        return '<h3 class="righe-sez"><span class="legenda__segno legenda__segno--' + c + '" aria-hidden="true"></span>' + esc(x[c]) + ' <small>' + l.length + '</small></h3>' +
          intestazione() + '<ul class="righe righe--gruppo">' + l.map(riga).join('') + '</ul>';
      }).join('');
    } else {
      el.elenco.innerHTML = intestazione() + '<ul class="righe">' + lista.map(riga).join('') + '</ul>';
    }
  }

  function disegnaMappa() {
    var x = u(), perLuogo = {};
    D.attivita.forEach(function (a) { luoghiDi(a).forEach(function (c) { (perLuogo[c] = perLuogo[c] || []).push(a); }); });
    el.mappa.innerHTML = Object.keys(D.luoghi).map(function (c) {
      var tutte = perLuogo[c] || [], attive = tutte.filter(function (a) { return passa(a, true); });
      if (!tutte.length) return '';
      var cat = (attive[0] || tutte[0]).cat, pos = D.luoghi[c];
      var corso = adesso != null && attive.some(function (a) { return inCorso(a, adesso); });
      return '<button type="button" class="punto punto--' + cat + (corso ? ' punto--corso' : '') + '" data-luogo="' + c + '"' +
        ' style="left:' + pos.x + '%;top:' + pos.y + '%"' + (attive.length ? '' : ' hidden') +
        ' aria-pressed="' + (stato.luogo === c) + '" aria-label="' + esc(x.pin(c, attive.map(function (a) { return a.titolo; }))) + '">' + esc(c) + '</button>';
    }).join('');
    var itin = D.attivita.filter(function (a) { return a.itinerante && !a.luogo && passa(a, true); }).length;
    el.nota.textContent = itin ? x.itinerantiNota(itin) : '';
    disegnaServizi();
  }

  var mostraServizi = true;
  function disegnaServizi() {
    var x = u(), box = document.getElementById('prog-servizi'), lab = document.getElementById('prog-servizi-etichetta');
    if (!box || !D.servizi) return;
    var vedi = mostraServizi || stato.cat === 'servizi';
    box.hidden = !vedi;
    box.classList.toggle('mappa__servizi--grandi', stato.cat === 'servizi');
    box.innerHTML = D.servizi.map(function (s) {
      return '<img class="servizio" src="assets/img/servizi/' + s.tipo + '.png" alt="" style="left:' + s.x + '%;top:' + s.y + '%">';
    }).join('');
    if (lab) lab.textContent = x.servizi;
  }
  var casella = document.getElementById('prog-servizi-casella');
  if (casella) casella.addEventListener('change', function () { mostraServizi = casella.checked; disegnaServizi(); });

  function tutto() { disegnaFiltri(); disegnaElenco(); disegnaMappa(); }

  /* ---------- Scheda ---------- */
  var aperta = null, apriDa = null;
  function scheda(a) {
    var x = u(), lista = filtrate(), i = lista.indexOf(a), lang = L();
    if (i === -1) { lista = D.attivita; i = lista.indexOf(a); }
    var riga = function (t, v) { return '<div><dt>' + esc(t) + '</dt><dd>' + esc(v) + '</dd></div>'; };
    var righe = '';
    if (a.giorni) righe += riga(x.giorni, tx(a.giorni));
    righe += riga(x.orari, a.orariTesto ? tx(a.orariTesto) : (a.permanente ? x.permanente : x.senzaOra));
    if (a.durata && !a.permanente) righe += riga(x.durata, tx(a.durata));
    righe += riga(x.dove, a.luogo ? x.dovePunto(luoghiDi(a)) : x.doveItinerante);
    if (a.genere) righe += riga(x.genere, tx(a.genere));
    var par = function (arr) { return arr.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join(''); };
    /* tendina: <details> nativo, apribile con tastiera e lettori di schermo */
    var tendina = function (titolo, extra, corpo) {
      return '<details class="tendina"><summary><span class="tendina__titolo">' + esc(titolo) + '</span>' + (extra ? ' <span class="tendina__extra">' + esc(extra) + '</span>' : '') + '</summary><div class="tendina__corpo">' + corpo + '</div></details>';
    };
    var link = '<p class="scheda__link"><a href="accessibilita.html' + (lang === 'en' ? '?lang=en' : '') + '">' + esc(x.linkAcc) + '</a> · <a href="info-utili.html' + (lang === 'en' ? '?lang=en' : '') + '">' + esc(x.linkInfo) + '</a></p>';
    var alert = a.alert.length
      ? tendina(x.alertTit, String(a.alert.length), '<ul class="scheda__alert">' + a.alert.map(function (z) { return '<li>' + esc(tx(z)) + '</li>'; }).join('') + '</ul>' + link)
      : '<div class="tendina tendina--vuota"><p><span class="tendina__titolo">' + esc(x.alertTit) + '</span> <span class="tendina__extra">' + esc(x.nessunAlert) + '</span></p></div>';
    el.corpo.innerHTML =
      '<div class="scheda__testa' + (a.media && a.media.post ? ' scheda__testa--post' : '') + (a.media && !a.media.post ? ' scheda__testa--foto' : '') + '">' + foto(a, true) +
        '<div class="scheda__sopra"><p class="occhiello">' + esc(x.programma()) + ' · ' + esc(x.cat1[a.cat]) + '</p>' +
        '<h2 id="prog-scheda-titolo" class="scheda__titolo">' + esc(a.titolo) + '</h2>' +
        (a.artista ? '<p class="scheda__artista">' + esc(a.artista) + '</p>' : '') + '</div></div>' +
      '<div class="scheda__corpo">' +
        (a.cura ? '<p class="scheda__cura">' + esc(tx(a.cura)) + '</p>' : '') +
        '<dl class="scheda__righe">' + righe + '</dl>' +
        (a.luogo ? '<p class="scheda__azioni"><button type="button" class="bottone" data-mappa="' + esc(a.luogo) + '">' + esc(x.vediMappa) + '</button></p>' : '') +
        '<div class="tendine">' + alert +
          (a.desc[lang].length ? tendina(x.descrizione, '', par(a.desc[lang])) : '') +
          (a.bio[lang].length ? tendina(x.bio, '', par(a.bio[lang])) : '') +
        '</div>' +
      '</div>' +
      '<div class="scheda__piede">' +
        '<button type="button" class="scheda__freccia" data-vai="' + (i - 1) + '"' + (i > 0 ? '' : ' disabled') + ' aria-label="' + esc(x.prec) + '"><span aria-hidden="true">←</span></button>' +
        '<p class="scheda__posizione">' + esc(x.schedaDi(i + 1, lista.length)) + '</p>' +
        '<button type="button" class="scheda__freccia" data-vai="' + (i + 1) + '"' + (i < lista.length - 1 ? '' : ' disabled') + ' aria-label="' + esc(x.succ) + '"><span aria-hidden="true">→</span></button>' +
      '</div>';
    /* sul computer le tendine partono aperte, sul telefono chiuse */
    if (window.matchMedia('(min-width: 961px)').matches) el.corpo.querySelectorAll('details').forEach(function (d) { d.open = true; });
    el.dialogo.querySelector('[data-chiudi]').setAttribute('aria-label', x.chiudi);
    aperta = a;
  }
  function apri(id, opener) {
    var a = D.attivita.filter(function (z) { return z.id === id; })[0];
    if (!a) return;
    apriDa = opener || document.activeElement;
    scheda(a);
    if (!el.dialogo.open) { if (el.dialogo.showModal) el.dialogo.showModal(); else el.dialogo.setAttribute('open', ''); }
    el.dialogo.scrollTop = 0;
    var t = document.getElementById('prog-scheda-titolo'); if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
  }
  function chiudi() {
    if (el.dialogo.open) { if (el.dialogo.close) el.dialogo.close(); else el.dialogo.removeAttribute('open'); }
  }
  el.dialogo.addEventListener('close', function () {
    aperta = null;
    if (apriDa && document.body.contains(apriDa)) apriDa.focus();
  });
  el.dialogo.addEventListener('click', function (e) {
    if (e.target === el.dialogo) { chiudi(); return; } /* clic sullo sfondo */
    if (e.target.closest('[data-chiudi]')) { chiudi(); return; }
    var vai = e.target.closest('[data-vai]');
    if (vai) {
      var lista = filtrate(); if (lista.indexOf(aperta) === -1) lista = D.attivita;
      var a = lista[parseInt(vai.getAttribute('data-vai'), 10)];
      if (a) { scheda(a); el.dialogo.scrollTop = 0; var b = el.dialogo.querySelector('[data-vai="' + vai.getAttribute('data-vai') + '"]'); var t = document.getElementById('prog-scheda-titolo'); if (t) { t.setAttribute('tabindex', '-1'); t.focus(); } }
      return;
    }
    var m = e.target.closest('[data-mappa]');
    if (m) { chiudi(); mostraLuogo(m.getAttribute('data-mappa')); }
  });

  /* ---------- Mappa ---------- */
  function mostraLuogo(c) {
    stato.luogo = c; tutto();
    var mappa = document.getElementById('prog-mappa');
    var ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mappa) mappa.scrollIntoView({ behavior: ridotto ? 'auto' : 'smooth', block: 'start' });
    var p = el.mappa.querySelector('[data-luogo="' + c + '"]'); if (p) p.focus({ preventScroll: true });
  }
  el.mappa.addEventListener('click', function (e) {
    var p = e.target.closest('[data-luogo]'); if (!p) return;
    var c = p.getAttribute('data-luogo');
    stato.luogo = stato.luogo === c ? null : c;
    tutto();
    var nuovo = el.mappa.querySelector('[data-luogo="' + c + '"]'); if (nuovo) nuovo.focus();
  });

  /* ---------- Filtri ed elenco ---------- */
  el.filtri.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (b) { stato.cat = b.getAttribute('data-cat'); tutto(); var n = el.filtri.querySelector('[data-cat="' + stato.cat + '"]'); if (n) n.focus(); return; }
    if (e.target.closest('[data-togli-luogo]')) { stato.luogo = null; tutto(); var f = el.filtri.querySelector('[data-cat="' + stato.cat + '"]'); if (f) f.focus(); }
  });
  el.filtri.addEventListener('change', function (e) {
    if (e.target.id === 'prog-arrivo') stato.arrivo = e.target.value === '' ? null : parseInt(e.target.value, 10);
    if (e.target.id === 'prog-giorno') stato.giorno = e.target.value || null;
    var id = e.target.id; tutto(); var n = document.getElementById(id); if (n) n.focus();
  });
  el.elenco.addEventListener('click', function (e) {
    var a = e.target.closest('[data-apri]'); if (a) { apri(a.getAttribute('data-apri'), a); return; }
    var m = e.target.closest('[data-mappa]'); if (m) { mostraLuogo(m.getAttribute('data-mappa')); return; }
    if (e.target.closest('[data-azzera]')) { stato = { cat: 'tutte', arrivo: null, luogo: null, giorno: null }; tutto(); }
  });
  /* passando su una carta si accende il suo punto */
  function accendi(e, on) {
    var c = e.target.closest && e.target.closest('.riga'); if (!c || !c.getAttribute('data-luogo')) return;
    c.getAttribute('data-luogo').split(' ').forEach(function (l) { var p = el.mappa.querySelector('[data-luogo="' + l + '"]'); if (p) p.classList.toggle('punto--acceso', on); });
  }
  el.elenco.addEventListener('mouseover', function (e) { accendi(e, true); });
  el.elenco.addEventListener('mouseout', function (e) { accendi(e, false); });
  el.elenco.addEventListener('focusin', function (e) { accendi(e, true); });
  el.elenco.addEventListener('focusout', function (e) { accendi(e, false); });

  /* ---------- Avvio ---------- */
  function avvia() {
    if (window.MOON_STATO === 'durante') {
      var par = new URLSearchParams(window.location.search), ora = par.get('ora'), g = par.get('giorno');
      var d = new Date();
      adesso = ora ? minutiDa(ora) : d.getHours() * 60 + d.getMinutes();
      stato.arrivo = Math.floor(adesso / 30) * 30;
      if (g) stato.giorno = g;
    }
    tutto();
    var h = (window.location.hash || '').replace('#', '');
    if (h && D.attivita.some(function (a) { return a.id === h; })) apri(h);
  }
  document.addEventListener('moon:lingua', function () {
    tutto();
    if (aperta) scheda(aperta);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia); else avvia();
})();
