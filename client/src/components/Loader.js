import React from 'react';
import { FaLeaf } from 'react-icons/fa';

const Loader = () => {
  const loaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
  };

  const iconStyle = {
    color: '#1a936f',
    fontSize: '3rem',
    animation: 'spin 2s linear infinite',
  };

  const textStyle = {
    marginTop: '1rem',
    color: '#333',
    fontWeight: '600',
  };

  return (
    <div style={loaderStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <FaLeaf style={iconStyle} />
      <p style={textStyle}>Loading...</p>
    </div>
  );
};

export default Loader;
