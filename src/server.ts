
import express from 'express';
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

// API routes
app.post('/api/admin/login', (req, res) => adminLogin(req as ApiRequest, res as ApiResponse));
app.get('/api/tables/availability', (req, res) => tableAvailability(req as ApiRequest, res as ApiResponse));
app.get('/api/tables/:id/availability', (req, res) => singleTableAvailability(req as ApiRequest, res as ApiResponse));
app.post('/api/reservations', (req, res) => reservations(req as ApiRequest, res as ApiResponse));
app.get('/api/reservations', (req, res) => reservations(req as ApiRequest, res as ApiResponse));
app.put('/api/reservations/:id/cancel', (req, res) => cancelReservation(req as ApiRequest, res as ApiResponse));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
