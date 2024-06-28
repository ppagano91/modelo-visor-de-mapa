import React from 'react';

const ContextMenu = ({ isOpen, position, options, onClose, onSelectOption }) => {
  const menuStyle = {
    position: 'absolute',
    top: position.y,
    left: position.x,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
    padding: '5px',
    zIndex: 1000,
  };

  const handleOptionClick = (option) => {
    onSelectOption(option);
    onClose();
  };

  return isOpen ? (
    <div style={menuStyle}>
      {options.map((option, index) => (
        <div key={index} onClick={() => handleOptionClick(option)}>
          {option.label}
        </div>
      ))}
    </div>
  ) : null;
};

export default ContextMenu;
