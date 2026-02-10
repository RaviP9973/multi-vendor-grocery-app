"use client";

import {
  Book,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Gift,
  Home,
  MonitorSmartphone,
  Panda,
  Shirt,
  Sparkle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { label } from "motion/react-client";
import { useEffect, useState } from "react";

const CategorySlider = () => {
  const [startIndex, setStartIndex] = useState(0);

  const categories = [
    {
      label: "Fashion & lifestyle",
      icon: Shirt,
    },
    {
      label: "Electronics",
      icon: MonitorSmartphone,
    },
    {
      label: "Home & Living",
      icon: Home,
    },
    {
      label: "Beauty & Personal Care",
      icon: Sparkle,
    },
    {
      label: "Sports & Fitness",
      icon: Dumbbell,
    },
    {
      label: "Toys & Games",
      icon: Panda,
    },
    {
      label: "Gifts & Handcrafts",
      icon: Gift,
    },
    {
      label: "Books & Stationery",
      icon: Book,
    },
  ];

  const NextSlice = () => {
    setStartIndex((prev) => (prev + 5) % categories.length);
  };

  const PrevSlice = () => {
    setStartIndex((prev) => (prev - 5 + categories.length) % categories.length);
  }

  useEffect(() => {
    const interval = setInterval(NextSlice,5000);

    return () => clearInterval(interval);
  },[])
  return (
    <motion.div
      className=" w-full mx-auto p-8 text-center bg-linear-to-br from-black via-gray-900 to-black relative "
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-white ">
        Shop by categories
      </h2>

      <div className="relative  py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={startIndex}
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -120 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {categories
              .slice(startIndex, startIndex + 5)
              .map((category, index) => (
                <motion.div
                  className="bg-white/10 border border-white/20 p-6 rounded-xl cursor-pointer text-white flex flex-col items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  key={index}
                >
                  <span className="text-4xl mb-2 block ">
                    {<category.icon size={48} />}
                  </span>
                  <p className="text-sm font-medium ">{category.label}</p>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>

        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/60 text-white p-2 rounded-full " onClick={PrevSlice}>
          <ChevronLeft />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/60 text-white p-2 rounded-full border border-gray-500 ">
          <ChevronRight onClick={NextSlice}/>
        </button>
      </div>
    </motion.div>
  );
};

export default CategorySlider;
