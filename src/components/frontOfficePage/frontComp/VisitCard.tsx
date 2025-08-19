import React, { useEffect, useState } from 'react';
import './vistCard.css';
import CEO from './CEO.png';
import { VisitType } from '../../../types/visitType';
import { VisitOptionService } from '../../../services/visitOptionService';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../frontServices/LinkService';

interface CardProp {
    vType: VisitType;
}

export const VisitCard: React.FC<CardProp> = ({ vType }) => {
    const [image, setImage] = useState<string>(CEO);
    const forntService = FrontPageService.getInstance();
    const navigate = useNavigate()

    useEffect(() => {
        const getImage = async () => {
            if (vType.imageName) {
                try {
                    const blob = await VisitOptionService.getImage(vType.imageName);
                    const imageUrl = URL.createObjectURL(blob); // ✅ convert blob to URL
                    setImage(imageUrl);
                } catch (e) {
                    console.log('Error fetching image:', vType.imageName, e);
                    // fallback image already handled with default CEO image
                }
            }
        };
        getImage();

        // Cleanup: revoke object URL when component unmounts or image changes
        return () => {
            if (image && image !== CEO) {
                URL.revokeObjectURL(image);
            }
        };
    }, [vType.imageName]);

    const openVisit = (vType: VisitType) => {
        forntService.setSelectedVisitType(vType);
        navigate(LinkService.getInstance().frontOffice.visitOptions);

    };

    return (
        <div onClick={() => openVisit(vType)} className="card">
            <img src={image} alt={vType.visitTypeName} />
            <div className="title">{vType.visitTypeName}</div>
            <button className="button">Proceed</button>
        </div>
    );
};
