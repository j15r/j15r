# 旅 Japan-Reiseblog

Ein schlichter Reiseblog für Familie und Freunde für unsere dreiwöchige Rundreise durch Japan.
Er braucht keine Datenbank und kein Programmieren: Beiträge sind Textdateien, Fotos liegen in einem Ordner.

**Das kann die Seite:**

- Countdown bis zum Abflug, während der Reise „Tag X von 21“ und die aktuelle Station
- Uhrzeit in Japan in der Kopfzeile
- Interaktive Karte mit der Route und eine Zeitleiste aller Stationen
- Reisetagebuch mit Filter nach Station
- Fotos lassen sich per Klick groß anzeigen
- Passt sich an Handy, Tablet und Dunkelmodus an

## Aufbau

```
index.html          Die Seite selbst
js/config.js        ← Reisedaten, Titel und Route anpassen
js/app.js           Logik (muss nicht angefasst werden)
css/style.css       Design
posts/              ← Hier kommen die Beiträge hin
posts/index.json    ← Liste aller Beiträge, die angezeigt werden
posts/_VORLAGE.md   Vorlage für neue Beiträge
bilder/             ← Fotos
```

## 1. Reise einstellen

In `js/config.js` anpassen:

- `titel`, `untertitel`, `autoren`, `ueberUns`
- `start`: erster Reisetag, z. B. `"2027-04-01"`
- `stationen`: die Route. `von`/`bis` sind Reisetage (Tag 1 = Startdatum).
  Die Koordinaten (`lat`/`lng`) findest du z. B. per Rechtsklick in Google Maps.

## 2. Neuen Beitrag schreiben

1. `posts/_VORLAGE.md` kopieren und umbenennen, z. B. `posts/2027-04-03-erster-tag-in-tokio.md`
2. Oben Titel, Datum und Station eintragen:
   ```
   ---
   titel: Erster Tag in Tokio
   datum: 2027-04-03
   station: tokio
   titelbild: bilder/tokio/shibuya.jpg
   ---
   ```
   `station` ist die `id` aus `js/config.js`. `titelbild` und `teaser` sind optional.
3. Darunter den Text in [Markdown](https://www.markdownguide.org/basic-syntax/) schreiben.
4. Den Dateinamen in `posts/index.json` ergänzen:
   ```json
   [
     "2027-04-03-erster-tag-in-tokio.md",
     "2026-09-24-bald-geht-es-los.md"
   ]
   ```
5. Committen und pushen – fertig. Die Beiträge werden automatisch nach Datum sortiert.

**Von unterwegs vom Handy aus:** Das geht direkt auf github.com oder in der GitHub-App:
Datei im Ordner `posts/` anlegen („Add file → Create new file“), Fotos über „Add file → Upload files“
in `bilder/` hochladen, danach `posts/index.json` bearbeiten.

**Fotos:** Vorher auf ca. 1600 px Breite verkleinern, damit die Seite schnell lädt
(Handy-Fotos haben oft 5 MB und mehr).

## 3. Lokal ansehen

Weil die Beiträge nachgeladen werden, muss die Seite über einen kleinen Webserver geöffnet werden
(ein Doppelklick auf `index.html` reicht nicht):

```bash
python3 -m http.server 8000
```

Dann <http://localhost:8000> im Browser öffnen.

## 4. Veröffentlichen mit GitHub Pages

1. Auf GitHub im Repository: **Settings → Pages**
2. Unter „Build and deployment“: Source **Deploy from a branch**, Branch `main` (bzw. dein Branch), Ordner `/ (root)`
3. Nach ein bis zwei Minuten ist der Blog unter `https://<benutzername>.github.io/<repository>/` erreichbar.
   Diesen Link an Familie und Freunde schicken.

> **Hinweis zur Privatsphäre:** Eine GitHub-Pages-Seite ist öffentlich – jeder mit dem Link kann sie sehen,
> und bei kostenlosen Konten muss dafür auch das Repository öffentlich sein. Also keine Adressen,
> Hotelnamen während des Aufenthalts oder andere sensible Infos posten.
