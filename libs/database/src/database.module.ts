import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { GlobalConfigModule } from 'libs/config/global-config.module';

@Module({
  imports: [
    GlobalConfigModule,

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URL');
        const username = configService.get<string>('MONGODB_USERNAME');
        const password = configService.get<string>('MONGODB_PASSWORD');
        const config: MongooseModuleFactoryOptions = { uri, autoIndex: false };
        if (username && password) {
          config['auth'] = { username, password };
        }

        return config;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
