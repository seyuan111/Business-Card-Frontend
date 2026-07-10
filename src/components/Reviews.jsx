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
    <div className="py-16 bg-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-3">What people are saying</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">User Reviews</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Real feedback from users who love how easy it is to create, share, and manage business cards.
          </p>
        </div>

        <div className="relative">
          <Swiper
            spaceBetween={24}
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
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
            }}
          >
            {reviews.map((review, index) => (
              <SwiperSlide
                key={index}
                className="h-full"
              >
                <div className="h-full flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 duration-300">
                  <div className="flex items-center justify-center mb-6">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-24 h-24 rounded-full shadow-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-lg font-semibold text-slate-900 text-center">{review.name}</p>
                    <p className="mt-4 text-sm leading-7 text-slate-600 text-center">
                      {review.review}
                    </p>
                  </div>

                  <div className="mt-8 text-center">
                    <span className="inline-flex rounded-full bg-cyan-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
                      Verified user
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-prev absolute top-1/2 left-0 -translate-y-1/2 cursor-pointer z-10 text-slate-900 bg-white p-2 rounded-full shadow-lg hover:bg-slate-50 transition duration-300">
            <BsArrowLeftCircle size={34} />
          </div>
          <div className="swiper-button-next absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer z-10 text-slate-900 bg-white p-2 rounded-full shadow-lg hover:bg-slate-50 transition duration-300">
            <BsArrowRightCircle size={34} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;