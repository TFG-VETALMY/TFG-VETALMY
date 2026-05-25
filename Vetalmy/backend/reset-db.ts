import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  await dataSource.synchronize(true);
  console.log('✨ Database wiped and schema recreated successfully!');
  await app.close();
}
bootstrap();
