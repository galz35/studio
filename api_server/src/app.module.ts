import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { SeguimientoModule } from './seguimiento/seguimiento.module';
import { PsicosocialModule } from './psicosocial/psicosocial.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Make sure it reads from root
    }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    MedicoModule,
    PacienteModule,
    SeguimientoModule,
    PsicosocialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
