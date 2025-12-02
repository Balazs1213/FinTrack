# FinTrack - Pénzügyi Nyilvántartó Alkalmazás
## Specifikációs Dokumentum

**Kurzus:** Szoftverfejlesztés MI támogatással  
**Intézmény:** Budapesti Műszaki és Gazdaságtudományi Egyetem (BME)  
**Készítette:** Sándor Balázs  
**Neptun kód:** W1SRF8  
**Verzió:** 1.0  
**Dátum:** 2025. december

---

## 1. Bevezetés és Célkitűzés

### 1.1 Probléma Azonosítása

A modern társadalmakban egyre növekvő problémát jelent a pénzügyi tudatosság hiánya, különösen a fiatal felnőttek és egyetemi hallgatók körében. Sokan nem rendelkeznek átfogó képpel saját bevételeikről és kiadásaikról, ami pénzügyi nehézségekhez, túlköltekezéshez és megtakarítási problémákhoz vezethet. A hagyományos papíralapú nyilvántartások időigényesek és hibára hajlamosak, míg a komplex pénzügyi szoftverek túlságosan bonyolultak és drágák az átlagos felhasználó számára.

A COVID-19 járvány utáni időszakban a digitális pénzügyi megoldások iránti igény tovább nőtt, hiszen az emberek egyre nagyobb hangsúlyt fektetnek arra, hogy otthonról, mobileszközökről is kezelhessék pénzügyeiket. A piacon létező megoldások többsége azonban előfizetési díjakat von, adatokat ad el harmadik félnek, vagy túlságosan összetett funkciókkal rendelkezik, amelyek elriasztják a kezdő felhasználókat.

### 1.2 Javasolt Megoldás

A **FinTrack** egy egyszerű, ingyenes, webalapú pénzügyi nyilvántartó alkalmazás, amely angol nyelvű felhasználói felülettel rendelkezik, így nemzetközi közönség számára is elérhető. A rendszer alapfilozófiája a minimalista, könnyen érthető felhasználói felület, amely a legfontosabb funkciókra koncentrál:

- **Bevételek és kiadások rögzítése** kategóriák szerint
- **Vizuális visszajelzés** interaktív diagramokon keresztül
- **Történeti áttekintés** szűrési lehetőségekkel
- **Biztonságos adatkezelés** modern titkosítási szabványokkal

Az alkalmazás célja, hogy a felhasználók néhány perc alatt képesek legyenek áttekinteni pénzügyi helyzetüket, és tudatos döntéseket hozzanak kiadásaikkal kapcsolatban. A rendszer nem kíván helyettesíteni professzionális számviteli szoftvereket vagy banki alkalmazásokat, hanem egy személyes, könnyen használható naplóként szolgál.

### 1.3 Célcsoport Meghatározása

Az alkalmazás elsődleges célcsoportja:

1. **Egyetemi hallgatók (18-25 év):**
   - Limitált anyagi forrásokkal rendelkeznek (ösztöndíj, részmunkaidős állás)
   - Első alkalommal kezelik önállóan pénzügyeiket
   - Digitálisan aktívak, megszokták a webes alkalmazásokat
   - Igényük van egyszerű, vizuális visszajelzésre költéseikről
   - Angolul használják a digitális eszközöket és szolgáltatásokat

2. **Fiatal szakemberek (25-35 év):**
   - Első munkahelyükön dolgoznak
   - Tudatosan szeretnének megtakarítani (lakásvásárlás, utazás)
   - Keresnek egy gyors, hatékony megoldást pénzügyi nyomon követésre
   - Nem szeretnének fizetni prémium szolgáltatásokért
   - Nemzetközi környezetben dolgoznak vagy tanulnak

3. **Családok és magánszemélyek:**
   - Egyszerű házitartási költségvetést szeretnének vezetni
   - Nincs szükségük komplex analitikai funkciókra
   - Értékelik az átlátható, reszponzív felületet
   - Előnyben részesítik az angol nyelvű interfészeket a szabványosság miatt

---

## 2. Funkcionális Követelmények

### 2.1 Felhasználókezelési Alrendszer

#### 2.1.1 Regisztráció (FR-AUTH-01)

