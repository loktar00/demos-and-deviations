// Get all of the demo directories and build the links.
import path from 'path';
import { readdir } from "fs/promises";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseBath = path.join(__dirname, '../demos');

async function generateListOfFiles(basePath) {
    return readdir(baseBath, (err, files) => {
        if (err) {
            console.log(err);
        }

        return files;
    });
}

(async () => {
    const files = await generateListOfFiles(baseBath);
    const destiniationDirectory = path.join(__dirname, '../dist');

    const fileList = files.map(file => {
        return {
            name: file,
            tags: []
        }
    });

    if (!existsSync(destiniationDirectory)) {
        mkdirSync(destiniationDirectory);
    }

    writeFileSync(`${destiniationDirectory}/list.json`, JSON.stringify(fileList, null, 2));
})();





