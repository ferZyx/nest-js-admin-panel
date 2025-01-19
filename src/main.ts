import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 5555;

  const globalPrefix = 'api/admin-api';
  const DISK_FILES_PATH = process.env.DISK_FILES_PATH || 'midnyt-files';

  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets(resolve(`./${DISK_FILES_PATH}`), {
    prefix: `/${globalPrefix}/${DISK_FILES_PATH}`,
  });
  await app.listen(PORT, () => {
    console.log(`NEST APPLICATION IS RUNNING ON PORT ${PORT}`);
  });
}

bootstrap();
