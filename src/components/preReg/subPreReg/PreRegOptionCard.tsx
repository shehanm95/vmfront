import React, { useEffect, useState } from 'react';
import '../../frontOfficePage/frontComp/vistCard.css';
import { VisitType } from '../../../types/visitType';
import { VisitOptionService } from '../../../services/visitOptionService';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../frontServices/LinkService';
import CEO from '../../frontOfficePage/frontComp/CEO.png'
import { useVisit } from '../../../context/preRegContext';
import { VisitOption } from '../../../types/visitOption';


export const PreRegOptionCard = ({ vOption: option }: { vOption: VisitOption }) => {
    const [image, setImage] = useState<string>(CEO);
    const navigate = useNavigate()

    const { visit, setVisit } = useVisit()



    useEffect(() => {
        const getImage = async () => {
            if (option.imageName) {
                try {
                    const blob = await VisitOptionService.getImage(option.imageName);
                    const imageUrl = URL.createObjectURL(blob);
                    setImage(imageUrl);
                } catch (e) {
                    console.log('Error fetching image:', option.imageName, e);
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
    }, [option.imageName]);

    const openVisit = (option: VisitOption) => {
        setVisit({ ...visit, visitOption: option })
        navigate(LinkService.getInstance().preReg.setRow);
    };

    return (
        <div onClick={() => openVisit(option)} className="card">
            <img src={image} alt={option.visitOptionName} />
            <div className="title">{option.visitOptionName}</div>
            <button className="button">Proceed</button>
        </div>
    );
};