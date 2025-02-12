
import { useState } from 'react';
import { TableMap } from '@/components/TableMap';
import { ReservationForm } from '@/components/ReservationForm';
import { motion, AnimatePresence } from 'framer-motion';

interface Table {
  id: number;
  seats: number;
  x: number;
  y: number;
  isAvailable: boolean;
}

const Index = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const handleReservationComplete = () => {
    setSelectedTable(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beach-sand to-beach-ocean-light p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Beach Bar Reservations</h1>
          <p className="text-lg text-gray-600">Select a table to make your reservation</p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <TableMap onSelectTable={setSelectedTable} />
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedTable ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-xl mx-auto"
              >
                <ReservationForm
                  tableId={selectedTable.id}
                  onReservationComplete={handleReservationComplete}
                />
              </motion.div>
            ) : (
              <motion.div
                key="instructions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg max-w-xl mx-auto">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Reserve</h2>
                  <ol className="text-left text-gray-600 space-y-2">
                    <li>1. Select an available table from the map</li>
                    <li>2. Choose your preferred date and time</li>
                    <li>3. Fill in your contact details</li>
                    <li>4. Confirm your reservation</li>
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Index;