**Leírás:**  
A rendszer lehetővé teszi új felhasználói fiókok létrehozását. A regisztráció során a felhasználónak meg kell adnia egy egyedi felhasználónevet és egy jelszót.

**Bemenetek:**
- `Username` (string, kötelező, minimum 3 karakter, maximum 50 karakter)
- `Password` (string, kötelező, minimum 6 karakter)

**Feldolgozás:**
1. A rendszer ellenőrzi, hogy a felhasználónév még nem létezik az adatbázisban.
2. A jelszó BCrypt algoritmussal kerül hash-elésre (cost factor: 11, automatikus salt generálással).
3. Az új felhasználói rekord mentésre kerül az SQLite adatbázisba (`Users` tábla).

**Kimenetek:**
- Sikeres regisztráció esetén: "Registration successful! Please login." üzenet, átirányítás a bejelentkezési oldalra.
- Hiba esetén: "Username already exists" hibaüzenet (HTTP 400 Bad Request).

**Biztonsági követelmények:**
- A jelszó soha nem kerül plain text formában tárolásra.
- A hash algoritmus megfelel az OWASP ajánlásoknak.

#### 2.1.2 Bejelentkezés (FR-AUTH-02)

**Leírás:**  
A rendszer lehetővé teszi regisztrált felhasználók bejelentkezését JWT (JSON Web Token) alapú munkamenet indításával.

**Bemenetek:**
- `Username` (string, kötelező)
- `Password` (string, kötelező)
- `RememberMe` (boolean, opcionális, alapértelmezetten false)

**Feldolgozás:**
1. A rendszer lekérdezi a felhasználót az adatbázisból username alapján.
2. BCrypt `Verify()` metódussal ellenőrzi a jelszó helyességét.
3. Sikeres autentikáció esetén generál egy JWT tokent a következő paraméterekkel:
   - **Issuer:** "FinTrackAPI"
   - **Audience:** "FinTrackFrontend"
   - **Claims:** `NameIdentifier` (UserId), `Name` (Username)
   - **Lejárati idő:** 30 nap (`DateTime.Now.AddDays(30)`)
   - **Aláírási algoritmus:** HmacSha256
4. A token visszaküldésre kerül a kliensnek.

