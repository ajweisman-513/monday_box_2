import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

export const loadConfig = (filename) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const configPath = process.env.NODE_ENV === 'production'
        ? `/etc/secrets/${filename}`
        : path.join(__dirname, `../config/${filename}`);

    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
};
