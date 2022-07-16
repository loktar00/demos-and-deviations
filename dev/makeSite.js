import list from './list.json' assert { type: 'json'};
import path from 'path';
import { readFile } from "fs/promises";
import { writeFileSync } from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the index.html file
async function readIndex() {
    return readFile(path.join(__dirname, './index.html'), 'utf8')
        .then(data => {
            return data;
        });
}

(async () => {
    const fileData = await readIndex();

    const links = list.map(file => {
        return `<li><a href="demos/${file.name}">${file.name}</a></li>\n`;
    });

    const html = fileData.replace('{{main}}', `<ol>${links.join('')}</ol>`);

    writeFileSync(path.join(__dirname, '../index.html'), html);
})();
