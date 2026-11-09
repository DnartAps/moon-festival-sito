/* Moon Festival · video della Home da Vimeo (ambito: Simone)
   - Parte sempre da solo, senza audio, in loop, senza l'interfaccia di Vimeo (controls=0).
   - Due bottoni sempre visibili: pausa/play (WCAG 2.2.2, contenuto in movimento > 5 secondi)
     e audio sì/no (WCAG 1.4.2: l'audio parte solo se lo chiede chi guarda).
   - dnt=1: Vimeo non traccia chi guarda (niente cookie di profilazione).
   - Fuori schermo il video si ferma (batteria e dati) e riparte quando torna visibile, se non è in pausa.
   Per cambiare video basta cambiare il numero in data-vimeo nella pagina. */
(function () {
  var box = document.querySelector('.video[data-vimeo]');
  if (!box) return;
  var id = box.getAttribute('data-vimeo');
  var TESTI = window.MOON_TESTI || {};
  var L = function () { return document.documentElement.lang === 'en' ? 'en' : 'it'; };
  var t = function (k) { return (TESTI[k] || {})[L()] || k; };
  var inPausa = false, conAudio = false;

  var f = document.createElement('iframe');
  f.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0' +
          '&playsinline=1&dnt=1&autopause=0';
  f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
  f.setAttribute('tabindex', '-1');           // il video non ha comandi propri: si usano i bottoni
  f.className = 'video__iframe';
  box.appendChild(f);

  var comandi = document.createElement('div');
  comandi.className = 'video__comandi';
  comandi.innerHTML =
    '<button type="button" class="video__bottone video__audio"><svg class="ico-muto" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>' +
    '<svg class="ico-audio" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/></svg><span class="sr"></span></button>' +
    '<button type="button" class="video__bottone video__pausa"><svg class="ico-pausa" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>' +
    '<svg class="ico-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span class="sr"></span></button>';
  box.appendChild(comandi);
  var bPausa = comandi.querySelector('.video__pausa'), bAudio = comandi.querySelector('.video__audio');

  function aggiorna() {
    bPausa.querySelector('.sr').textContent = t(inPausa ? 'video.play' : 'video.pausa');
    bPausa.classList.toggle('attivo', inPausa);
    bAudio.querySelector('.sr').textContent = t(conAudio ? 'video.audio.off' : 'video.audio.on');
    bAudio.classList.toggle('attivo', conAudio);
    f.title = t('video.titolo');
  }
  function comanda(metodo, valore) {
    var m = { method: metodo }; if (valore !== undefined) m.value = valore;
    try { f.contentWindow.postMessage(JSON.stringify(m), 'https://player.vimeo.com'); } catch (e) {}
  }
  bPausa.addEventListener('click', function () { inPausa = !inPausa; comanda(inPausa ? 'pause' : 'play'); aggiorna(); });
  bAudio.addEventListener('click', function () {
    conAudio = !conAudio;
    comanda('setMuted', !conAudio); comanda('setVolume', conAudio ? 1 : 0);
    if (conAudio && inPausa) { inPausa = false; comanda('play'); }
    aggiorna();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (v) { if (!inPausa) comanda(v[0].isIntersecting ? 'play' : 'pause'); }).observe(box);
  }
  document.addEventListener('moon:lingua', aggiorna);
  aggiorna();
})();
