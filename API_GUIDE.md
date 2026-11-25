# API Guide — Student Planner final project

## First, understand the difference

- **GitHub Pages**: free hosting for static HTML/CSS/JS. It is NOT an API key service and it does not store private user accounts or execute server-side JavaScript.
- **GitHub REST API**: a public HTTP API at `api.github.com`. Our website uses it to fetch programming resources as JSON.
- **Open Library API**: fetches book details as JSON.
- **Open-Meteo API**: fetches city coordinates and weather as JSON.
- **Firebase (optional)**: a separate Google product used for true login and a cloud database; it is not provided by GitHub.

## API #1: GitHub REST API — already working

In `app.js`, find `searchResources()`.

A search for Python calls this public URL (shown decoded for clarity):

`https://api.github.com/search/repositories?q=python%20in%3Aname%2Cdescription&sort=stars&per_page=12`

GitHub returns JSON containing `items`, including:
- `full_name`: repository name, e.g. `owner/project`
- `description`: description of the project
- `html_url`: direct project link
- `stargazers_count`: number of stars

The code uses `fetch()` to get the data, then draws a list of real repository results. No GitHub account, login, API token or GitHub App is needed for basic public searches. Unauthenticated requests are rate-limited per IP; search limits can be tighter than general API limits. Do not put GitHub access tokens in your public website.

**Demo**: Go to Resource Finder → select **Code · GitHub REST API** → search `python` → show the live repository list → save a link → go to Saved resources.

Official documentation: https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories and https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api

## API #2: Open Library Search API — already working

In `app.js`, find `searchResources()` and the `books` branch.

Example URL:

`https://openlibrary.org/search.json?q=organic%20chemistry&limit=12&fields=key,title,author_name,first_publish_year,cover_i`

The API returns `docs` containing titles, authors, publication year and cover IDs. The webpage displays these details and links to the Open Library work page. Covers use `https://covers.openlibrary.org/b/id/COVER-ID-S.jpg`.

**Demo**: Resource Finder → **Books · Open Library API** → search `calculus` → show live results → open a book link.

Docs: https://openlibrary.org/dev/docs/api/search

## API #3: Open-Meteo — already working

In `app.js`, find `loadWeather()`.

Step 1: Find city coordinates:

`https://geocoding-api.open-meteo.com/v1/search?name=New%20York&count=1&language=en&format=json`

Step 2: Use returned latitude and longitude to get current temperature, humidity and weather code:

`https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`

**Demo**: Go to Settings → change Weather city → Save → Dashboard → see the live weather. No key required for typical noncommercial usage, subject to usage policies.

Docs: https://open-meteo.com/en/docs and https://open-meteo.com/en/docs/geocoding-api

## What to say in your final report

> The platform uses the browser Fetch API to send HTTP requests to three external REST APIs. It parses JSON responses and displays live book information, open-source programming repositories, and weather data. Error handling covers failed requests, network problems and rate limits. Student-created content is stored in local browser storage in guest mode, while optional Firebase Authentication and Cloud Firestore can provide per-account cloud persistence.

### Testing and evidence to include in the report

1. Screenshot of the Resource Finder showing GitHub API results for `python`.
2. Screenshot of Open Library results for `calculus`.
3. Screenshot of the Dashboard showing weather and a selected city.
4. In Chrome: right-click → Inspect → **Network** → search again → click the request to `api.github.com` / `openlibrary.org` / `api.open-meteo.com` → show **Status 200** and the **Response** JSON.
5. Screenshot of Assignments, Calendar, Grade Calculator and Analytics after entering sample information.
6. Explain that browser requests cannot safely contain a secret token; GitHub public search uses an unauthenticated, rate-limited endpoint instead.

## How to update the API search

Change the `q` parameters in `searchResources()`. The website already uses `URL` + `searchParams` and `encodeURIComponent()` so query text is encoded safely. Use the official providers' docs for any new parameters.
