# MI Használat Dokumentáció - FinTrack

## 1. Projekt Környezet és Alapok Létrehozása
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat (@workspace)
**Cél:** A teljes mappaszerkezet, Solution fájl és a projektek (Backend/Frontend) legenerálása parancssori utasításokkal.

**Használt Prompt:**
> @workspace I am starting a university project called "FinTrack".
> The tech stack is C# .NET 8 Web API for the backend and vanilla HTML/CSS/JS for the frontend.
> Please provide the terminal commands (PowerShell or Bash) to set up the project structure as follows:
> 1. Create a new Solution file named 'FinTrack.sln' in the root directory.
> 2. Create a 'Backend' folder and initialize a new Web API project named 'FinTrack.API' inside it (use .NET 8).
> 3. Create a 'Frontend' folder and create empty 'index.html', 'style.css', and 'app.js' files inside it.
> 4. Add the 'FinTrack.API' project to the 'FinTrack.sln' solution.
> 5. Generate a standard .gitignore file for a .NET project in the root.
> 6. Create an empty markdown file named 'AI_USAGE.md' in the root directory.

**Eredmény:** A Copilot sikeresen generált PowerShell scripteket, amiamelyek segítéségvel létrehozta a fájlrendszert.



## 2. Verziókezelés és GitHub Publikálás
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A helyi git repository inicializálása és a projekt feltöltése GitHub-ra megfelelő leírással.

**Használt Prompt:**
> @workspace I have the .gitignore file ready in the root directory.
> Please provide the terminal commands to perform the following version control steps:
> 1. Initialize a new local git repository.
> 2. Add all files to the staging area.
> 3. Commit the changes with message "Initial commit: Project structure setup".
> 4. Provide commands to create a repo named 'FinTrack' with description: "Homework project for the 'Software Development with AI Support' course..."

**Eredmény:** A Git repository létrejött, a fájlok kommitolásra kerültek, és a projekt publikálva lett a GitHub-on.


## 3. Backend Adatmodellek Létrehozása
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat (@workspace)
**Cél:** A User és Transaction entitások létrehozása C# osztályként, adatbázis annotációkkal.

**Használt Prompt:**
> @workspace We are moving on to the Backend development. I need to define the data models representing the database structure.
> Please perform the following actions inside the 'FinTrack.API' project:
> 1. Create a new folder named 'Models'.
> 2. Create 'User.cs' with Id, Username, PasswordHash.
> 3. Create 'Transaction.cs' with Id, UserId, Amount, Date, Description, Category, Type.
> Use standard System.ComponentModel.DataAnnotations.

**Eredmény:** Létrejött a Models mappa a két C# osztállyal, amelyek tartalmazzák a szükséges tulajdonságokat és validációkat.


## 4. Adatbázis Konfiguráció (SQLite)
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** Az SQLite adatbázis beállítása a perzisztens adattároláshoz, mivel nincs telepített SQL Server.

**Használt Prompt:**
> @workspace Change of plan: I want to use a persistent database instead of In-Memory. Since I don't have SQL Server installed, let's use SQLite.
> 1. Install 'Microsoft.EntityFrameworkCore.Sqlite' and 'Microsoft.EntityFrameworkCore.Tools'.
> 2. Create 'AppDbContext.cs' with Users and Transactions DbSets.
> 3. Update 'appsettings.json' with connection string "Data Source=FinTrack.db".

**Eredmény:** A szükséges csomagok telepítve, Connection String beállítva a lokális fájl alapú adatbázishoz.


## 5. Adatbázis Migráció
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat + CLI
**Cél:** Az SQLite adatbázis fizikai létrehozása a Code-First migráció segítségével.

**Használt Prompt:**
> (Az előző prompt folytatása volt, ahol a terminál parancsokat kérte)
> ... Tell me what terminal command I need to run to create the database file (migrations).

**Eredmény:** A `dotnet ef` parancsok sikeresen létrehozták a migrációs fájlokat, majd a `FinTrack.db` adatbázis fájlt.


## 6. AuthController és Takarítás
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A felesleges minta kód eltávolítása, a Controllers szolgáltatás beüzemelése, és a Regisztráció/Belépés végpontok lefejlesztése jelszó hash-eléssel.

**Használt Prompt:**
> @workspace We are ready to build the API endpoints.
> 1. Install 'BCrypt.Net-Next'.
> 2. Clean 'Program.cs' (remove WeatherForecast), add AddControllers() and MapControllers().
> 3. Create 'UserDto.cs'.
> 4. Create 'AuthController.cs' with 'register' (hash password) and 'login' (verify hash) endpoints.

**Eredmény:** A Program.cs letisztult, és létrejött az AuthController, ami képes regisztrálni és beléptetni felhasználókat BCrypt titkosítással.

