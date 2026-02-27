# 🌟 Förbättringsrapport — Autismappar PWA

> *"Vi ska tillsammans göra de bästa apparna för barnen som har fått en liten svår start i livet"*

## ✅ Genomfört: Välkomstdialoger

### Vad som implementerades
- **WelcomeDialog-komponent** (`src/lib/components/WelcomeDialog.svelte`) — en återanvändbar Svelte-komponent
- **Tillagd i alla 42 appar** med individuellt anpassat innehåll
- **Tre sektioner per app:**
  - 🎯 *Vad är detta?* — Beskriver appens syfte och målgrupp
  - ❓ *Hur fungerar det?* — Kort användarguide
  - 💡 *Mål och syfte* — Pedagogiskt/terapeutiskt mål
- **Visa bara vid första start** — sparas i `localStorage` per app
- **"Visa inte igen"-kryssruta** — permanent avvisning
- **Fullt översatt** — svenska (med NPF/IF-terminologi) och engelska
- **Mörkt läge-stöd** och responsiv design
- **Tillgänglig** — `role="dialog"`, `aria-modal`, `aria-label`

### Terminologi
All svensk text använder korrekt terminologi:
- **NPF** (neuropsykiatrisk funktionsnedsättning) — inte "autism" ensamt
- **IF** (intellektuell funktionsnedsättning) — inte "utvecklingsstörning"
- **Språkstörning** — när relevant
- **ADHD** — vid fokus/uppmärksamhetsappar

---

## 🖼️ PECS-inspirerade funktioner — Forskningsrapport & Idéer

### Bakgrund: Vad är PECS?
PECS (Picture Exchange Communication System) är ett evidensbaserat AKK-system med 6 faser:
1. **Fas I — Fysiskt utbyte**: Barnet ger EN bild till en partner för att få önskat
2. **Fas II — Avstånd & uthållighet**: Barnet lär sig gå till tavlan, hitta bilden, gå till partnern
3. **Fas III — Bildurskiljning**: Välja rätt bild bland flera
4. **Fas IV — Meningsremsa**: "Jag vill" + önskat objekt på en remsa
5. **Fas V — Svara på frågor**: "Vad vill du ha?"
6. **Fas VI — Kommentera**: "Jag ser", "Jag hör", "Jag känner"

### Vad vi redan har
- ✅ **Talk Board** — Kärnvokabulär, LAMP-positioner, Fitzgerald Key-färger, meningsremsa
- ✅ **PECS Board** — Kategoriserade bildkort (behov, känslor, aktiviteter) med meningsremsa
- ✅ **PECS Trainer** — Träning av bildutbyte
- ✅ **Phrase Builder** — Bygg meningar med piktogram
- ✅ **Point Talk** — Stödd språkstimulering

### 💡 NYA PECS-inspirerade funktioner att bygga

#### 1. **Meningsremse-verkstad** (Sentence Strip Workshop)
*PECS Fas IV-VI digital implementation*
- Visuell "Jag vill" + objekt-remsa (fas IV)
- Utöka med "Jag ser/hör/känner" (fas VI)
- Barnet drar bilder till remsan i rätt ordning
- Remsan kan skrivas ut eller delas med pedagog
- **Färgkodad grammatik** (Fitzgerald Key genom hela systemet)

#### 2. **Kommunikationsbok** (Digital Communication Book)
*PECS-böcker digitaliserade*
- Fliksystem med kategorier (mat, dryck, aktiviteter, platser, personer)
- Barnets EGNA bilder (kamera/foto) + ARASAAC-piktogram
- Favoriter/snabbåtkomst på första sidan
- Synkronisering mellan enheter via export/import
- **Kontextmedvetna sidor** — visa matbilder vid måltider (tidsbaserat)

#### 3. **Visuellt schema med PECS-flöde** (Visual Schedule + PECS)
*Kombination av schemaläggning och kommunikation*
- Schema med "först-sedan-sist" med PECS-bilder
- Övergångsbilder mellan aktiviteter
- Barnet kommunicerar om schemat: "Jag vill INTE [aktivitet]", "När är [aktivitet]?"
- Koppling till meningsremsa

#### 4. **Social kommunikationsträning** (PECS Social Use)
*Utöka PECS till sociala sammanhang*
- Scenario-baserad träning: "På lekplatsen", "I matsalen", "Hos doktorn"
- Rollspel med bildstöd — barnet väljer vad de vill säga
- Visuella konversationskartor (turtagning visualiserad)
- Belöningssystem kopplat till kommunikationsförsök

#### 5. **PECS Fas-tracker** (Progress Tracker)
*Spåra barnets kommunikationsutveckling*
- Pedagog/förälder loggar vilken fas barnet arbetar i
- Notera framsteg, svårigheter, framgångsrika strategier
- Visuell progressionsvy (fas 1→6)
- Exportera rapporter till specialpedagog/logoped

#### 6. **Bildutbytes-simulator** (Digital PECS Exchange)
*Fas I-III digital träning*
- Simulera utbytet digitalt med animerad partner
- Barnet drar bilden till "handen"
- Öka avstånd (fas II) genom fler skärmsteg
- Distraktorer för urskiljning (fas III)
- **OBS:** Komplement till, inte ersättning för, fysisk PECS-träning

