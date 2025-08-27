import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle, BiShow } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete, MdEmail } from 'react-icons/md';
import { FaPhone } from "react-icons/fa";
import { useState } from 'react';
import BookModal from './BookModal';
const BookSingleCard = ({ card }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 m-4 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full max-w-md mx-auto">
      {/* Contact Badge */}

      {/* Card Content */}
      <div className="space-y-3">
        {/* Name Section */}
        <div className="flex items-center gap-3">
          <PiBookOpenTextLight className="text-red-500 text-2xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            {card.name}
          </h2>
        </div>
        {/* Address Section */}
        <div className="flex items-center gap-3">
          <BiUserCircle className="text-red-500 text-2xl flex-shrink-0" />
          <p className="text-sm sm:text-base text-gray-600 truncate">
            {card.address}
          </p>
        </div>
        {/* Email Section */}
        <div className="flex items-center gap-3">
          <MdEmail className="text-red-500 text-2xl flex-shrink-0" />
          <p className="text-sm sm:text-base text-gray-600 truncate">
            {card.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaPhone className="text-red-500 text-xl flex-shrink-0" />
          <p className="text-sm sm:text-base text-gray-600 truncate">
            {card.contact}
          </p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4 justify-center">
        <Link
          to={`/cards/details/${card._id}`}
          className="group p-2 rounded-full hover:bg-green-100 transition-colors"
          aria-label="View details"
        >
          <BsInfoCircle className="text-xl text-green-600 group-hover:text-green-800 group-hover:scale-110 transition-transform" />
        </Link>
        <Link
          to={`/cards/edit/${card._id}`}
          className="group p-2 rounded-full hover:bg-yellow-100 transition-colors"
          aria-label="Edit card"
        >
          <AiOutlineEdit className="text-xl text-yellow-600 group-hover:text-yellow-800 group-hover:scale-110 transition-transform" />
        </Link>
        <Link
          to={`/cards/delete/${card._id}`}
          className="group p-2 rounded-full hover:bg-red-100 transition-colors"
          aria-label="Delete card"
        >
          <MdOutlineDelete className="text-xl text-red-600 group-hover:text-red-800 group-hover:scale-110 transition-transform" />
        </Link>
      </div>
      {/* Modal */}
      {showModal && (
        <BookModal card={card} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
export default BookSingleCard;