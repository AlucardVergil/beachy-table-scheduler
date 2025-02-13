
import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

export interface ApiRequest extends Request {
  query: ParsedQs;
  body: any;
}

export interface ApiResponse<T = any> extends Response {
  json: (body: T) => this;
  status: (code: number) => this;
}
