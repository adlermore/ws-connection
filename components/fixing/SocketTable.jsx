'use client'

import React, { useContext, useRef, useState } from 'react'
import { useEffect } from 'react';
import { request } from '../request';
import toast from 'react-hot-toast';
import { encryptAES } from '@/utils/hooks/encryptGenerate';
import { useSelector } from 'react-redux';
import { getLocationData } from '@/redux/locationSlice';
import fixingLogo from '@/public/images/fixing_logo.png';
import successLogo from '@/public/images/success_svg.png';
import Image from 'next/image';
import { JsonContext } from '@/context/jsonContext';

function SocketTable({ discount, userId }) {

    const [tableData, setTableData] = useState([
        { id: 1, purity: '999.9', buyPrice: '-', sellPrice: '-', change: '-', time: '-' },
        { id: 2, purity: '995', buyPrice: '-', sellPrice: '-', change: '-', time: '-' },
    ]);
    const { activeFix, setActiveFix, totalPrice } = useContext(JsonContext);

    const [grams, setGrams] = useState({ 1: null, 2: null });
    const [usdValues, setUsdValues] = useState({ 1: 0.00, 2: 0.00 });
    const [loading, setLoading] = useState(true);
    const [fixLoading, setFixLoading] = useState({});
    const [successId, setSuccessId] = useState(null);
    const [fixedValue, setFixedValue] = useState(null);
    const [yesterdayPrices, setYesterdayPrices] = useState([]);

    const locationData = useSelector(getLocationData);

    const lastUpdateTime = useRef(Date.now());
    let ws = useRef(null);

    const getChangeSymbol = (todayPrice, yesterdayPrice) => {
        if (todayPrice > yesterdayPrice) return `+${(todayPrice - yesterdayPrice).toFixed(2)}`;
        if (todayPrice < yesterdayPrice) return `-${(yesterdayPrice - todayPrice).toFixed(2)}`;
        return '0.00';
    };

    useEffect(() => {
        // When prices change, recalculate USD values
        const newUsdValues = {};
        Object.keys(grams).forEach(id => {
            const gram = parseFloat(grams[id]) || 0;
            const item = tableData.find(i => i.id === parseInt(id));
            if (item) {
                newUsdValues[id] = gram * parseFloat(item.sellPrice || 0);
            }
        });
        setUsdValues(newUsdValues);
    }, [tableData]);

    const fetchLocalSocket = async (yesterdayPricesData) => {
        try {
            const response = await fetch('https://api.goldcenter.am/v1/rate/local_socket?month=1');
            const { data } = await response.json();

            if (!yesterdayPricesData) {
                yesterdayPricesData = yesterdayPrices;
            }
            const updatedData = data.slice(0, 2).map((item, idx) => {
                const yesterday = yesterdayPricesData.find(y => y.rate_id === idx + 1)

                const sellPrice = item.sell - (idx === 0 ? discount?.discount || 0 : discount?.discount995 || 0);
                const change = yesterday ? getChangeSymbol(sellPrice, yesterday.yesterday_sell_value) : '-';

                return {
                    ...tableData[idx],
                    buyPrice: item.buy.toFixed(2),
                    sellPrice: sellPrice.toFixed(2),
                    change,
                    time: new Date().toLocaleTimeString()
                };
            });

            setTableData(updatedData);
            lastUpdateTime.current = Date.now();
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching localSocket:', error);
        }
    };


    const handleGramsChange = (id, value) => {
        if (value && value == 0) {
            return
        }

        setGrams((prev) => ({ ...prev, [id]: value }));
        const selectedItem = tableData.find(item => item.id === id);
        if (selectedItem) {
            setUsdValues((prev) => ({ ...prev, [id]: value * selectedItem.sellPrice }));
        }
    };

    useEffect(() => {
        const fetchYesterdayPrices = async () => {
            const response = await fetch('https://api.goldcenter.am/v1/rate/local-yesterday-socket');
            const data = await response.json();
            setYesterdayPrices(data);
            await fetchLocalSocket(data);
        };

        fetchYesterdayPrices();

        ws.current = new WebSocket('wss://api.goldcenter.am/v1/rate/vue-websocket');
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const parsedLrs = JSON.parse(data.lrs);

            const updatedData = parsedLrs.map((item, idx) => {
                const yesterday = yesterdayPrices.find(y => y.rate_id === idx + 1);
                const sellPrice = item.sell - (idx === 0 ? discount?.discount || 0 : discount?.discount995 || 0);
                const change = yesterday ? getChangeSymbol(sellPrice, yesterday.yesterday_sell_value) : '-';

                return {
                    ...tableData[idx],
                    buyPrice: item.buy.toFixed(2),
                    sellPrice: sellPrice.toFixed(2),
                    change,
                    time: new Date().toLocaleTimeString()
                };
            });

            setTableData(updatedData);
            lastUpdateTime.current = Date.now();
            setTimeout(() => {
                setLoading(false);
            }, 1000);
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

    function getLocalISOTime() {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    }

    const handleFix = async (id) => {
        if (grams[id] === 0 || grams[id] === '' || grams[id] === '0' || !grams[id]) {
            toast.error('Please enter grams');
            return
        }

        setFixLoading((prev) => ({ ...prev, [id]: true }));

        const key = '1234567890123456';
        const textToEncrypt = getLocalISOTime();

        const { encryptedText, ivBase64 } = encryptAES(textToEncrypt, key);

        const fixData = {
            user_id: userId,
            location: {
                title: locationData.selectedLocation.label,
                value: locationData.selectedLocation.value,
            },
            date: locationData.date || '',
            grams999: id === 1 ? parseFloat(grams[1]) : 0,
            grams995: id === 2 ? parseFloat(grams[2]) : 0,
            price999: id === 1 ? parseFloat(usdValues[1]) : 0,
            price995: id === 2 ? parseFloat(usdValues[2]) : 0,
            remember: false,
            key: encryptedText,
            iv: ivBase64,
        }

        try {
            const data = await request(`https://newapi.goldcenter.am/v1/preorder/calculate-amount`, 'POST', fixData);
            if (data) {
                setSuccessId(id);
                setFixedValue(usdValues[id]?.toFixed(2));
                toast.success(`Successfully fixed ${grams[id]} grams of ${id === 1 ? '999' : '995'} purity gold`);
                setFixLoading((prev) => ({ ...prev, [id]: false }));
                setActiveFix(!activeFix)
            }
        } catch (error) {
            console.error('Error fetching user discount:', error);
            setFixLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const closePopup = () => {
        setSuccessId(null);
        setFixedValue(null);
        setGrams({ 1: null, 2: null});
        setUsdValues({ 1: 0.00, 2: 0.00 });
    }

    return (
        <div className="table-container">
            <table className="table fix_table">
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
                <tbody className={loading ? 'skeleton_active' : 'default_tbody'}>
                    {tableData.slice(0, 2).map(item => (
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
                                    value={grams[item.id] ?? ''}
                                    onChange={(e) => handleGramsChange(item.id, e.target.value)}
                                    placeholder='Enter Grams'
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
                                    {fixLoading[item.id] ? <span className='fix_loading'></span> : 'FIX'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {successId &&
                <div className='success_popup'>
                    <div className='popup_inner'>
                        <div className='popup_image'>
                            <Image
                                width={228}
                                height={53}
                                src={fixingLogo}
                                unoptimized={true}
                                alt="Fixing Logo"
                                priority={true}
                            />
                        </div>
                        <div className='success_svg'>
                            <Image
                                width={190}
                                height={35}
                                src={successLogo}
                                unoptimized={true}
                                alt="Fixing Logo"
                                priority={true}
                            />
                        </div>
                        <div className='popup_content'>
                            <span><b>ՇՆՈՐՀԱԿԱԼՈՒԹՅՈՒՆ</b></span>
                            <p>Դուք պատվիրել եք՝ </p>
                            <p><b>{grams[successId]}</b> գրամ <b>{tableData[successId - 1]?.purity}</b> ոսկի <b>{fixedValue}</b> փոխարժեքով</p>
                            <p><b>{locationData.date}</b> ժամը <b>{locationData?.selectedHour + ':' + locationData?.selectedMinute}</b> ին:</p>
                            <br />
                            <p>Վերապահված է 24 ժամով</p>
                            <p><b>{locationData.selectedLocation?.label} </b>հասցեում</p>
                            <br />
                            <p>ընդհանուր պարտքը՝ = <b>${totalPrice.toFixed(2) || usdValues[successId].toFixed(2)}</b> դոլար</p>
                        </div>
                        <button className='popop_btn' onClick={closePopup}>ԼԱՎ</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default SocketTable