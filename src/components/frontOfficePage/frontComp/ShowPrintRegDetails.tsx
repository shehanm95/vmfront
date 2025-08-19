import React, { useEffect, useState } from 'react'
import { RightAlign } from '../../common/RightAlign';
import { LinkService } from '../../../frontServices/LinkService';
import { useNavigate, useParams } from 'react-router-dom';
import BlueLogoImg from '../../../assets/BlueLogoImg.svg'
import { VisitService } from '../../../services/visitService';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';
import { Visit } from '../../../types/visit';
import { Utils } from '../../../frontServices/Utils';
import { toast } from 'react-toastify';
import DefaultProf from '../../../assets/ProfDefault.avif'
import userService from '../../../services/userService';

export const ShowPrintRegDetails = () => {
    const [visit, setVisit] = useState<Visit | undefined>()
    const id = useParams<{ id: string }>()
    const frontService = FrontPageService.getInstance();
    const [savedVisit, setSavedVisit] = useState(frontService.getPreRegVisit())
    const [qrCodeUrl, setqrCodeUrl] = useState('');
    const [photo, setPhoto] = useState<File | null>(frontService.getVisitorPhoto());
    const [photoUrl, setPhotoUrl] = useState<string>();

    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [comapanyName, setCompanyName] = useState("ZinCat Technologies")


    useEffect(() => {

        if (!savedVisit) {
            navigate(links.frontOffice.visitTypes)
            toast.error("no pre reg visit to display")
        }


        const pic = frontService.getVisitorPhoto()


        if (pic) {
            setPhoto(pic);
            setPhotoUrl(URL.createObjectURL(pic));
        } else {
            // Convert DefaultProf string to File object
            const convertDefaultImageToFile = async () => {
                try {
                    // 1. Fetch the default image
                    const response = await fetch(DefaultProf);

                    // 2. Get the image data as Blob
                    const blob = await response.blob();

                    // 3. Create a File object from the Blob
                    const defaultFile = new File([blob], 'default-profile.jpg', {
                        type: blob.type || 'image/jpeg'
                    });

                    setPhoto(defaultFile);
                    setPhotoUrl(DefaultProf);
                } catch (error) {
                    console.error("Error loading default profile image:", error);
                    setPhoto(null);
                    setPhotoUrl(DefaultProf);
                }
            };

            convertDefaultImageToFile();
            console.log("No valid photo found, using default");
        }
    }
        , [])

    useEffect(() => {

        const getSavedVisit = async () => {
            try {
                if (visit && frontService.getCurrentVisitId() == null) {
                    console.log("Original visit data:", visit);

                    if (!visit) {
                        console.error("No visit data provided");
                        return;
                    }

                    if (!frontService.isSaving()) {
                        frontService.setSaving(true)
                        const createdVisit = visit
                        if (createdVisit) {
                            createdVisit.visitor = visit.visitor
                            createdVisit.visitOption = visit.visitOption
                            createdVisit.dynamicAnswers = visit.dynamicAnswers
                            frontService.setCurrentVisitId(createdVisit.id || 0)
                            setqrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?data=V${createdVisit.id}&size=40x40`)
                        }
                        console.log("Created visit:", createdVisit);
                        setSavedVisit(createdVisit);
                        frontService.setSaving(false)
                    }
                } else {
                    // setSavedVisit(visit)
                }
            } catch (error) {
                console.error("Failed to save visit:", error);
            }
        };

        getSavedVisit();
    }, []);



    const links = LinkService.getInstance();
    const formatVerificationStatus = (verified: boolean) => verified ? 'Yes' : 'No';
    const navigate = useNavigate();

    function ResetAnswers(): void {
        navigate(links.frontOffice.visitTypes)
    }

    const printPass = () => {
        if (!savedVisit) return;

        // Create a hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '0';
        iframe.style.width = '300px';
        iframe.style.height = '500px';
        iframe.style.border = 'none';

        document.body.appendChild(iframe);

        const doc = iframe.contentDocument;
        if (!doc) return;

        // Format the visit date and time
        const visitDateTime = savedVisit.badgePrintDate
            ? new Date(savedVisit.badgePrintDate).toLocaleString()
            : new Date().toLocaleString();

        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Visitor Pass</title>
                    <style>
                        @page { 
                            size: 300px 500px;
                            margin: 0;
                        }
                        body { 
                            margin: 0;
                            padding: 0;
                            font-family: Arial, sans-serif;
                        }
                        .visitor-pass {
                            width: 300px;
                            background-color: #ffffff;
                            border: 1px solid #000;
                            margin: 0 auto;
                            overflow: hidden;
                        }
                            .blueLogo {
                                height: clamp(40px, 3vmin, 60px);
                                margin-right: 10px;
                            }

                            .light-font {
                                color: var(--light);
                            }
                       
                           
                       
                        .photo {
                            width: 120px;
                            height: 120px;
                            border: 2px solid #005bb5;
                            border-radius: 10px;
                            margin: 20px auto;
                            background-color: #f0f0f0;
                            overflow: hidden;
                        }
                        .photo img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                        .details {
                            padding: 0 20px;
                            text-align: center;
                            color: #005bb5;
                        }
                        .details p {
                            margin: 5px 0;
                            font-size: 14px;
                        }
                        .details .name {
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .extra-info {
                            padding: 10px 20px;
                            color: #005bb5;
                            font-size: 12px;
                            text-align: center;
                            border-top: 1px dashed #005bb5;
                        }
                        .footer {
                            border-top: 1px solid  #005bb5;
                            background-color: #0094ff;
                            color:  #005bb5;
                            display: flex;
                            align-items: center;
                            padding: 10px;
                            font-size: 12px;
                        }
                        .qr {
                            width: 40px;
                            height: 40px;
                            background-size: cover;
                            margin: 0 20px;
                        }
                        .footer-text {
                            text-align: left;
                            padding-bottom: 0 !important;
                            margin: 0 !important;
                            line-height: 0;
                        }
                        .headerLogo {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-bottom: 1px solid  #005bb5;
                            padding: 10px;
                        }

                        .headerLogo h3,
                        .headerLogo h4 {
                            line-height: 1 !important;
                            color: #0281d0;
                            margin:0 !important;
                            padding:0 !important;
                        } 
                            .lueLogo{
                            height:50px;}  
                    </style>
                </head>
                <body>
                    <div class="visitor-pass" role="region" aria-live="polite">
                       
                    
                    <div class="headerLogo">
                            <img src=${BlueLogoImg} class='blueLogo' alt="logoImg" />
                                <div class="bluelogoText flex column">
                                <h3>${comapanyName}</h3>
                                <h4>Visitor Mnagement</h4>
                        </div>
                       
                       
                        </div>
                        <div class="photo">
                            <img src="${photoUrl}" />
                        </div>
                        <div class="details">
                            <p class="name">${Utils.toTitleCase(savedVisit.visitor.firstName)} ${Utils.toTitleCase(savedVisit.visitor.lastName)}</p>
                            <p>Reason: ${savedVisit.visitOption.visitOptionName}</p>
                            <p>${savedVisit.dynamicAnswers.find(a => a.dynamicQuestion.questionText.includes('Room'))?.value || 'Room: Not specified'}</p>
                            <p>At ${savedVisit.visitRow.date} : ${savedVisit.visitRow.startTime} - ${savedVisit.visitRow.endTime} </p>
                        </div>
                        <div class="extra-info">
                            ${savedVisit.visitOption.description}
                        </div>
                        <div class="footer">
                            <div class="qr">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?data=V${savedVisit.id}&size=40x40" alt="V${savedVisit.id}" />
                            </div>
                            <div class="footer-text">
                                <p>Generated From ${window.location.hostname}</p>
                                <p>At ${new Date().toLocaleTimeString()}</p>
                                <p><strong>Visit ID:</strong> V${savedVisit.id || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `);
        doc.close();

        // Wait for content to load before printing
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow?.print();
                // Don't remove the iframe immediately - let user cancel/confirm print
                // It will be removed when component unmounts or on next print
            }, 200);
        };
        frontService.clearFrontEndService();
    };



    const saveVisitAndPrintPass = async () => {
        try {
            if (savedVisit && savedVisit.id) {
                savedVisit.printed = true;
                const savedObj = await VisitService.markAsPrinted(savedVisit.id);

                const visitorPhoto = frontService.getVisitorPhoto();
                if (visitorPhoto != null && visit?.visitor.id) {
                    // Ensure the photo is in the correct format
                    let imageFile;
                    if (visitorPhoto instanceof File) {
                        imageFile = visitorPhoto;
                    } else {
                        // Convert to File if it's raw data
                        imageFile = new File([visitorPhoto], 'visitor-photo.jpg', {
                            type: 'image/jpeg'
                        });
                    }

                    await userService.saveImage(visit.visitor.id, imageFile);
                }

                toast.info("Confirmed, Your visit marked as printed...");
                console.log(savedObj);
            }

            printPass();
            navigate(links.frontOffice.thankyouAndInstructions);
        } catch (error) {
            console.error("Error saving visit:", error);
            toast.error("Failed to save visit details");
        }
    };



    return (
        <div className="vd-container">
            <h1>Visit Details</h1>

            {/* Visitor Information Section */}
            <div className="vd-section mt-2">
                <div className="vd-section-title">Visitor Information</div>
                <div className="vd-visitor-profile">
                    <div className="vd-profile-img">
                        {photoUrl ? (
                            <img src={photoUrl} alt="Visitor profile" />
                        ) : (
                            <img src={photoUrl} alt="Visitor profile" />
                        )}
                    </div>
                    <div className="vd-visitor-details">
                        <div className="vd-detail-row">
                            <div className="vd-detail-label">Name:</div>
                            {savedVisit && <div className="vd-detail-value">{Utils.toTitleCase(savedVisit.visitor.firstName)} {Utils.toTitleCase(savedVisit.visitor.lastName)}</div>}
                        </div>
                        <div className="vd-detail-row">
                            <div className="vd-detail-label">Email:</div>
                            <div className="vd-detail-value">{savedVisit && savedVisit.visitor.email}</div>
                        </div>
                        <div className="vd-detail-row">
                            <div className="vd-detail-label">Phone:</div>
                            <div className="vd-detail-value">{savedVisit && savedVisit.visitor.phoneNumber}</div>
                        </div>
                        <div className="vd-detail-row">
                            <div className="vd-detail-label">Email Verified:</div>
                            <div className="vd-detail-value">{savedVisit && formatVerificationStatus(savedVisit.visitor.isEmailVerified)}</div>
                        </div>
                        <div className="vd-detail-row">
                            <div className="vd-detail-label">Phone Verified:</div>
                            <div className="vd-detail-value">{savedVisit && formatVerificationStatus(savedVisit.visitor.isPhoneNumberVerified)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visit Information Section */}
            <div className="vd-section">
                <div className="vd-section-title">Visit Information</div>
                <div className="vd-detail-row">
                    <div className="vd-detail-label">Visit Option:</div>
                    <div className="vd-detail-value">{savedVisit && savedVisit.visitOption.visitOptionName}</div>
                </div>
                <div className="vd-detail-row">
                    <div className="vd-detail-label">Date & Time:</div>
                    <div className="vd-detail-value">
                        {savedVisit && savedVisit.visitRow ? savedVisit.visitRow.startTime : 'Not printed yet'}
                    </div>
                </div>
                <div className="vd-detail-row">
                    <div className="vd-detail-label">Pre-registration:</div>
                    <div className="vd-detail-value">{savedVisit && savedVisit.visitOption.isPreRegistration ? 'Yes, This is a pre registration visit' : 'No, This is not a pre registration visit'}</div>
                </div>
            </div>

            {/* Questions and Answers Section */}
            <div className="vd-section">
                <div className="vd-section-title">Questions & Answers</div>
                {savedVisit && savedVisit.dynamicAnswers.map((answer, index) => {
                    const question = answer.dynamicQuestion;
                    return (
                        <div className="vd-question" key={index}>
                            <div className="vd-question-text">{index + 1}. {question.questionText}</div>
                            <div className="vd-answer">
                                {answer.answerType === 'button' ? (
                                    <>
                                        <div><strong>Available Options:</strong></div>
                                        <div>
                                            {question.buttonAnswers && question.buttonAnswers.map(button => (
                                                <span
                                                    key={button.id}
                                                    className={`vd-button-answer ${answer.selectedButtonAnswers && answer.selectedButtonAnswers
                                                        .some(ba => ba.id === button.id) ? 'vd-selected-button' : ''}`}
                                                >
                                                    {button.buttonText}
                                                    {answer.selectedButtonAnswers && answer.selectedButtonAnswers.some(ba => ba.id === button.id)}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div><strong>Answer:</strong> {answer.value || 'No answer provided'}</div>
                                )}
                                {question.specialInstructions && (
                                    <div><em>Special Instructions: {question.specialInstructions}</em></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <RightAlign>
                <button onClick={() => ResetAnswers()} className="front-Button mb-3">Reset My Answers</button>
                <button onClick={() => saveVisitAndPrintPass()} className="front-Button ms-2 mb-3">Print My Pass</button>
            </RightAlign>
        </div>
    );
};