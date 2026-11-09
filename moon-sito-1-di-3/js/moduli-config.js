/* Moon Festival · collegamento dei moduli al foglio Google (ambito: Simone)
   url: indirizzo dell'app web di Google Apps Script ("Esegui il deployment" > "App web").
        Si imposta una volta sola: resta uguale per tutte le edizioni.
        Finché è vuoto i moduli funzionano in modalità prova e non inviano nulla.
   edizione: l'anno delle call. Ogni anno basta cambiarlo: lo script crea da solo, partendo dai
        fogli modello, la cartella e i 7 fogli "Moon <anno> · Call …" alla prima risposta.
   stato: date di apertura e chiusura di ogni call (AAAA-MM-GG). Vuoto = sempre aperta. */
window.MOON_MODULI_CONFIG = {
  url: '',
  edizione: '2027',
  stato: {
    artisti: { apre: '', chiude: '' },        /* [SCADENZA CALL ARTISTI 2027] */
    installazioni: { apre: '', chiude: '' },  /* [SCADENZA CALL INSTALLAZIONI 2027] */
    laboratori: { apre: '', chiude: '' },     /* [SCADENZA CALL LABORATORI 2027] */
    'moon-lab': { apre: '', chiude: '' },     /* [SCADENZA MOON LAB 2027] */
    volontari: { apre: '', chiude: '' },      /* [SCADENZA VOLONTARI 2027] */
    cantina: { apre: '', chiude: '' },
    adotta: { apre: '', chiude: '' }
  }
};
