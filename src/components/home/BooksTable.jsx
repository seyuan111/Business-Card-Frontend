import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const BooksTable = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteCard = async () => {
    if (!selectedCard) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5555/cards/${selectedCard._id}`);
      enqueueSnackbar('Card deleted successfully', { variant: 'success' });
      setSelectedCard(null); // Close the sidebar after deletion
    } catch (error) {
      enqueueSnackbar('Error deleting card', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full'>
      {/* Table for larger screens */}
      <div className='hidden md:block'>
        <table className='w-full border-collapse border border-slate-600'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-slate-600 px-4 py-2'>No</th>
              <th className='border border-slate-600 px-4 py-2'>Name</th>
              <th className='border border-slate-600 px-4 py-2'>Email</th>
              <th className='border border-slate-600 px-4 py-2'>Contact</th>
              <th className='border border-slate-600 px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, index) => (
              <tr key={card._id} className='hover:bg-gray-100 transition'>
                <td className='border border-slate-700 px-4 py-2 text-center'>
                  {index + 1}
                </td>
                <td className='border border-slate-700 px-4 py-2 text-center'>
                  {card.name}
                </td>
                <td className='border border-slate-700 px-4 py-2 text-center'>
                  {card.email}
                </td>
                <td className='border border-slate-700 px-4 py-2 text-center'>
                  {card.contact}
                </td>
                <td className='border border-slate-700 px-4 py-2 text-center'>
                  <div className='flex justify-center gap-3'>
                    <Link to={`/cards/details/${card._id}`}>
                      <BsInfoCircle className='text-2xl text-green-700 hover:scale-110 transition' />
                    </Link>
                    <Link to={`/cards/edit/${card._id}`}>
                      <AiOutlineEdit className='text-2xl text-yellow-600 hover:scale-110 transition' />
                    </Link>
                    <button onClick={() => setSelectedCard(card)}>
                      <MdOutlineDelete className='text-2xl text-red-600 hover:scale-110 transition' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card-based design for mobile screens */}
      <div className='md:hidden space-y-4'>
        {cards.map((card, index) => (
          <div
            key={card._id}
            className='border border-gray-300 rounded-lg shadow-md p-4 bg-white'
          >
            <div className='flex justify-between'>
              <span className='font-semibold text-gray-700'>#{index + 1}</span>
              <div className='flex gap-3'>
                <Link to={`/cards/details/${card._id}`}>
                  <BsInfoCircle className='text-xl text-green-800 hover:scale-110 transition' />
                </Link>
                <Link to={`/cards/edit/${card._id}`}>
                  <AiOutlineEdit className='text-xl text-yellow-600 hover:scale-110 transition' />
                </Link>
                <button onClick={() => setSelectedCard(card)}>
                  <MdOutlineDelete className='text-xl text-red-600 hover:scale-110 transition' />
                </button>
              </div>
            </div>
            <div className='mt-2'>
              <p className='text-lg font-bold'>{card.name}</p>
              <p className='text-sm text-gray-600'>{card.email}</p>
              <p className='text-sm text-gray-600'>{card.contact}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar for Deleting Confirmation */}
      {selectedCard && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-end'>
          <div className='w-80 bg-white shadow-lg p-6 flex flex-col justify-center'>
            <h2 className='text-xl font-bold text-gray-700'>Confirm Delete</h2>
            <p className='text-sm text-gray-600 mt-2'>
              Are you sure you want to delete <span className='font-semibold'>{selectedCard.name}</span>?
            </p>
            <div className='flex justify-between mt-6'>
              <button
                onClick={() => setSelectedCard(null)}
                className='px-4 py-2 bg-gray-300 text-gray-800 rounded-md'
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCard}
                disabled={loading}
                className={`px-4 py-2 bg-red-600 text-white rounded-md ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                }`}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksTable;