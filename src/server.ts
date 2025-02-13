
import express, { RequestHandler } from 'express';
import { json } from 'express';
import cors from 'cors';
import { ApiRequest, ApiResponse } from './types/api';
import adminLogin from './pages/api/admin/login';
import reservations from './pages/api/reservations/index';
import cancelReservation from './pages/api/reservations/[id]/cancel';
import tableAvailability from './pages/api/tables/availability';
import singleTableAvailability from './pages/api/tables/[id]/availability';

const app = express();
const port = 8081;

app.use(json());
app.use(cors());

// Helper function to wrap our route handlers
const wrapHandler = (handler: (req: ApiRequest, res: ApiResponse) => Promise<void>): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req as ApiRequest, res as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
};

// API routes
app.post('/api/admin/login', wrapHandler(adminLogin));
app.get('/api/tables/availability', wrapHandler(tableAvailability));
app.get('/api/tables/:id/availability', wrapHandler(singleTableAvailability));
app.post('/api/reservations', wrapHandler(reservations));
app.get('/api/reservations', wrapHandler(reservations));
app.put('/api/reservations/:id/cancel', wrapHandler(cancelReservation));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
