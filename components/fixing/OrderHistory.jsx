import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { request } from '../request';

const FILTER_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
];

function formatDate(date) {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getDateRange(filter) {
  const to = new Date();
  let from = new Date();

  if (filter === 'yesterday') {
    from.setDate(from.getDate() - 1);
    to.setDate(to.getDate() - 1);
  } else if (filter === 'last7days') {
    from.setDate(from.getDate() - 7);
  } else {
    return null;
  }

  return {
    from: formatDate(from),
    to: formatDate(to),
  };
}

function OrderHistory({ userId }) {
  const [filter, setFilter] = useState(FILTER_OPTIONS[0]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (filterValue) => {
    setLoading(true);
    let url = `https://api.goldcenter.am/v1/preorder/orders/completed?user_id=${userId}`;

    const dateRange = getDateRange(filterValue);
    if (dateRange) {
      url += `&from=${dateRange.from}&to=${dateRange.to}`;
    }

    try {
      const data = await request(url);
      setOrders(data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchOrders(filter.value);
  }, [filter, userId]);

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '0px',
      padding: '5px',
      fontSize: '16px',
      width: '100%',
      boxShadow: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: 'black',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#d9c196'
        : state.isDisabled
        ? '#f5f5f5'
        : '#fff',
      color: state.isDisabled ? '#999' : state.isSelected ? '#fff' : '#333',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      '&:hover': {
        backgroundColor: state.isDisabled ? '#f5f5f5' : '#f0f8ff',
        color: state.isDisabled ? '#999' : 'black',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
    }),
  };

  return (
    <div className='mt-[80px] mb-[80px] mobile:mt-[40px] mobile:mb-[40px] order_history'>
      <h2 className='text-center text-2xl mobile:text-xl'>COMPLETED ORDERS</h2>
      <div className='mx-auto max-w-[400px] mt-[30px] mb-[40px]'>
        <Select
          options={FILTER_OPTIONS}
          styles={customSelectStyles}
          value={filter}
          onChange={(selected) => setFilter(selected)}
        />
      </div>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className='table' border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Grams</th>
              <th>Price</th>
              <th>Carat</th>
              <th>Status</th>
              <th>Location</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody className={loading ? 'skeleton_active' : 'default_tbody'}>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.grams}</td>
                <td>{order.price}</td>
                <td>{order.carat}</td>
                <td>{order.status}</td>
                <td>{order.location}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistory;
