import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import NavBar from '../components/NavBar';
import { getAuthConfig, hasToken } from '../utils/auth';

const EditBook = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [contact, setContact] = useState('');
  const [fax, setFax] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!hasToken()) {
      enqueueSnackbar('Please log in to edit a contact.', { variant: 'warning' });
      navigate('/Login');
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/cards/${id}`, getAuthConfig())
      .then((response) => {
        setName(response.data.name);
        setAddress(response.data.address);
        setEmail(response.data.email);
        setOccupation(response.data.occupation);
        setContact(response.data.contact);
        setFax(response.data.fax || '');
        setWebsite(response.data.website || '');
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check the console');
        console.log(error);
      });
  }, [id]);

  const formatPhoneNumber = (value) => {
    let numbers = value.replace(/\D/g, '');
    
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

  const handleFaxChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFax(formattedPhone);
  };

  const handleEditBook = () => {
    if (!hasToken()) {
      enqueueSnackbar('Please log in to edit a contact.', { variant: 'warning' });
      navigate('/Login');
      return;
    }

    // Validate if all fields are filled out
    if (!name || !email || !contact) {
      enqueueSnackbar('Please fill out all required fields', { variant: 'error' });
      return;
    }

    const data = { name, address, email, occupation, contact, fax, website };
    const authConfig = getAuthConfig();
    setLoading(true);

    // Check for existing email or contact number conflicts
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/cards`, authConfig)
      .then((response) => {
        const existingCard = response.data.data.find(
          (card) => (card.email === email || card.contact === contact) && card._id !== id
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
            .put(`${import.meta.env.VITE_BACKEND_URL}/cards/${id}`, data, authConfig)
            .then(() => {
              setLoading(false);
              enqueueSnackbar('Card Edited successfully', { variant: 'success' });
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
          Edit Business Card
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
                helperText: 'Format: (111) 222-5555' 
              },
              { 
                label: 'Fax', 
                value: fax, 
                setter: setFax, 
                helperText: 'Optional. Format: (111) 222-5555' 
              },
              { 
                label: 'Website', 
                value: website, 
                setter: setWebsite, 
                helperText: 'Optional. nike.com or https://nike.com' 
              },
            ].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-600 text-sm font-medium">{field.label}</label>
                <input
                  type={field.label === 'Email' ? 'email' : field.label === 'Website' ? 'url' : 'text'}
                  value={
                    field.label === 'Contact'
                      ? contact
                      : field.label === 'Fax'
                      ? fax
                      : field.value
                  }
                  onChange={
                    field.label === 'Contact'
                      ? handleContactChange
                      : field.label === 'Fax'
                      ? handleFaxChange
                      : (e) => field.setter(e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
                {field.helperText && (
                  <small className="text-gray-500 mt-1">{field.helperText}</small>
                )}
              </div>
            ))}
          </div>

          <button
            className={`w-full mt-6 py-2 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600'}`}
            onClick={handleEditBook}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBook;

