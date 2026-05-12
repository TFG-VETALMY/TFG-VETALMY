import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { Usuario } from './modules/usuarios/usuario.entity';
import { MascotasModule } from './modules/mascotas/mascotas.module';
import { Mascota } from './modules/mascotas/entities/mascota.entity';
import { CitasModule } from './modules/citas/citas.module';
import { Cita } from './modules/citas/entities/cita.entity';
import { HistorialModule } from './modules/historial/historial.module';
import { Historial } from './modules/historial/entities/historial.entity';
import { ChatModule } from './modules/chat/chat.module';
import { VacunasModule } from './modules/vacunas/vacunas.module';
import { EnfermedadesModule } from './modules/enfermedades/enfermedades.module';
import { Vacuna } from './modules/vacunas/entities/vacuna.entity';
import { Enfermedad } from './modules/enfermedades/entities/enfermedade.entity';
import { MensajesModule } from './modules/mensajes/mensajes.module';
import { Mensaje } from './modules/mensajes/entities/mensaje.entity';
import { Chat } from './modules/chat/entities/chat.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',

      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_URL ? undefined : '127.0.0.1',
      port: process.env.DATABASE_URL ? undefined : 5436,
      username: process.env.DATABASE_URL ? undefined : 'admin',
      password: process.env.DATABASE_URL ? undefined : 'admin',
      database: process.env.DATABASE_URL ? undefined : 'vet_db',
      entities: [Usuario, Mascota, Cita, Historial, Vacuna, Enfermedad, Mensaje, Chat],
      synchronize: true,

      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),


    UsuariosModule,
    MascotasModule,
    CitasModule,
    HistorialModule,
    ChatModule,
    VacunasModule,
    EnfermedadesModule,
    MensajesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }