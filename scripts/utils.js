import { readFile } from "fs/promises";

// Loads the file in the directory
export async function getFile(file) {
    return readFile(file, 'utf8')
        .then(data => {
            return data;
        })
        .catch(err => {
            return null;
        });
}