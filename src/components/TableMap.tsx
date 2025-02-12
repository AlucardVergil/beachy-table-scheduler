
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";

interface Table {
  id: number;
  seats: number;
  x: number;
  y: number;
  isAvailable: boolean;
}

const tables: Table[] = [
  { id: 1, seats: 4, x: 20, y: 20, isAvailable: true },
  { id: 2, seats: 2, x: 120, y: 20, isAvailable: false },
  { id: 3, seats: 6, x: 220, y: 20, isAvailable: true },
  { id: 4, seats: 4, x: 20, y: 120, isAvailable: true },
  { id: 5, seats: 4, x: 120, y: 120, isAvailable: true },
  { id: 6, seats: 8, x: 220, y: 120, isAvailable: true },
];

interface TableMapProps {
  onSelectTable: (table: Table) => void;
}

export const TableMap = ({ onSelectTable }: TableMapProps) => {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);

  const handleTableClick = (table: Table) => {
    if (!table.isAvailable) {
      toast.error("This table is not available for the selected time");
      return;
    }
    onSelectTable(table);
    toast.success(`Selected table ${table.id} (${table.seats} seats)`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-beach-ocean-light rounded-lg p-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-beach-ocean-light/30" />
      <div className="relative">
        {tables.map((table) => (
          <motion.div
            key={table.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              table.isAvailable ? 'hover:scale-110' : 'opacity-50'
            }`}
            style={{ left: table.x, top: table.y }}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHoveredTable(table.id)}
            onHoverEnd={() => setHoveredTable(null)}
            onClick={() => handleTableClick(table)}
          >
            <div
              className={`p-4 rounded-lg ${
                table.isAvailable ? 'bg-beach-ocean hover:bg-beach-ocean-dark' : 'bg-gray-400'
              } transition-colors duration-200`}
            >
              <span className="text-white font-medium">T{table.id}</span>
            </div>
            {hoveredTable === table.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white rounded shadow-lg text-sm"
              >
                {table.seats} seats
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
