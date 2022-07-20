// Get all of the demo directories and build the links.
import path from 'path';
import { readdir, readFile } from "fs/promises";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from 'url';

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

// Loads the file in the directory
async function getFile(file) {
    return readFile(file, 'utf8')
        .then(data => {
            return data;
        })
        .catch(err => console.log(err));
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

        if (tagJSON?.type === 'dwitter') {
            const dwitterIndex = await getFile('./templates/dwitter.html');
            const dwitterCode = await getFile(`${basePath}/${demo}/dwitter.txt`);
            const generatedIndex = dwitterIndex.replaceAll('{{dwitter_code}}', dwitterCode);
            const demoDirectory = path.join(__dirname, `../dist/demos/${demo}`);

            if (!existsSync(demoDirectory)) {
                mkdirSync(demoDirectory, { recursive: true });
            }

            writeFileSync(`${demoDirectory}/index.html`, generatedIndex);
        }

        fileList.push({
            name: demo,
            tags: tagJSON?.tags || [],
            description: tagJSON?.description || ''
        })
    }

    writeFileSync(path.join(__dirname, '../dist/list.json'), JSON.stringify(fileList, null, 2));
})();





