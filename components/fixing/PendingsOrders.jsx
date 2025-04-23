'use client'

import React, { useContext, useEffect, useState } from 'react';
import { request } from '../request';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Locations from './Locations';
import IconCalendar from "@/public/icons/IconCalendar";
import IconTime from "@/public/icons/IconTime";
import { FixContext } from '@/context/FixContext';

function PendingsOrders({ userId }) {

  const {activeFix, settotalPrice} = useContext(FixContext);
  
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const locationData = useSelector((state) => state.location);
  const [updateLoading, setUpdateLoading] = useState(false)


  const fetchPendingOrders = async () => {
    setLoading(true);
    const url = `https://newapi.goldcenter.am/v1/preorder/orders/pending?user_id=${userId}`;
    try {
      const data = await request(url);
      if (data) {
        setPendingOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPendingOrders();
    }
  }, [userId, activeFix]);

  const formatDateTime = (date, time) => {
    const [day, month, year] = date.split('.');
    return `${year}-${month}-${day}T${time}:00+04:00`;
  };

  const handleChangeOrder = async (order) => {
    if (!order || !locationData?.selectedMinute || !locationData?.selectedHour) return;
    setUpdateLoading(true)
    const formattedDateTime = formatDateTime(
      locationData?.date,
      `${locationData?.selectedHour}:${locationData?.selectedMinute}`
    );

    try {
      const updatedOrder = await request('https://newapi.goldcenter.am/v1/preorder/change-order', 'POST', {
        id: order.id,
        location: {
          title: locationData.selectedLocation.label,
          value: locationData.selectedLocation.value,
        },
        date: formattedDateTime,
      });

      if (updatedOrder) {
        toast.success('Order updated successfully');
        setEditingOrder(null);
        setShowModal(false);
        fetchPendingOrders();
        setUpdateLoading(false)
      }
    } catch (error) {
      toast.error('Failed to update order');
      setUpdateLoading(false)
    }
  };

  const totalGrams = pendingOrders.reduce((acc, order) => acc + order.grams, 0);
  const totalPrice = pendingOrders.reduce((acc, order) => acc + order.price, 0);
  const averagePrice = totalGrams ? (totalPrice / totalGrams) : 0;

  useEffect(()=>{
    if(totalPrice){
      settotalPrice(totalPrice)
    }
  },[totalPrice])
  

  const getFormattedDate = () => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${dayOfWeek} ${day}.${month}.${year}`;
  };

  function getFormattedTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const handleBook = async () => {
    const submitData = {
      location: {
        title: locationData.selectedLocation.label,
        value: locationData.selectedLocation.value,
      },
      date: locationData.date || '',
      remember: false
    }

    try {
      const data = await request(`https://newapi.goldcenter.am/v1/preorder/pre-book-location`, 'POST', submitData);
      if (data) {
        toast.success('Ձեր ժամադրությունը վերապահված է Ձեզ համար: Շնորհակալություն հաստատման համար')
      }
    } catch (error) {
      console.error('Error fetching user discount:', error);
    }
  }

  return (
    <>
      <div className="mt-[50px] text-[16px] mobile:text-sm mobile:text-center text-center">
        Ամրագրեք նշված գները 24 ժամվա համար մինչև
      </div>
      <div className="flex gap-[20px] items-center justify-center mt-[20px]">
        <div className="flex items-center gap-[10px]">
          <IconCalendar />
          {getFormattedDate()}
        </div>
        <div className="flex items-center gap-[10px]">
          <IconTime />
          {getFormattedTime()}
        </div>
      </div>
      {/* <button className="fix_submit_btn" disabled={totalPrice === 0 || !totalPrice} onClick={handleBook}>Հաստատել</button> */}

      <div className="mt-[40px] mb-[80px] mobile:mt-[40px] mobile:mb-[40px]">
        <div className='amount_wrapper'>
          <div>Ընդհանուր քաշը: <span>{totalGrams.toFixed(2)} գրամ</span></div>
          <div>Ընդհանուր գումարը:  <span>${totalPrice.toFixed(2)}</span></div>
          <div>Միջին գինը: <span>${averagePrice.toFixed(2)}</span></div>
        </div>
        {pendingOrders.length > 0 && (
          <div>
            <div className="mt-[50px]">
              <h2 className="text-[20px] font-semibold mb-4">ՍՊԱՍՎԱԾ ՊԱՏՎԵՐՆԵՐ</h2>
              <div className="table-wrapper">
                <table className="w-full table now_ordered border scroll-table border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 text-left"></th>
                      <th className="py-2 px-4 text-left">Հարգ</th>
                      <th className="py-2 px-4 text-left">Գին</th>
                      <th className="py-2 px-4 text-left">Քաշ</th>
                      <th className="py-2 px-4 text-left">Ընդ Արժեք</th>
                      <th className="py-2 px-4 text-left">Մասնաճյուղ</th>
                      <th className="py-2 px-4 text-left">Օր</th>
                      <th className="py-2 px-4 text-left">Ժամ</th>
                      <th className="py-2 px-4 text-left">Գործողություն</th>
                    </tr>
                  </thead>
                  <tbody className={loading ? 'skeleton_active' : 'default_tbody'}>
                    {loading ? (
                      <tr>
                        <td className="py-2 px-4"></td>
                      </tr>
                    ) : (
                      pendingOrders.map((order, i) => (
                        <tr key={order.id} className="border-t">
                          <td className="py-2 px-4">{i + 1}</td>
                          <td className="py-2 px-4">{order.carat}</td>
                          <td className="py-2 px-4">{(order.price / order.grams).toFixed(2)}</td>
                          <td className="py-2 px-4">{order.grams.toFixed(2)}</td>
                          <td className="py-2 px-4">{order.price.toFixed(2)}</td>
                          <td className="py-2 px-4">{order.location}</td>
                          <td className="py-2 px-4">{order.date || new Date(order.updated_at).toISOString().split('T')[0]}</td>
                          <td className="py-2 px-4">{order.time || new Date(order.updated_at).toTimeString().split(' ')[0]}</td>
                          <td className="py-2 px-4">
                            <button
                              onClick={() => {
                                setEditingOrder(order);
                                setShowModal(true);
                              }}
                              className="text-blue-500 edit_button"
                            >
                              Փոխել
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {showModal && (
          <Modal title="Փոխել Տվյալները" onClose={() => setShowModal(false)}>
            <Locations modalMode={true} editingOrder={editingOrder} />
            <div className="flex justify-end mt-4">
              <button
                onClick={async () => {
                  if (editingOrder) {
                    await handleChangeOrder(editingOrder);
                  }
                }}
                className={`bg-siteCrem save_btn text-white px-4 py-2 rounded ${updateLoading ? 'pointer-events-none' : ''}`}
              >
                {updateLoading ? <span className="loader_spinner"></span> : 'Պահպանել'}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}

export default PendingsOrders;
