// form-renderer.js
;(function() {
  /**
   * Renderizza dinamicamente il form nel container specificato,
   * a partire dalla configurazione passata.
   *
   * @param {string} containerSelector — selettore del div vuoto (es. '#form-container')
   * @param {Array} schedeConfig — array di schede (fieldset) da formsConfig
   */
  function renderForm(containerSelector, schedeConfig) {
    console.log('🖌️ renderForm chiamato:', containerSelector, schedeConfig);
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('Container non trovato:', containerSelector);
      return;
    }
    container.innerHTML = ''; // svuota

    schedeConfig.forEach(scheda => {
      const fieldset = document.createElement('fieldset');
      fieldset.id = scheda.id;

      // ── Legenda ───────────────────────────────
      const legend = document.createElement('legend');
      legend.textContent = scheda.title;
      fieldset.appendChild(legend);

      // ── Istruzioni testuali
      if (scheda.instructions) {
        scheda.instructions.forEach(txt => {
          const p = document.createElement('p');
          p.className = 'instruction-text';
          p.textContent = txt;
          fieldset.appendChild(p);
        });
      }

      // ── Sottotitolo
      if (scheda.subTitle) {
        const h4 = document.createElement('h4');
        h4.className = 'centered-subtitle';
        h4.textContent = scheda.subTitle;
        fieldset.appendChild(h4);
      }

      // ── Descrizione aggiuntiva
      if (scheda.description) {
        const p = document.createElement('p');
        p.textContent = scheda.description;
        fieldset.appendChild(p);
      }

      // Contenitore temporaneo per i checkbox-group
      let cbContainer = null;

      // ── Campi ─────────────────────────────────
      scheda.fields.forEach(field => {
        switch (field.type) {

          // Testo / Data
          case 'text':
          case 'date': {
            const wrap = document.createElement('div');
            wrap.className = 'form-group';
            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.textContent = field.label;
            const input = document.createElement('input');
            input.type = field.type;
            input.id   = field.name;
            input.name = field.name;
            if (field.required) input.required = true;
            wrap.append(label, input);
            fieldset.appendChild(wrap);
          } break;

          // Textarea
          case 'textarea': {
            const wrap = document.createElement('div');
            wrap.className = 'form-group';
            const label = document.createElement('label');
            label.setAttribute('for', field.name);
            label.textContent = field.label;
            const ta = document.createElement('textarea');
            ta.id   = field.name;
            ta.name = field.name;
            ta.rows = field.rows || 3;
            wrap.append(label, ta);
            fieldset.appendChild(wrap);
          } break;

          // Array di input testo
          case 'text-array': {
            const wrap = document.createElement('div');
            wrap.className = 'form-group';
            const label = document.createElement('label');
            label.textContent = field.label;
            wrap.appendChild(label);
            const grid = document.createElement('div');
            grid.className = 'grid-inputs';
            for (let i = 1; i <= field.count; i++) {
              const inp = document.createElement('input');
              inp.type        = 'text';
              inp.name        = `${field.name}_${i}`;
              inp.placeholder = `${i}.`;
              grid.appendChild(inp);
            }
            wrap.appendChild(grid);
            fieldset.appendChild(wrap);
          } break;

          // Immagine
          case 'image': {
            const wrap = document.createElement('div');
            wrap.className = 'image-container';
            const img = document.createElement('img');
            img.src = field.src;
            img.alt = field.alt || '';
            wrap.appendChild(img);
            fieldset.appendChild(wrap);
          } break;

          // Mappa Cytoscape
          case 'map': {
            const wrap = document.createElement('div');
            wrap.className = 'map-section';
            const cyDiv = document.createElement('div');
            cyDiv.id = field.cyId;
            wrap.appendChild(cyDiv);
            const ctrl = document.createElement('div');
            ctrl.id = field.controlsId;
            const h3 = document.createElement('h3');
            h3.textContent = 'Pannello di Controllo';
            const inner = document.createElement('div');
            inner.id = 'controls-content';
            ctrl.append(h3, inner);
            wrap.appendChild(ctrl);
            fieldset.appendChild(wrap);
          } break;

          // Details
          case 'details': {
            const details = document.createElement('details');
            details.className = 'suggestions-container';
            const sum = document.createElement('summary');
            sum.textContent = field.summary;
            const div = document.createElement('div');
            div.innerHTML = field.html;
            details.append(sum, div);
            fieldset.appendChild(details);
          } break;

          // Text instruction
          case 'instruction': {
            const p = document.createElement('p');
            p.className = 'instruction-text';
            p.textContent = field.text;
            fieldset.appendChild(p);
          } break;

          // Checkbox group
          case 'checkbox-group': {
            if (!cbContainer) {
              cbContainer = document.createElement('div');
              cbContainer.className = 'autovalutazione-container';
            }
            const cat = document.createElement('div');
            cat.className = 'lavoro-categoria';
            const h5 = document.createElement('h5');
            h5.textContent = field.label;
            const cbg = document.createElement('div');
            cbg.className = 'checkbox-group';
            field.options.forEach(opt => {
              const lbl = document.createElement('label');
              const inp = document.createElement('input');
              inp.type = 'checkbox';
              inp.name = opt.value;
              inp.value = opt.value;
              inp.dataset.category = field.name;
              lbl.append(inp, ` ${opt.label}`);
              cbg.appendChild(lbl);
            });
            cat.append(h5, cbg);
            cbContainer.appendChild(cat);
          } break;

          // Score summary
          case 'score-summary': {
            if (cbContainer) {
              fieldset.appendChild(cbContainer);
              cbContainer = null;
            }
            const tbl = document.createElement('table');
            tbl.className = 'score-summary-table';
            const tb = document.createElement('tbody');
            const cats = field.categories;
            const labels = {
              gente: 'LAVORARE CON LA GENTE',
              dati:  'LAVORARE CON I DATI',
              idee:  'LAVORARE CON LE IDEE',
              cose:  'LAVORARE CON LE COSE'
            };
            // riga 1 (0 e 2)
            const r1 = document.createElement('tr');
            [0, 2].forEach(idx => {
              const tdL = document.createElement('td');
              tdL.textContent = labels[cats[idx]] + ':';
              const tdS = document.createElement('td');
              const sp  = document.createElement('span');
              sp.id = field.scoreIds[cats[idx]];
              sp.textContent = '0';
              tdS.appendChild(sp);
              r1.append(tdL, tdS);
            });
            // riga 2 (1 e 3)
            const r2 = document.createElement('tr');
            [1, 3].forEach(idx => {
              const tdL = document.createElement('td');
              tdL.textContent = labels[cats[idx]] + ':';
              const tdS = document.createElement('td');
              const sp  = document.createElement('span');
              sp.id = field.scoreIds[cats[idx]];
              sp.textContent = '0';
              tdS.appendChild(sp);
              r2.append(tdL, tdS);
            });
            tb.append(r1, r2);
            tbl.appendChild(tb);
            fieldset.appendChild(tbl);
          } break;

          default:
            console.warn('Tipo non gestito da renderer:', field.type);
        }
      });

      // Se rimane un checkbox-container aperto
      if (cbContainer) {
        fieldset.appendChild(cbContainer);
        cbContainer = null;
      }

      // Aggiungo il fieldset al container
      container.appendChild(fieldset);
    });

    // Pulsante Submit
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'submit-btn';
    btn.textContent = 'Invia e Salva i Dati';
    container.appendChild(btn);
  } // ← chiude function renderForm

  // espongo globalmente
  window.renderForm = renderForm;

})(); // ← chiude l’IIFE
