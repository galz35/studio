import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
const envPath = path.resolve(__dirname, '../.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }, // Adjust based on your actual SSL needs, keeping generic for now matching app module
    entities: [],
    synchronize: false,
});

async function cleanDatabase() {
    try {
        console.log('Connecting to database...');
        await AppDataSource.initialize();
        console.log('Database connected.');

        const tables = await AppDataSource.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE';
        `);

        const tableNames = tables
            .map((t: any) => `"${t.table_name}"`)
            .filter((t: string) => t !== '"migrations"'); // Optional: Exclude migrations table if exists

        if (tableNames.length === 0) {
            console.log('No tables found to clean.');
            return;
        }

        console.log(`Found tables: ${tableNames.join(', ')}`);

        // Truncate all tables
        console.log('Truncating tables...');
        await AppDataSource.query(`TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY CASCADE;`);

        console.log('All tables cleaned successfully.');

    } catch (error) {
        console.error('Error cleaning database:', error);
        process.exit(1);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

cleanDatabase();
