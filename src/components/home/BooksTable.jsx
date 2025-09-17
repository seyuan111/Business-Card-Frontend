import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { motion, AnimatePresence } from 'framer-motion';

const BooksTable = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteCard = async () => {
    if (!selectedCard) return;

    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/cards/${selectedCard._id}`);
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

  // Utility function to truncate text with tooltip
  const TruncatedText = ({ text, maxLength = 30, className = "" }) => {
    const shouldTruncate = text && text.length > maxLength;
    const displayText = shouldTruncate ? `${text.substring(0, maxLength)}...` : text;

    return (
      <span 
        className={`${className} ${shouldTruncate ? 'cursor-help' : ''}`}
        title={shouldTruncate ? text : undefined}
      >
        {displayText}
      </span>
    );
  };

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
          <table className="w-full border-collapse bg-white table-fixed">
            <colgroup>
              <col className="w-16" /> {/* No column - fixed narrow width */}
              <col className="w-1/4" /> {/* Name column */}
              <col className="w-1/3" /> {/* Email column */}
              <col className="w-1/4" /> {/* Contact column */}
              <col className="w-24" /> {/* Actions column - fixed width */}
            </colgroup>
            <thead>
              <tr className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
                <th className="px-4 py-4 text-left font-semibold">No</th>
                <th className="px-4 py-4 text-left font-semibold">Name</th>
                <th className="px-4 py-4 text-left font-semibold">Email</th>
                <th className="px-4 py-4 text-left font-semibold">Contact</th>
                <th className="px-4 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.length > 0 ? (
                filteredCards.map((card, index) => (
                  <motion.tr
                    key={card._id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <TruncatedText 
                        text={card.name} 
                        maxLength={25}
                        className="font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis block"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <TruncatedText 
                        text={card.email} 
                        maxLength={30}
                        className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis block"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <TruncatedText 
                        text={card.contact} 
                        maxLength={20}
                        className="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis block"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <Link 
                          to={`/cards/details/${card._id}`} 
                          className="group p-1 rounded-full hover:bg-green-50 transition-colors"
                          title="View Details"
                        >
                          <BsInfoCircle className="text-lg text-green-600 group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link 
                          to={`/cards/edit/${card._id}`} 
                          className="group p-1 rounded-full hover:bg-yellow-50 transition-colors"
                          title="Edit Card"
                        >
                          <AiOutlineEdit className="text-lg text-yellow-600 group-hover:scale-110 transition-transform" />
                        </Link>
                        <button 
                          onClick={() => setSelectedCard(card)} 
                          className="group p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete Card"
                        >
                          <MdOutlineDelete className="text-lg text-red-600 group-hover:scale-110 transition-transform" />
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
                  className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link 
                        to={`/cards/details/${card._id}`} 
                        className="group p-2 rounded-full hover:bg-green-50 transition-colors"
                        title="View Details"
                      >
                        <BsInfoCircle className="text-lg text-green-600 group-hover:scale-110 transition-transform" />
                      </Link>
                      <Link 
                        to={`/cards/edit/${card._id}`} 
                        className="group p-2 rounded-full hover:bg-yellow-50 transition-colors"
                        title="Edit Card"
                      >
                        <AiOutlineEdit className="text-lg text-yellow-600 group-hover:scale-110 transition-transform" />
                      </Link>
                      <button 
                        onClick={() => setSelectedCard(card)} 
                        className="group p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Card"
                      >
                        <MdOutlineDelete className="text-lg text-red-600 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                        <p className="text-base font-semibold text-gray-800 truncate" title={card.name}>
                          {card.name}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                        <p className="text-sm text-gray-600 truncate" title={card.email}>
                          {card.email}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</label>
                        <p className="text-sm text-gray-600 truncate" title={card.contact}>
                          {card.contact}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No matching results found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search terms</p>
              </motion.div>
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
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <MdOutlineDelete className="text-red-600 text-xl" />
                </div>
                <h2 className="ml-3 text-xl font-bold text-gray-800">Confirm Delete</h2>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-800">"{selectedCard.name}"</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCard}
                  disabled={loading}
                  className={`px-5 py-2.5 bg-red-600 text-white rounded-lg transition-colors font-medium ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 active:bg-red-800'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete'
                  )}
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
