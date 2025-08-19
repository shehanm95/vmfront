import { useEffect, useState } from "react";
import { VisitOption } from "../../../types/visitOption";
import { VisitType } from "../../../types/visitType";
import './showPreRegOptionDetails.css'
import CEO from '../../frontOfficePage/frontComp/CEO.png'
import { VisitOptionService } from "../../../services/visitOptionService";
import { Utils } from "../../../frontServices/Utils";
import { useNavigate } from "react-router-dom";
import { LinkService } from "../../../frontServices/LinkService";

export const ShowOptionDetails = ({ visitType, visitOption }: { visitType?: VisitType; visitOption: VisitOption }) => {
    const [imagePath, setImagePath] = useState(CEO);
    const navigate = useNavigate();
    const links = LinkService.getInstance();

    useEffect(() => {
        if (!visitOption) {
            // navigate(links.preReg.base);
        }
    }, [visitOption, navigate, links.preReg.base]);

    useEffect(() => {
        const fetchImage = async () => {
            if (visitOption?.imageName) {
                try {
                    const img = await VisitOptionService.getImage(visitOption.imageName);
                    setImagePath(URL.createObjectURL(img));
                } catch (error) {
                    console.error("Error loading image:", error);
                }
            }
        };

        fetchImage();
    }, [visitOption]);

    if (!visitOption) {
        return null;
    }

    console.log("visit option details: ", visitOption);
    if (visitType) {
        console.log("visit type details: ", visitType);
    }

    return (
        <div className="pre-op-details">
            <h3 className="pre-op-header">Visit Option Details.</h3>
            <div className="pre-op-detailRow">
                <div className="pre-op-detailTitle">Visit Option Name</div>
                <div className="pre-op-detailValue">:{" "}{Utils.toTitleCase(visitOption.visitOptionName)}</div>
            </div>
            {visitType && <div className="pre-op-detailRow">
                <div className="pre-op-detailTitle">Visiting Type</div>
                <div className="pre-op-detailValue">:{" "}{visitType && Utils.toTitleCase(visitType.visitTypeName)}</div>
            </div>}
            {visitOption.description && <div className="pre-op-detailRow">
                <div className="pre-op-detailTitle">Description</div>
                <div className="pre-op-detailValue">:{" "}{Utils.toTitleCase(visitOption.description)}</div>
            </div>}
            <div className="pre-op-detailRow">
                <div className="pre-op-detailTitle">Cover Image</div>
                <div className="pre-op-detailValue">{" "}
                    {imagePath && <img src={imagePath} alt={`image ${visitOption.visitOptionName}`} />}
                </div>
            </div>
        </div>
    );
};