**Kimenetek:**
- Sikeres bejelentkezés: JSON objektum a tokennel és a felhasználói adatokkal.
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser"
    }
  }
  ```
- Hiba esetén: "Invalid username or password" (HTTP 401 Unauthorized).

**Frontend működés:**
- Ha `RememberMe` be van jelölve: token a `localStorage`-ba kerül (tartós).
- Ha nincs bejelölve: token a `sessionStorage`-ba kerül (böngésző bezárásig érvényes).

#### 2.1.3 Kijelentkezés (FR-AUTH-03)

**Leírás:**  
A felhasználó a "Settings" panelből elérhető "Logout" gombra kattintva kijelentkezik a rendszerből.

**Feldolgozás:**
1. A frontend törli a JWT tokent mindkét tárhelyről (`localStorage`, `sessionStorage`).
2. A Chart.js diagram példány megsemmisítésre kerül (`expenseChart.destroy()`).
3. A tranzakciók tömb kiürül (`allTransactions = []`).
4. Átirányítás a bejelentkezési oldalra.

**Kimenetek:**
- "Logged out successfully!" értesítés.
- Vizuális átmenet: Dashboard elrejtése, Auth section megjelenítése.

### 2.2 Tranzakciókezelési Alrendszer

#### 2.2.1 Új Tranzakció Hozzáadása (FR-TRANS-01)

**Leírás:**  
A felhasználó új pénzügyi tranzakciókat rögzíthet a rendszerben (bevétel vagy kiadás).

**Bemenetek:**
- `UserId` (int, kötelező, automatikusan a tokenből kinyerve)
- `Amount` (decimal, kötelező, pozitív érték, 2 tizedesjegy pontosság)
- `Date` (DateTime, kötelező, alapértelmezett: mai nap)
- `Category` (string, kötelező, maximum 100 karakter, pl. "Food", "Salary")
- `Type` (string, kötelező, értékkészlet: "Income" vagy "Expense")
- `Description` (string, opcionális, maximum 200 karakter)

**Feldolgozás:**
1. A frontend elküldi a POST kérést a `/api/Transactions` végpontra `Authorization: Bearer {token}` headerrel.
2. A backend validálja a DTO mezőket (`required` modifier).
3. Az új tranzakció mentésre kerül az adatbázisba (`Transactions` tábla).
4. A backend visszaküldi a létrehozott objektumot (HTTP 201 Created).

**Kimenetek:**
- Sikeres mentés: "Transaction added successfully!" alert, az űrlap kiürül, a táblázat és a diagram automatikusan frissül.
- Hiba esetén: "Failed to add transaction. Please try again." (HTTP 400/500).

**UI Viselkedés:**
- A dátum mező automatikusan kitöltődik a mai nappal.
- Az összeg mező csak pozitív számokat fogad el (HTML5 `min="0.01"` attribútum).
- A felhasználói felület angol nyelvű: "Add Transaction" gomb, "Amount ($)" címke, stb.

#### 2.2.2 Tranzakciók Listázása (FR-TRANS-02)

**Leírás:**  
A dashboard betöltésekor a rendszer lekérdezi és megjeleníti az aktuális felhasználó összes tranzakcióját.

**Feldolgozás:**
1. GET kérés a `/api/Transactions/user/{userId}` végpontra.
2. A backend szűri a tranzakciókat `UserId` alapján.
3. A frontend egy HTML táblázatban jeleníti meg az eredményeket időrendi sorrendben (csökkenő).

**Megjelenítés:**
- **Oszlopok:** Date, Category, Description, Type (badge), Amount (előjeles), Action (Delete gomb)
- **Stílus:** Income → zöld színű badge és + előjel, Expense → piros badge és - előjel.
- **Üres állapot:** Ha nincs tranzakció, megjelenik: "No transactions found".

#### 2.2.3 Tranzakció Törlése (FR-TRANS-03)

**Leírás:**  
A felhasználó törölheti a meglévő tranzakciókat a táblázat soraiból.

**Feldolgozás:**
1. A "Delete" gombra kattintva egy JavaScript `confirm()` ablak jelenik meg: "Are you sure you want to delete this transaction?"
2. Megerősítés esetén DELETE kérés küldése a `/api/Transactions/{id}` végpontra.
3. A backend törli a rekordot az adatbázisból.
4. A frontend újratölti a tranzakciók listáját.

**Kimenetek:**
- Sikeres törlés: "Transaction deleted successfully!" alert.
- Hiba esetén: "Failed to delete transaction." (HTTP 404/500).

### 2.3 Dashboard és Vizualizációs Alrendszer

#### 2.3.1 Összesítő Kártyák (FR-DASH-01)

**Leírás:**  
A dashboard tetején három kártya jelenik meg, amelyek összegzik a pénzügyi helyzetet.

**Számítási Logika:**
- **Total Income:** Összes `Type === 'Income'` tranzakció `Amount` értékének összege.
- **Total Expense:** Összes `Type === 'Expense'` tranzakció `Amount` értékének összege.
- **Balance:** `Total Income - Total Expense` különbség.

**Megjelenítés:**
- Dinamikus frissítés új tranzakció hozzáadásakor vagy törléskor.
- Színkódolás: Income (zöld), Expense (piros), Balance (lila).
- Formátum: `$1234.56` (2 tizedesjegy pontosság).
- Angol nyelvű címkék: "Total Income", "Total Expense", "Balance".

#### 2.3.2 Kördiagram (FR-DASH-02)

**Leírás:**  
Chart.js Doughnut chart, amely vizuálisan ábrázolja a bevételek és kiadások arányát.

**Technikai Specifikáció:**
- **Könyvtár:** Chart.js 4.4.1 (SRI hash ellenőrzéssel)
- **Típus:** Doughnut (2 szegmens)
- **Adatok:**
  - Szegmens 1: Income (zöld, #4caf50)
  - Szegmens 2: Expense (piros, #f44336)
- **Interakció:** Hover tooltip a pontos összeg megjelenítésére.
- **Felirat:** "Income vs Expense" (angol nyelvű cím)

**Dark Mode Támogatás:**
- A diagram feliratai (`plugins.legend.labels.color`) dinamikusan váltanak:
  - Light mode: `#333333`
  - Dark mode: `#ffffff`
