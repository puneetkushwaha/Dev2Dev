import React from 'react';
import './Loader.css';

const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="global-loader-container">
            <div className="loader-content">
                <img src="/logo.png" alt="DevElevate" className="loader-logo" />
                <div className="loader-spinner"></div>
            </div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
