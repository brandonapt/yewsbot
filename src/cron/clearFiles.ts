import { container } from '@sapphire/framework';
import fs from 'fs';
import { join } from 'path';

export async function main() {
    const tmpDir = join(__dirname, '../../tmp/')
    const tmpFiles = fs.readdirSync(tmpDir)

    const now = Date.now()

    tmpFiles.forEach(file => {
        const filePath = join(tmpDir, file)
        const fileStat = fs.statSync(filePath)
        container.logger.info(`deleting old file: ${file}`)
        if (fileStat.mtimeMs < now - 1000 * 60 * 60 * 3) {
            fs.unlinkSync(filePath)
        }
    })
}

const config = {
    interval: 60 * 60 * 1000,
    name: 'clearFiles',
    runOnStart: true
}

export { config }