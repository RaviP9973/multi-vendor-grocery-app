"use client";

import  { useState } from "react";
import { motion } from "motion/react";


const AddVendorProduct = () => {
  const categories = [
    "Fashion & Lifestyle",
    "Electronics & Gadgets",
    "Home & Living",
    "Beauty & Personal Care",
    "Toys, Kids & Baby",
    "Food & Grocery",
    "Sports & Fitness",
    "Automotive Accessories",
    "Gifts & Handicrafts",
    "Books & Stationery",
    "Others",
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isWearable, setIsWearable] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes((prev) => prev.filter((s) => s !== size));
    } else {
      setSelectedSizes((prev) => [...prev, size]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to bg-gray-900 text-white px-4 pt-20 pb-10">
      <motion.div
        className="max-w-3xl mx-auto bg-white/10 backdrop:blur-xl p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add New Product</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            className="p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
          <input
            type="number"
            className="p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Product Price"
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
            value={price}
          />
          
          <input
            type="number"
            className="p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Stock Quantity"
            onChange={(e) => {
              setStock(Number(e.target.value));
            }}
            value={stock}
          />

          <select
            name=""
            id=""
            className="p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            value={category}
          >
            <option value="" className="bg-gray-800">
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category} className="bg-gray-900 ">
                {category}
              </option>
            ))}
          </select>
        </div>
        {category === "Others" && (
          <input
            type="text"
            className="mt-4 w-full p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Enter custom category"
            value={customCategory}
          />
        )}

        <textarea
          className="mt-4 w-full p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Product description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />

        <div className="flex items-center gap-3 mt-5">
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={isWearable}
            onChange={(e) => setIsWearable(e.target.checked)}
          />
          <span>This is wearable / clothing product </span>
        </div>

        {isWearable && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold ">Select sizes</p>
            <div className="flex flex-wrap gap-3">
              {sizeOptions.map((size, index) => (
                <button key={index} onClick={() => {
                    toggleSize(size);
                }}
                className={`px-4 py-1 rounded-full border ${selectedSizes.includes(size) ? 'bg-blue-600 border-blue-500' : 'bg-white/10 border-white/20'} `}
                >{size}</button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AddVendorProduct;
