import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'symbols.json');

function readCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Cache read error:', err);
  }
  return {};
}

function writeCache(cache) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

export function getCached(symbol) {
  const key = symbol.toLowerCase().trim();
  const cache = readCache();
  return cache[key] || null;
}

export function setCache(symbol, data) {
  const key = symbol.toLowerCase().trim();
  const cache = readCache();
  cache[key] = data;
  writeCache(cache);
}
