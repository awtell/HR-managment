import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
    return (
        <div className="loading-animation">
            <div className="loading-bar">
                <div className="loading-progress"></div>
            </div>
            <p>Loading, please wait...</p>
        </div>
    );
};

export default LoadingAnimation;
