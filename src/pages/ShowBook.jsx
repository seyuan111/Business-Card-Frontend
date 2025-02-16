import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import NavBar from '../components/NavBar';

const ShowBook = () => {
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/cards/${id}`)
      .then((response) => {
        setCard(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4 max-w-lg mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold text-center my-4 text-gray-700">
          Business Card Details
        </h1>

        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="space-y-4">
              {[
                { label: 'ID', value: card._id },
                { label: 'Name', value: card.name },
                { label: 'Address', value: card.address },
                { label: 'Email', value: card.email },
                { label: 'Occupation', value: card.occupation },
                { label: 'Contact', value: card.contact },
                { 
                  label: 'Created At', 
                  value: card.createdAt ? new Date(card.createdAt).toLocaleString() : 'N/A' 
                },
                { 
                  label: 'Last Updated', 
                  value: card.updatedAt ? new Date(card.updatedAt).toLocaleString() : 'N/A' 
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span className="text-gray-500 font-medium">{item.label}</span>
                  <span className="text-gray-700">{item.value || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowBook;

