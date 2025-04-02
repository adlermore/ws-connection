'use client'
import React from 'react'
import Select from 'react-select';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from "react";

function Locations() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');

  const locationOptions = [
    { value: 'location1', label: 'Location 1' },
    { value: 'location2', label: 'Location 2' },
    { value: 'location3', label: 'Location 3' },
  ];

  const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
    value: String(i).padStart(2, '0'),
    label: String(i).padStart(2, '0'),
  }));

  const minutesOptions = Array.from({ length: 60 }, (_, i) => ({
    value: String(i).padStart(2, '0'),
    label: String(i).padStart(2, '0'),
  }));

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '0px',
      padding: '5px',
      fontSize: '16px',
      maxWidth: '300px',
      width: '100%',
      boxShadow: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: 'black',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#d9c196' : '#fff',
      color: state.isSelected ? '#fff' : '#333',
      '&:hover': {
        backgroundColor: '#f0f8ff',
        color: 'black',
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
    <div className="flex justify-between items-center mt-6 border-t pt-4 ">
    <div className='select-container max-w-[400px] w-full'>
      <label htmlFor="location-select">Select Location:</label>
      <Select
        id="location-select"
        options={locationOptions}
        styles={customSelectStyles}
        defaultValue={locationOptions[0]}
      />
    </div>

    <div className="datepicker-container max-w-[400px] w-full flex flex-col  ">
      <label htmlFor="date-picker">Select Date:</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd.MM.yyyy"
        className="datepicker-input w-full"
      />
    </div>

    <div className="time-select-container">
      <label htmlFor="time-select">Time:</label>
      <div className="flex space-x-2">
        
        <Select
          options={hoursOptions}
          value={hoursOptions.find(option => option.value === hours)}
          onChange={(selectedOption) => setHours(selectedOption.value)}
          styles={customSelectStyles}
        />
        <Select
          options={minutesOptions}
          value={minutesOptions.find(option => option.value === minutes)}
          onChange={(selectedOption) => setMinutes(selectedOption.value)}
          styles={customSelectStyles}
        />
      </div>
    </div>
  </div>
  )
}

export default Locations