# Rubrica automatica castelgandolfo.eu — istruzioni operative

## Ruolo
Ad ogni esecuzione (ogni 4 giorni), pubblichi 1 nuovo articolo del blog di castelgandolfo.eu.

## Passi (nell'ordine esatto)

### 1. Leggi il backlog
```
read /home/user/workspace/castel-gandolfo-site/blog-backlog.json
```
Scegli il primo item della `queue` il cui slug NON è in `published_slugs`.

Se il primo item della coda ha una categoria uguale all'ultimo articolo pubblicato (guarda `published_slugs` per capire la categoria dell'ultimo), salta al successivo per garantire rotazione tra le 4 categorie. Rotazione ideale: storia → attualita → guida → focus → storia...

### 2. Genera l'immagine hero
Usa `asi-generate-image` con il campo `image_prompt` dal backlog item. Salva come `blog-<slug>.png` in `/home/user/workspace/`, poi spostala in `castel-gandolfo-site/assets/images/`.

**Palette obbligatoria del sito:** warm, editorial, terracotta #B4441F, cream #F5EEDD, sage/lake teal #1F5F73, ink #2A1F14. Formato 16:9. Modello: `nano_banana_2`.

### 3. Scrivi l'articolo IT
Crea `/home/user/workspace/castel-gandolfo-site/blog/<slug>.html` seguendo ESATTAMENTE la struttura del template `ritorno-papa-leone-xiv.html`. Lunghezza: 700-900 parole, 4-5 paragrafi con 2-3 sottotitoli h2, 1 pull-quote opzionale.

**CRITICO — Script JS:** NON scrivere script inline. Includi SOLO `<script src="../app.js" defer></script>` prima di `</body>`. Il file `app.js` gestisce reveal (classe `.in-view`, non `.is-visible`), theme toggle e menu mobile. Uno script inline sbagliato rende invisibile TUTTO il contenuto (`.reveal { opacity: 0 }`). EN mirror usa `../../app.js`.

**Regole redazionali:**
- Tono editoriale colto ma accessibile, in italiano
- Cita fatti verificabili (date, numeri, nomi)
- Aggiungi link markdown a fonti autorevoli (Wikipedia, Ville Pontificie, Vatican News, Comune)
- Includi 2-3 CTA a fine articolo verso altre pagine del sito
- Metadata: title, description (155-160 char), Cormorant Garamond + Inter, base.css + style.css
- Path immagine: `../assets/images/blog-<slug>.png`
- Language switch link: `../en/blog/<slug-en>.html` (usa lo stesso slug della versione EN)

Il link alla versione EN va aggiornato allo slug inglese equivalente (di solito lo slug italiano tradotto, es: `criptoportico-domiziano-segreto` → `domitians-cryptoporticus-secret`).

### 4. Scrivi la versione EN
Crea `/home/user/workspace/castel-gandolfo-site/en/blog/<slug-en>.html` traducendo l'articolo IT. Path immagine: `../../assets/images/blog-<slug>.png`. Path CSS: `../../base.css` e `../../style.css`. Link IT: `../../blog/<slug-it>.html`.

### 5. Aggiungi la card in blog.html
Apri `castel-gandolfo-site/blog.html` e inserisci una nuova `<a class="feature-card">` come PRIMO figlio di `<div class="feature-grid reveal">`. Struttura:

```html
<a href="./blog/<slug>.html" class="feature-card" style="text-decoration:none; color:inherit">
  <div class="feature-media"><img src="./assets/images/blog-<slug>.png" alt="<alt breve>" loading="lazy" /></div>
  <div class="feature-body">
    <span class="feature-cat"><cat_label></span>
    <h3><titolo>. <subtitolo></h3>
    <p><hook_it in prosa, 25-35 parole></p>
    <div class="feature-meta"><span><reading_min> minuti di lettura</span><span><mese abbreviato IT> 2026</span></div>
  </div>
</a>
```

### 6. Aggiungi la card in en/blog.html
Stessa cosa in inglese usando i campi `title_en`, `subtitle_en`, `hook_en`, `cat_label` tradotto.

### 7. Aggiorna il backlog
Aggiungi lo slug pubblicato all'array `published_slugs` di `blog-backlog.json`. Sposta l'item dalla queue in fondo (o rimuovilo se hai già usato quello slug).

### 8. Commit + push
```
cd /home/user/workspace/castel-gandolfo-site
git add -A
git -c user.name="Alioscia Pericoli" -c user.email="aliosciapericoli@gmail.com" commit -m "blog: nuovo articolo — <titolo>"
git push origin main
```
Usa `api_credentials=["github"]` per il push.

### 9. Verifica live e notifica
Attendi 50 secondi, poi:
```
curl -sILk https://castelgandolfo.eu/blog/<slug>.html | head -3
```
Se torna HTTP 200, manda notifica in-app all'utente con titolo, URL diretto all'articolo, e schedule_description="Ogni 4 giorni · rubrica automatica".

### 10. Se il backlog scende sotto 5 item
Genera automaticamente 20 nuove idee coerenti con la stagionalità del mese in corso e aggiungile alla queue (mantieni bilanciamento 4 categorie). Salva il file.

## Cosa NON fare
- NON pubblicare un articolo con slug già in `published_slugs`
- NON generare immagini con testo sovraimpresso (nano_banana_2 spesso allucina scritte)
- NON usare emoji nell'HTML o nei titoli
- NON usare asterischi markdown italic
- NON pubblicare se qualunque step fallisce: notifica l'errore e fermati
