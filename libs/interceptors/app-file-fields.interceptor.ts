import { Observable, tap } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { UploadOptions, transformUploadOptions } from 'nest-file-fastify';

import { getMultipartRequest } from 'nest-file-fastify/build/src/multipart/request';
import {
  UploadFieldMapEntry,
  handleMultipartFileFields,
  uploadFieldsToMap,
} from 'nest-file-fastify/build/src/multipart/handlers/file-fields';
import * as qs from 'qs';

export function AppFileFieldsInterceptor(
  uploadFields: string[],
  options?: UploadOptions,
  maxCount = 1,
  resultToArray = false,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private readonly options: UploadOptions;

    private readonly fieldsMap: Map<string, UploadFieldMapEntry>;

    constructor() {
      this.options = transformUploadOptions(options);
      this.fieldsMap = uploadFieldsToMap(
        uploadFields.map((name) => ({ name, maxCount })),
      );
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      const req = getMultipartRequest(ctx);

      const { body, files, remove } = await handleMultipartFileFields(
        req,
        this.fieldsMap,
        this.options,
      );
      const _body: Record<string, any> = qs.parse(qs.stringify(body));

      Object.keys(files).forEach((key) => {
        if (resultToArray) {
          _body[key] = files[key];
        } else {
          _body[key] = files[key][0];
        }
      });
      req.body = _body;

      return next.handle().pipe(tap(remove));
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
