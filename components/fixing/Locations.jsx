'use client'
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { request } from '../request';
import { useDispatch } from 'react-redux';
import { setLocationData } from '@/redux/locationSlice';
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import { setAuthenticated } from '@/redux/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';


function Locations({ modalMode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [rememberLocation, setRememberLocation] = useState(false);

  const workingHourStart = 9;
  const workingHourEnd = 18;

  const hoursOptions = Array.from({ length: 24 }, (_, i) => {
    const hourStr = String(i).padStart(2, '0');
    const isDisabled = i < workingHourStart || i > workingHourEnd;
    return {
      value: hourStr,
      label: hourStr,
      isDisabled,
    };
  });

  const minutesOptions = Array.from({ length: 60 }, (_, i) => ({
    value: String(i).padStart(2, '0'),
    label: String(i).padStart(2, '0'),
    isDisabled: hours === '' || hours === null,
  }));

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

  const getLocations = async () => {
    try {
      const data = await request(`https://newapi.goldcenter.am/v1/preorder/locations`);
      if (data) {
        const formattedOptions = data.markets.map((market) => ({
          value: market.id,
          label: market.title || market.location,
        }));
        setLocationOptions(formattedOptions);
        if (formattedOptions.length > 0) {
          setSelectedLocation(formattedOptions[0]);
        }
      }

    } catch (error) {
      console.error('Error fetching locations:', error);
      dispatch(setAuthenticated(false));
      localStorage.removeItem("token");
      Cookies.remove("token");
      toast.error('Session expired. Please log in again.');
      router.refresh();
    }
  };

  const getCurrentUserLocation = async () => {
    try {
      const data = await request('https://newapi.goldcenter.am/v1/preorder/current-user-location');
      if (data && data.location_id) {
        const defaultLocation = locationOptions.find(option => option.value === data.location_id);
        if (defaultLocation) {
          setSelectedLocation(defaultLocation);
        }
      }
    } catch (error) {
      console.error('Error fetching current user location:', error);
    }
  };

  useEffect(() => {
    getCurrentUserLocation();
  }, [locationOptions]);

  useEffect(() => {
    getLocations();
  }, []);

  // Dispatch to Redux when any relevant value changes
  useEffect(() => {
    if (selectedLocation || selectedDate || (hours && minutes)) {
      dispatch(
        setLocationData({
          location: selectedLocation,
          hours: hours || '--',
          minutes,
          date: format(selectedDate, 'dd.MM.yyyy'),
        })
      );
    }
  }, [selectedLocation, hours, selectedDate, minutes, dispatch]);

  useEffect(() => {
    if (rememberLocation) {
      localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation));
    } else {
      localStorage.removeItem("selectedLocation");
    }
  }, [rememberLocation, selectedLocation]);

  return (
    <>
      <div className={`${modalMode ? 'modalMode' : ''} flex justify-between location_section items-center mt-[50px] border-t pt-6 tablet:mt-[30px] tablet:pt-[30px] mobile:pt-[20px] mobile:grid  mobile:grid-cols-2 gap-[10px]`}>
        <div className='select-container max-w-[400px] w-full'>
          <label htmlFor="location-select">Select Location:</label>
          <Select
            id="location-select"
            options={locationOptions}
            value={selectedLocation}
            onChange={(option) => setSelectedLocation(option)}
            styles={customSelectStyles}
          />
        </div>
        <div className="datepicker-container max-w-[400px] w-full flex flex-col">
          <label htmlFor="date-picker">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd.MM.yyyy"
            calendarClassName="custom-calendar"
            className="datepicker-input w-full"
          />
        </div>
        <div className="time-select-container mobile:w-full mobile:col-span-2">
          <label htmlFor="time-select">Time:</label>
          <div className="flex mobile:flex-1 mobile:grid mobile:grid-cols-2 gap-[15px] mobile:w-full">
            <Select
              options={hoursOptions}
              value={hoursOptions.find(option => option.value === hours)}
              onChange={(selectedOption) => {
                setHours(selectedOption.value);
                setMinutes('');
              }}
              styles={customSelectStyles}
            />
            <Select
              options={minutesOptions}
              value={minutesOptions.find(option => option.value === minutes)}
              onChange={(selectedOption) => setMinutes(selectedOption.value)}
              styles={customSelectStyles}
              isDisabled={!hours}
            />
          </div>
        </div>
      </div>
      <div className="remember-location flex gap-[10px] mt-[5px]">
        <input
          type="checkbox"
          checked={rememberLocation}
          id='remimber_lavel'
          className='cursor-pointer'
          onChange={() => setRememberLocation(!rememberLocation)}
        />
        <label for="remimber_lavel" className='cursor-pointer'>Remember</label>
      </div>
    </>
  );
}

export default Locations;
