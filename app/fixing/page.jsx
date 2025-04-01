'use client'

import React, { useEffect, useState } from 'react'
import "@/styles/fixing.scss"
import fixingLogo from '@/public/images/fixing_logo.png'
import Image from 'next/image';
import { useSelector } from 'react-redux';
import SocketTable from '@/components/fixing/socketTable';

function Fixing() {

  const user = useSelector((state) => state.auth.user);

  const getFormattedDate = () => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    return `${dayOfWeek} ${day}.${month}.${year}`;
  };


  return (
    <div className='fixing_section'>
      <div className='custom_container'>
        <div className='flex justify-between items-center'>
          <div className='today text-xl'>{getFormattedDate()}</div>
          <div className='text-siteCrem text-[32px]'>24GCM005</div>
        </div>
        <div className='mt-[20px] flex justify-between items-center'>
          {/* <div className='fixing_logo'>
            <Image
              width={228}
              height={51}
              src={fixingLogo}
              unoptimized={true}
              alt="Fixing Logo"
              priority={true}
            />
          </div> */}
          <div className='user_info text-xl'>
            <div className='text-right'>{user?.firstname}</div>
            <div className='mt-[10px]'>+37411111111</div>
          </div>
        </div>
        <SocketTable />
      </div>
    </div>
  )
}

export default Fixing
