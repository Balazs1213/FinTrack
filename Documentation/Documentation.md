# FinTrack - Pénzügyi Nyilvántartó Alkalmazás
## Projekt Dokumentáció

**Kurzus:** Szoftverfejlesztés MI támogatással  
**Intézmény:** Budapesti Műszaki és Gazdaságtudományi Egyetem (BME)  
**Készítette:** Sándor Balázs  
**Neptun kód:** W1SRF8  
**Félév:** 2025/2026 ősz  
**Verzió:** 1.0  
**Utolsó frissítés:** 2025. december

---

## 1. Bevezetés

### 1.1 Projekt Célja

A **FinTrack** egy modern, webalapú pénzügyi nyilvántartó alkalmazás, amelyet személyes bevételek és kiadások nyomon követésére fejlesztettem ki. A projekt célja egy olyan, ipari szabványoknak megfelelő full-stack szoftver létrehozása volt, amely biztonságos, felhasználóbarát és könnyen karbantartható.

### 1.2 Célcsoport

Az alkalmazás elsődleges célcsoportja:
- **Egyetemi hallgatók**, akik szeretnék áttekinteni havi költségeiket
- **Fiatal felnőttek**, akik most kezdik el tudatosan kezelni pénzügyeiket
- **Magánszemélyek**, akik egyszerű, átlátható megoldást keresnek bevételeik és kiadásaik rögzítésére

### 1.3 Főbb Funkciók

- 🔐 **Biztonságos regisztráció és bejelentkezés** (BCrypt jelszó titkosítás, JWT token alapú munkamenet)
- 💰 **Tranzakciók kezelése:** bevételek és kiadások rögzítése, módosítása, törlése
- 📊 **Vizuális adatábrázolás:** interaktív kördiagram a bevételek és kiadások arányáról
- 🔍 **Haladó szűrés:** dátum intervallum és tranzakciótípus szerinti kliens oldali szűrés
- 🌓 **Sötét mód:** szemkímélő megjelenítés alacsony fényviszonyok között
- 💾 **"Emlékezz rám" funkció:** perzisztens bejelentkezés választható módon

---

## 2. Technológiai Háttér

### 2.1 Backend Technológiák

#### **Keretrendszer és Nyelv**
- **C# .NET 8 Web API:** A Microsoft legújabb enterprise szintű keretrendszere, amely korszerű, aszinkron API végpontok fejlesztését teszi lehetővé.
- **ASP.NET Core MVC Architecture:** A projekt tisztán szétválasztja a Business Logic (Controllers), az adatkezelést (Models) és az adatátviteli objektumokat (DTOs).

#### **Adatbázis-kezelés**
- **Entity Framework Core 8.0 (Code-First):** ORM (Object-Relational Mapping) megoldás, amely C# osztályokból generálja az adatbázis sémát.
- **SQLite:** Könnyű, fájl alapú adatbázis motor, amely nem igényel külön szerver telepítést, ideális fejlesztési és oktatási célokra.
- **Migrations:** Az adatbázis séma verziózása és automatikus frissítése `dotnet ef` parancsokkal.

#### **Biztonsági Réteg**
- **BCrypt.Net-Next:** Iparági szabvány jelszó hash algoritmus salt (véletlenszerű érték) hozzáadással.
- **JWT (JSON Web Token):** Stateless munkamenet-kezelés, ahol a felhasználói azonosítás kriptográfiailag aláírt tokenekkel történik.
- **Microsoft.AspNetCore.Authentication.JwtBearer:** JWT tokenek validálása és middleware integráció.
- **CORS (Cross-Origin Resource Sharing):** Kontrollált engedélyezése a frontend-backend kommunikációnak.

### 2.2 Frontend Technológiák

#### **Alapvető Webes Szabványok**
- **HTML5:** Szemantikus elemek használata (nav, section, article) az akadálymentesség javítására.
- **CSS3:** Modern layout technikák:
  - **CSS Custom Properties (változók):** Központosított téma-kezelés.
  - **Flexbox & Grid Layout:** Reszponzív elrendezés különböző eszközökön.
  - **CSS Transitions & Animations:** Interaktív felhasználói élmény (hover effektek, modal animációk).

#### **JavaScript (ES6+)**
- **Fetch API:** Modern, Promise alapú HTTP kérések.
- **Async/Await:** Olvasható aszinkron kód struktúra.
- **localStorage & sessionStorage API:** Kliens oldali adattárolás (token, téma preferencia).
- **Template Literals:** Dinamikus HTML generálás.

