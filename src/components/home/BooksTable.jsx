import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion'; // Added for animations

const BooksTable = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteCard = async () => {
    if (!selectedCard) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5555/cards/${selectedCard._id}`);
      enqueueSnackbar('Card deleted successfully', { variant: 'success' });
      setSelectedCard(null);
    } catch (error) {
      enqueueSnackbar('Error deleting card', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Table for larger screens */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto rounded-xl shadow-lg"
        >
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
                <th className="px-6 py-4 text-left">No</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.length > 0 ? (
                filteredCards.map((card, index) => (
                  <motion.tr
                    key={card._id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{card.name}</td>
                    <td className="px-6 py-4">{card.email}</td>
                    <td className="px-6 py-4">{card.contact}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link to={`/cards/details/${card._id}`} className="group">
                          <BsInfoCircle className="text-xl text-green-600 group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link to={`/cards/edit/${card._id}`} className="group">
                          <AiOutlineEdit className="text-xl text-yellow-600 group-hover:scale-110 transition-transform" />
                        </Link>
                        <button onClick={() => setSelectedCard(card)} className="group">
                          <MdOutlineDelete className="text-xl text-red-600 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No matching results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Card-based design for mobile screens */}
      <div className="lg:hidden">
        <div className="space-y-4">
          <AnimatePresence>
            {filteredCards.length > 0 ? (
              filteredCards.map((card, index) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-4 sm:p-5"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-blue-600">#{index + 1}</span>
                    <div className="flex gap-3">
                      <Link to={`/cards/details/${card._id}`} className="group">
                        <BsInfoCircle className="text-lg text-green-600 group-hover:scale-110 transition-transform" />
                      </Link>
                      <Link to={`/cards/edit/${card._id}`} className="group">
                        <AiOutlineEdit className="text-lg text-yellow-600 group-hover:scale-110 transition-transform" />
                      </Link>
                      <button onClick={() => setSelectedCard(card)} className="group">
                        <MdOutlineDelete className="text-lg text-red-600 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-800">{card.name}</p>
                    <p className="text-sm text-gray-600">{card.email}</p>
                    <p className="text-sm text-gray-600">{card.contact}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-8"
              >
                No matching results found.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal for Delete Confirmation (Mobile-friendly) */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{selectedCard.name}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCard}
                  disabled={loading}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                  }`}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooksTable;
