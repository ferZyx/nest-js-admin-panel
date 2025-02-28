import { DynamicModule, Module, Provider, Scope } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import Axios from 'axios';
import {
  AXIOS_INSTANCE_TOKEN,
  HTTP_MODULE_ID,
  HTTP_MODULE_OPTIONS,
} from './http.constants';
import { HttpService } from './http.service';
import {
  HttpModuleAsyncOptions,
  HttpModuleOptions,
  HttpModuleOptionsFactory,
} from './interfaces';

import { AxiosThrottler } from 'axios-throttler';

const createAxiosInstance = (config?: HttpModuleOptions) => {
  const axiosInstance = Axios.create(config);
  // axiosRetry(axiosInstance, {
  //   retries: 3,
  //   retryDelay: (rCount) => {
  //     return rCount * 5000;
  //   },
  // });
  if (config?.requestsPerSecond) {
    AxiosThrottler.throttle(
      axiosInstance,
      AxiosThrottler.rps(config.requestsPerSecond!),
    );
  }
  return axiosInstance;
};

@Module({
  providers: [
    HttpService,
    {
      provide: AXIOS_INSTANCE_TOKEN,
      useFactory: () => createAxiosInstance(),
    },
  ],
  exports: [HttpService],
})
export class HttpModule {
  static register(config: HttpModuleOptions): DynamicModule {
    return {
      module: HttpModule,
      providers: [
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useFactory: () => createAxiosInstance(config),
          scope: config.scope ?? Scope.DEFAULT,
        },
        {
          provide: HTTP_MODULE_ID,
          useValue: randomStringGenerator(),
          scope: config.scope ?? Scope.DEFAULT,
        },
      ],
    };
  }

  static registerAsync(options: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: HttpModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useFactory: (config: HttpModuleOptions) =>
            createAxiosInstance(config),
          inject: [HTTP_MODULE_OPTIONS],
          scope: options.scope ?? Scope.DEFAULT,
        },
        {
          provide: HTTP_MODULE_ID,
          useValue: randomStringGenerator(),
          scope: options.scope ?? Scope.DEFAULT,
        },
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    options: HttpModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const providers = [this.createAsyncOptionsProvider(options)];

    if (options.useClass)
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });

    return providers;
  }

  private static createAsyncOptionsProvider(
    options: HttpModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: HTTP_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    let inject;
    if (options.useExisting) inject = [options.useExisting];
    else if (options.useClass) inject = [options.useClass];

    return {
      provide: HTTP_MODULE_OPTIONS,
      useFactory: async (optionsFactory: HttpModuleOptionsFactory) =>
        optionsFactory.createHttpOptions(),
      inject,
    };
  }
}
