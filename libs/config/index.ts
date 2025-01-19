/* eslint-disable prettier/prettier */
import { ServiceConfig } from './types';

export const CONFIG = {
  ADMIN_API: new ServiceConfig('127.0.0.1', 1200, 'admin-api'),
} as const;

const ports = new Set();
Object.values(CONFIG).forEach((x) => {
  if (!ports.has(x.http_port)) {
    ports.add(x.http_port);
  } else {
    throw `Одиннаковый порт ${x.http_port} ${x.name}`;
  }
});