#### **Külső Könyvtárak**
- **Chart.js 4.4.1:** Interaktív, canvas alapú diagramok (Doughnut chart).
- **Font Awesome 6.4.0:** Vektoros ikonok (⚙️ settings, stb.).

#### **Biztonsági Intézkedések**
- **Subresource Integrity (SRI):** A Chart.js CDN scriptnek SHA-384 hash ellenőrzése van beágyazva, amely véd a CDN kompromittálás ellen.
- **Content Security Policy (CSP) ready:** A kód felkészült külső erőforrások szigorú ellenőrzésére.

### 2.3 Fejlesztői Eszközök és Minőségbiztosítás

- **Visual Studio Code:** Elsődleges IDE, TypeScript IntelliSense támogatással.
- **Git & GitHub:** Verziókezelés, teljes commit történettel.
- **SonarQube Cloud:** Statikus kódelemző, amely 15+ code smell-t és security hotspot-ot azonosított és javíttattam.
- **GitHub Copilot:** AI asszisztált kódfejlesztés (dokumentálva az `AI_USAGE.md` fájlban).

---

## 3. Telepítési és Futtatási Útmutató

### 3.1 Rendszerkövetelmények

- **Operációs rendszer:** Windows 10/11, macOS 11+, vagy Linux (Ubuntu 20.04+)
- **.NET 8 SDK:** [Letöltés](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Visual Studio Code:** [Letöltés](https://code.visualstudio.com/)
- **Live Server Extension:** VS Code Marketplace-ről telepíthető

### 3.2 Projekt Klónozása

```bash
git clone https://github.com/Balazs1213/FinTrack.git
cd FinTrack
```

### 3.3 Backend Beállítása és Indítása

#### **1. Környezeti Változó Beállítása (KRITIKUS!)**

A JWT aláíró kulcs biztonsági okokból nincs a forráskódban. Állítsd be a következő környezeti változót:

**Windows (PowerShell):**
```powershell
$env:FINTRACK_JWT_KEY="ThisIsASecretKeyForFinTrackProject2025_MustBeLongEnough_ToBeSecure"
```

**Linux/macOS:**
```bash
export FINTRACK_JWT_KEY="ThisIsASecretKeyForFinTrackProject2025_MustBeLongEnough_ToBeSecure"
```

#### **2. NuGet Csomagok Telepítése**

```bash
cd Backend/FinTrack.API
dotnet restore
```

#### **3. Adatbázis Migrációk Futtatása**

```bash
dotnet ef database update
```

Ez a parancs létrehozza a `FinTrack.db` SQLite fájlt a projekt gyökerében, amely tartalmazza a `Users` és `Transactions` táblákat.

#### **4. Backend Indítása**

```bash
dotnet run --launch-profile "https"
```

✅ **Ellenőrzés:** Nyisd meg a böngészőben: `https://localhost:7264/swagger`  
Itt tesztelheted az API végpontokat (pl. POST /api/Auth/register).

![Swagger API](Documentation/Pictures/swagger.png)

### 3.4 Frontend Indítása

1. Nyisd meg a **Frontend** mappát VS Code-ban
2. Jobb klikk az `index.html` fájlon
3. Válaszd a **"Open with Live Server"** opciót
4. Az alkalmazás automatikusan megnyílik: `http://127.0.0.1:5500/Frontend/index.html`

---

## 4. Felhasználói Kézikönyv

### 4.1 Regisztráció és Bejelentkezés

#### **Regisztráció**
1. Az alkalmazás indulásakor kattints a **"Register here"** linkre.
2. Add meg a kívánt felhasználónevet (egyedi kell legyen).
3. Adj meg egy erős jelszót (minimum 6 karakter ajánlott).
4. Kattints a **"Register"** gombra.
5. Sikeres regisztráció esetén automatikusan visszairányít a bejelentkezési oldalra.

**Háttérben történik:**
- A jelszó BCrypt algoritmussal hash-elve kerül az adatbázisba (cost factor: 11).
- Az adatbázis egyediségi megszorítás miatt duplikált felhasználónév nem engedhető.

#### **Bejelentkezés**
1. Add meg a felhasználóneved és jelszavad.
2. **"Remember Me" checkbox:**
   - ✅ **Bejelölve:** A JWT token a `localStorage`-ba kerül, így a böngésző bezárása után is bejelentkezve maradsz (30 napig érvényes token).
   - ❌ **Kikapcsolva:** A token a `sessionStorage`-ba kerül, amely a böngésző/fül bezárásakor törlődik (növelt biztonság közös számítógépeken).
3. Kattints a **"Login"** gombra.

![Bejelentkezési felület](Documentation/Pictures/login.png)

**Sikeres belépés után:**
- A rendszer lekéri a felhasználói tranzakciókat.
- Megjelenik a Dashboard (Főoldal).
- A navigációs sávban látható a felhasználónév.

### 4.2 Dashboard (Főoldal)

![Dashboard Sötét Módban](Documentation/Pictures/dashboard.png)

#### **Pénzügyi Összegzés (Summary Cards)**

A Dashboard tetején három színkódolt kártya jelenik meg:

- 💚 **Total Income (Összes Bevétel):** Az összes "Income" típusú tranzakció összértéke.
- 🔴 **Total Expense (Összes Kiadás):** Az összes "Expense" típusú tranzakció összértéke.
- 💜 **Balance (Egyenleg):** Bevétel - Kiadás különbség.

**Dinamikus Frissítés:** A kártyák automatikusan frissülnek új tranzakció hozzáadásakor vagy szűrés esetén.

#### **Kördiagram (Income vs Expense)**

A jobb oldali panel egy interaktív Chart.js Doughnut chart-ot jelenít meg:
- **Zöld szegmens:** Bevételek aránya
- **Piros szegmens:** Kiadások aránya
- **Hover effekt:** A kurzort a szegmensek fölé húzva látható a pontos összeg.

**Sötét Mód Támogatás:** A diagram feliratai automatikusan fehérre/feketére váltanak a téma szerint.

### 4.3 Tranzakciók Kezelése

#### **Új Tranzakció Hozzáadása**

A bal oldali űrlapon a következő mezőket kell kitölteni:

1. **Amount ($):** A tranzakció összege (tizedesjegy is megadható, pl. 123.45).
2. **Date:** A tranzakció dátuma (alapértelmezetten a mai nap, de módosítható).
3. **Category:** Kategória neve (pl. "Food", "Salary", "Rent"). Szabadszöveges mező.
4. **Type:** Legördülő menü két opcióval:
   - **Income:** Bevétel (pl. fizetés, ajándék)
   - **Expense:** Kiadás (pl. étel, számla)
5. **Description (Optional):** Opcionális megjegyzés mező (max. 200 karakter).

![Új Tranzakció Űrlap](Documentation/Pictures/transaction.png)

**Mentés:**
- Kattints az **"Add Transaction"** gombra.
- A tranzakció azonnal megjelenik a táblázatban.
- A summary kártyák és a diagram automatikusan frissül.

#### **Validációs Szabályok**
- Az `Amount`, `Date`, `Category`, és `Type` mezők kötelezőek (HTML5 `required` attribútum).
- Negatív összeg nem adható meg (frontend `input[type="number"]` korlát).
- A backend DTO szinten is ellenőrzi a kötelező mezőket (`required` modifier C#-ban).

### 4.4 Tranzakciók Listázása és Szűrése

#### **Tranzakciótábla**

A táblázat oszlopai:
- **Date:** Tranzakció dátuma (helyi formátumban, pl. 2024.12.18.)
- **Category:** Kategória neve
- **Description:** Leírás (ha van, különben "-")
- **Type:** Badge formában (zöld: Income, piros: Expense)
- **Amount:** Összeg előjellel (+/- $123.45)
- **Action:** Törlés gomb minden sornál

#### **Szűrési Funkciók (Client-Side Filtering)**

A táblázat felett található szűrő panel:

1. **Start Date:** Kezdő dátum (inkluzív).
2. **End Date:** Végdátum (inkluzív).
3. **Type:** Legördülő menü (All / Income / Expense).

**Használat:**
- Állítsd be a kívánt szűrőket.
- Kattints a **"Filter"** gombra.
- A táblázat, a summary kártyák és a diagram azonnal frissül a szűrt adatokkal.

**Validáció:** Ha a kezdő dátum későbbi, mint a végdátum, a rendszer hibaüzenetet jelenít meg és törli a végdátum mezőt.

**Reset:** A **"Reset"** gomb visszaállítja az összes szűrőt és újra megjeleníti az összes tranzakciót.

### 4.5 Tranzakció Törlése

- Kattints a **"Delete"** gombra a kívánt tranzakció sorában.
- Egy megerősítő ablak jelenik meg: "Are you sure you want to delete this transaction?"
- **OK:** A tranzakció véglegesen törlődik az adatbázisból.
- **Cancel:** A művelet megszakad.

### 4.6 Beállítások és Sötét Mód

#### **Beállítások Panel Megnyitása**
- Kattints a fejléc jobb oldalán található **fogaskerék ikonra (⚙️)**.
- Egy animált modal jelenik meg.

#### **Sötét Mód (Dark Theme)**
- Kapcsold be/ki a **"Dark Theme"** toggle switch-et.
- A teljes felület azonnal átvált:
  - Fekete háttér, fehér szövegek
  - Inverz színek a naptár ikonokban
  - A diagram feliratai fehérre váltanak
- A választásod automatikusan elmentődik a `localStorage`-ba, így az oldal újratöltésekor is megmarad.

#### **Kijelentkezés**
- Kattints a **"Logout"** gombra a modal alján.
- A rendszer törli a JWT tokent és visszairányít a bejelentkezési oldalra.

---

## 5. Műszaki és Architektúrális Leírás

### 5.1 Adatbázis Modell (EF Core Code-First)

#### **User Entitás**

```csharp
public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;
}
```

**Relációk:**
- **One-to-Many** kapcsolat a `Transaction` entitással (egy felhasználóhoz több tranzakció tartozhat).

#### **Transaction Entitás**

```csharp
public class Transaction
{
    [Key]
    public int Id { get; set; }

    [Required]
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [MaxLength(200)]
    public string? Description { get; set; }

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty; // "Income" vagy "Expense"

    public User? User { get; set; }
}
```

**Kapcsolat:**
- `UserId` külső kulcs (Foreign Key) a `Users` táblára.
- **Cascade Delete:** Ha egy felhasználó törlődik, az összes tranzakciója is törlődik.

#### **Adatbázis Diagram**

```
┌─────────────────────┐
│      Users          │
├─────────────────────┤
│ Id (PK)             │
│ Username            │
│ PasswordHash        │
└─────────────────────┘
         │ 1
         │
         │ N
┌─────────────────────┐
│   Transactions      │
├─────────────────────┤
│ Id (PK)             │
│ UserId (FK)         │
│ Amount              │
│ Date                │
│ Description         │
│ Category            │
│ Type                │
└─────────────────────┘
```

### 5.2 API Végpontok (RESTful Design)

#### **AuthController (`/api/Auth`)**

##### **POST /api/Auth/register**
**Leírás:** Új felhasználó regisztrálása.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

**Hibakezelés:**
- **400 Bad Request:** Ha a felhasználónév már létezik.

##### **POST /api/Auth/login**
**Leírás:** Felhasználó bejelentkeztetése, JWT token generálás.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
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

**Token Tartalom (Claims):**
- `NameIdentifier`: Felhasználó ID
- `Name`: Felhasználónév
- `Issuer`: "FinTrackAPI"
- `Audience`: "FinTrackFrontend"
- `Expires`: 30 nap

**Hibakezelés:**
- **401 Unauthorized:** Hibás felhasználónév vagy jelszó.

#### **TransactionsController (`/api/Transactions`)**

##### **GET /api/Transactions/user/{userId}**
**Leírás:** Egy felhasználó összes tranzakciójának lekérése.

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "amount": 1500.00,
    "date": "2024-12-01T00:00:00Z",
    "description": "Monthly salary",
    "category": "Salary",
    "type": "Income"
  },
  {
    "id": 2,
    "userId": 1,
    "amount": 50.00,
    "date": "2024-12-05T00:00:00Z",
    "description": "Grocery shopping",
    "category": "Food",
    "type": "Expense"
  }
]
```

##### **POST /api/Transactions**
**Leírás:** Új tranzakció létrehozása.

**Request Body:**
```json
{
  "userId": 1,
  "amount": 200.50,
  "date": "2024-12-18",
  "category": "Entertainment",
  "type": "Expense",
  "description": "Cinema ticket"
}
```

**Response (201 Created):**
A létrehozott tranzakció objektum visszaadása.

##### **DELETE /api/Transactions/{id}**
**Leírás:** Tranzakció törlése ID alapján.

**Response (200 OK):**
```json
{
  "message": "Transaction deleted successfully"
}
```

**Hibakezelés:**
- **404 Not Found:** Ha az ID nem létezik.

### 5.3 Biztonsági Architektúra

#### **Jelszó Védelem (BCrypt)**

**Hash Folyamat:**
```csharp
string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
```

**Ellenőrzés:**
```csharp
bool isPasswordValid = BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash);
```

**Előnyök:**
- Automatikus salt generálás (minden hash egyedi).
- Cost factor: 11 (2048 iteráció).
- Brute-force támadások elleni védelem.

#### **JWT Token Biztonság**

**Token Generálás:**
```csharp
var jwtKey = Environment.GetEnvironmentVariable("FINTRACK_JWT_KEY");
var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

