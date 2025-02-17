import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateBook from './pages/CreateBooks';
import ShowBook from './pages/ShowBook';
import EditBook from './pages/EditBook';
import DeleteBook from './pages/DeleteBook';
import Hero from './pages/Hero';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Hero />} />
      <Route path='/Home' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path='/cards/create' element={<CreateBook />} />
      <Route path='/cards/details/:id' element={<ShowBook />} />
      <Route path='/cards/edit/:id' element={<EditBook />} />
      <Route path='/cards/delete/:id' element={<DeleteBook />} />
    </Routes>
  );
};

export default App;
