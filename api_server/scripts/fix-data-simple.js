
const { Client } = require('pg');

const client = new Client({
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 6543,
    user: 'postgres.ayyotvvjcwdoocdcouao',
    password: '92li!ra$Gu2',
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
});

async function fixData() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // 1. Fix Patient 500708
        console.log('Fixing Patient 500708...');
        const resPatient = await client.query(`
            UPDATE usuarios
            SET id_paciente = (SELECT id_paciente FROM pacientes WHERE carnet = '500708')
            WHERE carnet = '500708'
            RETURNING id_usuario, id_paciente;
        `);
        console.log('Patient Fix Result:', resPatient.rows[0] || 'No rows updated (maybe user/patient not found)');

        // 2. Fix Doctor 000772
        console.log('Fixing Doctor 000772...');
        const resDoctor = await client.query(`
            UPDATE usuarios
            SET id_medico = (SELECT id_medico FROM medicos WHERE carnet = '000772')
            WHERE carnet = '000772'
            RETURNING id_usuario, id_medico;
        `);
        console.log('Doctor Fix Result:', resDoctor.rows[0] || 'No rows updated (maybe user/doctor not found)');

    } catch (err) {
        console.error('Error executing fix:', err);
    } finally {
        await client.end();
        console.log('Disconnected.');
    }
}

fixData();