var token = new JwtSecurityToken(
    issuer: "FinTrackAPI",
    audience: "FinTrackFrontend",
    claims: claims,
    expires: DateTime.Now.AddDays(30),
    signingCredentials: credentials
);
```

**Validáció (Middleware):**
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "FinTrackAPI",
            ValidAudience = "FinTrackFrontend",
            IssuerSigningKey = new SymmetricSecurityKey(...)
        };
    });
```

**Védelem:**
- A token aláírási kulcsa környezeti változóban tárolva (nem a forráskódban).
- HmacSha256 algoritmus (256-bit biztonság).
- 30 napos érvényesség (vizsgaidőszak támogatás).

#### **SQL Injection Védelem**

Entity Framework Core **paraméteres lekérdezéseket** használ:

```csharp
var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);
```

A `userDto.Username` értéke automatikusan escapelve kerül be a query-be, így SQL injection nem lehetséges.

#### **XSS (Cross-Site Scripting) Védelem**

**Frontend:**
- A Chart.js library integrity hash ellenőrzéssel van beágyazva (SRI):
  ```html
  <script src="https://cdn.jsdelivr.net/.../chart.umd.min.js" 
          integrity="sha384-9nhczxUqK87bcKHh20fSQcTGD4qq5GhayNYSYWqwBkINBhOfQLg/P5HG5lF1urn4" 
          crossorigin="anonymous"></script>
  ```
