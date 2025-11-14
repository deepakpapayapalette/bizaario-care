import React from 'react';

const UniqueLoader = () => {
  const loaderContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '150px',
  };

  const dotStyle = (delay) => ({
    width: '15px',
    height: '15px',
    margin: '0 5px',
    borderRadius: '50%',
    backgroundColor: '#4a90e2',
    animation: `bounce 1.4s infinite ease-in-out`,
    animationDelay: delay,
  });

  const keyframes = `
    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.3;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

  return (
    <div style={loaderContainerStyle}>
      <style>{keyframes}</style>
      <div style={dotStyle('0s')}></div>
      <div style={dotStyle('0.2s')}></div>
      <div style={dotStyle('0.4s')}></div>
    </div>
  );
};

export default UniqueLoader;