## 7. Backend Tesztelése (Swagger)
**Dátum:** 2025. [aktuális dátum]
**Módszer:** A beépített Swagger UI használata.
**Tesztelt esetek:**
1. Új felhasználó regisztrációja (Sikeres, 200 OK).
2. Regisztrált felhasználó belépése (Sikeres, token visszaadva).
**Eredmény:** A backend Auth rendszere működik, az adatbázis kapcsolat él.


## 8. Tranzakció Kezelés (CRUD) Megvalósítása
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A pénzügyi tranzakciók létrehozását, lekérdezését, módosítását és törlését végző végpontok (API endpoints) létrehozása.

**Használt Prompt:**
> @workspace We need to implement the Transaction management features now.
> 1. Create 'TransactionDto.cs'.
> 2. Create 'TransactionsController.cs' with AppDbContext injection.
> 3. Implement endpoints: GET (by userId), POST (create), PUT (update), DELETE (delete).
> 4. Add error handling (NotFound).

**Eredmény:** Létrejött a TransactionsController teljes CRUD funkcionalitással.


## 9. CORS Engedélyezése
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A böngésző biztonsági korlátozásának (CORS) feloldása, hogy a Frontend képes legyen adatokat küldeni a Backendnek.

**Használt Prompt:**
> @workspace Before we start the Frontend, I need to enable CORS to allow my HTML app to communicate with this API.
> 1. Add CORS policy (AllowAnyOrigin, AllowAnyMethod, AllowAnyHeader).
> 2. Use app.UseCors() before authorization.

**Eredmény:** A CORS policy bekerült a Program.cs-be, így a böngésző engedni fogja a kéréseket.


## 10. Backend Mentése (Checkpoint)
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A működő és letesztelt Backend kódjának rögzítése a verziókezelőben a Frontend fejlesztés megkezdése előtt.

**Használt Prompt:**
> @workspace I want to save my current progress to GitHub before starting the Frontend.
> 1. Add all modified files.
> 2. Commit with message "Backend complete: Auth and Transaction APIs with SQLite & CORS enabled".
> 3. Push to remote.

**Eredmény:** A backend stabil állapota feltöltve GitHub-ra.


## 11. Frontend: Login és Regisztráció
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A modern webes felület (HTML/CSS) és a kommunikációs logika (JS) létrehozása a belépéshez.

**Használt Prompt:**
> @workspace We are starting the Frontend implementation. My API is running at "http://localhost:5062".
> 1. Update index.html (Login/Register forms, dashboard placeholder).
> 2. Update style.css (modern card UI).
> 3. Update app.js (POST requests to Auth API, handling localStorage).

**Eredmény:** A frontend sikeresen csatlakozik a backendhez, a regisztráció és belépés működik, a tokent elmentjük.



## 12. Frontend Integrációs Teszt
**Dátum:** 2025. [aktuális dátum]
**Módszer:** Manuális tesztelés böngészőben + DevTools (Network/Application tab).
**Tesztelt esetek:**
1. Regisztráció (Sikeres API hívás).
2. Login (Token mentése LocalStorage-ba).
3. Oldal újratöltése (Token alapú automatikus belépés).
4. Logout (Token törlése).
**Eredmény:** A rendszer stabilan kezeli a felhasználói munkamenetet.


## 13. Dashboard: Tranzakciókezelés és Diagram
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A tranzakciók CRUD műveleteinek frontend oldali megvalósítása és az adatok vizualizálása Chart.js segítségével.

**Használt Prompt:**
> @workspace The Authentication is working perfectly. Now verify the user's token and build the Dashboard functionality.
> 1. Update index.html (Add Chart.js CDN, Form, Table).
> 2. Update app.js (Fetch transactions with Bearer token, Render Table, Init Chart.js, Handle Add/Delete).
> 3. Update style.css (Table and Button styling).

**Eredmény:** A felhasználó látja a saját tranzakcióit listázva és diagramon, tud újat felvenni és törölni. A rendszer automatikusan frissíti a nézetet.


## 14. Verziókiadás (v1.0)
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A kész alkalmazás (Frontend + Backend) végső állapotának rögzítése és publikálása a verziókezelőben.

**Használt Prompt:**
> @workspace The application is fully functional. I want to push the final Frontend changes to GitHub.
> 1. Add all files.
> 2. Commit with message "Frontend completed... First working version (v1.0)."
> 3. Push to origin.

**Eredmény:** A FinTrack v1.0 forráskódja elérhető a GitHub repository-ban.


## 15. Funkcióbővítés: Szűrés
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** Lehetőség biztosítása a tranzakciók szűrésére dátum intervallum és típus (Bevétel/Kiadás) szerint a Frontend oldalon.

**Használt Prompt:**
> @workspace I want to add filtering capabilities to the Transaction List on the Dashboard.
> 1. Update index.html (Filter inputs: Start Date, End Date, Type).
> 2. Update app.js (Client-side filtering logic, filterTransactions function).
> 3. Update style.css (Filter bar styling).

