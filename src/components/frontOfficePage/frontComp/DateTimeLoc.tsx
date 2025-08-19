import React, { useState, useEffect } from 'react';
import './css/dateTimeLoc.css';

export const DateTimeLoc = ({ location = 'Colombo, Sri Lanka' }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second
        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    const time = currentTime.toLocaleTimeString('en-US', { hour12: true, timeZone: 'Asia/Colombo' });
    const date = currentTime.toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' });

    return (
        <div className="date-time-loc-container">
            <div className="time">{time}</div>
            <div className="date">{date}</div>
            <div className="location">{location}</div>
        </div>
    );
};