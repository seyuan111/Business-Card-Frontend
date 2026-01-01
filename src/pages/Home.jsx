import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';
import NavBar from '../components/NavBar';
import { getAuthConfig, hasToken } from '../utils/auth';

const Home = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const [authRequired, setAuthRequired] = useState(false);

  useEffect(() => {
    if (!hasToken()) {
      setAuthRequired(true);
      setCards([]);
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/cards`, getAuthConfig())
      .then((response) => {
        setCards(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cards:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="p-4 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Contact List</h1>
        <Link to="/cards/create" aria-label="Add new card">
          <button className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <MdOutlineAddBox className="text-white text-3xl" />
            <span className="text-lg">Add Contact</span>
          </button>
        </Link>
      </div>
      

        {/* View Switcher */}
        <div className="mt-6 flex justify-center sm:justify-start gap-4">
          {['table', 'card'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                showType === type
                  ? 'bg-sky-600 text-white'
                  : 'bg-sky-300 hover:bg-sky-500 text-gray-800'
              }`}
              onClick={() => setShowType(type)}
            >
              {type === 'table' ? 'Table View' : 'Card View'}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="mt-8">
          {authRequired ? (
            <div className="text-center bg-white rounded-lg shadow p-6 text-gray-700">
              Please log in to view your contacts.
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : showType === 'table' ? (
            <BooksTable cards={cards} />
          ) : (
            <BooksCard cards={cards} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

