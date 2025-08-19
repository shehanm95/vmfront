import React, { useRef, useState } from 'react';
import './css/frontTakePhotoPage.css'
import { RightAlign } from '../../common/RightAlign';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../frontServices/LinkService';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';
import ProfileImage from './profileImage.avif'
import { toast } from 'react-toastify';

const FrontTakePhoto: React.FC = () => {
    const [photo, setPhoto] = useState<File | null>();
    const [photoUrl, setPhotoUrl] = useState(ProfileImage)
    const navigate = useNavigate()
    const linkService = LinkService.getInstance();
    const frontService = FrontPageService.getInstance();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    function displayDetails(): void {
        if (photo) {
            frontService.setVisitorPhoto(photo);
        }
        navigate(linkService.frontOffice.showVisitDetails)
    }

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0];
        if (file) {
            setPhotoUrl(URL.createObjectURL(file))
            setPhoto(file)
            frontService.setVisitorPhoto(file)
        } else {
            toast.error("uploadded photo is not workling")
        }
    }

    return (
        <>
            <div className="photo-page-photo-capture-container">
                <div className="photo-page-photo-frame">
                    <img
                        src={photoUrl}
                        alt="Captured"
                        className="photo-page-captured-photo"
                    />
                </div>
                <div className="photo-page-sidebar">
                    <p className="photo-page-ready-text">Ready</p>
                    <div className="photo-page-circle">1</div>
                    <div className="photo-page-circle active">2</div>
                    <div className="photo-page-circle">3</div>
                    <div className="photo-page-camera-icon" />
                </div>
                <div className="photo-page-button-group">
                    {/* <button className="photo-page-btn retake">Re-take</button>
                    <button className="photo-page-btn ok">Ok</button> */}
                    <>
                        <button
                            type="button"
                            onClick={handleClick}
                            className="photo-page-btn"
                        >
                            Upload Photo
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            name="photoUpload"
                            id="photoUpload"
                        />
                    </>
                </div>

            </div>
            <div className="w-100 mt-5">
                <RightAlign>
                    <button onClick={() => displayDetails()} className='front-Button'>
                        Check My Visit Summery
                    </button>
                </RightAlign>
            </div>
        </>
    );
};

export default FrontTakePhoto;