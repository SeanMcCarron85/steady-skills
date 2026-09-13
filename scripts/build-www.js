#!/usr/bin/env node
/**
 * Copy static game assets into www/ for Capacitor webDir.
 * Keeps repo root playable as a plain static server.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const www = path.join(root, "www");

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

rmrf(www);
fs.mkdirSync(www, { recursive: true });

const files = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "sw.js"
];

for (const f of files) {
  const src = path.join(root, f);
  if (!fs.existsSync(src)) {
    console.error("Missing required file:", f);
    process.exit(1);
  }
  copyFile(src, path.join(www, f));
}

copyDir(path.join(root, "icons"), path.join(www, "icons"));

console.log("Built www/ for Capacitor (webDir).");
