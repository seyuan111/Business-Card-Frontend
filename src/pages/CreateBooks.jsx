import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import NavBar from '../components/NavBar';

const CreateBooks = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const formatPhoneNumber = (value) => {
    // Remove any non-numeric characters
    let numbers = value.replace(/\D/g, '');
    
    // Format the numbers into (xxx) xxx-xxxx format
    if (numbers.length > 3 && numbers.length <= 6) {
      numbers = `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length > 6) {
      numbers = `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    } else if (numbers.length <= 3) {
      numbers = `(${numbers.slice(0, 3)}`;
    }
    
    return numbers;
  };

  const handleContactChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setContact(formattedPhone);
  };

  const handleSaveBook = () => {
    if (!name || !address || !email || !occupation || !contact) {
      enqueueSnackbar('Please fill out all required fields', { variant: 'error' });
      return;
    }

    const data = { name, address, email, occupation, contact };
    setLoading(true);

    // Check if the email or contact already exists
    axios
      .get('http://localhost:5555/cards')
      .then((response) => {
        const existingCard = response.data.data.find(
          (card) => card.email === email || card.contact === contact
        );

        if (existingCard) {
          setLoading(false);
          if (existingCard.email === email) {
            enqueueSnackbar('Email address is already taken', { variant: 'error' });
          } else if (existingCard.contact === contact) {
            enqueueSnackbar('Phone number is already taken', { variant: 'error' });
          }
        } else {
          axios
            .post('http://localhost:5555/cards', data)
            .then(() => {
              setLoading(false);
              enqueueSnackbar('Card Created successfully', { variant: 'success' });
              navigate('/Home');
            })
            .catch((error) => {
              setLoading(false);
              enqueueSnackbar('Error', { variant: 'error' });
              console.log(error);
            });
        }
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error checking existing cards', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4 max-w-lg mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold text-center my-4 text-gray-700">
          Create Business Card
        </h1>
        {loading && <Spinner />}

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-4">
            {[ 
              { label: 'Name', value: name, setter: setName },
              { label: 'Address', value: address, setter: setAddress },
              { label: 'Email', value: email, setter: setEmail },
              { label: 'Occupation', value: occupation, setter: setOccupation },
              { 
                label: 'Contact', 
                value: contact, 
                setter: setContact, 
                helperText: 'Format: (111) 222-5555' // Added helper text
              },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-600 text-sm font-medium">{field.label}</label>
                <input
                  type="text"
                  value={field.label === 'Contact' ? contact : field.value}
                  onChange={field.label === 'Contact' ? handleContactChange : (e) => field.setter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
                {field.helperText && (
                  <small className="text-gray-500 mt-1">{field.helperText}</small> // Displaying the helper text
                )}
              </div>
            ))}
          </div>

          <button
            className={`w-full mt-6 py-2 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'}`}
            onClick={handleSaveBook}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBooks;
