# StudyNest — Student Academic Success Platform

A complete student-focused web app that runs on **free GitHub Pages** with no build process or server required.

## Included features

- Welcome screen with **guest mode**, plus optional **real Firebase email/password login** (not fake local passwords).
- Assignments: add/edit/delete, due dates, priorities, complete status, search, filters.
- Monthly calendar: assignments and study events, click any date to add items.
- Study schedule: subject, date, start time, duration.
- GPA calculator: editable courses, weighted credits, 4.0 grade points; what-if final-exam calculator.
- Focus/Pomodoro timer: custom focus/break duration, tracked time, browser alert at completion.
- Notes and flip flashcards.
- Learning resource finder: **Open Library** book search and **GitHub REST API** repository search, with saved links.
- Current city weather using **Open-Meteo** geocoding and forecast APIs.
- Dashboard and study analytics, due-date status, course completion charts.
- Optional browser notifications while the site is open, task backup JSON import/export, assignment CSV export.
- Responsive layout for phones and desktop; static hosting friendly.
- Existing browser data migration from the original Student Planner's `studentTasks` and `studentSchedule` keys where available.

## Start on your computer

1. Unzip the project folder.
2. Open `index.html` in a browser **or preferably serve with a local HTTP server**:
   - In VS Code, install **Live Server** and right-click `index.html` → **Open with Live Server**; or
   - In the project directory, run `python -m http.server 8000` and visit `http://localhost:8000`.
3. Click **Continue in free guest mode**. All built-in planner features work immediately.
4. Under **Resource Finder**, choose Books or Code, type a search, and click **Search API**. Requires internet.
5. Weather loads automatically on the dashboard with internet access.

NOTE: Opening `index.html` directly from `file://` can prevent JavaScript ES modules from loading. Use Live Server or GitHub Pages if the page is blank.

## Publish FREE with GitHub Pages

GitHub Pages is **static hosting**; it is not a general-purpose database or a provider of unlimited API keys. The site uses the **public GitHub REST API** from the browser to discover coding resources.

1. Log in to [github.com](https://github.com) and create a **public** repository, e.g. `studynest` (GitHub Free Pages requires a public repo).
2. Click **Add file → Upload files**. Upload the **contents** of this folder, not the outer folder or ZIP. `index.html` must appear at the repository root.
3. Commit the files to the `main` branch.
4. In the repository, go to **Settings → Pages → Build and deployment**.
5. Set **Source: Deploy from a branch**; **Branch: main**; **Folder: /(root)**; click **Save**.
6. Your address will usually be `https://YOUR-USERNAME.github.io/studynest/` (replace username and repository name). GitHub will show the actual URL under Settings → Pages.
7. Wait for the Pages deployment to finish (check the Actions tab if necessary), then open the site.
8. To update the site, replace/upload files and commit again. GitHub will republish.

Official GitHub instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Connect the free APIs (NO GitHub API key required)

The three public APIs are **already integrated**, and work automatically in the hosted site (internet needed). You don't create an API token just to use these:

| Provider | Feature | Endpoint used |
|---|---|---|
| GitHub REST API | Find public repositories for programming study | `https://api.github.com/search/repositories?q=python+in:name,description&sort=stars&per_page=12` |
| Open Library | Search educational books | `https://openlibrary.org/search.json?q=calculus&limit=12` |
| Open-Meteo | City search + current weather | `https://geocoding-api.open-meteo.com/v1/search?name=New%20York&count=1` then `https://api.open-meteo.com/v1/forecast?...` |

Try it: **Resource Finder → Code · GitHub REST API → Search**. Results come directly from GitHub's public JSON response, and each result links to its real repo. This is an API demonstration that can be shown to your professor.

**Rate limits:** GitHub's unauthenticated API has a shared IP-based hourly rate limit (typically 60 requests/hour). Searches may also face stricter secondary limits. When a request returns 403 or 429, wait and try again. **Never put a personal access token or secret key in a public GitHub Pages JavaScript file.** A token-protected or high-volume API requires a backend/proxy that keeps secrets private.

More API explanation and class-demo steps in [API_GUIDE.md](API_GUIDE.md).

## Optional real account sign-in and cloud sync

Guest mode saves information only in your current browser's `localStorage`. Cloud accounts and synchronized storage require setting up Firebase Authentication and Cloud Firestore, which have separate free-tier limits. Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md) to enable them. **Do not assume guest mode is a secure multi-user login.**

## Important limitations

- Login with Firebase is optional and disabled until you configure it; guest mode requires no key.
- GitHub Pages cannot protect browser secrets or run Node/Python server code.
- Study timer works while a tab is running. If the tab or browser is closed, no timer session is credited.
- Browser notifications are best-effort while the app is open, not guaranteed background or push delivery.
- Grades are only estimates on one 4.0 scale; universities set their own GPA policies.
- Book/repo/weather results require external services and are subject to their policies, quotas, CORS, and availability.
- There is no real Blackboard integration or automatic import of school assignments.
- Saved course notes are not encrypted in guest mode. Avoid entering sensitive personal information.
- Data can be moved between browsers using Settings → Export/Import JSON, or synced using optional Firebase.

## Project files

- `index.html` — layout and main screens
- `style.css` — responsive purple/white UI
- `app.js` — all application logic and public API requests
- `firebase-config.js` — OPTIONAL Firebase public web configuration
- `FIREBASE_SETUP.md` — step-by-step cloud setup and security rules
- `API_GUIDE.md` — public API request/response explanation and presentation demo
- `.nojekyll` — lets GitHub Pages serve files directly

## Technologies used
HTML5, CSS3, vanilla JavaScript ES modules, Fetch API, JSON, Local Storage, browser Notification API, GitHub REST API, Open Library Search API, Open-Meteo API; optional Firebase Auth + Cloud Firestore.

## Quick testing checklist

1. Guest → add an assignment → refresh → assignment persists.
2. Mark assignment complete; filter completed/pending.
3. Calendar shows new assignment; click its date.
4. Add a study session; check schedule and calendar.
5. Add a graded course → see GPA; adjust what-if exam parameters.
6. Settings → focus length 1 minute → finish a focus session → Analytics updates.
7. Create note + flashcard, flip it, and move between cards.
8. Search Open Library and GitHub; save a result.
9. Change city in Settings and view Dashboard weather.
10. Export backup, make a change, then re-import backup.
11. On mobile width, verify sidebar scroll and dashboard layout.
12. (Optional) Configure Firebase, create account, sign out/in, verify data reloads.
