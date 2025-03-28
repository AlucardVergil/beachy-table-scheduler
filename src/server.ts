import express, { RequestHandler } from 'express';
import { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApiRequest, ApiResponse } from './types/api';
import adminLogin from './pages/api/admin/login';
import reservations from './pages/api/reservations/index';
import cancelReservation from './pages/api/reservations/[id]/cancel';
import tableAvailability from './pages/api/tables/availability';
import singleTableAvailability from './pages/api/tables/[id]/availability';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.API_URL 
    : 'http://localhost:5173',
  credentials: true
}));

// Helper function to wrap API handlers
const wrapHandler = (handler: (req: ApiRequest, res: ApiResponse) => Promise<ApiResponse>): RequestHandler => {
  return async (req, res) => {
    try {
      await handler(req as ApiRequest, res as ApiResponse);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// API routes
app.post('/api/admin/login', wrapHandler(adminLogin));
app.get('/api/reservations', wrapHandler(reservations));
app.post('/api/reservations', wrapHandler(reservations));
app.put('/api/reservations/:id/cancel', wrapHandler(cancelReservation));
app.get('/api/tables/availability', wrapHandler(tableAvailability));
app.get('/api/tables/:id/availability', wrapHandler(singleTableAvailability));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
