import { useState } from 'react';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import BookSingleCard from './BookSingleCard';

const BooksCard = ({ cards }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter the cards based on the search term
  const filteredCards = cards.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Input */}
      <input
        type='text'
        placeholder='Search books...'
        className='border border-gray-400 p-2 rounded-md mb-4 w-full'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Cards Grid */}
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6'>
        {filteredCards.map((item) => (
          <BookSingleCard key={item._id} card={item} />
        ))}
      </div>
    </div>
  );
};

export default BooksCard;
