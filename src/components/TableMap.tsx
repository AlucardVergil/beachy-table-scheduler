import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Umbrella } from "lucide-react";

interface Table {
  id: number;
  seats: number;
  x: number;
  y: number;
  isAvailable: boolean;
  availableHours: string[];
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
  const [tablesWithAvailability, setTablesWithAvailability] = useState(tables);

  useEffect(() => {
    fetchTableAvailability();
  }, []);

  const fetchTableAvailability = async () => {
    try {
      const response = await fetch('/api/tables/availability');
      if (!response.ok) throw new Error('Failed to fetch table availability');
      const data = await response.json();
      setTablesWithAvailability(data);
    } catch (error) {
      console.error('Error fetching table availability:', error);
    }
  };

  const handleTableClick = (table: Table) => {
    if (!table.availableHours.length) {
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
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div className="relative h-full">
        {tablesWithAvailability.map((table) => (
          <motion.div
            key={table.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              table.availableHours.length > 0 ? 'hover:scale-105' : 'opacity-50'
            }`}
            style={{ left: table.x, top: table.y }}
            onHoverStart={() => setHoveredTable(table.id)}
            onHoverEnd={() => setHoveredTable(null)}
            onClick={() => handleTableClick(table)}
          >
            <div
              className={`${getTableSize(table.seats)} rounded-full flex flex-col items-center justify-center ${
                table.availableHours.length > 0
                  ? 'bg-beach-ocean shadow-lg hover:bg-beach-ocean-dark' 
                  : 'bg-gray-400'
              } transition-all duration-200 border-4 border-white/50`}
            >
              <Umbrella className="w-6 h-6 text-white mb-1" />
              <span className="text-white font-medium">T{table.id}</span>
            </div>
            {hoveredTable === table.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full -mt-4 px-4 py-2 bg-white rounded-lg shadow-lg w-48"
              >
                <div className="text-sm font-medium text-gray-900">
                  Table {table.id}
                </div>
                <div className="text-sm text-gray-600">
                  {table.seats} seats
                </div>
                {table.availableHours.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-beach-ocean-dark">Available Hours:</p>
                    <div className="mt-1 text-xs text-gray-600 max-h-24 overflow-y-auto">
                      {table.availableHours.map((hour, index) => (
                        <div key={index} className="py-0.5">{hour}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-500 font-medium mt-1">
                    No available hours
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

export default TableMap;
