# API Test Cases

These Playwright API tests verify the Express backend without needing MongoDB to be connected.

## Covered Flows

- Health endpoint responds and reports database status
- Empty inquiry payloads return `400`
- Malformed pet ids return `400`
- Invalid email payloads return `400`

## Run

```bash
cd pawfind-playwright
npm.cmd run test:e2e
```
