---
# UberApp

UberApp ist eine Webanwendung, die es Schülern ermöglicht, Fahrgemeinschaften für den Schulweg zu organisieren. Sie können sich anmelden, Fahrten anbieten, suchen und verwalten, sowie an Fahrten teilnehmen oder diese verlassen.
---

## Inhaltsverzeichnis

1. [Installation](#installation)
2. [Verwendung](#verwendung)
3. [Features](#features)

---

## Installation

### **Voraussetzungen**

Um das Projekt zu installieren und zu starten, benötigst du folgende Software:

- Supabase CLI
- Docker
- Node.js

### **Installationsschritte**

1. Klone das Repository:

   ```bash
   git clone https://github.com/dein-benutzername/uberapp.git
   cd uberapp
   ```

2. Installiere die Abhängigkeiten:

   ```bash
   npm i
   # oder
   npm i --legacy-peer-deps   # works best
   ```

3. Starte den Supabase-Dienst in Docker (dies dauert etwa 10 Minuten):

   ```bash
   supabase start
   ```

4. Lade die Nominatim-Datenbank in Docker:

   ```bash
   docker-compose -f docker-compose-nominatim.yml up nominatim
   ```

   > **Hinweis:** Überprüfe in Docker den Container mit dem Namen `nominatim`, und warte, bis in der Konsole "finished" angezeigt wird. Dies kann bis zu 2 Stunden dauern.

5. Führe anschließend Migrationen durch:
   ```bash
   # hier Migration-Befehl einfügen, falls relevant
   ```

---

## Verwendung

### **Entwicklungsserver starten**

1. Starte den Entwicklungsserver:

   ```bash
   npm run dev # i used this
   # oder
   yarn dev
   # oder
   pnpm dev
   # oder
   bun dev
   ```

2. Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser, um die App zu nutzen.

### **Produktionsserver starten**

1. Baue das Projekt für die Produktion:

   ```bash
   npm run build # i used this
   # oder
   yarn build
   # oder
   pnpm build
   # oder
   bun build
   ```

2. Starte anschließend den Produktionsserver:
   ```bash
   npm start
   ```

---

## Features

- **Anmeldung und Registrierung**: Nutzer können sich anmelden oder ein Konto erstellen.
- **Fahrten anbieten und suchen**: Schüler können Fahrten erstellen und nach vorhandenen Fahrgemeinschaften suchen.
- **Fahrtenverwaltung**: Fahrten können bearbeitet oder gelöscht werden.
- **Teilnahme an Fahrten**: Nutzer können sich für Fahrten anmelden oder abmelden.

---
