
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Table, RESTAURANT_TIME_SLOTS } from '@/types';

interface ReservationFormProps {
  table: Table;
  onReservationComplete: () => void;
}

const API_URL = 'http://localhost:8081';

export const ReservationForm = ({ table, onReservationComplete }: ReservationFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<'lunch' | 'dinner' | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'notify'>('notify');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !name || !email || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (table.type === 'restaurant' && !timeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: table.id,
          date,
          timeSlot: table.type === 'restaurant' ? timeSlot : null,
          name,
          email,
          phone,
          type: table.type,
          paymentStatus: paymentMethod === 'card' ? 'pending' : 'not_required',
        }),
      });

      if (!response.ok) throw new Error('Failed to create reservation');

      if (paymentMethod === 'card') {
        // TODO: Implement Stripe payment flow
        toast.info("Payment functionality coming soon!");
      } else {
        toast.success("Reservation request sent! Admin will be notified.");
      }

      onReservationComplete();
    } catch (error) {
      toast.error("Failed to create reservation");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-1 bg-beach-ocean-light text-beach-ocean-dark rounded-full text-sm font-medium mb-2">
          {table.type === 'beach' ? 'Beach' : 'Restaurant'} Table {table.id}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Make a Reservation</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />
        </div>

        {table.type === 'restaurant' && (
          <div>
            <Label>Time Slot</Label>
            <Select onValueChange={(value: 'lunch' | 'dinner') => setTimeSlot(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunch">{RESTAURANT_TIME_SLOTS.lunch}</SelectItem>
                <SelectItem value="dinner">{RESTAURANT_TIME_SLOTS.dinner}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label>Payment Method</Label>
          <Select onValueChange={(value: 'card' | 'notify') => setPaymentMethod(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Pay by Card</SelectItem>
              <SelectItem value="notify">Notify Admin Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-beach-ocean hover:bg-beach-ocean-dark transition-colors"
        >
          Complete Reservation
        </Button>
      </div>
    </form>
  );
};
