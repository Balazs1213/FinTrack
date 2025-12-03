## 1. Specifikáció és Technológia Kiválasztása
**Használt eszköz:** Google Gemini 2.5 PRO
**Cél:** A házi feladat témájának kiválasztása, a technológiai stack meghatározása (C# .NET Backend + Vanilla JS Frontend) a lehető leghatékonyabb fejlesztés ("vibe coding") érdekében, valamint a tantárgy által előírt 5-10 mondatos rövid specifikáció legenerálása.

**Használt Prompt:**
> Szia! Egy egyetemi házi feladatot kell készítenem 'Szoftverfejlesztés MI támogatással' tárgyból. A választott témám egy **FinTrack** nevű személyes pénzügyi menedzser alkalmazás.
>
> A feladat kiírása szerint szükségem van egy **rövid (5-10 mondatos) specifikációra**.
> **A követelmények:**
> 1. Legyen Backend és Frontend is szétválasztva.
> 2. Olyan technológiákat ajánlj, amiket AI támogatással (vibe coding) a leghatékonyabban és leggyorsabban le lehet fejleszteni (pl. C# .NET és sima HTML/JS).
> 3. Funkciók: Regisztráció/Belépés, Bevételek/Kiadások CRUD műveletei, Listázás szűréssel, és egy diagramos összesítő.
> 4. Térj ki a biztonságra (tokenek) és az adatok elkülönítésére.
>
> Kérlek, fogalmazd meg ezt a specifikációt szakmai nyelven.

**Eredmény:** Az MI elkészítette a pontos specifikációt, amely definiálja a FinTrack alkalmazás célját, a választott technológiákat (C# .NET Web API, HTML/CSS/JS), a főbb funkciókat és az adatbiztonsági alapelveket. Ez a szöveg került feltöltésre a Moodle-be a félév elején/közepén.


## 2. Specifikáció Bővítése
**Használt eszköz:** GitHub Copilot Chat (@workspace)
**Cél:** A kezdeti, vázlatos specifikáció bővítése a "2+ oldal" egyetemi követelmény eléréséhez. A már elkészült funkciók (Dark Mode, Szűrés, Biztonság) részletes műszaki leírása.

**Használt Prompt:**
> @workspace I need to expand the project specification to meet the university requirement of "2+ pages".
> Based on the implemented features of FinTrack, please generate a detailed **Specification Document** in HUNGARIAN.
> Structure:
> 1. Bevezetés és Célkitűzés.
> 2. Funkcionális Követelmények (User handling, Transactions, Dashboard, Filtering, Dark Mode).
> 3. Nem-funkcionális Követelmények (Security, Tech Stack, UX/WCAG).
> 4. Use Cases (UC-01: New Expense, UC-02: Monthly Overview).
> 5. Future Plans.

**Eredmény:** Egy részletes, műszaki nyelvezetű dokumentum, amely lefedi a teljes rendszerkövetelményeket és használati eseteket, készen áll a PDF exportálásra.


## 3. Specifikáció Finomhangolása és Jelmagyarázat
**Használt eszköz:** GitHub Copilot Chat (@workspace)
**Cél:** A specifikáció szövegének pontosítása a valós alkalmazáshoz igazodva. A célcsoport módosítása (nemzetközi/angol nyelvű), a UI elemek megnevezésének javítása (magyarról angolra), valamint a technikai rövidítések (FR, NFR, SEC) feloldása egy új "Jelmagyarázat" fejezetben az érthetőség kedvéért.

**Használt Prompt:**
> @workspace I need to refine the Hungarian Specification Document based on feedback.
> Please rewrite the generated Specification text with the following adjustments:
> 1. Correction in Introduction: Remove specific Hungarian focus, target English-speaking audience.
> 2. Clarification of Requirement Codes: Add a "Jelmagyarázat (Glossary)" section to explain FR, NFR, AUTH, etc.
> 3. Consistency Check: Ensure UI element descriptions match the actual English interface.

**Eredmény:** A specifikáció most már konzisztens az elkészült angol nyelvű szoftverrel, a szakmai rövidítések pedig közérthetővé váltak a hozzáadott glosszárium segítségével.


## 2. Prompt Engineering és Adminisztráció Támogatása
**Használt eszköz:** Google Gemini 2.5 Pro
**Cél:** A fejlesztés hatékonyságának növelése azáltal, hogy a GitHub Copilot számára (amely angolul és kontextus-alapúan működik a legjobban) precíz, strukturált, szakmai angol nyelvű utasításokat generáltatunk. Továbbá a projekt adminisztrációjának (AI naplózás) automatizálása a megfelelő Markdown formátum előállításával.

**Rekonstruált Promptok (Amiket a felhasználó a Gemininek adott):**

> **1. A Copilot Promptok Generálásához:**
> "Kérlek, írj nekem egy részletes, angol nyelvű promptot, amit bemásolhatok a GitHub Copilot Chat-be.
> A célom a következő feladat megoldása: [pl. README generálása, Dark Mode javítása].
> A prompt legyen strukturált, tartalmazza a technikai elvárásokat (pl. .NET 8, Clean Code), és lépésről lépésre instruálja az AI-t."

> **2. A Dokumentáció Formázásához:**
> "Az előzőleg megbeszélt folyamatot és a generált promptot formázd meg nekem úgy, hogy közvetlenül beilleszthessem az `AI_USAGE.md` (vagy log) fájlomba.
> Használd a projektben megszokott sablont:
> - Fejezetcím
> - Használt eszköz
> - Cél
> - Használt Prompt (idézetblokkban)
> - Eredmény"

**Eredmény:**
- **Minőségjavulás:** A Copilot sokkal pontosabb kódokat generált a strukturált angol parancsok hatására (pl. a `SEED` controller vagy a `JWT` implementáció esetén).
- **Időmegtakarítás:** A dokumentáció (naplózás) formázása automatikussá vált, így a fejlesztő a kódolásra és a rendszertervezésre fókuszálhatott.