# guter-cfd-broker.de

Statischer Informations- und Vergleichsguide zu CFD Brokern in Deutschland (2026). Single-Page-Site, kein Build-Step, kein Framework — reines HTML/CSS/JS.

## Projektstruktur

```
/
├── index.html                              Startseite (Hub)
├── was-sind-cfds.html                      Interne Seite
├── cfd-broker-regulierung-bafin.html       Interne Seite
├── cfd-broker-kosten-vergleich.html        Interne Seite
├── cfd-broker-ausfuehrungsmodelle.html     Interne Seite
├── cfd-trade-kosten-berechnen.html         Interne Seite (inkl. Margin-Rechner)
├── cfd-overnight-kosten-swap.html          Interne Seite
├── cfd-vs-etf-kostenvergleich.html         Interne Seite
├── cfd-broker-ohne-mindesteinzahlung.html  Interne Seite
├── cfd-demokonto-broker-testen.html        Interne Seite
├── cfd-gewinne-versteuern.html             Interne Seite
├── assets/
│   ├── style.css        Gemeinsames Design-System (Tokens, Komponenten, Responsive)
│   ├── app.js           Sticky Header, Fade-in, Smooth Scroll, FAQ-Akkordeon, Nav-State
│   ├── ticker.js         Live-Kurs-Ticker (nur Startseite)
│   └── calculator.js     Margin-Rechner (Startseite + Trade-Kosten-Seite)
├── content.md           Markdown-Version des Startseiten-Inhalts
├── llms.txt              Kurzbeschreibung für LLM-Crawler
├── robots.txt
├── sitemap.xml           11 URLs: Startseite + 10 interne Landingpages
├── favicon.svg
├── netlify.toml          Netlify-Build- und Header-Konfiguration
├── prompts/              Ursprüngliche Erstellungs-Prompts (Referenz, nicht Teil des Deploys)
└── README.md
```

Insgesamt **11 Seiten**: die Startseite (Hub mit Vergleich, Regulierung, Kosten, Rechner, FAQ) plus 10 eigenständige interne Landingpages, die in Navigation, Footer, dem "Weitere Themen"-Grid der Startseite sowie `sitemap.xml`/`llms.txt` verlinkt sind. Jede interne Seite hat eigenes `<title>`/`meta description`/Canonical, WebPage- und BreadcrumbList-Schema sowie (wo passend) FAQPage-Schema.

Es handelt sich um eine reine Static-Site: Netlify braucht **keinen Build-Befehl**, es wird lediglich das Root-Verzeichnis als `publish`-Ordner ausgeliefert (siehe `netlify.toml`). Cleane URLs ohne `.html`-Endung (z. B. `/was-sind-cfds`) funktionieren auf Netlify automatisch, da Netlify `<name>.html` transparent unter `/<name>` ausliefert ("Pretty URLs") — dafür ist keine zusätzliche Redirect-Konfiguration nötig.

## Voraussetzungen

- Ein [GitHub](https://github.com)-Konto (oder GitLab/Bitbucket)
- Ein [Netlify](https://netlify.com)-Konto
- [Git](https://git-scm.com/downloads) lokal installiert

## 1. Lokales Git-Repository initialisieren

Im Projektordner ausführen:

```bash
git init
git add .
git commit -m "Initial commit: guter-cfd-broker.de"
```

## 2. Repository auf GitHub anlegen und pushen

1. Auf GitHub ein neues, leeres Repository erstellen (z. B. `guter-cfd-broker-de`) — **ohne** README/`.gitignore` beim Anlegen, da diese bereits lokal existieren.
2. Remote verbinden und pushen:

```bash
git remote add origin https://github.com/<dein-user>/guter-cfd-broker-de.git
git branch -M main
git push -u origin main
```

## 3. Mit Netlify verbinden (Deploy via Git)

1. In Netlify einloggen → **Add new site → Import an existing project**.
2. GitHub als Git-Provider auswählen und das Repository `guter-cfd-broker-de` autorisieren/auswählen.
3. Build-Einstellungen:
   - **Build command:** leer lassen
   - **Publish directory:** `.` (Root)
   - Diese Werte werden automatisch aus `netlify.toml` übernommen.
4. **Deploy site** klicken. Netlify baut und veröffentlicht die Seite unter einer `*.netlify.app`-Subdomain.

Ab diesem Zeitpunkt löst jeder `git push` auf den `main`-Branch automatisch ein neues Deployment aus (Continuous Deployment).

## 4. Eigene Domain verbinden

1. In Netlify: **Site configuration → Domain management → Add a domain** → `guter-cfd-broker.de` eintragen.
2. Beim Domain-Registrar die von Netlify angezeigten DNS-Einträge setzen:
   - Entweder Nameserver auf Netlify DNS umstellen, **oder**
   - einen `A`-Record auf die Netlify-Load-Balancer-IP sowie einen `CNAME` für `www` auf `<sitename>.netlify.app` setzen (genaue Werte werden im Netlify-Dashboard angezeigt).
3. Netlify stellt automatisch ein kostenloses SSL-Zertifikat (Let's Encrypt) aus, sobald die DNS-Propagierung abgeschlossen ist.

## 5. Nach dem Deploy prüfen

- [ ] `https://guter-cfd-broker.de/` lädt die Startseite fehlerfrei
- [ ] Alle 10 internen Seiten laden unter ihrer cleanen URL (z. B. `https://guter-cfd-broker.de/was-sind-cfds`, ohne `.html`)
- [ ] `https://guter-cfd-broker.de/robots.txt` und `/sitemap.xml` sind erreichbar
- [ ] `https://guter-cfd-broker.de/content.md` und `/llms.txt` sind erreichbar
- [ ] Favicon wird im Browser-Tab angezeigt
- [ ] Live-Ticker aktualisiert sich (Frankfurter API, Fallback-Simulation bei API-Ausfall) — nur Startseite
- [ ] Margin-Rechner liefert plausible Werte — Startseite und `/cfd-trade-kosten-berechnen`
- [ ] FAQ-Akkordeon öffnet/schließt korrekt auf allen Seiten mit FAQ-Block
- [ ] Alle CTA-Buttons verlinken auf `https://libertex.com/de/`
- [ ] Interne Verlinkung stichprobenartig geklickt (Header-Nav, Footer, "Weitere Themen"-Grid, "Weiterführende Themen" je Artikel)
- [ ] Google Search Console: Property anlegen und `sitemap.xml` einreichen

## Wartung

- Änderungen lokal vornehmen → `git add . && git commit -m "..." && git push` → Netlify deployt automatisch neu.
- Bei Domainwechsel oder URL-Änderungen: `canonical`-Tag in **jeder** HTML-Datei sowie `sitemap.xml`, `robots.txt` und `llms.txt` konsistent aktualisieren.
- Design-/Layout-Änderungen zentral in `assets/style.css` vornehmen — sie gelten dann automatisch für alle 11 Seiten.

## Compliance-Hinweis

Der Inhalt unterliegt strengen Compliance-Vorgaben für CFD-Werbung in der EU (ESMA/BaFin): kein Anlageberatungs-Ton, verpflichtender Risikohinweis bei jeder Erwähnung von Hebelwirkung, keine Kostenangaben ohne den Zusatz „brokerabhängig". Änderungen am Content sollten diese Regeln beibehalten (siehe `prompts/prompt-01-structure-content.md`, Abschnitt „Compliance-Regeln").
