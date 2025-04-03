'use client'

import React, { useRef, useState } from 'react'
import { useEffect } from 'react';

function SocketTable({ discount }) {

    const [tableData, setTableData] = useState([
        { id: 1, purity: '999.9', buyPrice: '-', sellPrice: '-', change: '-', time: '-' },
        { id: 2, purity: '995', buyPrice: '-', sellPrice: '-', change: '-', time: '-' },
    ]);
    const [grams, setGrams] = useState({ 1: 0, 2: 0 });
    const [usdValues, setUsdValues] = useState({ 1: 0.00, 2: 0.00 });
    const [loading, setLoading] = useState(true);
    const [fixLoading, setFixLoading] = useState({});


    const lastUpdateTime = useRef(Date.now());
    let ws = useRef(null);

    const fetchLocalSocket = async () => {
        try {
            const response = await fetch('https://api.goldcenter.am/v1/rate/local_socket?month=1');
            const { data } = await response.json();
            setTableData([
                { ...tableData[0], buyPrice: data[0].buy.toFixed(2), sellPrice: (data[0].sell - discount?.discount).toFixed(2), change: data[0].difference, time: new Date().toLocaleTimeString() },
                { ...tableData[1], buyPrice: data[1].buy.toFixed(2), sellPrice: (data[1].sell - discount?.discount995).toFixed(2), change: data[1].difference, time: new Date().toLocaleTimeString() }
            ]);
            lastUpdateTime.current = Date.now();
        } catch (error) {
            console.error('Error fetching localSocket:', error);
        }
    };

    const handleGramsChange = (id, value) => {
        setGrams((prev) => ({ ...prev, [id]: value }));
        const selectedItem = tableData.find(item => item.id === id);
        if (selectedItem) {
            setUsdValues((prev) => ({ ...prev, [id]: value * selectedItem.sellPrice }));
        }
    };

    useEffect(() => {
        fetchLocalSocket();

        ws.current = new WebSocket('wss://api.goldcenter.am/v1/rate/vue-websocket');
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const parsedLrs = JSON.parse(data.lrs);
            setTableData([
                { ...tableData[0], buyPrice: parsedLrs[0].buy.toFixed(2), sellPrice: (parsedLrs[0].sell - discount?.discount).toFixed(2), change: parsedLrs[0].difference, time: new Date().toLocaleTimeString() },
                { ...tableData[1], buyPrice: parsedLrs[1].buy.toFixed(2), sellPrice: (parsedLrs[1].sell - discount?.discount995).toFixed(2), change: parsedLrs[1].difference, time: new Date().toLocaleTimeString() }
            ]);
            lastUpdateTime.current = Date.now();
            setLoading(false);
        };

        const pingInterval = setInterval(() => {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: 'ping' }));
            }
        }, 5000);

        const checkDataInterval = setInterval(() => {
            if (Date.now() - lastUpdateTime.current > 10000) {
                fetchLocalSocket();
            }
        }, 10000);

        return () => {
            ws.current.close();
            clearInterval(pingInterval);
            clearInterval(checkDataInterval);
        };
    }, [discount]);

    const handleFix = (id) => {
        setFixLoading((prev) => ({ ...prev, [id]: true }));

        setTimeout(() => {
            setFixLoading((prev) => ({ ...prev, [id]: false })); 
        }, 2000); 
    };



    return (
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
                                    value={grams[item.id] ?? 0}
                                    onChange={(e) => handleGramsChange(item.id, e.target.value)}
                                    className="grams-input"
                                />
                            </td>
                            <td>{`$ ${usdValues[item.id]?.toFixed(2) || 0.00}`}</td>
                            <td>
                                <button
                                    className={`fix-button ${fixLoading[item.id] ? 'disabled' : ''}`}
                                    onClick={() => handleFix(item.id)}
                                    disabled={fixLoading[item.id]}
                                >
                                    {fixLoading[item.id] ?
                                        <span className='fix_loading'></span>
                                        :
                                        'FIX'
                                    }
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SocketTable