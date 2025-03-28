'use client'

import React, { useEffect, useState } from 'react'
import "@/styles/fixing.scss"
import fixingLogo from '@/public/images/fixing_logo.png'
import Image from 'next/image';
import { useSelector } from 'react-redux';

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

  // Separate state for grams
  const [grams, setGrams] = useState({
    1: 0,
    2: 0,
  });

  // Separate state for USD calculation
  const [usdValues, setUsdValues] = useState({
    1: 0.00,
    2: 0.00,
  });

  const [tableData, setTableData] = useState([
    { id: 1, purity: '999.9', buyPrice: '94.35', sellPrice: '94.85', change: '+1.10', time: '20:10:55' },
    { id: 2, purity: '995', buyPrice: '93.85', sellPrice: '94.35', change: '+1.10', time: '20:10:55' },
  ]);

  const [loading, setLoading] = useState(true);

  const handleGramsChange = (id, value) => {
    // Update the grams state
    setGrams((prevGrams) => ({
      ...prevGrams,
      [id]: value,
    }));

    // Update the USD state based on new grams
    const selectedItem = tableData.find(item => item.id === id);
    if (selectedItem) {
      const newUsdValue = value * selectedItem.sellPrice;
      setUsdValues((prevUsdValues) => ({
        ...prevUsdValues,
        [id]: newUsdValue,
      }));
    }
  };

  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    const parsedLrs = JSON.parse(data.lrs);

    const g999 = parsedLrs.find((item) => item.id === 1);
    const g995 = parsedLrs.find((item) => item.id === 2);

    setTableData([
      { ...tableData[0], buyPrice: g999.buy.toFixed(2), sellPrice: g999.sell.toFixed(2), change: g999.difference, time: new Date().toLocaleTimeString() },
      { ...tableData[1], buyPrice: g995.buy.toFixed(2), sellPrice: g995.sell.toFixed(2), change: g995.difference, time: new Date().toLocaleTimeString() }
    ]);
    setLoading(false);
  };

  useEffect(() => {
    // Create a new WebSocket connection
    const ws = new WebSocket('wss://api.goldcenter.am/v1/rate/vue-websocket');

    // Listen for WebSocket messages
    ws.onmessage = handleWebSocketMessage;

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className='fixing_section'>
      <div className='custom_container'>
        <div className='flex justify-between items-center'>
          <div className='today text-xl'>{getFormattedDate()}</div>
          <div className='text-siteCrem text-[32px]'>24GCM005</div>
        </div>
        <div className='mt-[20px] flex justify-between items-center'>
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
          <div className='user_info text-xl'>
            <div className='text-right'>{user?.firstname}</div>
            <div className='mt-[10px]'>+37411111111</div>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>PURITY</th>
                <th>BUY</th>
                <th>SELL</th>
                <th>CHANGE</th>
                <th>TIME</th>
                <th className='gram_th'>GRAMS</th>
                <th className='usd_th'>USD</th>
                <th></th>
              </tr>
            </thead>
            <tbody className={loading ? 'skeleton_active' : ''}>
              {tableData.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.purity}</td>
                  <td>{item.buyPrice}</td>
                  <td>{item.sellPrice}</td>
                  <td className="change">{item.change}</td>
                  <td>{item.time}</td>
                  <td>
                    <input
                      type="number"
                      value={grams[item.id]}
                      onChange={(e) => handleGramsChange(item.id, e.target.value)}
                      className="grams-input"
                      defaultValue='0'
                    />
                  </td>
                  <td>{`$ ${usdValues[item.id]?.toFixed(2) || 0.00}`}</td>
                  <td><button className="fix-button">FIX</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Fixing
