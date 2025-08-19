import React, { use, useEffect, useState } from 'react';
import scanImg from '../../assets/scanner.png';
import './css/point.css';
import { LinkService } from '../../frontServices/LinkService';
import { useNavigate } from 'react-router-dom';
import userService, { UserService } from '../../services/userService';
import { getCurrentUser } from '../../api/axios';
import { UserDto } from '../../types/UserDto';
import { usePointContext } from '../../context/PointContext';
import { toast } from 'react-toastify';
import { VisitService } from '../../services/visitService';
import { Visit } from '../../types/visit';
import { PointFrontService } from '../../frontServices/PointFrontService';

const PointScanVisit: React.FC = () => {
    const links = LinkService.getInstance();
    const navigate = useNavigate();
    const [officer, setOfficer] = useState<UserDto>();
    const [inputValue, setInputValue] = useState('');
    const { visit, setVisit, setServicePoints } = usePointContext();

    useEffect(() => {
        const getUser = async () => {
            try {
                const u = await getCurrentUser();
                if (u) {
                    setOfficer(u);
                    console.log('Current user:', u);
                } else {
                    console.error('User not found');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        getUser();
    }, [officer]);

    const handleScan = async () => {
        if (inputValue.trim() === '') {
            toast.error('Please enter a visit ID');
            return;
        }

        try {
            const visitData = await VisitService.getVisitById(Number(inputValue));
            if (visitData) {
                setVisit(visitData);
                console.log('Scanned visit:', visitData);
                const servicePoints = PointFrontService.fetchServicePointsByOfficer(visitData, officer!)
                if (servicePoints.length > 0) {
                    setServicePoints(servicePoints)
                    navigate(links.servicePoint.answerQuestions);
                } else {
                    navigate(links.visit.fullVisitMethod(visitData.id!));
                }

            }

        } catch (error) {
            console.error('Error scanning visit:', error);
            toast.error('Error scanning visit. Please try again.');
        }
    };


    return (
        <div className="point-container">
            <img src={scanImg} alt="Scaner" className="point-image" />
            <button className="point-button point-scanuser-btn">Scan Visit Badge QR</button>
            <input
                type="text"
                className="point-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter visit id"
            />
            <button onClick={handleScan} className="point-button point-scan-btn">Scan</button>
        </div>
    );
};

export default PointScanVisit;