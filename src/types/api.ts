
import { Request, Response } from 'express';
import { ParsedQs } from 'qs';

export interface ApiRequest extends Request {
  query: ParsedQs;
  body: any;
}

export interface ApiResponse extends Response {
  json: (body: any) => ApiResponse;
  status: (code: number) => ApiResponse;
}
