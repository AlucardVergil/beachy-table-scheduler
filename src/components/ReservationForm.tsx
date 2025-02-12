
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !arrivalTime || !departureTime || !name || !email || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Here you would typically make an API call to save the reservation
    console.log({
      tableId,
      date,
      arrivalTime,
      departureTime,
      name,
      email,
      phone
    });

    toast.success("Reservation completed successfully!");
    onReservationComplete();
  };

  const timeSlots = [
    "12:00", "13:00", "14:00", "15:00", "16:00", 
    "17:00", "18:00", "19:00", "20:00", "21:00"
  ];

  const departureTimeSlots = [
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

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
          <Label>Reservation Time</Label>
          <Select onValueChange={setArrivalTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Estimated Departure Time</Label>
          <Select onValueChange={setDepartureTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {departureTimeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
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