- A diagram automatikusan újrarajzolódik témaváltáskor (`renderChart()` újrahívása).

### 2.4 Szűrési Alrendszer

#### 2.4.1 Kliens Oldali Szűrés (FR-FILTER-01)

**Leírás:**  
A felhasználó szűrheti a megjelenített tranzakciókat dátum intervallum és típus szerint anélkül, hogy új API hívás történne.

**Bemenetek:**
- `Start Date` (date, opcionális)
- `End Date` (date, opcionális)
- `Type` (dropdown, értékkészlet: "All", "Income", "Expense")

**Feldolgozás:**
1. A "Filter" gombra kattintva a `filterTransactions()` JavaScript függvény lefut.
2. Az `allTransactions` globális tömb egy másolata készül.
3. Szűrési feltételek alkalmazása:
   - **Dátum:** A `Date` mező összehasonlítása a megadott intervallummal (inkluzív, időkomponens figyelmen kívül hagyásával).
   - **Típus:** A `Type` mező egyezésének vizsgálata (ha nem "All").
4. A szűrt eredmények megjelenítése a táblázatban, a kártyákon és a diagramon.

**Validáció:**
- Ha `Start Date > End Date`, hibaüzenet jelenik meg: "Error: The start date cannot be later than the end date!"
- Az `End Date` mező automatikusan törlődik.

**Reset Funkció:**
- A "Reset" gomb visszaállítja az összes szűrőt és újra megjeleníti az összes tranzakciót.

### 2.5 Beállítások és Megjelenés

#### 2.5.1 Sötét Mód (FR-SETTINGS-01)

**Leírás:**  
A felhasználó válthat a világos és sötét téma között a "Settings" panelből.

**Feldolgozás:**
1. A "Dark Theme" toggle switch kapcsolásakor egy `change` event fut le.
2. Ha bekapcsolva: `document.body.classList.add('dark-mode')`.
3. A választás elmentésre kerül a `localStorage`-ba (`theme: 'dark'` vagy `'light'`).
4. Oldal újratöltésekor az `applySavedTheme()` függvény visszaállítja a mentett beállítást.

**CSS Megvalósítás:**
- A `body.dark-mode` szelektorral felülírandó CSS változók:
  - `--bg-primary`: `#1a1a2e`
  - `--text-dark`: `#e0e0e0`
  - `--card-bg`: `#2a2a3e`
  - stb.

**Komponensek Dinamikus Frissítése:**
- Chart.js diagram feliratainak színe.
- Input mezők háttérszíne és szövegszíne.
- Naptár ikonok inverz megjelenítése (WebKit CSS filter).

---

## 3. Nem-funkcionális Követelmények

### 3.1 Biztonsági Követelmények (NFR-SEC)

#### NFR-SEC-01: Jelszó Titkosítás
- **Követelmény:** A felhasználói jelszavak soha nem kerülhetnek plain text formában tárolásra.
- **Megvalósítás:** BCrypt.Net-Next könyvtár használata, cost factor 11 beállítással.
- **Ellenőrzés:** SonarQube statikus elemzés, amely nem jelöl hardcoded secrets-et.

#### NFR-SEC-02: Token Alapú Autentikáció
- **Követelmény:** A munkamenet-kezelés stateless JWT tokenekkel történjen.
- **Megvalósítás:**
  - Aláírási kulcs környezeti változóból olvasva (`FINTRACK_JWT_KEY`).
  - HmacSha256 aláírási algoritmus.
  - 30 napos lejárati idő (vizsgaidőszak támogatás).
- **Ellenőrzés:** Middleware szintű token validáció minden védett végponton.

#### NFR-SEC-03: SRI Hash Ellenőrzés
- **Követelmény:** Külső JavaScript könyvtárak integritásának garantálása.
- **Megvalósítás:** Chart.js CDN script tag `integrity` attribútummal (SHA-384 hash).
- **Ellenőrzés:** SonarQube S5725 szabály betartása.

