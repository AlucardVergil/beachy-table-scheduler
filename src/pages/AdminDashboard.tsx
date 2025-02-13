
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Reservation } from '@/types';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    fetchReservations();
  }, [isAuthenticated, navigate]);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      toast.error('Failed to load reservations');
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to cancel reservation');
      toast.success('Reservation cancelled successfully');
      fetchReservations();
    } catch (error) {
      toast.error('Failed to cancel reservation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beach-sand to-beach-ocean-light p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reservations Dashboard</h1>
          <Button onClick={() => logout()} variant="outline">
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">Table {reservation.tableId}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(reservation.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">{reservation.name} - {reservation.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    reservation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {reservation.status}
                  </span>
                  {reservation.status === 'active' && (
                    <Button
                      onClick={() => handleCancelReservation(reservation._id!)}
                      variant="destructive"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
