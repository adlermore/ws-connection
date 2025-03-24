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

  const [tableData, setTableData] = useState([
    { id: 1, purity: '999.9', buyPrice: '94.35', sellPrice: '94.85', change: '+1.10', time: '20:10:55', grams: 0, usd: 0.00 },
    { id: 2, purity: '995', buyPrice: '93.85', sellPrice: '94.35', change: '+1.10', time: '20:10:55', grams: 0, usd: 0.00 },
  ]);

  const handleInputChange = (id, value) => {
    const updatedData = tableData.map(item =>
      item.id === id ? { ...item, grams: value, usd: (value * item.sellPrice).toFixed(2) } : item
    );
    setTableData(updatedData);
  };


  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('WebSocket data:', data);
    
    const parsedGrs = JSON.parse(data.grs);
    const parsedLrs = JSON.parse(data.lrs);
    
    // Map through the lrs and combine the necessary details from grs
    const updatedData = parsedLrs.slice(0,2).map((item) => {
      const gr = parsedGrs[item.id]; // Find corresponding grs data by id
      
      return {
        id: item.id,
        buyPrice: item.buy,
        sellPrice: item.sell,
        change: item.difference,
        purity: gr ? gr.today_price : null, // Get purity (today_price) from grs
        time: new Date().toLocaleTimeString(), // Use current time as an example
        grams: 0, // Initialize with 0 grams
        usd: 0.00 // Initialize with 0.00 USD
      };
    });

    setTableData(updatedData);
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
            <tbody>
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
                      value={item.grams}
                      onChange={(e) => handleInputChange(item.id, e.target.value)}
                      className="grams-input"
                    />
                  </td>
                  <td>{`$ ${item?.usd?.toFixed(2)}`}</td>
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