
import { Request, Response } from 'express';

export interface ApiRequest extends Request {
  query: {
    [key: string]: string | string[];
  };
  body: any;
}

export interface ApiResponse extends Response {
  json: (body: any) => ApiResponse;
  status: (code: number) => ApiResponse;
}