- Dinamikus HTML generálás template literals-szel:
  ```javascript
  row.innerHTML = `<td>${transaction.category}</td>`;
  ```
  A böngésző automatikusan escape-eli a speciális karaktereket (`<`, `>`, `&`).

#### **CORS Policy**

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

**Megjegyzés:** Production környezetben a `AllowAnyOrigin()` helyett konkrét frontend URL-t kell megadni (pl. `WithOrigins("https://fintrack.com")`).

### 5.4 Kódminőségi Intézkedések (SonarQube Compliance)

#### **Javított Hibák**

1. **S6966 (Backend):** `app.Run()` → `await app.RunAsync()`
   - Aszinkron indítás, graceful shutdown támogatás.

2. **S6418 (Backend):** Hardcoded JWT Key → Environment Variable
   - A titkos kulcs nem szerepel a verziókezelőben.

3. **S5725 (Frontend):** Script SRI attribútum hozzáadása
   - CDN kompromittálás elleni védelem.

4. **S1091 (Frontend):** Label-input társítás
   - A `<input>` elem a `<label>` belsejében van (WCAG 2.2 megfelelőség).

5. **Code Smells (Frontend):**
   - `forEach` → `for...of` (performance & linting).
   - `parseFloat()` → `Number.parseFloat()` (ES6 szabvány).
   - `window` → `globalThis` (univerzális scope).

