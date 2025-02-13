
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

interface ReservationFormProps {
  tableId: number | null;
  onReservationComplete: () => void;
}

export const ReservationForm = ({ tableId, onReservationComplete }: ReservationFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availableHours, setAvailableHours] = useState<string[]>([]);

  useEffect(() => {
    if (date) {
      fetchAvailableHours();
    }
  }, [date, tableId]);

  const fetchAvailableHours = async () => {
    try {
      const response = await fetch(`/api/tables/${tableId}/availability?date=${date?.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch available hours');
      const data = await response.json();
      setAvailableHours(data.availableHours);
    } catch (error) {
      console.error('Error fetching available hours:', error);
      toast.error('Failed to fetch available hours');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !arrivalTime || !departureTime || !name || !email || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId,
          date,
          arrivalTime,
          departureTime,
          name,
          email,
          phone,
        }),
      });

      if (!response.ok) throw new Error('Failed to create reservation');

      toast.success("Reservation completed successfully!");
      onReservationComplete();
    } catch (error) {
      toast.error("Failed to create reservation");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-block px-4 py-1 bg-beach-ocean-light text-beach-ocean-dark rounded-full text-sm font-medium mb-2">
          Table {tableId}
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

        <div>
          <Label>Arrival Time</Label>
          <Select onValueChange={setArrivalTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {availableHours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Departure Time</Label>
          <Select onValueChange={setDepartureTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {availableHours
                .filter((hour) => hour > arrivalTime)
                .map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

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
