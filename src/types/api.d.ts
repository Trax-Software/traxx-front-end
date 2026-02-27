/**
 * Interface padrão para erros retornados pelo NestJS
 */
interface NestApiError {
    message: string | string[];
    error: string;
    statusCode: number;
  }