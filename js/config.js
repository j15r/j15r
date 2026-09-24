/*
 * ==========================================================
 *  REISE-EINSTELLUNGEN
 *  Hier passt du alles an, was die Reise selbst betrifft:
 *  Titel, Reisedaten und die Stationen der Route.
 * ==========================================================
 */
window.REISE = {
  titel: "Japan & Singapur",
  untertitel: "Knapp drei Wochen unterwegs – von Tokio über Izu, Hakone und den Fuji nach Kyoto und Osaka, zum Abschluss nach Singapur.",

  // Wer schreibt? Erscheint im Footer.
  autoren: "Wir",

  // Erster Reisetag (Ankunft in Japan) im Format JJJJ-MM-TT.
  start: "2026-10-04",

  // Kurzer Text für den Abschnitt „Über uns“.
  ueberUns:
    "Hallo ihr Lieben! Hier halten wir euch während unserer Reise durch Japan und Singapur auf dem Laufenden – " +
    "mit Geschichten, Fotos und allem, was wir unterwegs erleben. Schaut regelmäßig vorbei!",

  /*
   * Stationen der Route in Reihenfolge.
   *  id        – kurzer Name ohne Leerzeichen, wird in Beiträgen unter „station:“ verwendet
   *  name      – Anzeigename
   *  kanji     – japanische Schreibweise (Deko)
   *  von/bis   – Reisetage (Tag 1 = Startdatum)
   *  lat/lng   – Koordinaten für die Karte
   *  info      – kurze Beschreibung, was geplant ist
   *  ausfluege – optional: Tagesausflüge, erscheinen als kleine Punkte auf der Karte
   *  zeitzone  – optional: für die Uhr oben rechts (Standard: Japan)
   *  fernziel  – optional: liegt weit weg, die Karte zeigt beim Start nur den Rest
   */
  stationen: [
    {
      id: "tokio", name: "Tokio", kanji: "東京", von: 1, bis: 5,
      lat: 35.6812, lng: 139.7671,
      info: "Ankunft in Haneda. Senso-ji, Shibuya Crossing und Shibuya Sky, Meiji-Schrein, Tokyo Tower, teamLab Planets und Akihabara bei Nacht.",
      ausfluege: [
        { name: "Nikko", lat: 36.7580, lng: 139.5989, info: "Tagesausflug: UNESCO-Tempel, Kegon-Wasserfall, Chuzenji-See" },
        { name: "Kamakura", lat: 35.3192, lng: 139.5467, info: "Tagesausflug: Großer Buddha, Hasedera, Bambuswald im Hokokuji" }
      ]
    },
    {
      id: "izu", name: "Izu-Halbinsel", kanji: "伊豆", von: 6, bis: 7,
      lat: 34.7540, lng: 138.8500,
      info: "Mit dem Mietwagen die Küste entlang: Irozaki-Leuchtturm, Bootstour in Dogashima, Lover's Cape und Sonnenuntergang in Koganezaki."
    },
    {
      id: "hakone", name: "Hakone & Fuji", kanji: "富士", von: 8, bis: 10,
      lat: 35.2044, lng: 139.0251,
      info: "Owakudani mit schwarzen Eiern, Torii im Ashi-See, Chureito-Pagode am Morgen und der „1000-Yen-Blick“ am Motosu-See.",
      ausfluege: [
        { name: "Kawaguchiko", lat: 35.5171, lng: 138.7519, info: "Chureito-Pagode, Oishi-Park, Motosu-See" }
      ]
    },
    {
      id: "kyoto", name: "Kyoto", kanji: "京都", von: 11, bis: 15,
      lat: 35.0116, lng: 135.7681,
      info: "Fushimi Inari, Gion, Kiyomizu-dera am frühen Morgen, Arashiyama, der goldene Pavillon, Kurama & Kibune und Matcha in Uji.",
      ausfluege: [
        { name: "Uji", lat: 34.8893, lng: 135.8077, info: "Byodo-in und Matcha" },
        { name: "Nara", lat: 34.6851, lng: 135.8430, info: "Option für den vierten Tag: Todaiji und Rehe" }
      ]
    },
    {
      id: "osaka", name: "Osaka", kanji: "大阪", von: 16, bis: 17,
      lat: 34.6937, lng: 135.5023,
      info: "Neonlichter in Dotonbori, Takoyaki, Kushikatsu in Shinsekai, Umeda Sky Building – und ein Tag bei der Burg Himeji.",
      ausfluege: [
        { name: "Himeji", lat: 34.8394, lng: 134.6939, info: "Burg Himeji und Koko-en-Garten" }
      ]
    },
    {
      id: "singapur", name: "Singapur", kanji: "星港", von: 18, bis: 20,
      lat: 1.2834, lng: 103.8607, zeitzone: "Asia/Singapore", fernziel: true,
      info: "Gardens by the Bay, Marina Bay Sands, Lichtshows am Abend, Chinatown, Kampong Glam, Sentosa – und zum Schluss das Jewel am Flughafen."
    }
  ]
};