---

## 📝 Widgit Go-inspirerade funktioner — Forskningsrapport & Idéer

### Bakgrund: Vad gör Widgit Go?
Widgit Go är en iPad-app som använder Widgit Symbols (proprietära symboler) för:
- Symbolstödd kommunikation (AAC)
- Symbolstödda aktiviteter och övningar
- Skapa visuella material med text+symbol
- Flashcards, scheman, berättelser
- Literacy-stöd (text med symboler ovanför varje ord)

### Vad vi kan göra (inspiration, inte kopiering — vi använder ARASAAC)

#### 1. **Symbolstödd text** (Symbol-Supported Reading)
*Widgit-inspirerad textläsning med bilder*
- Skriv eller klistra in text → varje ord får en ARASAAC-piktogram ovanför
- Justerbara inställningar: bara nyckelord, alla ord, eller anpassat urval
- Stöd för svenska med korrekt böjningsigenkänning
- **Perfekt för:** Hemläxor, meddelanden från skolan, recept
- Kan integreras i befintlig Sentence Builder och Word Builder

#### 2. **Visuell ordbok** (Visual Dictionary)
*Vi har Picture Dictionary — utöka den*
- Text + symbol + ljud + TAKK-tecken för varje ord
- Ordklasser markerade med Fitzgerald Key-färger
- Exempelmeningar med symbolstöd
- Temaordlistor (skola, mat, kroppen, känslor, årstider)
- Sökbar med både text och bild

#### 3. **Symbolbaserat skrivverktyg** (Symbol Writing Tool)
*Barn skriver med bild+text*
- Skriv text → se symboler i realtid
- Skapa visuella berättelser med text under varje bild
- Skriv ut eller dela som PDF
- **Stöd för elever med NPF och IF som lär sig läsa/skriva**
- Predictive text med symbolförslag

#### 4. **Flashcard-skapare** (Visual Flashcard Creator)
*Widgit-inspirerade flashcards*
- Skapa kort med bild + text + ljud
- Kategorisera i ämnen (matte-ord, engelska ord, NO-begrepp)
- Studiläge med spaced repetition
- Delbar mellan enheter/användare
- Import av ordlistor

#### 5. **Visuella instruktioner** (Symbol-Supported Instructions)
*Utöka Step Guide och Cooking Helper*
- Automatisk symbolstöd för alla textinstruktioner
- Skapa egna instruktioner med drag-and-drop
- Mallbibliotek: hygien, påklädning, matlagning, städning
- QR-koder för att komma åt instruktioner snabbt

#### 6. **Symbolstödda sociala berättelser** (Enhanced Social Stories)
*Utöka befintliga Social Stories*
- Varje mening får symbolstöd automatiskt
- Interaktiva val: "Vad skulle du göra?"
- Anpassningsbara med barnets namn och bilder
- Mallar för vanliga situationer med symbolstöd

---

## 🚀 Prioriterad implementationsordning

### Fas 1 — Snabba vinster (1-2 veckor)
1. ✅ **Välkomstdialoger** — KLART
2. **Symbolstödd text** — Grundversion med ARASAAC-lookup per ord
3. **Utökad Picture Dictionary** — Lägg till Fitzgerald-färger och exempelmeningar

### Fas 2 — Kärnfunktioner (2-4 veckor)
4. **Digital kommunikationsbok** — Personliga sidor med flikar
5. **Meningsremse-verkstad** — PECS fas IV-VI
6. **Flashcard-skapare** — Med ARASAAC-integration

### Fas 3 — Avancerade funktioner (4-8 veckor)
7. **Bildutbytes-simulator** — PECS fas I-III digital träning
8. **Symbolbaserat skrivverktyg** — Text→symbol i realtid
9. **PECS Fas-tracker** — Progressionsspårning

### Fas 4 — Polish & Integration (löpande)
10. **Kontextmedvetna förslag** — Tidbaserade bildförslag
11. **Cross-app integration** — Dela symboler/ord mellan appar
12. **Export/import/delning** — PDF, utskrift, QR-koder

---

## 🔧 Tekniska överväganden

### ARASAAC som symbolkälla
- Vi använder redan ARASAAC (öppen licens, CC BY-NC-SA)
- Omfattande svenskt stöd
- API för sökning och nedladdning
- **Viktigt:** Casha piktogram lokalt för offline-stöd (PWA)

### Ordmatchning för symbolstöd
- Svårt för svenska (böjningsformer): "äter" → "äta", "hundarna" → "hund"
- Lösning: Grundforms-lookup-tabell eller lättare stemming
- Fallback: Visa texten utan symbol om ingen match hittas

### Datamodell
- Alla användardata i localStorage/IndexedDB
- Ingen server behövs (privacy-first)
- Export som JSON för backup/delning

---

## 🎯 Mission

Varje funktion vi bygger ska svara på frågan:
> "Hjälper detta barnet att kommunicera, förstå sin vardag, eller utvecklas?"

Vi bygger inte teknik för teknikens skull. Vi bygger verktyg som ger barn med NPF och IF en röst, struktur och möjlighet att delta i sin egen vardag.

*För Axel, Alma, Alice — och alla barn som förtjänar de bästa verktygen.* 💜
