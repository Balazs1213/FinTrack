## 1. Specifikáció Bővítése
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


## 2. Specifikáció Finomhangolása és Jelmagyarázat
**Használt eszköz:** GitHub Copilot Chat (@workspace)
**Cél:** A specifikáció szövegének pontosítása a valós alkalmazáshoz igazodva. A célcsoport módosítása (nemzetközi/angol nyelvű), a UI elemek megnevezésének javítása (magyarról angolra), valamint a technikai rövidítések (FR, NFR, SEC) feloldása egy új "Jelmagyarázat" fejezetben az érthetőség kedvéért.

**Használt Prompt:**
> @workspace I need to refine the Hungarian Specification Document based on feedback.
> Please rewrite the generated Specification text with the following adjustments:
> 1. Correction in Introduction: Remove specific Hungarian focus, target English-speaking audience.
> 2. Clarification of Requirement Codes: Add a "Jelmagyarázat (Glossary)" section to explain FR, NFR, AUTH, etc.
> 3. Consistency Check: Ensure UI element descriptions match the actual English interface.

**Eredmény:** A specifikáció most már konzisztens az elkészült angol nyelvű szoftverrel, a szakmai rövidítések pedig közérthetővé váltak a hozzáadott glosszárium segítségével.