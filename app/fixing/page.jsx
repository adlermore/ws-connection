'use client'

import "@/styles/fixing.scss"
import fixingLogo from '@/public/images/fixing_logo.png'
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import SocketTable from '@/components/fixing/SocketTable';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { request } from "@/components/request";
import OrderHistory from "@/components/fixing/OrderHistory";
import Modal from "@/components/ui/Modal";
import { updateFixedOrder } from "@/redux/fixedOrdersSlice";
import toast from "react-hot-toast";

const LocationLoading = () => (
  <div className="flex justify-between location_section items-center mt-[50px] border-t pt-6 gap-[10px]">
    <div className='select-container max-w-[400px] w-full'>
      <label htmlFor="location-select">Select Location:</label>
      <div className="input_skeleton"></div>
    </div>
    <div className="datepicker-container max-w-[400px] w-full flex flex-col">
      <label htmlFor="date-picker">Select Date:</label>
      <div className="input_skeleton"></div>
    </div>
    <div className="time-select-container">
      <label htmlFor="time-select">Time:</label>
      <div className="flex space-x-2">
        <div className="input_skeleton"></div>
        <div className="input_skeleton"></div>
      </div>
    </div>
  </div>
);

const Locations = dynamic(() => import('@/components/fixing/Locations'), { ssr: false, loading: () => <LocationLoading /> });

function Fixing() {

  const user = useSelector((state) => state.auth.user);
  const [discount, setDiscount] = useState(null);


  const fixedOrders = useSelector((state) => state.fixedOrders.orders);
  const dispatch = useDispatch();

  const [editingOrder, setEditingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const locationData = useSelector(state => state.location);

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

  const getFormattedDate = () => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${dayOfWeek} ${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (user) {
      getUserDiscount(user?.user_id)
    }

  }, [user])


  const formatDateTime = (date, time) => {
    const [day, month, year] = date.split('.');
    const isoDateTime = `${year}-${month}-${day}T${time}:00+04:00`;
    return isoDateTime;
  };

  const handleCHangeOrder = async (order) => {
    
    const formattedDateTime = formatDateTime(locationData?.date, `${locationData?.selectedHour}:${locationData?.selectedMinute}`);

    if (!order || !locationData?.selectedMinute || !locationData?.selectedHour ) return;
    const updatedOrder = await request('https://newapi.goldcenter.am/v1/preorder/change-order', 'POST', {
      id: order.id,
      location: {
        title: locationData.selectedLocation.label,
        value: locationData.selectedLocation.value,
      },
      date: formattedDateTime,
    });

    if (updatedOrder) {
      dispatch(updateFixedOrder(updatedOrder.orders.find(itme => itme.id === order.id)));
      setEditingOrder(null);
      setShowModal(false);
      toast.success('Order updated successfully');
    }
    
  }
  return (
    <div className='fixing_section pb-[20px]'>
      <div className='custom_container'>
        <div className='flex justify-between items-center'>
          <div className='today text-xl tablet:text-[18px] mobile:text-sm'>{getFormattedDate()}</div>
          <div className='text-siteCrem text-[32px] tablet:text-2xl mobile:text-xl'>24GCM005</div>
        </div>
        <div className='mt-[20px] flex justify-between mobile:gap-[20px] items-center'>
          <div className='fixing_logo'>
            <Image
              width={228}
              height={51}
              src={fixingLogo}
              unoptimized={true}
              alt="Fixing Logo"
              priority={true}
            />
          </div>
          <div className='user_info text-xl tablet:text-[18px] mobile:text-[14px]'>
            <div className='text-right'>{user?.firstname || '...'}</div>
            <div className='mt-[10px]'>{user?.phone || '...'}</div>
          </div>
        </div>
        <SocketTable discount={discount} userId={user?.user_id} />
        <Locations />
        <div className="mt-[50px] text-[20px] mobile:text-sm mobile:text-center">
          Book the above rates for 24 hours
        </div>
        {fixedOrders.length > 0 &&
          <div>
            <div className="mt-[50px]">
              <h2 className="text-[20px] font-semibold mb-4">Now Fixed Orders</h2>
              <table className="w-full table now_ordered border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Location</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Time</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fixedOrders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="py-2 px-4">{order.location}</td>
                      <td className="py-2 px-4">{order.date ||  new Date(order?.arrive_date).toISOString().split("T")[0]}</td>
                      <td className="py-2 px-4">{order.time || new Date(order?.arrive_date).toTimeString().split(" ")[0]}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => {
                            setEditingOrder(order);
                            setShowModal(true);
                          }}
                          className="text-blue-500 edit_button"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        }
        {showModal && (
          <Modal title="Edit Fixed Order" onClose={() => setShowModal(false)}>
            <Locations modalMode={true} />
            <div className="flex justify-end mt-4">
              <button
                onClick={async() => {
                  if (!editingOrder) return;
                  await handleCHangeOrder(editingOrder);
                  // setShowModal(false);
                }}
                className="bg-siteCrem text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </Modal>
        )}
        {user?.user_id && <OrderHistory userId={user?.user_id} />}
      </div>
    </div>
  )
}

export default Fixing
