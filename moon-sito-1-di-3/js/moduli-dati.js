/* Moon Festival · moduli di candidatura 2027 (ambito: Simone, contenuti e funzioni)
   Domande e opzioni riprese dai moduli Google 2026 (call artist*, call volontarie, Moon Network),
   aggiornate al 2027. Ogni testo ha italiano ed inglese (EN tradotto da Claude, da rivedere).
   I segnaposto tra [QUADRE] sono dati da confermare: non vanno pubblicati così.

   Tipi di campo: testo, email, tel, data, numero, area (testo lungo), scelta (un'opzione, a bottoni),
   scelte (più opzioni, a bottoni), link (indirizzo web), file (caricamento), consenso (casella).
   "se": il campo compare solo se un altro campo ha un certo valore. */
(function () {
  var t = function (it, en) { return { it: it, en: en }; };
  var SI_NO = [t('Sì', 'Yes'), t('No', 'No')];

  /* ---------- Blocchi comuni ---------- */
  function chiSei(opz) {
    opz = opz || {};
    var c = [
      { id: 'nome', tipo: 'testo', obbl: true, auto: 'given-name', et: t('Nome anagrafico', 'Legal first name') },
      { id: 'nome_elezione', tipo: 'testo', auto: 'nickname', et: t('Nome di elezione', 'Chosen name'),
        aiuto: t('Se usi un nome diverso da quello anagrafico, lo useremo in tutte le comunicazioni.', 'If you use a name other than your legal one, we will use it in all communications.') },
      { id: 'cognome', tipo: 'testo', obbl: true, auto: 'family-name', et: t('Cognome', 'Last name') },
      { id: 'pronomi', tipo: 'scelta', et: t('Quali pronomi usi?', 'Which pronouns do you use?'), altro: true,
        opz: [t('Lei', 'She/her'), t('Lui', 'He/him'), t('Loro', 'They/them'), t('Preferisco non dirlo', 'I prefer not to say')] }
    ];
    if (opz.nascita) c.push({ id: 'nascita', tipo: 'data', obbl: true, auto: 'bday', et: t('Data di nascita', 'Date of birth'), aiuto: opz.nascita });
    c.push(
      { id: 'email', tipo: 'email', obbl: true, auto: 'email', et: t('Email', 'Email') },
      { id: 'telefono', tipo: 'tel', obbl: true, auto: 'tel', et: t('Telefono', 'Phone number'), aiuto: t('Con il prefisso, se non è italiano.', 'With the country code if it is not Italian.') },
      { id: 'comune', tipo: 'testo', obbl: true, auto: 'address-level2', et: t('Comune in cui vivi', 'Town or city where you live') },
      { id: 'paese', tipo: 'testo', auto: 'country-name', et: t('Paese', 'Country'), val: t('Italia', 'Italy') }
    );
    return { id: 'chi', titolo: opz.titolo || t('Chi sei', 'About you'), campi: c };
  }
  function consensi(opz) {
    opz = opz || {};
    var c = [];
    if (opz.tessera) c.push({ id: 'tessera', tipo: 'consenso', obbl: true,
      et: t('So che, se verrò selezionat*, dovrò fare la tessera dell’associazione Dnart APS, obbligatoria per motivi assicurativi. La tessera è digitale e vale dal 1° gennaio al 31 dicembre. Costo: [COSTO TESSERA 2027].',
            'I understand that, if selected, I will need to become a member of Dnart APS, which is required for insurance reasons. Membership is digital and valid from 1 January to 31 December. Cost: [MEMBERSHIP FEE 2027].') });
    c.push({ id: 'privacy', tipo: 'consenso', obbl: true,
      et: t('Ho letto l’informativa privacy del Moon Festival e acconsento al trattamento dei miei dati personali (Regolamento UE 2016/679).' + (opz.gruppo ? ' Se la proposta è di un gruppo, ho informato tutte le persone coinvolte e ho il loro consenso.' : ''),
            'I have read the Moon Festival privacy notice and I consent to the processing of my personal data (EU Regulation 2016/679).' + (opz.gruppo ? ' If the proposal comes from a group, I have informed everyone involved and have their consent.' : '')),
      link: 'https://moonfestival.it/privacy' });
    c.push({ id: 'comunicazioni', tipo: 'consenso',
      et: t('Acconsento all’uso della mia email per comunicazioni sul Moon Festival e sulle call future.', 'I agree to my email being used for communications about Moon Festival and future calls.') });
    if (opz.liberatoria) c.push({ id: 'liberatoria', tipo: 'consenso',
      et: t('Autorizzo l’uso di foto e video realizzati durante il festival per comunicazione, documentazione e archivio del Moon Festival.', 'I authorise the use of photos and videos taken during the festival for Moon Festival communication, documentation and archive.') });
    c.push({ id: 'newsletter', tipo: 'consenso',
      et: t('Iscrivimi alla newsletter di Dnart. Ogni tanto atterriamo nella tua mail con idee, festival e piccoli atti di cura.', 'Sign me up to the Dnart newsletter. Every now and then we land in your inbox with ideas, festivals and small acts of care.') });
    return { id: 'consensi', titolo: t('Ultime cose', 'Last things'), campi: [
      { id: 'conosciuto', tipo: 'scelta', et: t('Come hai conosciuto il Moon Festival?', 'How did you hear about Moon Festival?'), altro: true,
        opz: [t('Passaparola', 'Word of mouth'), t('Instagram', 'Instagram'), t('Facebook', 'Facebook'), t('Sito web', 'Website'), t('Materiale stampato', 'Printed materials'), t('Ci sono già stat*', 'I have been before')] },
      { id: 'suggerimenti', tipo: 'area', max: 1000, et: t('Vuoi dirci qualcos’altro?', 'Anything else you want to tell us?'),
        aiuto: t('Suggerimenti, bisogni, cose che il modulo non ti ha chiesto o errori che hai notato.', 'Suggestions, needs, things this form did not ask, or mistakes you noticed.') }
    ].concat(c) };
  }
  var NO_WETRANSFER = t('Usa un link che non scade (Drive, Dropbox, Vimeo, YouTube, il tuo sito). I link di WeTransfer scadono dopo pochi giorni.', 'Use a link that does not expire (Drive, Dropbox, Vimeo, YouTube, your website). WeTransfer links expire after a few days.');
  var ALIMENTAZIONE = { id: 'alimentazione', tipo: 'scelte', et: t('Esigenze alimentari', 'Dietary needs'), altro: true,
    aiuto: t('Per allergie o intolleranze gravi scegli “Altro” e descrivile.', 'For allergies or severe intolerances choose “Other” and describe them.'),
    opz: [t('Nessuna', 'None'), t('Vegetariana', 'Vegetarian'), t('Vegana', 'Vegan'), t('Senza glutine', 'Gluten-free'), t('Senza lattosio', 'Lactose-free')] };
  var BUDGET = { id: 'budget', tipo: 'scelta', et: t('Budget richiesto', 'Requested fee'),
    aiuto: t('Cachet complessivo per le giornate di festival, IVA inclusa se dovuta.', 'Total fee for the festival days, including VAT if applicable.'),
    opz: [t('Fino a 300 €', 'Up to €300'), t('301–500 €', '€301–500'), t('501–800 €', '€501–800'), t('801–1.200 €', '€801–1,200'), t('1.201–1.500 €', '€1,201–1,500'), t('Oltre 1.500 €', 'Over €1,500'), t('Preferisco dirlo più avanti', 'I prefer to say later')] };
  var TERRITORIO = { id: 'territorio', tipo: 'scelta', et: t('Sarai in Piemonte o nei dintorni tra agosto e settembre 2027?', 'Will you be in Piedmont or nearby in August and September 2027?'),
    aiuto: t('Ci aiuta a valorizzare chi è già sul territorio in quel periodo.', 'It helps us support people who are already in the area at that time.'),
    opz: [t('Sì, ho già date confermate in Piemonte', 'Yes, I already have confirmed dates in Piedmont'), t('Sì, ho date nelle zone vicine', 'Yes, I have dates in nearby areas'), t('No, ma sarò comunque in Piemonte', 'No, but I will be in Piedmont anyway'), t('No', 'No')] };
  function materiali(cosa) {
    return [
      { id: 'materiali', tipo: 'scelta', obbl: true, et: t('Usi materiali riciclati, recuperati o sostenibili?', 'Do you use recycled, reclaimed or sustainable materials?'), opz: [t('Sì', 'Yes'), t('In parte', 'Partly'), t('No', 'No')] },
      { id: 'materiali_quali', tipo: 'area', max: 500, se: { campo: 'materiali', non: 'No' }, et: t('Quali materiali, quanti e come li usi?', 'Which materials, how much and how do you use them?') }
    ];
  }
  function materialeOnline(opz) {
    return { id: 'materiale', titolo: t('Foto, video e documenti', 'Photos, videos and documents'),
      intro: t('Puoi caricare i file qui sotto oppure incollare dei link. Foto in JPG o PNG, documenti in PDF, massimo 10 MB per file.', 'You can upload files below or paste links. Photos as JPG or PNG, documents as PDF, up to 10 MB per file.'),
      campi: [
        { id: 'foto', tipo: 'file', multipli: 5, accetta: 'image/jpeg,image/png', et: opz.fotoEt || t('Foto (fino a 5)', 'Photos (up to 5)'),
          aiuto: t('Foto orizzontali o verticali, almeno 1000 px sul lato lungo. Le useremo anche per il sito e i social, se verrai selezionat*.', 'Landscape or portrait, at least 1000 px on the long side. If selected, we will also use them on the website and social media.') },
        { id: 'dossier', tipo: 'file', multipli: 1, accetta: 'application/pdf', et: opz.dossierEt || t('Dossier o presentazione (PDF)', 'Portfolio or presentation (PDF)') },
        { id: 'link_video', tipo: 'link', obbl: !!opz.videoObbl, et: opz.videoEt || t('Link a un video', 'Link to a video'), aiuto: NO_WETRANSFER },
        { id: 'link_altro', tipo: 'link', et: t('Altri link (sito, Instagram, foto online)', 'Other links (website, Instagram, online photos)'), aiuto: t('Uno per riga.', 'One per line.'), righe: true }
      ] };
  }

  /* ---------- I moduli ---------- */
  var M = {};

  M.artisti = {
    titolo: t('Call artist* 2027', 'Open call for artists 2027'),
    breve: t('Spettacoli', 'Performances'),
    lead: t('Cerchiamo spettacoli capaci di incontrare davvero il borgo: teatro, circo, danza, musica, teatro di figura, performance.', 'We are looking for performances that can truly meet the village: theatre, circus, dance, music, puppetry, performance.'),
    info: [
      [t('Date del festival', 'Festival dates'), t('3, 4 e 5 settembre 2027', '3, 4 and 5 September 2027')],
      [t('Dove', 'Where'), t('San Raffaele Cimena Alto (TO)', 'San Raffaele Cimena Alto (TO), Italy')],
      [t('Formato', 'Format'), t('Spettacoli all’aperto, fino a 30 minuti, ripetuti 3 volte a sera', 'Outdoor shows, up to 30 minutes, performed 3 times each evening')],
      [t('Scadenza', 'Deadline'), t('[SCADENZA CALL ARTISTI 2027]', '[ARTIST CALL DEADLINE 2027]')]
    ],
    blocchi: [
      chiSei({ nascita: t('Ci serve per motivi organizzativi e assicurativi.', 'We need it for organisational and insurance reasons.') }),
      { id: 'progetto', titolo: t('Il tuo spettacolo', 'Your performance'), campi: [
        { id: 'compagnia', tipo: 'testo', et: t('Nome della compagnia o del collettivo', 'Name of the company or collective'), aiuto: t('Se presenti da sol*, lascia vuoto.', 'Leave empty if you are applying on your own.') },
        { id: 'titolo', tipo: 'testo', obbl: true, et: t('Titolo dello spettacolo', 'Title of the performance') },
        { id: 'descrizione', tipo: 'area', obbl: true, max: 500, et: t('Raccontalo in poche righe', 'Describe it in a few lines') },
        { id: 'categoria', tipo: 'scelte', obbl: true, altro: true, et: t('Che tipo di spettacolo è?', 'What kind of performance is it?'),
          opz: [t('Teatro', 'Theatre'), t('Circo', 'Circus'), t('Danza', 'Dance'), t('Performance', 'Performance'), t('Teatro di figura / marionette', 'Puppetry / visual theatre'), t('Musica / sound art', 'Music / sound art')] },
        { id: 'linguaggio', tipo: 'testo', et: t('Il linguaggio dello spettacolo in poche parole', 'The language of the performance in a few words'), aiuto: t('Per esempio: fisico, poetico, comico, partecipativo.', 'For example: physical, poetic, comic, participatory.') },
        { id: 'pubblico', tipo: 'scelte', obbl: true, altro: true, et: t('Per quale pubblico è più adatto?', 'Which audience is it best suited for?'),
          opz: [t('Per tutt*', 'For everyone'), t('Per famiglie', 'For families'), t('Per un pubblico adulto', 'For adults'), t('Senza parole', 'Non-verbal'), t('Per spazi raccolti', 'For small, intimate spaces'), t('Per spazi ampi e con flusso di pubblico', 'For large spaces with moving audiences')] },
        { id: 'tema', tipo: 'area', obbl: true, max: 600, et: t('Come dialoga il tuo spettacolo con il tema 2027, [TEMA 2027]?', 'How does your performance relate to the 2027 theme, [THEME 2027]?') }
      ].concat(materiali()) },
      { id: 'formato', titolo: t('Durata, repliche, disponibilità', 'Length, repeats, availability'), campi: [
        { id: 'durata', tipo: 'scelta', obbl: true, et: t('Quanto dura?', 'How long is it?'), opz: [t('Fino a 15 minuti', 'Up to 15 minutes'), t('15–30 minuti', '15–30 minutes'), t('30–45 minuti', '30–45 minutes'), t('Oltre 45 minuti', 'Over 45 minutes')] },
        { id: 'max30', tipo: 'scelta', obbl: true, opz: SI_NO, et: t('Puoi portarlo a massimo 30 minuti?', 'Can you bring it down to 30 minutes at most?') },
        { id: 'repliche', tipo: 'scelta', obbl: true, opz: SI_NO, et: t('Puoi replicarlo 3 volte nella stessa sera?', 'Can you perform it 3 times in the same evening?') },
        { id: 'disponibile', tipo: 'scelta', obbl: true, opz: [t('Sì, tutti e tre i giorni', 'Yes, all three days'), t('Solo alcuni giorni', 'Only some days')], et: t('Sei disponibile il 3, 4 e 5 settembre 2027?', 'Are you available on 3, 4 and 5 September 2027?') },
        { id: 'giorni', tipo: 'scelte', se: { campo: 'disponibile', vale: 'Solo alcuni giorni' }, et: t('Quali giorni?', 'Which days?'), opz: [t('Venerdì 3 settembre', 'Friday 3 September'), t('Sabato 4 settembre', 'Saturday 4 September'), t('Domenica 5 settembre', 'Sunday 5 September')] },
        { id: 'persone', tipo: 'numero', obbl: true, min: 1, et: t('Quante persone siete in tutto?', 'How many people are you in total?'), aiuto: t('Contando chi va in scena e chi segue la tecnica.', 'Counting performers and technical crew.') },
        { id: 'eta_media', tipo: 'scelta', se: { campo: 'persone', piuDi: 1 }, et: t('Età media del gruppo', 'Average age of the group'),
          opz: [t('Meno di 18', 'Under 18'), t('18–25', '18–25'), t('26–30', '26–30'), t('31–40', '31–40'), t('41–50', '41–50'), t('51–60', '51–60'), t('Oltre 60', 'Over 60'), t('Gruppo di più generazioni', 'Multigenerational group')] },
        { id: 'lingue', tipo: 'scelte', altro: true, et: t('Che lingue parlate?', 'Which languages do you speak?'), opz: [t('Italiano', 'Italian'), t('Inglese', 'English'), t('Francese', 'French'), t('Spagnolo', 'Spanish'), t('Tedesco', 'German')] },
        TERRITORIO
      ] },
      { id: 'tecnica', titolo: t('Tecnica e allestimento', 'Technical needs and set-up'), campi: [
        { id: 'esigenze', tipo: 'scelte', obbl: true, altro: true, et: t('Di cosa ha bisogno lo spettacolo?', 'What does the performance need?'),
          opz: [t('Niente di particolare, siamo autonom*', 'Nothing in particular, we are self-sufficient'), t('Uno spazio minimo definito', 'A defined minimum space'), t('Pavimento regolare', 'Even ground'), t('Presa elettrica', 'Power socket'), t('Corrente più del normale', 'Higher-than-average power'), t('Impianto audio', 'Sound system'), t('Impianto luci', 'Lighting'), t('Buio', 'Darkness'), t('Silenzio, poco rumore intorno', 'Silence, little noise around')] },
        { id: 'esigenze_desc', tipo: 'area', max: 800, et: t('Descrivi le esigenze tecniche', 'Describe your technical needs'), aiuto: t('Misure dello spazio, altezza, corrente, audio, luci.', 'Space size, height, power, sound, lights.') },
        { id: 'scheda_tecnica', tipo: 'file', multipli: 1, accetta: 'application/pdf', et: t('Scheda tecnica (PDF), se ce l’hai', 'Technical rider (PDF), if you have one') },
        { id: 'autonomia', tipo: 'scelta', obbl: true, et: t('Quanto siete autonom* dal punto di vista tecnico?', 'How technically self-sufficient are you?'),
          opz: [t('Del tutto: abbiamo tutto ciò che serve', 'Completely: we have everything we need'), t('In parte: ci serve un supporto minimo (corrente, luce di base, aiuto a montare)', 'Partly: we need minimal support (power, basic light, help with set-up)'), t('Poco: ci serve il supporto del festival', 'Not much: we need support from the festival'), t('Dipende dallo spazio', 'It depends on the space')] },
        { id: 'montaggio', tipo: 'scelta', obbl: true, et: t('Quanto tempo vi serve per montare?', 'How long do you need to set up?'), opz: [t('Meno di 15 minuti', 'Less than 15 minutes'), t('15–30 minuti', '15–30 minutes'), t('30–60 minuti', '30–60 minutes'), t('Oltre un’ora', 'Over an hour'), t('Dipende dallo spazio', 'It depends on the space')] },
        { id: 'giorno_prima', tipo: 'scelta', et: t('Vi serve montare il giorno prima?', 'Do you need to set up the day before?'), opz: [t('No, montiamo il giorno stesso', 'No, we set up on the day'), t('Sarebbe meglio', 'It would be better'), t('Sì, è necessario', 'Yes, it is necessary')] },
        { id: 'rumore', tipo: 'scelta', obbl: true, et: t('Quanto è rumoroso lo spettacolo?', 'How loud is the performance?'), opz: [t('Poco', 'Low'), t('Medio', 'Moderate'), t('Molto', 'High')] },
        { id: 'fruizione', tipo: 'scelte', altro: true, et: t('Cosa lo rende più facile da seguire per pubblici diversi?', 'What makes it easier to follow for different audiences?'),
          aiuto: t('Ci aiuta a preparare le informazioni di accessibilità.', 'It helps us prepare accessibility information.'),
          opz: [t('Soprattutto linguaggio fisico e gestuale', 'Mostly physical and gestural language'), t('Testo semplice', 'Simple text'), t('Si può seguire anche da lontano o in movimento', 'Can be followed from a distance or on the move'), t('Si può seguire da vicino', 'Can be followed up close'), t('Il pubblico resta fermo', 'The audience stays still'), t('Nessun effetto di luce critico (es. stroboscopio)', 'No critical light effects (e.g. strobe)')] },
        { id: 'alert', tipo: 'area', max: 400, et: t('Ci sono cose da segnalare al pubblico?', 'Is there anything the audience should be warned about?'), aiuto: t('Per esempio fuoco, fumo, rumori forti, contatto fisico, temi delicati.', 'For example fire, smoke, loud noises, physical contact, sensitive themes.') },
        ALIMENTAZIONE, BUDGET
      ] },
      materialeOnline({ videoObbl: true, videoEt: t('Link a un video dello spettacolo', 'Link to a video of the performance') }),
      consensi({ gruppo: true, liberatoria: true })
    ]
  };

  M.installazioni = {
    titolo: t('Call installazioni 2027', 'Open call for installations 2027'),
    breve: t('Installazioni', 'Installations'),
    lead: t('Opere da abitare per tre sere: luce, suono, materia, sagome che trasformano vicoli, cortili e piazze del borgo.', 'Works to be lived in for three evenings: light, sound, matter and shapes that transform the lanes, courtyards and squares of the village.'),
    info: [
      [t('Date del festival', 'Festival dates'), t('3, 4 e 5 settembre 2027', '3, 4 and 5 September 2027')],
      [t('Dove', 'Where'), t('All’aperto e in spazi del borgo, dal tramonto a mezzanotte', 'Outdoors and in village spaces, from sunset to midnight')],
      [t('Scadenza', 'Deadline'), t('[SCADENZA CALL INSTALLAZIONI 2027]', '[INSTALLATION CALL DEADLINE 2027]')]
    ],
    blocchi: [
      chiSei({ nascita: t('Ci serve per motivi organizzativi e assicurativi.', 'We need it for organisational and insurance reasons.') }),
      { id: 'progetto', titolo: t('La tua installazione', 'Your installation'), campi: [
        { id: 'compagnia', tipo: 'testo', et: t('Nome del collettivo o dello studio', 'Name of the collective or studio'), aiuto: t('Se presenti da sol*, lascia vuoto.', 'Leave empty if you are applying on your own.') },
        { id: 'titolo', tipo: 'testo', obbl: true, et: t('Titolo dell’opera', 'Title of the work') },
        { id: 'descrizione', tipo: 'area', obbl: true, max: 500, et: t('Raccontala in poche righe', 'Describe it in a few lines') },
        { id: 'tipo_opera', tipo: 'scelte', obbl: true, altro: true, et: t('Che tipo di installazione è?', 'What kind of installation is it?'),
          opz: [t('Luminosa', 'Light'), t('Sonora', 'Sound'), t('Interattiva, il pubblico la usa o la tocca', 'Interactive, the audience uses or touches it'), t('Scultura o oggetto', 'Sculpture or object'), t('Site-specific, nasce per il luogo', 'Site-specific, made for the place'), t('Visiva o video', 'Visual or video')] },
        { id: 'tema', tipo: 'area', obbl: true, max: 600, et: t('Come dialoga l’opera con il tema 2027, [TEMA 2027]?', 'How does the work relate to the 2027 theme, [THEME 2027]?') }
      ].concat(materiali()) },
      { id: 'spazio', titolo: t('Spazio e montaggio', 'Space and set-up'), campi: [
        { id: 'luogo', tipo: 'scelte', obbl: true, et: t('Dove funziona meglio?', 'Where does it work best?'), opz: [t('All’aperto', 'Outdoors'), t('Al coperto', 'Indoors'), t('In un vicolo o passaggio', 'In a lane or passage'), t('In una piazza o cortile', 'In a square or courtyard'), t('Su un muro o una facciata', 'On a wall or facade'), t('Va bene ovunque', 'Anywhere')] },
        { id: 'dimensioni', tipo: 'testo', obbl: true, et: t('Ingombro (larghezza × profondità × altezza)', 'Size (width × depth × height)'), aiuto: t('Anche indicativo, in metri.', 'Even approximate, in metres.') },
        { id: 'elettricita', tipo: 'scelta', obbl: true, et: t('Ha bisogno di corrente?', 'Does it need power?'), opz: [t('No', 'No'), t('Sì, una presa normale', 'Yes, a standard socket'), t('Sì, più corrente del normale', 'Yes, higher-than-average power'), t('Funziona a batteria', 'It runs on batteries')] },
        { id: 'meteo', tipo: 'scelta', obbl: true, et: t('Regge pioggia e vento?', 'Can it withstand rain and wind?'), opz: [t('Sì', 'Yes'), t('Con qualche protezione', 'With some protection'), t('No, va protetta o smontata', 'No, it must be covered or taken down')] },
        { id: 'montaggio', tipo: 'scelta', obbl: true, et: t('Quanto tempo serve per montarla?', 'How long does it take to install?'), opz: [t('Meno di mezza giornata', 'Less than half a day'), t('Una giornata', 'One day'), t('Due giorni o più', 'Two days or more')] },
        { id: 'presenza', tipo: 'scelta', obbl: true, et: t('Durante il festival serve una persona accanto all’opera?', 'Does the work need someone with it during the festival?'), opz: [t('No, è autonoma', 'No, it runs on its own'), t('Sì, la seguiamo noi', 'Yes, we look after it'), t('Sì, serve una persona del festival', 'Yes, it needs someone from the festival')] },
        { id: 'sicurezza', tipo: 'area', max: 400, et: t('Ci sono cose da sapere per la sicurezza del pubblico?', 'Is there anything to know about audience safety?'), aiuto: t('Parti fragili, spigoli, fuoco, fumo, luci intermittenti, superfici calpestabili.', 'Fragile parts, sharp edges, fire, smoke, flashing lights, walkable surfaces.') },
        { id: 'persone', tipo: 'numero', obbl: true, min: 1, et: t('Quante persone verranno al festival?', 'How many people will come to the festival?') },
        ALIMENTAZIONE, TERRITORIO, BUDGET
      ] },
      materialeOnline({ fotoEt: t('Foto o disegni dell’opera (fino a 5)', 'Photos or drawings of the work (up to 5)'), videoEt: t('Link a un video (se c’è)', 'Link to a video (if any)') }),
      consensi({ gruppo: true, liberatoria: true })
    ]
  };

  M.laboratori = {
    titolo: t('Proponi un laboratorio 2027', 'Propose a workshop 2027'),
    breve: t('Laboratori', 'Workshops'),
    lead: t('Hai un laboratorio da condividere? Raccontaci cosa vorresti costruire con il pubblico del festival.', 'Do you have a workshop to share? Tell us what you would like to build with the festival audience.'),
    info: [
      [t('Date del festival', 'Festival dates'), t('3, 4 e 5 settembre 2027', '3, 4 and 5 September 2027')],
      [t('Quando', 'When'), t('Di solito nel pomeriggio, prima degli spettacoli', 'Usually in the afternoon, before the shows')],
      [t('Scadenza', 'Deadline'), t('[SCADENZA CALL LABORATORI 2027]', '[WORKSHOP CALL DEADLINE 2027]')]
    ],
    blocchi: [
      chiSei({ nascita: t('Ci serve per motivi organizzativi e assicurativi.', 'We need it for organisational and insurance reasons.') }),
      { id: 'progetto', titolo: t('Il tuo laboratorio', 'Your workshop'), campi: [
        { id: 'realta', tipo: 'testo', et: t('Associazione, collettivo o realtà che rappresenti', 'Organisation or collective you represent'), aiuto: t('Se proponi da sol*, lascia vuoto.', 'Leave empty if you are proposing it on your own.') },
        { id: 'titolo', tipo: 'testo', obbl: true, et: t('Titolo del laboratorio', 'Title of the workshop') },
        { id: 'descrizione', tipo: 'area', obbl: true, max: 500, et: t('Cosa si fa, passo per passo?', 'What happens, step by step?') },
        { id: 'ambito', tipo: 'scelte', obbl: true, altro: true, et: t('Di che cosa si tratta?', 'What is it about?'), opz: [t('Arte e manualità', 'Art and crafts'), t('Natura e ambiente', 'Nature and environment'), t('Corpo e movimento', 'Body and movement'), t('Musica e suono', 'Music and sound'), t('Scienza e gioco', 'Science and play'), t('Parola e racconto', 'Words and storytelling')] },
        { id: 'tema', tipo: 'area', max: 600, et: t('Come dialoga con il tema 2027, [TEMA 2027]?', 'How does it relate to the 2027 theme, [THEME 2027]?') }
      ].concat(materiali()) },
      { id: 'partecipanti', titolo: t('Chi partecipa e come', 'Who takes part and how'), campi: [
        { id: 'destinatari', tipo: 'scelte', obbl: true, et: t('A chi è rivolto?', 'Who is it for?'), opz: [t('Bambin* (fino a 10 anni)', 'Children (up to 10)'), t('Ragazz* (11–17 anni)', 'Teenagers (11–17)'), t('Famiglie', 'Families'), t('Adult*', 'Adults'), t('Tutt*', 'Everyone')] },
        { id: 'eta_minima', tipo: 'numero', min: 0, et: t('Età minima', 'Minimum age'), aiuto: t('Lascia vuoto se non c’è.', 'Leave empty if there is none.') },
        { id: 'max_persone', tipo: 'numero', obbl: true, min: 1, et: t('Quante persone al massimo per volta?', 'Maximum number of people at a time?') },
        { id: 'durata', tipo: 'scelta', obbl: true, et: t('Quanto dura?', 'How long is it?'), opz: [t('Meno di un’ora', 'Less than an hour'), t('1–2 ore', '1–2 hours'), t('Oltre 2 ore', 'Over 2 hours'), t('Aperto, si entra e si esce', 'Drop-in, people come and go')] },
        { id: 'repliche', tipo: 'scelta', obbl: true, et: t('Quante volte puoi proporlo?', 'How many times can you run it?'), opz: [t('Una volta', 'Once'), t('Una volta al giorno', 'Once a day'), t('Più volte al giorno', 'Several times a day')] },
        { id: 'giorni', tipo: 'scelte', obbl: true, et: t('In quali giorni ci sei?', 'Which days are you available?'), opz: [t('Venerdì 3 settembre', 'Friday 3 September'), t('Sabato 4 settembre', 'Saturday 4 September'), t('Domenica 5 settembre', 'Sunday 5 September')] },
        { id: 'accessibile', tipo: 'area', max: 400, et: t('Chi potrebbe avere difficoltà a partecipare, e come lo rendi più accessibile?', 'Who might find it hard to take part, and how do you make it more accessible?'), aiuto: t('Per esempio persone in carrozzina, con difficoltà visive o uditive, che non parlano italiano.', 'For example wheelchair users, people with sight or hearing impairments, people who do not speak Italian.') }
      ] },
      { id: 'servizi', titolo: t('Spazio e materiali', 'Space and materials'), campi: [
        { id: 'spazio', tipo: 'scelte', obbl: true, et: t('Di che spazio hai bisogno?', 'What kind of space do you need?'), opz: [t('All’aperto', 'Outdoors'), t('Al coperto', 'Indoors'), t('Tavoli e sedie', 'Tables and chairs'), t('Ombra', 'Shade'), t('Acqua vicina', 'Water nearby'), t('Presa elettrica', 'Power socket')] },
        { id: 'materiali_lab', tipo: 'scelta', obbl: true, et: t('I materiali per chi partecipa', 'Materials for participants'), opz: [t('Li porto io', 'I bring them'), t('Me ne serve una parte', 'I need some of them'), t('Mi servono tutti', 'I need all of them')] },
        { id: 'materiali_elenco', tipo: 'area', max: 500, se: { campo: 'materiali_lab', non: 'Li porto io' }, et: t('Quali materiali ti servono?', 'Which materials do you need?') },
        ALIMENTAZIONE, BUDGET
      ] },
      materialeOnline({ fotoEt: t('Foto di laboratori già fatti (fino a 5)', 'Photos of past workshops (up to 5)') }),
      consensi({ gruppo: true, liberatoria: true })
    ]
  };

  var GRUPPI = [t('Scenografia, allestimento e luci', 'Set design, installation and lighting'), t('Media: foto, video, grafica, social', 'Media: photo, video, graphics, social'), t('Produzione e organizzazione', 'Production and organisation'), t('Accoglienza e awareness', 'Welcome and awareness'), t('Cucina e convivialità', 'Kitchen and conviviality'), t('Dove serve', 'Wherever needed')];

  M['moon-lab'] = {
    titolo: t('Moon Lab 2027', 'Moon Lab 2027'),
    breve: t('Moon Lab', 'Moon Lab'),
    lead: t('Dodici giorni per costruire il festival insieme: formazione, lavoro condiviso e vita in campeggio. Per chi ha tra i 18 e i 35 anni.', 'Twelve days to build the festival together: training, shared work and camp life. For people aged 18 to 35.'),
    info: [
      [t('Quando', 'When'), t('Dal 27 agosto al 7 settembre 2027, presenza per tutto il periodo', 'From 27 August to 7 September 2027, for the whole period')],
      [t('Per chi', 'Who for'), t('Dai 18 ai 35 anni, senza competenze specifiche', 'Aged 18 to 35, no specific skills needed')],
      [t('Ospitalità', 'Accommodation'), t('In campeggio insieme allo staff', 'Camping together with the staff')],
      [t('Tessera', 'Membership'), t('Tessera Dnart obbligatoria (assicurazione)', 'Dnart membership required (insurance)')],
      [t('Scadenza', 'Deadline'), t('[SCADENZA MOON LAB 2027]', '[MOON LAB DEADLINE 2027]')]
    ],
    blocchi: [
      chiSei({ nascita: t('Il Moon Lab è per chi ha tra i 18 e i 35 anni.', 'Moon Lab is for people aged 18 to 35.') }),
      { id: 'percorso', titolo: t('Il tuo percorso', 'Your path'), campi: [
        { id: 'gruppo', tipo: 'scelta', obbl: true, opz: GRUPPI, et: t('In quale gruppo di lavoro ti piacerebbe stare?', 'Which working group would you like to join?') },
        { id: 'esperienza', tipo: 'scelta', obbl: true, et: t('Che esperienza hai in questo ambito?', 'How much experience do you have in this area?'), opz: [t('Nessuna, voglio imparare', 'None, I want to learn'), t('Di base, ho già partecipato a cose simili', 'Basic, I have done similar things'), t('Sono autonom* su alcune attività', 'I can work on my own on some tasks'), t('Avanzata o professionale', 'Advanced or professional')] },
        { id: 'competenze', tipo: 'scelte', altro: true, et: t('Hai pratica in qualcuno di questi ambiti?', 'Do you have practice in any of these?'), opz: [t('Falegnameria e bricolage', 'Carpentry and DIY'), t('Cucito e tessuti', 'Sewing and textiles'), t('Pittura e decorazione', 'Painting and decoration'), t('Luci ed elettricità di base', 'Lighting and basic electrics'), t('Fotografia', 'Photography'), t('Video', 'Video'), t('Grafica e illustrazione', 'Graphics and illustration'), t('Social media', 'Social media'), t('Cucina', 'Cooking'), t('Facilitare gruppi', 'Facilitating groups'), t('Riuso dei materiali', 'Reusing materials')] },
        { id: 'attrezzatura', tipo: 'testo', et: t('Porti attrezzi o strumenti tuoi?', 'Will you bring your own tools or equipment?'), aiuto: t('Per esempio macchina fotografica, macchina da cucire, computer.', 'For example a camera, sewing machine, laptop.') },
        { id: 'racconto', tipo: 'area', obbl: true, max: 1000, et: t('Raccontaci qualcosa di te', 'Tell us something about yourself'), aiuto: t('Chi sei, cosa ti muove, cosa cerchi nel Moon Lab.', 'Who you are, what moves you, what you are looking for in Moon Lab.') },
        { id: 'proposta', tipo: 'area', max: 600, et: t('C’è un’idea o un’attività che ti piacerebbe proporre durante il Moon Lab?', 'Is there an idea or activity you would like to propose during Moon Lab?') },
        { id: 'cv', tipo: 'file', multipli: 1, accetta: 'application/pdf,image/jpeg,image/png', et: t('CV o portfolio (PDF), se vuoi', 'CV or portfolio (PDF), if you like') },
        { id: 'link_portfolio', tipo: 'link', et: t('Oppure un link al tuo portfolio o profilo', 'Or a link to your portfolio or profile'), aiuto: NO_WETRANSFER },
        { id: 'formazione', tipo: 'scelta', obbl: true, et: t('Ti servono ore certificate per scuola o università?', 'Do you need certified hours for school or university?'), opz: [t('No', 'No'), t('Sì, stage o tirocinio', 'Yes, internship or traineeship'), t('Sì, altro percorso', 'Yes, another programme')] },
        { id: 'scuola', tipo: 'testo', se: { campo: 'formazione', non: 'No' }, et: t('Nome della scuola o dell’ente', 'Name of the school or institution') }
      ] },
      { id: 'campo', titolo: t('Vita al campo', 'Camp life'), campi: [
        { id: 'periodo', tipo: 'consenso', obbl: true, et: t('Confermo che posso esserci per tutto il periodo, dal 27 agosto al 7 settembre 2027.', 'I confirm I can be there for the whole period, from 27 August to 7 September 2027.') },
        { id: 'campeggio', tipo: 'scelte', obbl: true, et: t('Cosa hai per il campeggio?', 'What camping gear do you have?'), opz: [t('Tenda', 'Tent'), t('Sacco a pelo', 'Sleeping bag'), t('Materassino', 'Sleeping mat'), t('Borraccia', 'Water bottle'), t('Niente, mi serve aiuto', 'Nothing, I need help')] },
        { id: 'patente', tipo: 'scelta', obbl: true, opz: SI_NO, et: t('Hai la patente?', 'Do you have a driving licence?') },
        { id: 'auto', tipo: 'scelta', se: { campo: 'patente', vale: 'Sì' }, opz: SI_NO, et: t('Puoi mettere a disposizione la tua auto per il festival?', 'Could your car be used for festival needs?') },
        { id: 'maglietta', tipo: 'scelta', obbl: true, et: t('Taglia della maglietta staff', 'Staff T-shirt size'), opz: [t('XS', 'XS'), t('S', 'S'), t('M', 'M'), t('L', 'L'), t('XL', 'XL'), t('XXL', 'XXL')] },
        { id: 'dieta', tipo: 'scelta', obbl: true, et: t('Come mangi?', 'What do you eat?'), opz: [t('Di tutto', 'Everything'), t('Vegetariana', 'Vegetarian'), t('Vegana', 'Vegan')] },
        { id: 'allergie', tipo: 'testo', et: t('Allergie o intolleranze', 'Allergies or intolerances'), aiuto: t('Lascia vuoto se non ne hai.', 'Leave empty if you have none.') },
        { id: 'bisogni', tipo: 'area', max: 500, et: t('C’è qualcosa che ci aiuta a farti stare bene?', 'Is there anything that helps us make you feel at ease?'), aiuto: t('Bisogni di accessibilità, salute, ritmi. Resta tra noi dello staff.', 'Accessibility, health, rhythms. It stays within the staff.') }
      ] },
      consensi({ tessera: true, liberatoria: true })
    ]
  };

  M.volontari = {
    titolo: t('Volontar* del festival 2027', 'Festival volunteers 2027'),
    breve: t('Volontar*', 'Volunteers'),
    lead: t('Tre giorni dentro il festival: accoglienza, piazza, media, cucina. Non servono competenze, servono ascolto e voglia di esserci.', 'Three days inside the festival: welcome, squares, media, kitchen. No skills needed, just listening and wanting to be there.'),
    info: [
      [t('Quando', 'When'), t('3, 4 e 5 settembre 2027, per tutti e tre i giorni', '3, 4 and 5 September 2027, all three days')],
      [t('Per chi', 'Who for'), t('[FASCIA D’ETÀ VOLONTARI 2027]', '[VOLUNTEER AGE RANGE 2027]')],
      [t('Ospitalità', 'Accommodation'), t('Non prevista: si torna a casa ogni sera', 'Not included: you go home every evening')],
      [t('Scadenza', 'Deadline'), t('[SCADENZA VOLONTARI 2027]', '[VOLUNTEER DEADLINE 2027]')]
    ],
    blocchi: [
      chiSei({ nascita: t('Ci serve per l’assicurazione. Se hai meno di 18 anni ti chiederemo l’autorizzazione di chi esercita la responsabilità genitoriale.', 'We need it for insurance. If you are under 18 we will ask for permission from a parent or guardian.') }),
      { id: 'percorso', titolo: t('Come vuoi esserci', 'How you want to take part'), campi: [
        { id: 'gruppo', tipo: 'scelta', obbl: true, et: t('In quale gruppo ti piacerebbe stare?', 'Which group would you like to join?'), opz: [t('Accoglienza e awareness', 'Welcome and awareness'), t('Servizio di piazza e supporto all’evento', 'Square service and event support'), t('Media: foto, video, social', 'Media: photo, video, social'), t('Cucina e convivialità', 'Kitchen and conviviality'), t('Dove serve', 'Wherever needed')] },
        { id: 'giorni', tipo: 'consenso', obbl: true, et: t('Confermo che posso esserci tutti e tre i giorni, 3, 4 e 5 settembre 2027.', 'I confirm I can be there on all three days, 3, 4 and 5 September 2027.') },
        { id: 'racconto', tipo: 'area', max: 800, et: t('Raccontaci qualcosa di te', 'Tell us something about yourself'), aiuto: t('Cosa fai nella vita, cosa ti incuriosisce del festival.', 'What you do in life, what makes you curious about the festival.') },
        { id: 'formazione', tipo: 'scelta', obbl: true, et: t('Ti servono ore certificate per scuola (PCTO) o università?', 'Do you need certified hours for school or university?'), opz: [t('No', 'No'), t('Sì, PCTO', 'Yes, school programme (PCTO)'), t('Sì, stage o tirocinio', 'Yes, internship or traineeship')] },
        { id: 'scuola', tipo: 'testo', se: { campo: 'formazione', non: 'No' }, et: t('Nome della scuola o dell’ente', 'Name of the school or institution') },
        { id: 'patente', tipo: 'scelta', obbl: true, opz: SI_NO, et: t('Hai la patente?', 'Do you have a driving licence?') },
        { id: 'maglietta', tipo: 'scelta', obbl: true, et: t('Taglia della maglietta staff', 'Staff T-shirt size'), opz: [t('XS', 'XS'), t('S', 'S'), t('M', 'M'), t('L', 'L'), t('XL', 'XL'), t('XXL', 'XXL')] },
        { id: 'dieta', tipo: 'scelta', obbl: true, et: t('Come mangi?', 'What do you eat?'), opz: [t('Di tutto', 'Everything'), t('Vegetariana', 'Vegetarian'), t('Vegana', 'Vegan')] },
        { id: 'allergie', tipo: 'testo', et: t('Allergie o intolleranze', 'Allergies or intolerances'), aiuto: t('Lascia vuoto se non ne hai.', 'Leave empty if you have none.') }
      ] },
      consensi({ liberatoria: true })
    ]
  };

  M.cantina = {
    titolo: t('Apri la tua cantina', 'Open your cellar'),
    breve: t('Apri la tua cantina', 'Open your cellar'),
    lead: t('Quello che non usi può diventare un mondo. Raccogliamo materiali per costruire le scenografie del festival.', 'What you no longer use can become a world. We collect materials to build the festival sets.'),
    info: [
      [t('Cosa cerchiamo', 'What we look for'), t('Legno, tessuti, metallo, vetro, luci, oggetti e mobili in buono stato', 'Wood, fabric, metal, glass, lights, objects and furniture in good condition')],
      [t('Quando', 'When'), t('Raccolta durante l’anno, soprattutto prima del Moon Lab di fine agosto', 'Collected all year, especially before Moon Lab in late August')],
      [t('Ritiro', 'Pick-up'), t('Possiamo passare noi, nella zona di San Raffaele Cimena', 'We can collect around San Raffaele Cimena')]
    ],
    blocchi: [
      { id: 'chi', titolo: t('Chi sei', 'About you'), campi: [
        { id: 'nome', tipo: 'testo', obbl: true, auto: 'name', et: t('Nome e cognome, o nome della realtà', 'Name, or name of the organisation') },
        { id: 'email', tipo: 'email', obbl: true, auto: 'email', et: t('Email', 'Email') },
        { id: 'telefono', tipo: 'tel', obbl: true, auto: 'tel', et: t('Telefono', 'Phone number') },
        { id: 'comune', tipo: 'testo', obbl: true, auto: 'address-level2', et: t('Comune', 'Town') }
      ] },
      { id: 'materiali', titolo: t('Cosa vuoi donare', 'What you want to donate'), campi: [
        { id: 'tipi', tipo: 'scelte', obbl: true, altro: true, et: t('Che materiali hai?', 'What materials do you have?'), opz: [t('Legno e bancali', 'Wood and pallets'), t('Tessuti e stoffe', 'Fabric and textiles'), t('Metallo', 'Metal'), t('Vetro e barattoli', 'Glass and jars'), t('Plastica', 'Plastic'), t('Carta e cartone', 'Paper and cardboard'), t('Corde e reti', 'Ropes and nets'), t('Luci, lampadine, cavi', 'Lights, bulbs, cables'), t('Mobili', 'Furniture'), t('Oggetti e cianfrusaglie', 'Objects and odds and ends'), t('Vernici e colori', 'Paints'), t('Attrezzi', 'Tools')] },
        { id: 'descrizione', tipo: 'area', obbl: true, max: 800, et: t('Descrivili', 'Describe them'), aiuto: t('Cosa sono, in che stato, più o meno quanti.', 'What they are, what condition, roughly how many.') },
        { id: 'quantita', tipo: 'scelta', obbl: true, et: t('Quanto spazio occupano?', 'How much space do they take up?'), opz: [t('Sta in una borsa', 'Fits in a bag'), t('Sta in un’auto', 'Fits in a car'), t('Serve un furgone', 'Needs a van')] },
        { id: 'foto', tipo: 'file', multipli: 5, accetta: 'image/jpeg,image/png', et: t('Foto dei materiali (fino a 5)', 'Photos of the materials (up to 5)'), aiuto: t('Ci aiutano a capire se riusciamo a usarli. Massimo 10 MB per foto.', 'They help us see whether we can use them. Up to 10 MB per photo.') }
      ] },
      { id: 'ritiro', titolo: t('Consegna o ritiro', 'Drop-off or pick-up'), campi: [
        { id: 'modalita', tipo: 'scelta', obbl: true, et: t('Come preferisci?', 'What do you prefer?'), opz: [t('Li porto io', 'I bring them'), t('Venite a prenderli', 'Please pick them up')] },
        { id: 'indirizzo', tipo: 'testo', obbl: true, auto: 'street-address', se: { campo: 'modalita', vale: 'Venite a prenderli' }, et: t('Indirizzo per il ritiro', 'Pick-up address') },
        { id: 'quando', tipo: 'testo', et: t('Quando sei disponibile?', 'When are you available?'), aiuto: t('Giorni e orari in cui possiamo sentirci o passare.', 'Days and times when we can call or come by.') }
      ] },
      { id: 'consensi', titolo: t('Ultime cose', 'Last things'), campi: [
        { id: 'privacy', tipo: 'consenso', obbl: true, link: 'https://moonfestival.it/privacy', et: t('Ho letto l’informativa privacy del Moon Festival e acconsento al trattamento dei miei dati personali (Regolamento UE 2016/679).', 'I have read the Moon Festival privacy notice and I consent to the processing of my personal data (EU Regulation 2016/679).') },
        { id: 'newsletter', tipo: 'consenso', et: t('Iscrivimi alla newsletter di Dnart.', 'Sign me up to the Dnart newsletter.') }
      ] }
    ]
  };

  M.adotta = {
    titolo: t('Adotta un artista', 'Host an artist'),
    breve: t('Adotta un artista', 'Host an artist'),
    lead: t('Una stanza libera, un incontro in più. Cerchiamo persone del territorio che ospitino artist* durante il festival.', 'A spare room, one more encounter. We are looking for local people to host artists during the festival.'),
    info: [
      [t('Quando', 'When'), t('Le notti intorno al festival, 3, 4 e 5 settembre 2027', 'The nights around the festival, 3, 4 and 5 September 2027')],
      [t('Dove', 'Where'), t('A San Raffaele Cimena o nei paesi vicini', 'In San Raffaele Cimena or nearby villages')],
      [t('Cosa serve', 'What it takes'), t('Un letto o un divano, un bagno, un po’ di accoglienza', 'A bed or sofa, a bathroom, a little welcome')]
    ],
    blocchi: [
      { id: 'chi', titolo: t('Chi sei', 'About you'), campi: [
        { id: 'nome', tipo: 'testo', obbl: true, auto: 'given-name', et: t('Nome', 'First name') },
        { id: 'cognome', tipo: 'testo', obbl: true, auto: 'family-name', et: t('Cognome', 'Last name') },
        { id: 'email', tipo: 'email', obbl: true, auto: 'email', et: t('Email', 'Email') },
        { id: 'telefono', tipo: 'tel', obbl: true, auto: 'tel', et: t('Telefono', 'Phone number') },
        { id: 'indirizzo', tipo: 'testo', obbl: true, auto: 'street-address', et: t('Indirizzo della casa', 'Address of the home') },
        { id: 'comune', tipo: 'testo', obbl: true, auto: 'address-level2', et: t('Comune', 'Town') }
      ] },
      { id: 'casa', titolo: t('Cosa puoi offrire', 'What you can offer'), campi: [
        { id: 'tipo', tipo: 'scelte', obbl: true, et: t('Che posto hai?', 'What kind of space do you have?'), opz: [t('Una camera singola', 'A single room'), t('Una camera doppia', 'A double room'), t('Un divano letto', 'A sofa bed'), t('Spazio per una tenda in giardino', 'Room for a tent in the garden'), t('Posto per un camper o un furgone', 'Room for a camper or van')] },
        { id: 'posti', tipo: 'numero', obbl: true, min: 1, et: t('Quante persone puoi ospitare?', 'How many people can you host?') },
        { id: 'notti', tipo: 'scelte', obbl: true, et: t('Quali notti?', 'Which nights?'), opz: [t('2–3 settembre', '2–3 September'), t('3–4 settembre', '3–4 September'), t('4–5 settembre', '4–5 September'), t('5–6 settembre', '5–6 September')] },
        { id: 'bagno', tipo: 'scelta', obbl: true, et: t('Il bagno', 'The bathroom'), opz: [t('Riservato agli ospiti', 'For guests only'), t('Condiviso con la famiglia', 'Shared with the household')] },
        { id: 'extra', tipo: 'scelte', et: t('Puoi offrire anche', 'You can also offer'), opz: [t('La colazione', 'Breakfast'), t('Un posto auto', 'A parking space'), t('Un passaggio fino al festival', 'A lift to the festival'), t('Lavatrice', 'Washing machine'), t('Wi-fi', 'Wi-fi')] },
        { id: 'casa_info', tipo: 'scelte', et: t('In casa ci sono', 'In the home there are'), aiuto: t('Ci aiuta ad abbinare la casa giusta all’artista giusto.', 'It helps us match the right home with the right artist.'), opz: [t('Animali', 'Pets'), t('Bambin*', 'Children'), t('Persone che fumano', 'People who smoke'), t('Scale per arrivare alla camera', 'Stairs up to the room')] },
        { id: 'lingue', tipo: 'scelte', altro: true, et: t('Che lingue parli?', 'Which languages do you speak?'), opz: [t('Italiano', 'Italian'), t('Inglese', 'English'), t('Francese', 'French'), t('Spagnolo', 'Spanish'), t('Tedesco', 'German')] },
        { id: 'note', tipo: 'area', max: 600, et: t('Vuoi dirci qualcos’altro della casa o di te?', 'Anything else about the home or about you?') }
      ] },
      { id: 'consensi', titolo: t('Ultime cose', 'Last things'), campi: [
        { id: 'privacy', tipo: 'consenso', obbl: true, link: 'https://moonfestival.it/privacy', et: t('Ho letto l’informativa privacy del Moon Festival e acconsento al trattamento dei miei dati personali (Regolamento UE 2016/679).', 'I have read the Moon Festival privacy notice and I consent to the processing of my personal data (EU Regulation 2016/679).') },
        { id: 'comunicazioni', tipo: 'consenso', et: t('Acconsento all’uso della mia email per comunicazioni sul Moon Festival.', 'I agree to my email being used for communications about Moon Festival.') },
        { id: 'newsletter', tipo: 'consenso', et: t('Iscrivimi alla newsletter di Dnart.', 'Sign me up to the Dnart newsletter.') }
      ] }
    ]
  };

  /* ordine nel sottomenu delle call */
  window.MOON_MODULI_ORDINE = ['artisti', 'installazioni', 'laboratori', 'moon-lab', 'volontari', 'cantina', 'adotta'];
  window.MOON_MODULI = M;
})();
