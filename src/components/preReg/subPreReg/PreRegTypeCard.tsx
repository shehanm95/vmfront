import React, { useEffect, useState } from 'react';
import '../../frontOfficePage/frontComp/vistCard.css';
import { VisitType } from '../../../types/visitType';
import { VisitOptionService } from '../../../services/visitOptionService';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../../frontServices/LinkService';
import CEO from '../../frontOfficePage/frontComp/CEO.png'
import { useVisit } from '../../../context/preRegContext';


export const PreRegTypeCard = ({ vType }: { vType: VisitType }) => {
    const [image, setImage] = useState<string>(CEO);
    const navigate = useNavigate()
    const links = LinkService.getInstance();

    const { visit, setVisit } = useVisit()


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
        if (visit.visitor) {
            setVisit({ ...visit, visitType: vType })
            console.log("moved to type opions")
            navigate(links.preReg.preRegOptions);
        } else {
            navigate(links.login)
        }

    };

    return (
        <div onClick={() => openVisit(vType)} className="card">
            <img src={image} alt={vType.visitTypeName} />
            <div className="title">{vType.visitTypeName}</div>
            <button className="button">Proceed</button>
        </div>
    );
};