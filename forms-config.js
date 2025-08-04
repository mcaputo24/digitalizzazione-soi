// forms-config.js

// ───────────────────────────────────────────────────────────
// Schede Fase1 – Anno 1
// ───────────────────────────────────────────────────────────
const anno1Schede = [
  {
    id: 'dati-studente',
    title: 'Dati dello Studente',
    fields: [
      { type: 'text',     name: 'nome',     label: 'Nome',     required: true },
      { type: 'text',     name: 'cognome',  label: 'Cognome',  required: true },
      { type: 'text',     name: 'classe',   label: 'Classe',   required: true },
      { type: 'date',     name: 'data',     label: 'Data',     required: true },
    ]
  },

  {
    id: 'scheda1',
    title: 'SCHEDA 1 – MAPPA DI DESCRIZIONE DI SÉ',
    instructions: [
      'Le mappe sono rappresentazioni grafiche che ci aiutano a vedere meglio le singole tessere che compongono il puzzle e come si incastrano tra loro.',
      'Elenca dieci aggettivi che ritieni essere i più adatti per descriverti.',
      'Ora usa lo strumento qui sotto per costruire la tua mappa. Inizia aggiungendo gli aggettivi che ritieni più importanti. Poi, clicca su ogni aggettivo per collegarlo a specifiche attività che fai o contesti in cui ti trovi.'
    ],
    fields: [
      { type: 'text-array', name: 'aggettivi', label: 'Aggettivi (10)', count: 10 },

      // esempio di mappa
      { type: 'image',      src: 'mappa-esempio.png', alt: 'Esempio di mappa concettuale' },
      { type: 'map',        cyId: 'cy', controlsId: 'map-controls' },

      // dettagli con tabella
      {
        type: 'details',
        summary: 'Non trovi le parole? Clicca qui per una lista di aggettivi.',
        html: `
<table>
  <thead><tr><th>CARATTERISTICHE PERSONALI</th></tr></thead>
  <tbody>
    <tr><td>Corretto</td><td>Protettivo</td><td>Intelligente</td></tr>
    <tr><td>Paziente</td><td>Collaborativo</td><td>Capace di assumere responsabilità</td></tr>
    <tr><td>Autoritario</td><td>Estroverso</td><td>Simpatico</td></tr>
    <tr><td>Avventuroso</td><td>Fidato</td><td>Sincero</td></tr>
    <tr><td>Benevolo</td><td>Fiducioso negli altri</td><td>Socievole</td></tr>
    <tr><td>Calcolatore</td><td>Generoso</td><td>Creativo</td></tr>
    <tr><td>Calmo</td><td>Adattabile</td><td>Tenace</td></tr>
    <tr><td>Solidale</td><td>Intraprendente</td><td>Tollerante</td></tr>
    <tr><td>Capace di cambiamento</td><td>Intuitivo</td><td>Umile</td></tr>
    <tr><td>Competente</td><td>Portato al risultato</td><td>Sensibile</td></tr>
    <tr><td>Comunicativo</td><td>Preciso</td><td>Affidabile</td></tr>
    <tr><td>Leale</td><td>Coinvolgente</td><td>Deciso</td></tr>
    <tr><td>Costante</td><td>Razionale</td><td>Sicuro di sé</td></tr>
  </tbody>
</table>
`
      },

      // testo libero
      {
        type: 'textarea',
        name: 'scheda1_attivita_preferite',
        label: 'Tra le attività che hai descritto nella mappa, scegli le due che ti piacciono di più e prova a dire perché.',
        rows: 5
      },
      {
        type: 'textarea',
        name: 'scheda1_preferenze_scolastiche',
        label: 'E rispetto alla scuola, cosa ti piace? Ci sono materie o argomenti che ti piacerebbe approfondire?',
        rows: 5
      }
    ]
  },

  {
    id: 'scheda2',
    title: 'SCHEDA 2 – UN PENSIERO SUL LAVORO',
    fields: [
      {
        type: 'textarea',
        name: 'scheda2_cosa_e_lavoro',
        label: 'Secondo te, cosa è il lavoro?',
        rows: 5
      },
      {
        type: 'textarea',
        name: 'scheda2_perche_si_lavora',
        label: 'Perché le persone lavorano?',
        rows: 5
      },
      {
        type: 'textarea',
        name: 'scheda2_se_nessuno_lavorasse',
        label: 'Se nessuno lavorasse, cosa succederebbe?',
        rows: 5
      },
      {
        type: 'textarea',
        name: 'scheda2_come_mi_sento',
        label: 'Se penso al lavoro, mi sento…',
        rows: 3
      }
    ]
  },

  {
    id: 'scheda3',
    title: 'SCHEDA 3 – MODI DI LAVORARE',
    instructions: [
      'Esistono quattro principali modi diversi di lavorare; quasi tutte le professioni o i lavori si svolgono lavorando un po\' in un modo un po\' in un altro.',
      '… con la GENTE: quando si hanno frequenti o continui rapporti con molte persone (clienti, pazienti, allievi…).',
      '… con i DATI: quando si ha a che fare con la registrazione, il calcolo, l’elaborazione di dati statistici o numerici…',
      '… con le IDEE: quando si producono concetti astratti, idee artistiche, scientifiche…',
      '… con le COSE: quando si manipolano materiali o oggetti per produrre o riparare manufatti…',
      'Ora, prova a compilare il questionario seguente, indicando quali modalità senti più tue.'
    ],
    subTitle: 'QUESTIONARIO DI AUTOVALUTAZIONE',
    description: 'Segna con una crocetta le affermazioni che descrivono chi sei e i tuoi interessi.',
    fields: [
      {
        type: 'checkbox-group',
        name: 'gente',
        label: 'LAVORARE CON LA GENTE',
        options: [
          { value: 'gente_1',  label: 'Nelle interrogazioni orali ti esprimi con disinvoltura' },
          { value: 'gente_2',  label: 'A scuola, ti piace lavorare in gruppo' },
          { value: 'gente_3',  label: 'Non resisti a lungo in un posto in cui non puoi parlare' },
          { value: 'gente_4',  label: 'Tutti ti dicono che sei garbato e cordiale' },
          { value: 'gente_5',  label: 'Vai d\'accordo con tutti, anche con chi hai appena conosciuto' },
          { value: 'gente_6',  label: 'Ti capita spesso di persuadere gli altri' },
          { value: 'gente_7',  label: 'Ammiri chi aiuta persone in difficoltà' },
          { value: 'gente_8',  label: 'Ti capita di aiutare compagni in difficoltà' },
          { value: 'gente_9',  label: 'Sei disponibile ad ascoltare chi ha problemi' },
          { value: 'gente_10', label: 'Ti piacerebbe fare volontariato' }
        ]
      },
      {
        type: 'checkbox-group',
        name: 'dati',
        label: 'LAVORARE CON I DATI',
        options: [
          { value: 'dati_1',  label: 'Ti piace fare i calcoli di matematica' },
          { value: 'dati_2',  label: 'Segui con precisione istruzioni complesse' },
          { value: 'dati_3',  label: 'Non sopporti disordine e confusione' },
          { value: 'dati_4',  label: 'Ti piace organizzare le attività' },
          { value: 'dati_5',  label: 'Ti piace costruire grafici e diagrammi' },
          { value: 'dati_6',  label: 'Organizzi le informazioni con schemi' },
          { value: 'dati_7',  label: 'I prof affidano incarichi di precisione' },
          { value: 'dati_8',  label: 'Rifai un compito per renderlo ordinato' },
          { value: 'dati_9',  label: 'Hai buone doti di osservazione' },
          { value: 'dati_10', label: 'Sei costante negli impegni' }
        ]
      },
      {
        type: 'checkbox-group',
        name: 'idee',
        label: 'LAVORARE CON LE IDEE',
        options: [
          { value: 'idee_1',  label: 'Ti piace studiare a lungo termine' },
          { value: 'idee_2',  label: 'Ti piace leggere' },
          { value: 'idee_3',  label: 'Ti piace discutere di temi sociali/scientifici' },
          { value: 'idee_4',  label: 'Approfondisci argomenti culturali autonomamente' },
          { value: 'idee_5',  label: 'Ritieni utili tutte le materie di studio' },
          { value: 'idee_6',  label: 'Ami esercizi di logica' },
          { value: 'idee_7',  label: 'Hai buona memoria' },
          { value: 'idee_8',  label: 'Segui programmi culturali in TV' },
          { value: 'idee_9',  label: 'Hai il gusto della ricerca' },
          { value: 'idee_10', label: 'Capisci concetti astratti senza esempi' }
        ]
      },
      {
        type: 'checkbox-group',
        name: 'cose',
        label: 'LAVORARE CON LE COSE',
        options: [
          { value: 'cose_1',  label: 'Riesci nei piccoli lavori manuali' },
          { value: 'cose_2',  label: 'Ti piace costruire oggetti' },
          { value: 'cose_3',  label: 'Segui consigli in Educazione Tecnica' },
          { value: 'cose_4',  label: 'Ti piace osservare artigiani' },
          { value: 'cose_5',  label: 'Scopri come funzionano i meccanismi' },
          { value: 'cose_6',  label: 'Diventi nervoso se fermo a lungo' },
          { value: 'cose_7',  label: 'Sei affascinato da ogni tipo di macchina' },
          { value: 'cose_8',  label: 'Inventi soluzioni pratiche' },
          { value: 'cose_9',  label: 'Segui programmi sui progressi tecnologici' },
          { value: 'cose_10', label: 'Ami la natura e gli animali' }
        ]
      },

      // riepilogo punteggi (può essere gestito in renderer)
      {
        type: 'score-summary',
        categories: ['gente', 'dati', 'idee', 'cose'],
        scoreIds: {
          gente: 'punteggio-gente',
          dati:  'punteggio-dati',
          idee:  'punteggio-idee',
          cose:  'punteggio-cose'
        }
      },

      {
        type: 'textarea',
        name: 'scheda3_riflessione',
        label: 'Cosa hai capito di te? Quale potrebbe essere la modalità di lavorare migliore per te?',
        rows: 5
      }
    ]
  },

  {
    id: 'scheda4',
    title: 'SCHEDA 4 – TUTTE LE POSSIBILI STRADE',
    instructions: [
      'Considerate tutte le “scoperte” che hai fatto con le schede precedenti, quale o quali lavori ti piacerebbe fare da grande?'
    ],
    fields: [
      {
        type: 'textarea',
        name: 'scheda4_lavori_desiderati',
        label: 'Quali lavori ti piacerebbe fare da grande?',
        rows: 4
      },
      {
        type: 'textarea',
        name: 'scheda4_immaginario_lavoro',
        label: 'Come ti immagini mentre svolgi uno di questi lavori? (Dove lavori? Cosa fai durante la giornata? Con chi lavori?)',
        rows: 6
      },
      {
        type: 'textarea',
        name: 'scheda4_motivazioni',
        label: 'Perché pensi che questo lavoro faccia per te? Cosa ti interessa? Quali aspetti ti attirano?',
        rows: 8
      },
      {
        type: 'textarea',
        name: 'scheda4_desideri_sogni',
        label: 'Quali desideri, sogni, obiettivi pensi di poter realizzare con questo lavoro?',
        rows: 6
      },
      {
        type: 'textarea',
        name: 'scheda4_ispirazione',
        label: 'C’è qualcuno che ammiri o che ti ispira per il suo lavoro o il suo modo di vivere?',
        rows: 4
      },
      {
        type: 'instruction',
        text: 'ADESSO – Come mi preparo al mio futuro? Ora serve un ultimo sforzo per riflettere su come puoi arrivare a svolgere il lavoro che ti piace.'
      },
      {
        type: 'textarea',
        name: 'scheda4_modo_studiare',
        label: 'Qual è il modo di studiare che funziona meglio per te?',
        rows: 6
      }
    ]
  }
];


