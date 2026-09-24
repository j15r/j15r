/*
 * ==========================================================
 *  REISE-EINSTELLUNGEN
 *  Hier passt du alles an, was die Reise selbst betrifft:
 *  Titel, Reisedaten und die Stationen der Route.
 * ==========================================================
 */
window.REISE = {
  titel: "Unsere Japan-Reise",
  untertitel: "Drei Wochen quer durch Japan – von Tokio über die Japanischen Alpen bis nach Hiroshima.",

  // Wer schreibt? Erscheint im Footer und im Abschnitt „Über uns“.
  autoren: "Wir",

  // Erster Reisetag (Ankunft in Japan) im Format JJJJ-MM-TT.
  start: "2027-04-01",

  // Kurzer Text für den Abschnitt „Über uns“.
  ueberUns:
    "Hallo ihr Lieben! Hier halten wir euch während unserer drei Wochen in Japan auf dem Laufenden – " +
    "mit Geschichten, Fotos und allem, was wir unterwegs erleben. Schaut regelmäßig vorbei!",

  /*
   * Stationen der Route in Reihenfolge.
   *  id      – kurzer Name ohne Leerzeichen, wird in Beiträgen unter „station:“ verwendet
   *  name    – Anzeigename
   *  kanji   – japanische Schreibweise (Deko)
   *  von/bis – Reisetage (Tag 1 = Startdatum)
   *  lat/lng – Koordinaten für die Karte
   *  info    – kurze Beschreibung, was geplant ist
   */
  stationen: [
    {
      id: "tokio", name: "Tokio", kanji: "東京", von: 1, bis: 5,
      lat: 35.6812, lng: 139.7671,
      info: "Shibuya, Asakusa, Shinjuku und ganz viel Streetfood – Ankommen im Großstadtdschungel."
    },
    {
      id: "hakone", name: "Hakone", kanji: "箱根", von: 6, bis: 7,
      lat: 35.2324, lng: 139.1069,
      info: "Onsen, Ryokan-Übernachtung und hoffentlich ein Blick auf den Fuji."
    },
    {
      id: "takayama", name: "Takayama", kanji: "高山", von: 8, bis: 9,
      lat: 36.1461, lng: 137.2522,
      info: "Altstadt aus der Edo-Zeit, Morgenmärkte und ein Abstecher nach Shirakawa-gō."
    },
    {
      id: "kanazawa", name: "Kanazawa", kanji: "金沢", von: 10, bis: 11,
      lat: 36.5613, lng: 136.6562,
      info: "Kenroku-en-Garten, Samurai-Viertel und Blattgold auf allem."
    },
    {
      id: "kyoto", name: "Kyoto", kanji: "京都", von: 12, bis: 16,
      lat: 35.0116, lng: 135.7681,
      info: "Tempel, Schreine, Bambuswald – plus ein Tagesausflug zu den Hirschen in Nara."
    },
    {
      id: "osaka", name: "Osaka", kanji: "大阪", von: 17, bis: 18,
      lat: 34.6937, lng: 135.5023,
      info: "Dōtonbori, Takoyaki und Okonomiyaki – Japans Küche der Herzen."
    },
    {
      id: "hiroshima", name: "Hiroshima & Miyajima", kanji: "広島", von: 19, bis: 20,
      lat: 34.3853, lng: 132.4553,
      info: "Friedenspark und das schwimmende Torii von Itsukushima."
    },
    {
      id: "rueckreise", name: "Tokio & Heimreise", kanji: "帰国", von: 21, bis: 21,
      lat: 35.5494, lng: 139.7798,
      info: "Mit dem Shinkansen zurück nach Tokio und ab nach Hause."
    }
  ]
};
