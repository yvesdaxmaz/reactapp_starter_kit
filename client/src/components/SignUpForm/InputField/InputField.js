import { useState, useEffect, memo } from 'react';

const InputField = ({ type, label, name, value, error, handleChange }) => {
  // useEffect(() => {
  //   console.log(`rerender InputField of ${name}`);
  // });
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        {label ? label : name.charAt(0).toUpperCase() + name.slice(1)}
      </label>
      <div className="mt-1">
        <input
          id={name}
          value={value}
          onChange={handleChange}
          name={name}
          type={type}
          autoComplete="name"
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id="name-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default memo(InputField);
