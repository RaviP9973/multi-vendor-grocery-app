"use client";
import slide1 from "../../../public/slider1.png";
import slide2 from "../../../public/slider2.png";
import slide3 from "../../../public/slider3.png";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
const Slider = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      image: slide1,
      title: "High performance gaming PCs",
      subtitle: "game on",
      description: "Gaming PC's",
      button: "DISCOVER",
    },
    {
      image: slide2,
      title: "Style and comfort",
      subtitle: "Do it now",
      description: "Get the freshest products delivered to your doorstep.",
      button: "DISCOVER",
    },
    {
      image: slide3,
      title: "Quality and affordability",
      subtitle: "Do it now",
      description: "Get the freshest products delivered to your doorstep.",
      button: "DISCOVER",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  },[])
  return (
    <div className="relative w-full min-h-[90vh] mt-0 overflow-hidden bg-black text-white md:mt-[60px] pt-0 top-0  ">
      <AnimatePresence>
        <motion.div
          className="absolute inset-0 flex justify-center items-center"
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full opacity-70"
            fill
          />

          <div className="absolute inset-0 flex flex-col items-start justify-center px-10 md:px-24  bg-linear-to-r from-black/70 to to-transparent">
            <motion.h3
              className="text-sm md:text-base uppercase tracking-widest"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slides[current].subtitle}
            </motion.h3>
            <motion.h1
              className="text-xl md:text-6xl font-bold mb-4"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {slides[current].description}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-6 "
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {slides[current].title}
            </motion.p>

            <motion.button
              className="px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg transition"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {slides[current].button}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-6 right-6 flex gap-4 ">
        {slides.map((slide, index) => (
          <motion.div
            className={`relative w-20 h-1/2 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${index === current ? "border-gray-100 shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "border-gray-500 hover:border-blue-400"}`}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrent(index)}
            key={index}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              // fill 
              className="object-cover opacity-90 "
              />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
