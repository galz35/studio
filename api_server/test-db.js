require('dotenv').config();
const { Client } = require('pg');

async function testConnection(config, name) {
    console.log(`\nTesting ${name}:`);
    console.log(`  Host: ${config.host}`);
    console.log(`  Port: ${config.port}`);
    console.log(`  User: ${config.user}`);

    const client = new Client(config);
    try {
        await client.connect();
        console.log(`  ✅ SUCCESS! Connected to ${name}.`);
        await client.end();
        return true;
    } catch (err) {
        console.error(`  ❌ FAILED ${name}: ${err.message} (Code: ${err.code})`);
        return false;
    }
}

async function main() {
    // 1. Test Configuration from .env
    const envConfig = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
    };

    const envSuccess = await testConnection(envConfig, 'ENV Configuration');

    if (envSuccess) {
        console.log('\n✅ The current .env configuration is working!');
        process.exit(0);
    }

    // 2. Try to guess Direct Connection (Port 5432)
    // Extract project ID from user (postgres.start_of_id...)
    // Format: postgres.[project-ref]
    const projectId = envConfig.user.split('.')[1];
    if (projectId) {
        const directConfig = {
            ...envConfig,
            host: `db.${projectId}.supabase.co`,
            port: 5432,
        };

        const directSuccess = await testConnection(directConfig, 'Direct Connection (Port 5432)');

        if (directSuccess) {
            console.log('\n✨ SOLUTION FOUND!');
            console.log('Update your .env file with these values:');
            console.log(`DB_HOST="${directConfig.host}"`);
            console.log(`DB_PORT=5432`);
            process.exit(0);
        }
    }

    console.log('\n❌ All attempts failed. Please check your internet connection or firewall settings.');
    process.exit(1);
}

main();
