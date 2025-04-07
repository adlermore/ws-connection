'use client'
import React from 'react';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed p-[20px] inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}