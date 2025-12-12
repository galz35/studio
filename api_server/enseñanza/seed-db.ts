import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../src/entities/usuario.entity';
// Import other entities if needed, but strict mode might require importing all involved in relations
// For this simple seed we might get away with just Usuario if we disable synchronization or be careful.
// Ideally, we load all entities to avoid "Metadata not found" errors if we use repository patterns relying on relations.
import { Paciente } from '../src/entities/paciente.entity';
import { Medico } from '../src/entities/medico.entity';
import { Seguimiento } from '../src/entities/seguimiento.entity';
import { CitaMedica } from '../src/entities/cita-medica.entity';
import { CasoClinico } from '../src/entities/caso-clinico.entity';
import { AtencionMedica } from '../src/entities/atencion-medica.entity';
import { ChequeoBienestar } from '../src/entities/chequeo-bienestar.entity';
import { ExamenMedico } from '../src/entities/examen-medico.entity';
import { RegistroPsicosocial } from '../src/entities/registro-psicosocial.entity';
import { VacunaAplicada } from '../src/entities/vacuna-aplicada.entity';

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
    ssl: { rejectUnauthorized: false },
    entities: [
        Usuario,
        Paciente,
        Medico,
        Seguimiento,
        CitaMedica,
        CasoClinico,
        AtencionMedica,
        ChequeoBienestar,
        ExamenMedico,
        RegistroPsicosocial,
        VacunaAplicada
    ],
    synchronize: false, // We assume DB is already synced by the app
});

async function seedDatabase() {
    try {
        console.log('Connecting to database...');
        await AppDataSource.initialize();
        console.log('Database connected.');

        const usuarioRepo = AppDataSource.getRepository(Usuario);

        // Check if admin exists
        const adminEmail = 'admin@admin.com';
        const existingAdmin = await usuarioRepo.findOne({ where: { correo: adminEmail } });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists. Skipping seed.');
            return;
        }

        console.log('Creating default Admin user...');
        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        const newAdmin = usuarioRepo.create({
            carnet: 'ADMIN001',
            nombre_completo: 'Administrador del Sistema',
            correo: adminEmail,
            password_hash: hashedPassword,
            rol: 'ADMIN',
            pais: 'NI',
            estado: 'A',
            // Other fields have defaults or are nullable
        });

        await usuarioRepo.save(newAdmin);
        console.log('✅ Admin user created successfully!');
        console.log('   Email: admin@admin.com');
        console.log('   Password: Admin123!');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

seedDatabase();
