import mongoose from 'mongoose';
import fs from 'fs';
import { container } from '@sapphire/framework';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yews-rewrite';

export async function initializeMongooseClient() {
    await mongoose.connect(MONGO_URI)
    await loadSchemas();
    container.logger.info('Connected to MongoDB');
}

function loadSchemas() {
    const files = fs.readdirSync('./src/db/schemas');
    files.forEach(file => {
        const slicedFile = file.slice(0, -3);
        container.logger.info(`Loading MongoDB Schema: ${slicedFile}`);
        require(`./schemas/${slicedFile}`);
    });
    container.logger.info('Loaded MongoDB Schemas');
}

export { mongoose };