import React, { use, useEffect, useState } from 'react';
import scanImg from '../../assets/scanner.png';
import '../servicePoint/css/point.css'
import { LinkService } from '../../frontServices/LinkService';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../api/axios';
import { UserDto } from '../../types/UserDto';
import { toast } from 'react-toastify';
import { VisitService } from '../../services/visitService';
import { PointFrontService } from '../../frontServices/PointFrontService';
import { useMyNavigator } from '../customHooks/useMyNavigator';
import { FrontPageService } from '../../frontServices/FrontPageSerivce';
import { ApiErrorResponse } from '../../types/ApiErrorResonse';
import { PopUpWindow } from '../common/PopUpWindow';
import { Visit } from '../../types/visit';
import { EmailChecker } from './frontComp/EmailChecker';

export const PreRegPrintInput: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const { links, navigate } = useMyNavigator();
    const frontServices = FrontPageService.getInstance();
    const [confirmEmail, setConfirmEmail] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [visit, setVisit] = useState<Visit | undefined>();


    function backToTypes(): void {
        navigate(LinkService.getInstance().frontOffice.visitTypes);
    }

    const handleScan = async () => {
        const id = inputValue.trim();
        if (id === '') {
            toast.error('Please enter a visit ID');
            return;
        }

        try {
            const fetchedVisit = await VisitService.getVisitById(Number(id));
            if (fetchedVisit) {
                frontServices.setPreRegVisit(fetchedVisit);
                console.log("Fetched visit:", fetchedVisit);
                setVisit(fetchedVisit); // Store the visit in state
                setConfirmEmail(true); // Show email confirmation popup
            }
        } catch (e) {
            const error = e as ApiErrorResponse;
            console.error(error.message);
            toast.error(error.message || 'Failed to fetch visit details');
        }
    };

    useEffect(() => {
        if (enteredEmail != '') {
            if (visit && visit.visitor.email == enteredEmail) {
                navigate(links.frontOffice.PreRegTakePhotoPage)
            } else {
                toast.error("input Email is Not matching")
                console.log(visit)
                console.log(enteredEmail)
            }
        }
    }, [enteredEmail])


    return (
        <div className="point-container">
            {/* <img src={scanImg} alt="Scaner" className="point-image" /> */}
            {/* <button className="point-button point-scanuser-btn">Scan Visit Badge QR</button> */}
            <input
                type="text"
                className="point-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Enter visit id"
            />
            <button onClick={handleScan} className="point-button point-scan-btn">Print Pre Registration Visit</button>


            {confirmEmail && <PopUpWindow onClose={() => setConfirmEmail(false)}
                title={'Confirm User Email'}>

                <EmailChecker setEnteredEmail={setEnteredEmail} />

            </PopUpWindow>}
        </div>
    );
};
