import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { throwError } from 'rxjs';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  logger = new Logger(AppExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const hostType = host.getType();
    // console.log(exception);

    const status = exception.status ?? 400;

    if (hostType == 'rpc') {
      const ctx = host.switchToRpc();
      if (exception.name == 'AxiosError') {
        this.logger.error(exception.response?.data);
        return throwError(() => exception);
      } else {
        const context = ctx.getContext().args[1];
        this.logger.error(context);
        this.logger.error(exception.message);
        this.logger.error(exception.response);
      }

      return throwError(() => exception);
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    switch (exception.name) {
      case 'AggregateError':
        this.logger.error(
          `[${status}][${hostType}][${response?.request?.url}] Сервис не доступен`,
        );

        this.logger.error(JSON.stringify(response?.request?.body));

        response
          .status(400)
          .send({ message: 'Сервис не доступен, попробуйте позднее' });
        break;
      case 'DocumentNotFoundError':
        response
          .status(400)
          .send({ ...exception, message: 'Не найдено, обновите страницу' });
        break;

      case 'ValidationError':
        const key = Object.keys(exception.errors).pop();

        if (key) {
          response.status(status).send(exception.errors[key]);
        } else {
          response.status(status).send(exception);
        }
        break;
      case 'HttpException':
      case 'BadRequestException':
      case 'ForbiddenException':
        if (Array.isArray(exception.response?.message)) {
          return response.status(status).send({
            ...exception.response,
            message: exception.response.message[0],
          });
        }
        if (typeof exception.response == 'string') {
          return response.status(status).send({ message: exception.response });
        }
        response.status(status).send(exception.response);
        break;
      case 'MongoServerError':
        switch (exception.code) {
          case 11000:
            const message = `Такая запись уже существуют`;
            return response.status(status).send({ message });
          default:
            return response.status(status).send(exception);
        }
      case 'UnauthorizedException':
        // const request: FastifyRequest = ctx.getRequest();

        // this.logger.warn(`[401] ${request.url}`);
        response.clearCookie && response.clearCookie('token');
        return response.status(status).send(exception);

      case 'ValidationErrorException':
        this.logger.log('ValidationErrorException');
        const data = exception.getData();
        return response.status(status).send(data);
      case 'AxiosError':
        return response
          .status(400)
          .send((exception as AxiosError).response?.data);
      case 'Error':
        if (exception.code === 'ECONNREFUSED') {
          this.logger.error(hostType, exception);

          response.status(400).send({
            message: 'Сервис временно не доступен',
            detail: exception,
          });
          break;
        }

      default:
        try {
          // console.log(host.getArgByIndex(0));

          this.logger.error(`[${hostType}][${status}]`, exception);
          response
            .status(500)
            .send(
              exception.response ||
                exception.errors ||
                exception.message ||
                exception,
            );
        } catch (error) {
          return response
            .status(500)
            .send({ message: 'Ошибка сервера', error: `${error}` });
        }
        break;
    }
  }
}