// ───────────────────────────────────────────────────────────
// Schede Fase1 – Anno 2 (riuso + variazioni)
// ───────────────────────────────────────────────────────────
const anno2Schede = [
  // dati studente e schede 1–3 identici
  anno1Schede[0],
  anno1Schede[1],
  anno1Schede[2],
  anno1Schede[3],

  // scheda4: base + domanda extra
  {
    ...anno1Schede[4],
    id:    'scheda4-anno2',
    title: 'SCHEDA 4 – TUTTE LE POSSIBILI STRADE (Anno 2)',
    fields: [
      ...anno1Schede[4].fields,
      {
        type: 'textarea',
        name: 'scheda4_scuola_adatta',
        label: 'E quale potrebbe essere il tipo di scuola più adatta a te dopo la terza media?',
        rows: 4
      }
    ]
  },

  // nuova scheda5
  {
    id: 'scheda5',
    title: 'SCHEDA 5 – AUTOVALUTAZIONE FINALE',
    fields: [
      {
        type: 'textarea',
        name: 'scheda5_cosa_ho_capito',
        label: 'Cosa hai capito di te stesso/a grazie a questo percorso?',
        rows: 5
      },
      {
        type: 'textarea',
        name: 'scheda5_cosa_mi_ha_colpito',
        label: 'Qual è la parte del percorso che ti ha colpito di più o che ti è sembrata più utile?',
        rows: 5
      },
      {
        type: 'textarea',
        name: 'scheda5_come_continuo',
        label: 'In che modo pensi di continuare a riflettere sul tuo orientamento in futuro?',
        rows: 5
      }
    ]
  }
];

// ════════════════════════════════════════════════
// Schede Fase1 – Anno 3 (stesso contenuto di Anno 2)
// ════════════════════════════════════════════════
const anno3Schede = anno2Schede.map(s => {
  // se vuoi mantenere lo stesso id/title, basta restituire s
  return { ...s };
});

// Poi estendi formsConfig
const formsConfig = {
  fase1: {
    anno1: { schede: anno1Schede },
    anno2: { schede: anno2Schede },
    anno3: { schede: anno3Schede }
  }
};

// global
window.formsConfig = formsConfig;