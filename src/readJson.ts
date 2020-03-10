import { promises as fs } from 'fs';
export async function readJson(file: string) {
    return JSON.parse((await fs.readFile(file)).toString());
}
