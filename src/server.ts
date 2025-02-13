
import express, { Request, Response, NextFunction } from 'express';
import { json } from 'express';
import cors from 'cors';
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
app.post('/api/admin/login', (req: Request, res: Response) => adminLogin(req, res));
app.get('/api/tables/availability', (req: Request, res: Response) => tableAvailability(req, res));
app.get('/api/tables/:id/availability', (req: Request, res: Response) => singleTableAvailability(req, res));
app.post('/api/reservations', (req: Request, res: Response) => reservations(req, res));
app.get('/api/reservations', (req: Request, res: Response) => reservations(req, res));
app.put('/api/reservations/:id/cancel', (req: Request, res: Response) => cancelReservation(req, res));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
