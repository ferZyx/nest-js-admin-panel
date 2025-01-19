import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private entityClass) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        let obj = data;
        if (data?.toJSON) {
          obj = data?.toJSON();
          // console.log(1);
        }
        if (data?.lean) {
          // console.log(2);

          obj = data?.lean();
        }

        // console.log(data);
        if (Array.isArray(obj)) {
          return obj.map((x) =>
            plainToInstance(this.entityClass, x, {
              enableImplicitConversion: true,
              strategy: 'excludeAll',
            }),
          );
        }

        return plainToInstance(this.entityClass, obj, {
          enableImplicitConversion: true,
          strategy: 'excludeAll',
        });
      }),
    );
  }
}

export function Lean(Class, isArray?, options?: ApiResponseOptions) {
  return applyDecorators(
    UseInterceptors(new TransformInterceptor(Class)),
    ApiResponse({ type: Class, isArray, ...options }), /// выполнение идёт снизу вверх ^
  );
}