**Eredmény:** A felhasználó dinamikusan szűrheti a megjelenített tranzakciókat anélkül, hogy új lekérdezést küldene a szervernek.


## 16. Hibajavítás: Dátum Szűrés
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A dátumszűrő javítása, hogy a kiválasztott kezdő- és végdátum napján történt tranzakciók is megjelenjenek (inkluzív szűrés).

**Használt Prompt:**
> @workspace There is a bug in the client-side filtering logic. When I select a "Start Date", transactions that happened exactly ON that date are currently hidden.
> Please fix the `filterTransactions` function in 'app.js' to ensure date comparison is INCLUSIVE and ignores the time component.

**Eredmény:** A szűrő most már helyesen jeleníti meg az adott napon történt tranzakciókat is, figyelmen kívül hagyva az időpontot.


## 17. Validáció: Dátum Intervallum
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat
**Cél:** Felhasználói hiba kezelése a szűrésnél. Megakadályozzuk, hogy a kezdő dátum későbbi legyen, mint a végdátum.

**Használt Prompt:**
> @workspace I need to add validation to the date filtering logic in 'app.js'.
> 1. Check if Start Date > End Date.
> 2. If true, show alert "Error: The start date cannot be grater than the end date!", clear input, and return.

**Eredmény:** A rendszer hibaüzenetet dob és megállítja a szűrést logikátlan dátumbeállítás esetén.



## 18. Kódminőség és Refaktorálás (SonarQube)
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat + SonarQube
**Cél:** A statikus kódelemző által talált hibák (Code Smells) javítása a fenntarthatóság és akadálymentesség érdekében.

**Használt Prompt:**
> @workspace I need to refactor the Frontend code based on SonarQube analysis results.
> 1. Refactor 'style.css' for WCAG 2.2 Contrast Compliance (darker colors).
> 2. Refactor 'app.js': replace forEach with for...of loops.
> 3. Use Number.parseFloat() instead of global parseFloat.
> 4. Use globalThis instead of window.

**Eredmény:** A kód megfelel a modern JavaScript szabványoknak (ES6+), és a felület kontrasztosabb, jobban olvasható lett.



## 19. Refaktorálás és Véglegesítés
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat + SonarQube
**Cél:** A kód megtisztítása a statikus elemző visszajelzései alapján (kontraszt javítás, modern ciklusok), valamint a változtatások végleges rögzítése a verziókezelőben.

**Használt Prompt:**
> @workspace The application refactoring and filtering features are complete. I want to push these changes to GitHub.
> 1. Add all files.
> 2. Commit with message "Refactoring: SonarQube fixes...".
> 3. Push to remote.

**Eredmény:** A FinTrack projekt végleges, tiszta kódja elérhető a GitHub-on.


## 20. Backend Refaktorálás (SonarQube)
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat + SonarQube Cloud
**Cél:** A backend indításának aszinkronná tétele (S6966 hiba javítása) a megbízhatóság növelése érdekében.

**Használt Prompt:**
> @workspace I need to fix a SonarQube issue (S6966) in 'Backend/FinTrack.API/Program.cs'.
> Change `app.Run();` to `await app.RunAsync();`.

**Eredmény:** Az alkalmazás most már aszinkron módon fut (`RunAsync`), ami megfelel a modern .NET szabványoknak.


## 21. Adatmodell Szigorítás (SonarQube)
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat + SonarQube Cloud
**Cél:** Az "under-posting" sérülékenység javítása. Kötelezővé tesszük (`required`) a kulcsfontosságú mezőket a DTO-ban, hogy a szerver ne fogadjon el hiányos adatokat alapértelmezett értékekkel.

**Használt Prompt:**
> @workspace I need to fix a SonarQube reliability issue in 'Backend/FinTrack.API/DTOs/TransactionDto.cs'.
> Add the `required` modifier to `UserId`, `Amount`, and `Date`.

**Eredmény:** A tranzakciók felvitele biztonságosabb, a hiányos adatokra a szerver 400-as hibával válaszol.


## 21. Adatmodell Szigorítás (SonarQube)
**Dátum:** 2025. [aktuális dátum]
**Használt eszköz:** GitHub Copilot Chat + SonarQube Cloud
**Cél:** Az "under-posting" sérülékenység javítása. Kötelezővé tesszük (`required`) a kulcsfontosságú mezőket a DTO-ban, hogy a szerver ne fogadjon el hiányos adatokat alapértelmezett értékekkel.

**Használt Prompt:**
> @workspace I need to fix a SonarQube reliability issue in 'Backend/FinTrack.API/DTOs/TransactionDto.cs'.
> Add the `required` modifier to `UserId`, `Amount`, and `Date`.

**Eredmény:** A tranzakciók felvitele biztonságosabb, a hiányos adatokra a szerver 400-as hibával válaszol.


