import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import { applyDecorators, UseGuards } from '@nestjs/common';

@Injectable()
export class AdminWsJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true; // Skip for non-WebSocket contexts
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'excludeFromAuthGuard',
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const { handshake } = client;
    return {
      headers: {
        authorization: `Bearer ${handshake.auth.token}`,
      },
    };
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new WsException('Unauthorized');
    }
    const client = context.switchToWs().getClient();
    client.user = user; // Attach user to the client
    return user;
  }
}

export function WsJwtAuthGuard() {
  return applyDecorators(UseGuards(AdminWsJwtAuthGuard));
}
