import { container } from '@sapphire/framework';
import fs from 'fs';
import { join } from 'path';

export async function main() {
    const tmpDir = join(__dirname, '../../tmp/')
    const tmpFiles = fs.readdirSync(tmpDir)

    const now = Date.now()

    if (tmpFiles.length === 0) return 

    tmpFiles.forEach(file => {
        const filePath = join(tmpDir, file)
        const fileStat = fs.statSync(filePath)

        if (fileStat.mtimeMs < now - 1000 * 60 * 60 * 3 && file !== '.gitkeep') {
            fs.unlinkSync(filePath)
            container.logger.info(`deleting old file: ${file}`)
        }
    })
}

const config = {
    interval: 60 * 60 * 1000,
    name: 'clearFiles',
    runOnStart: true
}

export { config }