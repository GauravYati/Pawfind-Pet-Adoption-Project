# Playwright Test Cases

This folder contains end-to-end tests for the pet adoption React UI. Tests use Page Object Models from `tests/page-objects` so page locators and actions stay separate from test assertions.

## Covered Flows

- Dashboard renders starter pet data
- Species filtering keeps cards at the intended fixed size
- Search narrows pet results and updates the detail panel
- Demo-mode adoption inquiry form shows the fallback confirmation
- Empty and invalid inquiry submissions are blocked
- Maximum input lengths are enforced
- Refreshing the page keeps the app usable

## Run

```bash
cd pawfind-playwright
npm.cmd run test:e2e
```

Use headed mode when you want to watch the browser:

```bash
cd pawfind-playwright
npm.cmd run test:e2e:headed
```
