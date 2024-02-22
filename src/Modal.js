import React from 'react';
import gdLogo from "./images/gd-logo.png";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={ onClose }>&times;</span>
          <div style={ { textAlign: 'center' } }>
            <img src={ gdLogo } style={ { height: '2.25rem' } } />
            </div>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;