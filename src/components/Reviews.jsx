import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import 'swiper/css';

const Reviews = () => {
  const reviews = [
    {
      name: 'John Doe',
      review:
        'This app has revolutionized the way I share my business card. It’s fast, simple, and very professional. Highly recommend it!',
      image:
        'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      name: 'Jane Smith',
      review:
        'I love how easy it is to upload and manage my business cards. Perfect for networking events!',
      image:
        'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      name: 'Michael Johnson',
      review:
        'The app makes business card sharing a breeze! No more lost cards. I can easily find and share my contacts.',
      image:
        'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
      name: 'Emily Davis',
      review:
        'A game-changer for any professional. I never lose a business card again, and it’s so easy to use.',
      image:
        'https://randomuser.me/api/portraits/women/2.jpg',
    },
  ];

  return (
    <div className="py-16 bg-neutral-400">
      <h2 className="text-center text-3xl sm:text-4xl font-bold mb-8">User Reviews</h2>

      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide
            key={index}
            className="text-center p-6 bg-white rounded-xl shadow-lg flex flex-col justify-between h-[50%]"
          >
            <img
              src={review.image}
              alt={review.name}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <p className="text-lg font-semibold">{review.name}</p>
            <p className="text-gray-500">{review.review}</p>
          </SwiperSlide>
        ))}
        {/* Left and Right Arrows */}
        <div className="swiper-button-prev absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer z-10 text-white bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out">
          <BsArrowLeftCircle size={40} />
        </div>
        <div className="swiper-button-next absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer z-10 text-white bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out">
          <BsArrowRightCircle size={40} />
        </div>
      </Swiper>
    </div>
  );
};

export default Reviews;