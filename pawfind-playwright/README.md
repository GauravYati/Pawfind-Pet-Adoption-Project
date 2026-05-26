# PawFind Playwright

Playwright UI and API automation for the PawFind pet adoption app.

The main MERN application is kept in a different repository: `pawfind-mern`. This repository contains only the Playwright test project.

## Test Coverage

- Dashboard loads starter pet data
- Species filtering keeps pet cards at the fixed design size
- Search narrows results and updates the detail panel
- Demo-mode adoption inquiry form submits successfully
- Empty form submission is blocked
- Invalid name, email, and phone values are rejected
- Maximum input lengths are enforced
- Page refresh keeps the app usable
- API health endpoint responds
- API rejects empty and invalid inquiry payloads

## Project Structure

```text
pawfind-playwright/
  tests/
    api/             # API tests
    e2e/             # Browser end-to-end tests
    page-objects/    # Page Object Models
  scripts/           # Screenshot helper scripts
  playwright.config.js
  package.json
```

## Setup

Install dependencies:

```bash
npm.cmd install
```

Install Playwright browsers:

```bash
npx.cmd playwright install chromium
```

## Run Tests

Run all tests:

```bash
npm.cmd run test:e2e
```

Run in headed mode:

```bash
npm.cmd run test:e2e:headed
```

## App Dependency

By default, `playwright.config.js` expects the MERN project to be beside this folder:

```text
parent-folder/
  pawfind-mern/
  pawfind-playwright/
```

The test config starts:

- React client from `../pawfind-mern/client`
- Express API from `../pawfind-mern/server`

If the MERN app is stored somewhere else, update the `webServer` commands in `playwright.config.js`.

## Screenshots

Generate screenshots for the MERN README:

```bash
npm.cmd run screenshots
```
