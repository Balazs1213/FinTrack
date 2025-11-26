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