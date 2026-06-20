import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const baseUrl = process.env.FETCH_BASE_URL ?? "http://localhost:3000";
const secret = process.env.CRON_SECRET;

if (!secret) {
  console.error("Missing CRON_SECRET in .env.local");
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/cron/fetch`, {
  headers: {
    Authorization: `Bearer ${secret}`,
  },
});

const payload = await response.json();
console.log(JSON.stringify(payload, null, 2));

if (!response.ok) {
  process.exit(1);
}