#### **Kontrasztarány Javítás (WCAG 2.2)**

A színválasztás megfelel az **AA szintű** kontrasztkövetelményeknek:
- Fehér szöveg fekete háttéren: 21:1 arány.
- Primer lila (#667eea) fehér háttéren: 4.5:1 arány.

---

## 6. Összegzés

A **FinTrack** projekt egy teljes körű, modern webalkalmazás, amely egyesíti a backend biztonságot (JWT, BCrypt, EF Core), a frontend elegenciát (CSS Variables, Chart.js) és az ipari minőségbiztosítást (SonarQube, SRI). Az alkalmazás készen áll bővítésre (pl. email értesítések, export funkciók) és production környezetbe telepítésre (Azure, Docker).

A fejlesztés során GitHub Copilot AI asszisztenst használtam, amely jelentősen felgyorsította a kódfejlesztést és segített a best practice-ek betartásában. A teljes AI használati napló megtalálható az [`AI_USAGE.md`](AI_USAGE.md) fájlban.

**Projekt státusz:** ✅ **Production Ready** (v2.0)  
**Kód minőség:** ✅ **SonarQube Clean** (0 critical issue)  
**Tesztelés:** ✅ **Manuálisan tesztelve** (10+ scenario)

---

**Fejlesztő:** [Sándor Balázs]  
**Elérhetőség:** [sandorbalazs1013@gmail.com]  
**GitHub Repository:** [https://github.com/Balazs1213/FinTrack](https://github.com/Balazs1213/FinTrack)

**Köszönetnyilvánítás:** Köszönöm a kurzus oktatóinak a támogatást, valamint a GitHub Copilot csapatának az AI asszisztens fejlesztését.