import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PUZZLE_COUNT = 20;
const index = Math.floor(Math.random() * PUZZLE_COUNT);
const envPath = join(__dirname, '..', '.env.production');

writeFileSync(envPath, `VITE_PUZZLE_INDEX=${index}\n`);
console.warn(`[pick-puzzle] Selected puzzle index: ${index}`);
