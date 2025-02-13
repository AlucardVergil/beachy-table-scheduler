
import { Request, Response } from 'express';

export interface ApiRequest extends Request {
  query: {
    [key: string]: string | string[];
  };
  body: any;
}

export interface ApiResponse<T = any> extends Response {
  json: (body: T) => this;
  status: (code: number) => this;
}
