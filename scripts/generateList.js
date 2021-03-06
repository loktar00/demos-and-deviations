// Get all of the demo directories and build the links.
import path from 'path';
import { readdir } from "fs/promises";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from 'url';
import { getFile } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../demos');

// Grabs all the directories in /demos
async function generateListOfDemos(basePath) {
    return readdir(basePath, (err, files) => {
        if (err) {
            console.log(err);
        }

        return files;
    });
}

(async () => {
    const demos = await generateListOfDemos(basePath);
    const destiniationDirectory = path.join(__dirname, '../dist/demos');

    // Create the dist directory
    if (!existsSync(destiniationDirectory)) {
        mkdirSync(destiniationDirectory, { recursive: true });
    }

    let fileList = [];

    for (const demo of demos) {
        const tagData = await getFile(`${basePath}/${demo}/tags.json`);
        let tagJSON = {};

        try {
            tagJSON = JSON.parse(tagData);
        } catch (e) {
            console.error(e);
        }

        let generatedIndex = null;
        const demoDirectory = path.join(__dirname, `../dist/demos/${demo}`);
        const codepenIndex = await getFile('./templates/codepen.html');
        const dwitterIndex = await getFile('./templates/dwitter.html');

        switch(tagJSON?.type) {
            case 'dwitter':
                const dwitterCode = await getFile(`${basePath}/${demo}/dwitter.txt`);
                generatedIndex = dwitterIndex.replaceAll('{{dwitter_code}}', dwitterCode);

                if (!existsSync(demoDirectory)) {
                    mkdirSync(demoDirectory, { recursive: true });
                }

                writeFileSync(`${demoDirectory}/index.html`, generatedIndex);
                break;
            case 'codepen':
                const codepenHtml = await getFile(`${basePath}/${demo}/markup.html`);
                generatedIndex = codepenIndex.replaceAll('{{html}}', codepenHtml);

                // Quite a few of my pens use datgui just include it if we need it.
                // Idea of this repo is to keep all my work working so self hosting it
                generatedIndex = generatedIndex.replaceAll('{{datgui}}', `<script src='../../js/datgui.min.js'></script>`);

                if (!existsSync(demoDirectory)) {
                    mkdirSync(demoDirectory, { recursive: true });
                }

                writeFileSync(`${demoDirectory}/index.html`, generatedIndex);
                break;
        }

        fileList.push({
            name: demo,
            tags: tagJSON?.tags || [],
            description: tagJSON?.description || ''
        })
    }

    writeFileSync(path.join(__dirname, '../dist/list.json'), JSON.stringify(fileList, null, 2));
})();





