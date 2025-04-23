'use client'

import "@/styles/fixing.scss"
import fixingLogo from '@/public/images/fixing_logo.png'
import Image from 'next/image';
import { useSelector } from 'react-redux';
import SocketTable from '@/components/fixing/SocketTable';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { request } from "@/components/request";
import OrderHistory from "@/components/fixing/OrderHistory";
import PendingsOrders from "@/components/fixing/PendingsOrders";
import { FixContextProvider } from "@/context/fixContext";

const LocationLoading = () => (
  <div className="flex justify-between location_section mobile:block items-center mt-[50px] border-t pt-6 gap-[10px]">
    <div className='select-container max-w-[400px] mobile:max-w-none w-full'>
      <label htmlFor="location-select">Select Location:</label>
      <div className="input_skeleton"></div>
    </div>
    <div className="datepicker-container max-w-[400px] mobile:max-w-none w-full flex flex-col">
      <label htmlFor="date-picker">Select Date:</label>
      <div className="input_skeleton"></div>
    </div>
    <div className="time-select-container">
      <label htmlFor="time-select">Time:</label>
      <div className="flex space-x-2 mobile:space-x-0 mobile:block">
        <div className="input_skeleton"></div>
        <div className="input_skeleton mobile:hidden"></div>
      </div>
    </div>
  </div>
);

const Locations = dynamic(() => import('@/components/fixing/Locations'), { ssr: false, loading: () => <LocationLoading /> });

function Fixing() {

  const user = useSelector((state) => state.auth.user);
  const [discount, setDiscount] = useState(null);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const weekdaysHy = [
      'Կիրակի',    // Sunday
      'Երկուշաբթի', // Monday
      'Երեքշաբթի', // Tuesday
      'Չորեքշաբթի', // Wednesday
      'Հինգշաբթի',  // Thursday
      'Ուրբաթ',     // Friday
      'Շաբաթ'       // Saturday
    ];

    const dayOfWeek = weekdaysHy[today.getDay()];
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    setFormattedDate(`${dayOfWeek} ${day}.${month}.${year}`);
  }, []);

  const getUserDiscount = async (userId) => {
    try {
      const data = await request(`https://newapi.goldcenter.am/v1/preorder/prices?user_id=${userId}`);
      if (data) {
        setDiscount({
          discount: data.discount,
          discount995: data.discount995
        })
      }
    } catch (error) {
      console.error('Error fetching user discount:', error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserDiscount(user?.user_id)
    }
  }, [user])


  return (
    <div className='fixing_section pb-[20px]'>
      <FixContextProvider>
        <div className='custom_container'>
          <div className='flex justify-between items-center mobile:flex-col'>
            <div className='today text-xl tablet:text-[18px] mobile:text-xl'>{formattedDate || '...'}</div>
            <div className='text-siteCrem text-[32px] tablet:text-2xl mobile:mt-[5px]'>24GCM005</div>
          </div>
          <div className='mt-[20px] flex justify-between mobile:gap-[20px] items-center mobile:flex-col'>
            <div className='fixing_logo'>
              <Image
                width={300}
                height={65}
                src={fixingLogo}
                unoptimized={true}
                alt="Fixing Logo"
                priority={true}
              />
            </div>
            <div className='user_info text-xl tablet:text-[18px] mobile:text-[16px] mobile:flex mobile:items-center mobile:gap-[15px]'>
              <div className='text-right'>{user?.firstname || '...'}</div>
              <div className='mt-[10px] mobile:mt-0'>{user?.phone || '...'}</div>
            </div>
          </div>
          <SocketTable discount={discount} userId={user?.user_id} />
          <Locations />
          <PendingsOrders userId={user?.user_id} />
          {user?.user_id && <OrderHistory userId={user?.user_id} />}
        </div>
      </FixContextProvider>
    </div>
  )
}

export default Fixing