#### NFR-SEC-04: Környezeti Változók Használata
- **Követelmény:** Titkos kulcsok (JWT signing key) nem szerepelhetnek a verziókezelőben.
- **Megvalósítás:** `Environment.GetEnvironmentVariable("FINTRACK_JWT_KEY")` használata.
- **Ellenőrzés:** A `.gitignore` kizárja az `appsettings.json` titkos értékeit.

### 3.2 Teljesítmény Követelmények (NFR-PERF)

#### NFR-PERF-01: Gyors Betöltés
- **Követelmény:** A dashboard betöltési ideje ne haladja meg a 2 másodpercet átlagos internetkapcsolaton.
- **Megvalósítás:**
  - SQLite adatbázis optimalizált indexekkel (`UserId` külső kulcs).
  - CDN használata külső könyvtárakhoz (Chart.js, FontAwesome).
  - Minimalizált CSS/JS fájlok (production build esetén).

#### NFR-PERF-02: Kliens Oldali Szűrés
- **Követelmény:** A szűrési műveletek ne igényeljenek szerver kommunikációt.
- **Megvalósítás:** JavaScript `filter()` metódus használata a memóriában tárolt `allTransactions` tömbön.
- **Előny:** Azonnali vizuális visszajelzés, csökkentett szerver terhelés.

### 3.3 Használhatósági Követelmények (NFR-UX)

#### NFR-UX-01: Reszponzív Dizájn
- **Követelmény:** Az alkalmazás mobil, tablet és desktop eszközökön egyaránt használható legyen.
- **Megvalósítás:** CSS Flexbox/Grid layout, media query-k (pl. `@media (max-width: 768px)`).
- **Ellenőrzés:** Chrome DevTools reszponzív módban való tesztelés.

