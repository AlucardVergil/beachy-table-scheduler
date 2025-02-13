
import express from 'express';
import { json } from 'express';
import adminLogin from './pages/api/admin/login';
import reservations from './pages/api/reservations/index';
import cancelReservation from './pages/api/reservations/[id]/cancel';
import tableAvailability from './pages/api/tables/availability';
import singleTableAvailability from './pages/api/tables/[id]/availability';

const app = express();
const port = 8081;

app.use(json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API routes
app.post('/api/admin/login', adminLogin);
app.get('/api/tables/availability', tableAvailability);
app.get('/api/tables/:id/availability', singleTableAvailability);
app.post('/api/reservations', reservations);
app.get('/api/reservations', reservations);
app.put('/api/reservations/:id/cancel', cancelReservation);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
