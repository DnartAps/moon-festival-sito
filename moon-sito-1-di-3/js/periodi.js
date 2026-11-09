/* Moon Festival · periodi del sito (ambito: Simone, funzioni e dati)
   Il sito ha tre stati e si accende e spegne da solo in base alla data:
   - "base"    tutto l'anno
   - "prima"   prima del festival: call, iscrizioni, programma pubblicato
   - "durante" nei giorni del festival
   Gli elementi con data-periodi="prima durante" si vedono solo in quegli stati.
   Per provare uno stato senza aspettare la data: aggiungi ?periodo=prima (o durante, base)
   all'indirizzo; durante il festival si può simulare anche l'ora con &giorno=2027-09-04&ora=21:15. */
window.MOON_PERIODI = {
  edizione: 6,
  anno: 2027,
  festival: { dal: '2027-09-03', al: '2027-09-05' },
  moonLab: { dal: '2027-08-27', al: '2027-09-07' },
  /* [DATA] Da quando il sito passa allo stato "prima" (es. apertura delle call o pubblicazione
     del programma 2027). Finché è null il sito resta in "base" fino al primo giorno del festival. */
  prima: { dal: null },
  /* Orari di apertura del festival per giorno (usati per "in corso adesso").
     [DATA] Orari 2027 da confermare: questi sono quelli del 2026, spostati sulle date 2027. */
  aperture: { '2027-09-03': ['18:30', '24:00'], '2027-09-04': ['15:00', '24:00'], '2027-09-05': ['16:00', '24:00'] }
};