#### NFR-UX-02: WCAG Kontrasztosság
- **Követelmény:** A színválasztás feleljen meg a WCAG 2.2 AA szintű kontrasztarányoknak.
- **Megvalósítás:**
  - Fehér szöveg fekete háttéren: 21:1 arány.
  - Primer lila (#667eea) fehér háttéren: 4.5:1 arány.
- **Ellenőrzés:** SonarQube CSS color contrast analyzer.

#### NFR-UX-03: Hibakezelés
- **Követelmény:** Minden felhasználói művelet visszajelzést adjon (sikeres/sikertelen).
- **Megvalósítás:** JavaScript `alert()` üzenetek minden kritikus műveletnél (regisztráció, tranzakció hozzáadása, törlés).
- **Jövőbeli Javítás:** Toast notification könyvtár integrálása (pl. Toastify).

#### NFR-UX-04: Angol Nyelvű Felület
- **Követelmény:** A felhasználói felület angolul jelenjen meg a nemzetközi hozzáférhetőség érdekében.
- **Megvalósítás:** Minden UI elem angol nyelvű szöveggel (pl. "Add Transaction", "Filter", "Settings").
- **Előny:** Szélesebb közönség elérése, szabványosított terminológia használata.

### 3.4 Karbantarthatósági Követelmények (NFR-MAINT)

#### NFR-MAINT-01: Kód Minőség
- **Követelmény:** A kód feleljen meg az iparági Clean Code szabványoknak.
- **Megvalósítás:**
  - SonarQube elemzés minden commit előtt.
  - Async/await minták következetes használata.
  - DTO használata a controller és az adatbázis réteg között.
- **Metrikák:** 0 kritikus hiba, < 5% kód duplikáció.

#### NFR-MAINT-02: Verziókezelés
- **Követelmény:** Teljes Git commit történet az AI használattal együtt.
- **Megvalósítás:** Részletes commit üzenetek (pl. "Fix: Resolved Dark Mode toggle regression").
- **Dokumentáció:** `AI_USAGE.md` fájl az összes Copilot interakció részletes leírásával.

---

## 4. Használati Esetek (Use Cases)

### UC-01: Új Kiadás Rögzítése

**Aktor:** Bejelentkezett felhasználó (hallgató)

**Előfeltétel:**
- A felhasználó sikeresen bejelentkezett a rendszerbe.
- A Dashboard megjelenítésre került.

**Normál Folyamat:**
1. A felhasználó a bal oldali "Add Transaction" űrlapnál a következő adatokat adja meg:
   - **Amount:** 1500 (összeg dollárban)
   - **Date:** 2025.12.18. (mai nap, automatikusan kitöltve)
   - **Category:** "Lunch"
   - **Type:** "Expense" (legördülő menüből kiválasztva)
   - **Description:** "Cafeteria meal + coffee" (opcionális)
2. A felhasználó rákattint az **"Add Transaction"** gombra.
3. A frontend elküldi a POST kérést a backend-nek JWT tokennel hitelesítve.
4. A backend validálja az adatokat és elmenti az SQLite adatbázisba.
5. A frontend megkapja a 201 Created választ.
6. Megjelenik egy alert: "Transaction added successfully!"
7. Az űrlap automatikusan kiürül (kivéve a dátumot, amely újra a mai napra áll).
8. A táblázatban megjelenik az új sor:
   - **Date:** 2025.12.18.
   - **Category:** Lunch
   - **Description:** Cafeteria meal + coffee
   - **Type:** 🔴 Expense (piros badge)
   - **Amount:** -$1500.00 (piros szín, negatív előjel)
9. Az összesítő kártyák automatikusan frissülnek:
   - **Total Expense:** Növekszik $1500-zal.
   - **Balance:** Csökken $1500-zal.
10. A kördiagram újrarajzolódik, a piros szegmens mérete növekszik.

**Alternatív Folyamat (Hiba):**
- Ha a felhasználó elhagyja az "Amount" mezőt, a HTML5 validáció hibaüzenetet jelenít meg: "Please fill out this field."
- Ha a backend elérhetetlen, megjelenik: "An error occurred. Please try again later."

**Utófeltétel:**
- Az új tranzakció perzisztens módon tárolva van az adatbázisban.
- A felhasználó látja a frissített pénzügyi összesítést.

### UC-02: Havi Összesítés Ellenőrzése Szűréssel

**Aktor:** Bejelentkezett felhasználó (fiatal szakember)

**Előfeltétel:**
- A felhasználó legalább 10 tranzakciót rögzített az elmúlt hónapokban.
- A Dashboard betöltődött az összes tranzakcióval.

**Normál Folyamat:**
1. A felhasználó a "Transaction History" szakaszban található szűrő panelhez navigál.
2. Beállítja a szűrési feltételeket:
   - **Start Date:** 2024.12.01.
   - **End Date:** 2024.12.31.
   - **Type:** "All" (megtartva, mert bevételeket és kiadásokat is látni szeretne)
3. Rákattint a **"Filter"** gombra.
4. A JavaScript `filterTransactions()` függvény lefut:
   - A dátum mezők alapján szűri az `allTransactions` tömböt.
   - Csak a december havi bejegyzések maradnak meg.
5. A táblázat újrarajzolódik:
   - Csak 5 tranzakció jelenik meg (pl. 3 kiadás, 2 bevétel).
6. Az összesítő kártyák frissülnek a szűrt adatok alapján:
   - **Total Income:** $150,000
   - **Total Expense:** $85,000
   - **Balance:** +$65,000 (pozitív, zöld kiemelés)
7. A kördiagram is frissül:
   - A zöld szegmens (Income) nagyobb, mint a piros (Expense).
8. A felhasználó megvizsgálja a diagramot és megállapítja, hogy a decemberi kiadások 56,7%-át tették ki a bevételeknek.
9. Elégedetten jegyzi meg, hogy sikerült több mint $60,000-t félretennie.

**Alternatív Folyamat (Validációs Hiba):**
- Ha a felhasználó véletlenül megcseréli a dátumokat (Start Date > End Date):
  - Megjelenik egy alert: "Error: The start date cannot be later than the end date!"
  - Az "End Date" mező automatikusan kiürül.
  - A szűrés nem fut le, az eredeti lista marad látható.

**Utófeltétel:**
- A felhasználó tiszta képet kapott a decemberi pénzügyi teljesítményéről.
- A szűrők aktívak maradnak, amíg a felhasználó nem kattint a "Reset" gombra.

**Reset Művelet (Opcionális Folytatás):**
1. A felhasználó rákattint a **"Reset"** gombra.
2. A dátum mezők és a típus dropdown kiürül.
3. A táblázat visszaáll az összes tranzakció megjelenítésére.
4. Az összesítő kártyák és a diagram is visszaállnak a teljes dataset alapján.

---

## 5. Összegzés és Jövőbeli Fejlesztési Irányok

A **FinTrack** projekt specifikációja egy átfogó, modern pénzügyi nyilvántartó alkalmazást definiál, amely egyesíti a felhasználóbarát dizájnt, a robusztus backend biztonsági megoldásokat és a Clean Code elveket. A dokumentumban részletezett funkcionális és nem-funkcionális követelmények biztosítják, hogy a rendszer:

- **Biztonságos:** BCrypt, JWT, SRI hash, környezeti változók használata.
- **Gyors:** Kliens oldali szűrés, CDN integrációk, optimalizált adatbázis.
- **Átlátható:** Vizuális visszajelzések (kártyák, diagramok), validációs üzenetek.
- **Karbantartható:** SonarQube kompatibilis kód, dokumentált AI használat, Git verziókezelés.
- **Nemzetközi:** Angol nyelvű felhasználói felület a szélesebb közönség elérése érdekében.

### Jövőbeli Bővítési Lehetőségek:

1. **Többfelhasználós Környezet:** Családi fiókmegosztás, költségvetés delegálás.
2. **Export Funkciók:** CSV/PDF export a tranzakciókból.
3. **Kategória Statisztikák:** Részletes lebontás kategóriánként (pie chart, bar chart).
4. **Email Értesítések:** Havi összesítő jelentések automatikus kiküldése.
5. **PWA (Progressive Web App):** Offline működés, home screen telepítés mobilon.
6. **Bank API Integráció:** Automatikus tranzakció szinkronizálás PSD2 szabvány szerint.
7. **Többnyelvűség (i18n):** Magyar, német, francia nyelvi támogatás bevezetése.

A specifikáció jelenleg egy **Minimum Viable Product (MVP)** szintet definiál, amely teljes mértékben működőképes és egyetemi követelményeket teljesít.

---

## 6. Jelmagyarázat (Glossary)

A dokumentumban használt követelménykódok jelentése:

### Rövidítések:

- **FR:** Functional Requirement (Funkcionális Követelmény)  
  A rendszer viselkedését és funkcionalitását leíró követelmények.

- **NFR:** Non-Functional Requirement (Nem-funkcionális Követelmény)  
  A rendszer minőségi jellemzőit (teljesítmény, biztonság, használhatóság) leíró követelmények.

### Területek:

- **AUTH:** Authentication (Hitelesítés)  
  Felhasználói azonosítással kapcsolatos funkciók (regisztráció, bejelentkezés, kijelentkezés).

- **TRANS:** Transaction Management (Tranzakciókezelés)  
  Pénzügyi tranzakciók létrehozása, listázása, módosítása, törlése.

- **DASH:** Dashboard (Vezérlőpult)  
  Az áttekintő felület, amely összesítő kártyákat és diagramokat jelenít meg.

- **FILTER:** Filtering (Szűrés)  
  A tranzakciók szűrési funkciói dátum és típus szerint.

- **SETTINGS:** Settings (Beállítások)  
  Felhasználói preferenciák kezelése (pl. Dark Mode).

- **SEC:** Security (Biztonság)  
  Biztonsággal kapcsolatos követelmények (titkosítás, token védelem, SRI).

- **PERF:** Performance (Teljesítmény)  
  A rendszer válaszidejével és hatékonyságával kapcsolatos követelmények.

- **UX:** User Experience (Felhasználói Élmény)  
  A felhasználói felület használhatóságával és akadálymentességével kapcsolatos követelmények.

- **MAINT:** Maintainability (Karbantarthatóság)  
  A kód minőségével, dokumentációjával és verziókezelésével kapcsolatos követelmények.

### Példák:

- **FR-AUTH-01:** Az első funkcionális követelmény a hitelesítési (Authentication) alrendszerben.
- **NFR-SEC-03:** A harmadik nem-funkcionális biztonsági (Security) követelmény.
- **FR-TRANS-02:** A második funkcionális követelmény a tranzakciókezelési (Transaction Management) alrendszerben.

---

**Jóváhagyás:**  
A specifikációt a projekt menedzser és a műszaki vezető jóváhagyta.  
**Dátum:** 2025. december  
**Aláírás:** Sándor Balázs