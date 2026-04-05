'use client'

import React from 'react'
import {motion} from "motion/react";
import { useRouter } from 'next/navigation';

const VendorProducts = () => {

  const router = useRouter();

  return (
    <div className='w-full p-4 sm:p-8 text-white '>
      {/* header */}
      <div className="flex justify-between items-center mb-6 ">
        <h1 className='text-2xl sm:text-3xl font-bold '>My Products</h1>
        <motion.button className='bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold text-sm sm:text-base '
        whileHover={{scale:1.02}}
        whileTap={{scale:0.97}}
        onClick={() => {
          router.push('/addVendorProduct');
        }}
        >
          + Add Product
        </motion.button>
      </div>

    </div>
  )
}

export default VendorProducts
