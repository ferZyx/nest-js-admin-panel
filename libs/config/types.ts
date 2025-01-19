export class ServiceConfig {
  constructor(
    private HTTP_HOST: string,
    private HTTP_PORT: number,
    private NAME: string,
  ) {}

  get http_port() {
    return this.HTTP_PORT;
  }
  get http_host() {
    return this.HTTP_HOST;
  }
  get name() {
    return this.NAME;
  }

  get app_prefix() {
    return `/api/${this.NAME}`;
  }
  get swagger_url() {
    return `${this.app_prefix}/swagger`;
  }
  get api_url() {
    return `http://${this.http_host}:${this.http_port}${this.app_prefix}`;
  }
  get service_url() {
    return `http://${this.http_host}:${this.http_port}${this.swagger_url}`;
  }
}
