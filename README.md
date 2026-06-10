# Inchiostro UV

PWA di steganografia testuale: nasconde un messaggio dentro un testo dall'aspetto
normale usando caratteri Unicode a larghezza zero (`U+200B`, `U+200C`), con cifratura
opzionale **AES-256-GCM** (chiave derivata con PBKDF2, 150k iterazioni).

Tutto gira **lato client**: nessun dato lascia il dispositivo, nessun backend, nessuna
dipendenza esterna. Funziona offline una volta installata.

## File

```
index.html          l'app (funziona anche aperta da sola, doppio click)
manifest.json       configurazione PWA (installabile)
service-worker.js   cache offline
icons/              icone PWA (192, 512 maskable, apple-touch, favicon)
```

## Pubblicarla — 3 strade (dalla più veloce)

Sono tutti **siti statici**: basta servire la cartella. Niente build, niente Node.

### 1. Netlify Drop — la più veloce (nessun account git, ~30 secondi)
1. Vai su https://app.netlify.com/drop
2. Trascina l'intera cartella `stego-app` nella pagina.
3. Ottieni subito un link `https://nome-random.netlify.app`. Fatto.

> Ideale se vuoi solo un link condivisibile in fretta. Per un dominio fisso fai login
> (anche con account GitHub) e rinomina il sito.

### 2. GitHub Pages — la più "tua" (link tied al repo, gratis, permanente)
Richiede un account GitHub e git installato. Dalla cartella `stego-app`:

```bash
git init
git add .
git commit -m "Inchiostro UV — stego PWA"
git branch -M main
# crea prima un repo vuoto su github.com, poi:
git remote add origin https://github.com/TUO-UTENTE/inchiostro-uv.git
git push -u origin main
```

Poi su GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
Dopo un minuto l'app è online su `https://TUO-UTENTE.github.io/inchiostro-uv/`.

> Nota: per HTTPS e service worker GitHub Pages va benissimo. Il path è sotto
> sottocartella, ma il manifest usa percorsi relativi, quindi funziona senza modifiche.

### 3. Cloudflare Pages / Vercel — CDN globale, deploy da repo
Dopo aver fatto il push su GitHub (passo 2):
- **Cloudflare Pages**: https://pages.cloudflare.com → Connect to Git → seleziona il repo →
  build command vuoto, output dir `/` (root) → Deploy.
- **Vercel**: https://vercel.com/new → importa il repo → framework "Other" → Deploy.

Entrambi danno un link HTTPS e ridistribuiscono a ogni `git push`.

## Requisiti PWA
- L'installazione e l'offline richiedono **HTTPS** (Netlify/Pages/Cloudflare/Vercel lo danno
  in automatico). In locale puoi testare con `python3 -m http.server` su `http://localhost`.
- Aperta come file singolo (`file://`) l'app **funziona comunque**: solo il service worker
  e il pulsante "Installa" restano disattivati.

## Sicurezza (promemoria)
La steganografia **occulta**, non garantisce riservatezza: i caratteri a larghezza zero sono
rilevabili e spesso rimossi da sanitizzatori HTML, normalizzazione NFKC e molti DLP/WAF.
Per confidenzialità reale usa **sempre** la passphrase (AES-GCM): il tag di autenticazione
fa fallire l'estrazione se la chiave è errata o i dati sono stati manomessi.
