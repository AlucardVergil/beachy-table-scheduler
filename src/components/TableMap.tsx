
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Umbrella } from "lucide-react";

interface Table {
  id: number;
  seats: number;
  x: number;
  y: number;
  isAvailable: boolean;
  availableHours: string[]
}

const tables: Table[] = [
  { id: 1, seats: 4, x: 200, y: 10, isAvailable: true, availableHours: ["13:00", "14:00", "16:00"] },
  { id: 2, seats: 2, x: 320, y: 10, isAvailable: false, availableHours: [] },
  { id: 3, seats: 6, x: 550, y: 150, isAvailable: true, availableHours: ["13:00", "15:00", "18:00"] },
  { id: 4, seats: 4, x: 150, y: 350, isAvailable: true, availableHours: ["12:00", "17:00"] },
  { id: 5, seats: 4, x: 350, y: 350, isAvailable: true, availableHours: ["14:00", "19:00"] },
  { id: 6, seats: 8, x: 550, y: 350, isAvailable: true, availableHours: ["12:00", "15:00", "20:00"] },
];


interface TableMapProps {
  onSelectTable: (table: Table) => void;
}

export const TableMap = ({ onSelectTable }: TableMapProps) => {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);

  const handleTableClick = (table: Table) => {
    if (!table.isAvailable) {
      onSelectTable(null);
      toast.error("This table is not available for the selected time");
      return;
    }
    onSelectTable(table);
    toast.success(`Selected table ${table.id} (${table.seats} seats)`);
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
      <div className="absolute inset-0 bg-white/10 " /> {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" /> */}
      <div className="relative h-full">
        {tables.map((table) => (
          <motion.div
            key={table.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              table.isAvailable ? 'hover:scale-110' : ''
            }`}
            style={{ left: table.x, top: table.y }}
            // whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHoveredTable(table.id)}
            onHoverEnd={() => setHoveredTable(null)}
            onClick={() => handleTableClick(table)}
          >
            <div
              className={`${getTableSize(table.seats)} rounded-full flex flex-col items-center justify-center ${
                table.isAvailable 
                  ? 'bg-beach-ocean shadow-lg hover:bg-beach-ocean-dark' 
                  : 'bg-gray-400 opacity-100'
              } transition-all duration-200 border-4 border-white/50`}
            >
              <Umbrella className="w-6 h-6 text-white mb-1" />
              <span className="text-white font-medium">T{table.id}</span>
            </div>
            {hoveredTable === table.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-4 px-4 py-2 bg-white rounded-lg shadow-lg"
              >
                <div className="text-sm font-medium text-gray-900">
                  Table {table.id}
                </div>
                <div className="text-sm text-gray-600">
                  {table.seats} seats
                </div>
                <div className={`text-xs font-medium mt-1 ${
                    table.isAvailable ? 'text-beach-ocean-dark' : 'text-red-500'
                  }`}
                >
                  {table.isAvailable ? 'Available' : 'Not Available'}
                </div>

                {table.isAvailable && (
                  <div className="mt-2 text-xs text-gray-700">
                    <strong>Free Hours:</strong>
                    <ul className="list-disc ml-4">
                      {table.availableHours.length > 0 ? (
                        table.availableHours.map((hour) => (
                          <li key={hour}>{hour}</li>
                        ))
                      ) : (
                        <li>No free slots</li>
                      )}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
