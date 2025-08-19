import React, { useEffect, useState } from 'react';
import './vistCard.css';
import CEO from './CEO.png';
import { VisitOption } from '../../../types/visitOption';
import { VisitOptionService } from '../../../services/visitOptionService';
import { useNavigate } from 'react-router-dom';
import { FrontPageService } from '../../../frontServices/FrontPageSerivce';
import { LinkService } from '../../../frontServices/LinkService';

interface OptionCardProp {
    visitOption: VisitOption;
}

export const OptionCard: React.FC<OptionCardProp> = ({ visitOption }) => {
    const [image, setImage] = useState<string>(CEO);
    const navigate = useNavigate();
    const frontServices = FrontPageService.getInstance()

    useEffect(() => {
        const getImage = async () => {
            if (visitOption.imageName) {
                try {
                    const blob = await VisitOptionService.getImage(visitOption.imageName);
                    const imageUrl = URL.createObjectURL(blob);
                    setImage(imageUrl);
                } catch (e) {
                    console.log('Error fetching image:', visitOption.imageName, e);

                }
            }
        };
        getImage();
        return () => {
            if (image && image !== CEO) {
                URL.revokeObjectURL(image);
            }
        };
    }, [visitOption.imageName]);

    const openVisit = (visitOption: VisitOption) => {
        frontServices.setSelectedVisitOption(visitOption);
        navigate(LinkService.getInstance().frontOffice.register)
    };

    return (
        <div onClick={() => openVisit(visitOption)} className="card">
            <img src={image} alt={visitOption.visitOptionName} />
            <div className="title">{visitOption.visitOptionName}</div>
            <button className="button">Proceed</button>
        </div>
    );
};
