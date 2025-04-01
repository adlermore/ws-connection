'use Client'
import React, { useState } from 'react'
import { useEffect } from 'react';

function SocketTable() {

    const [tableData, setTableData] = useState([
        { id: 1, purity: '999.9', buyPrice: '-', sellPrice: '-', change: '-', time: '-' },
        { id: 2, purity: '995', buyPrice: '-', sellPrice: '-', change: '-', time: '-' },
    ]);


    // Separate state for grams
    const [grams, setGrams] = useState({ 1: 0, 2: 0 });

    // Separate state for USD calculation
    const [usdValues, setUsdValues] = useState({ 1: 0.00, 2: 0.00 });
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
    });

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
                            <td><button className="fix-button">FIX</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SocketTable