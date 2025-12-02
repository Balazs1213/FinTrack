# MI Használat Dokumentáció - Projekt Dokumentálás

## 1. A Részletes Dokumentáció Generálása
**Használt eszköz:** GitHub Copilot Chat (@workspace)
**Cél:** A projekt követelményeinek megfelelő, kb. 3-4 oldalas, magyar nyelvű műszaki dokumentáció és felhasználói kézikönyv legenerálása a meglévő kódbázis alapján.

**Használt Prompt:**
> @workspace The coding is finished. Now I need to generate the final project documentation to meet the university requirements (approx. 3-4 pages).
> Please create a new file named `DOKUMENTACIO.md` in the root directory.
> **The content of the file MUST be in HUNGARIAN.**
> Structure the documentation as follows:
> 1. **Bevezetés:** Project name, Goal, Target audience.
> 2. **Technológiai Háttér:** Backend (.NET 8, EF Core, SQLite), Frontend (HTML/CSS/JS, Chart.js), Security (BCrypt, SRI, CORS).
> 3. **Telepítési és Futtatási Útmutató:** Prerequisites, clone, migration, dotnet run, Live Server.
> 4. **Felhasználói Kézikönyv - DETAILED:** Regisztráció/Belépés logic, Dashboard summary, Tranzakciók Kezelése, Listázás és Szűrés, Diagram.
> 5. **Műszaki és Architektúrális Leírás:** Adatbázis Modell (User, Transaction), API Végpontok, Biztonsági Megoldások (SQLi, XSS), Kódminőség (SonarQube fixes).
> Please format the text professionally using Markdown.

**Eredmény:** Létrejött a `DOKUMENTACIO.md` fájl, amely strukturáltan, fejezetekre bontva tartalmazza a rendszer teljes leírását magyar nyelven.

## 2. Képernyőképek Integrálása
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A dokumentáció vizuális gazdagítása a kész alkalmazásról készült képernyőképek (Login, Dashboard, Swagger) beszúrásával a megfelelő fejezetekhez.

**Használt Prompt:**
> @workspace I need to insert screenshots into 'DOKUMENTACIO.md' using the correct file path.
> The images are located in the `Documentation/Pictures/` folder in the root.
> Please update 'DOKUMENTACIO.md' to insert the Markdown image links at the following specific locations:
> 1. Section 4.1: Insert login.png.
> 2. Section 4.2: Insert dashboard.png.
> 3. Section 4.3: Insert transaction.png.
> 4. Section 3.3: Insert swagger.png.

**Eredmény:** A markdown fájlba bekerültek a képhivatkozások (`![alt text](path/to/image)` formátumban), így az előnézetben és a PDF exportban már látszanak a képek.

## 3. Dokumentációs Hibajavítás (Útvonalak)
**Használt eszköz:** GitHub Copilot Chat
**Cél:** A GitHub-on felmerülő "broken image link" hiba javítása, melyet a relatív útvonalak és a mappa elnevezésének eltérése (Picture vs Pictures) okozott.

**Használt Prompt:**
> @workspace I need to fix broken image links in my documentation.
> Currently, my markdown file is inside the `Documentation` folder, and the images are in `Documentation/Picture`.
> Please provide the terminal commands to:
> 1. Rename the folder `Documentation/Picture` to `Documentation/Pictures` (standardize to plural).
> 2. Update the image links in `Documentation/documentation.md` to be correctly relative (remove the redundant 'Documentation/' prefix).
> 3. Commit and push these fixes.

**Eredmény:** A mappaszerkezet egységesítésre került, és a markdown hivatkozások relatív útvonala javítva lett, így a képek helyesen megjelennek a GitHub felületén is.