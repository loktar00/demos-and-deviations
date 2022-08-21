/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import path from 'path';
import { readFile } from 'fs/promises';
import fs from 'fs-extra';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

import list from '../dist/list.json' assert { type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the index.html file from the dist directory.
// Vite should have already thrown it in there.
async function readIndex() {
    return readFile(path.join(__dirname, '../dist/index.html'), 'utf8')
        .then(data => data).catch(err => { console.error(err); });
}

(async () => {
    const fileData = await readIndex();
    // Replace the first script tag with the list of demos
    const html = fileData.replace(/demoData=((.|\n)*)/, `demoData=${JSON.stringify(list)};`);

    // Overwrite the index.html file with the new data.
    writeFileSync(path.join(__dirname, '../dist/index.html'), html);

    // Copy the rest of the files
    try {
        fs.copySync(path.join(__dirname, '../public/'), path.join(__dirname,'../dist/'));
        console.log('public files copy succes!');
    } catch (err) {
        console.error(err);
    }

    try {
        fs.copySync(path.join(__dirname, '../src/demos'), path.join(__dirname, '../dist/demos'));
        console.log('demo copy succes!');
    } catch (err) {
        console.error(err);
    }
})();
