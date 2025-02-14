import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Umbrella, UtensilsCrossed } from "lucide-react";
import type { Table } from '@/types';

const initialTables: Table[] = [
  // Beach tables
  { id: 1, seats: 4, x: 200, y: 10, type: 'beach', isAvailable: true },
  { id: 2, seats: 2, x: 320, y: 10, type: 'beach', isAvailable: false },
  { id: 3, seats: 6, x: 550, y: 150, type: 'beach', isAvailable: true },
  // Restaurant tables
  { id: 4, seats: 4, x: 150, y: 350, type: 'restaurant', isAvailable: true },
  { id: 5, seats: 4, x: 350, y: 350, type: 'restaurant', isAvailable: true },
  { id: 6, seats: 8, x: 550, y: 350, type: 'restaurant', isAvailable: true },
];

interface TableMapProps {
  onSelectTable: (table: Table) => void;
}

export const TableMap = ({ onSelectTable }: TableMapProps) => {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);
  const [tables, setTables] = useState(initialTables);

  useEffect(() => {
    fetchTableAvailability();
  }, []);

  const fetchTableAvailability = async () => {
    try {
      const response = await fetch('/api/tables/availability');
      if (!response.ok) throw new Error('Failed to fetch table availability');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching table availability:', error);
    }
  };

  const handleTableClick = (table: Table) => {
    if (!table.isAvailable) {
      toast.error("This table is not available for the selected date");
      return;
    }
    onSelectTable(table);
    toast.success(`Selected ${table.type} table ${table.id} (${table.seats} seats)`);
  };

  const getTableSize = (seats: number) => {
    if (seats <= 2) return 'w-20 h-20';
    if (seats <= 4) return 'w-24 h-24';
    if (seats <= 6) return 'w-28 h-28';
    return 'w-32 h-32';
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-beach-sand to-beach-ocean-light rounded-xl p-16 overflow-hidden shadow-xl"
      style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'fit', // Ensures the image covers the whole container
        backgroundPosition: 'center', // Centers the background image
        // backgroundRepeat: 'no-repeat',  
      }}
    >
      <div className="absolute inset-0 bg-white/10 " />
      <div className="relative h-full">
        {tables.map((table) => (
          <motion.div
            key={table.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              table.isAvailable ? 'hover:scale-105' : ''
            }`}
            style={{ left: table.x, top: table.y }}
            onHoverStart={() => setHoveredTable(table.id)}
            onHoverEnd={() => setHoveredTable(null)}
            onClick={() => handleTableClick(table)}
          >
            <div
              className={`${getTableSize(table.seats)} rounded-full flex flex-col items-center justify-center ${
                table.isAvailable
                  ? 'bg-beach-ocean shadow-lg hover:bg-beach-ocean-dark' 
                  : 'bg-gray-400 opacity-90'
              } transition-all duration-200 border-4 border-white/50`}
            >
              {table.type === 'beach' ? (
                <Umbrella className="w-6 h-6 text-white mb-1" />
              ) : (
                <UtensilsCrossed className="w-6 h-6 text-white mb-1" />
              )}
              <span className="text-white font-medium">T{table.id}</span>
            </div>
            {hoveredTable === table.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-4 px-4 py-2 bg-white rounded-lg shadow-lg w-48"
              >
                <div className="text-sm font-medium text-gray-900">
                  {table.type === 'beach' ? 'Beach Table' : 'Restaurant Table'} {table.id}
                </div>
                <div className="text-sm text-gray-600">
                  {table.seats} seats
                </div>
                {table.type === 'restaurant' && (
                  <div className="mt-1 text-xs">
                    <p>Available sessions:</p>
                    <p>Lunch: 12:00-18:00</p>
                    <p>Dinner: 18:00-23:00</p>
                  </div>
                )}
                 <div className={`text-xs font-medium mt-1 ${
                    table.isAvailable ? 'text-beach-ocean-dark' : 'text-red-500'
                  }`}
                >
                  {table.isAvailable ? 'Available' : 'Not Available'}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TableMap;
