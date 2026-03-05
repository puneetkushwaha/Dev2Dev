import React from 'react';
import './Loader.css';

const Loader = ({ text = "", inline = false }) => {
    if (inline) {
        return (
            <div className="elite-loader-inline">
                <div className="elite-spinner-mini"></div>
                {text && <span>{text}</span>}
            </div>
        );
    }

    return (
        <div className="elite-loader-container">
            <div className="elite-glass-backdrop"></div>
            <div className="elite-logo-platform">
                <div className="elite-aura"></div>
                <div className="elite-logo-wrapper">
                    <img src="/logo.webp" width="100" height="100" alt="Dev2Dev" className="elite-logo" />
                    <div className="elite-shimmer"></div>
                </div>
            </div>
            {text && <p className="elite-loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
