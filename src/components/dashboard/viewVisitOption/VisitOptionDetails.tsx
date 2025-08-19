import React, { useEffect, useState } from "react";
import { VisitOption } from "../../../types/visitOption";
import { TimeRange } from "../../../types/TimeRange";
import { ServicePointView } from "./viewOptionSub/ServicePointView";
import { Center } from "../../common/Center";
import { VisitOptionService } from "../../../services/visitOptionService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RightAlign } from "../../common/RightAlign";
import './optionDetails.css';
import { useMyNavigator } from "../../customHooks/useMyNavigator";

export const VisitOptionDetails = () => {
    const [visitOption, setVisitOption] = useState<VisitOption | undefined>();
    const [editable, setEditable] = useState<VisitOption | undefined>();
    const [isEditing, setIsEditing] = useState(false);
    const { id } = useParams<{ id: string }>();
    const { navigate, links } = useMyNavigator()

    useEffect(() => {
        const getVisitOption = async () => {
            try {
                const vOption = await VisitOptionService.getVisitOptionById(parseInt(id!));
                setVisitOption(vOption);
            } catch (e) {
                toast.error(`Visit option not found with ID: ${id}`);
            }
        };
        getVisitOption();
    }, [id]);

    const toggleEdit = () => {
        setIsEditing(true);
        setEditable({ ...visitOption! });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditable(undefined);
    };

    const deleteOption = async () => {
        if (window.confirm("Are you sure you want to delete this visit option?")) {
            try {
                await VisitOptionService.deleteVisitOption(visitOption!.id!);
                toast.success("Visit option deleted successfully");
                setVisitOption(undefined);
                navigate(links.moderatorDashboard.visitOptions)
            } catch (e) {
                toast.error("Failed to delete visit option");
            }
        }
    };

    const handleSave = async () => {
        try {
            const updated = await VisitOptionService.updateVisitOption(editable!);
            toast.success("Visit option updated successfully");
            setVisitOption(updated);
            setIsEditing(false);
        } catch (e) {
            toast.error("Failed to update visit option");
        }
    };

    const handleChange = (field: keyof VisitOption, value: any) => {
        setEditable(prev => ({
            ...prev!,
            [field]: value
        }));
    };

    if (!visitOption) {
        return (
            <Center>
                <h3 className="option-details-loading">Loading Visit Option...</h3>
            </Center>
        );
    }

    const option = isEditing ? editable! : visitOption;

    return (
        <div className="option-details-container">
            <h2 className="option-details-title">Visit Option Details</h2>

            <div className="option-details-form">
                <label>Name</label>
                <input
                    type="text"
                    value={option.visitOptionName}
                    disabled={!isEditing}
                    onChange={e => handleChange("visitOptionName", e.target.value)}
                />

                <label>Description</label>
                <textarea
                    value={option.description || ""}
                    disabled={!isEditing}
                    onChange={e => handleChange("description", e.target.value)}
                />

                <label>Average Time Per Person (mins)</label>
                <input
                    type="number"
                    value={option.averageTimeForAPerson}
                    disabled={!isEditing}
                    onChange={e => handleChange("averageTimeForAPerson", +e.target.value)}
                />

                <label>Visitors Per Row</label>
                <input
                    type="number"
                    value={option.visitorsPerRow}
                    disabled={!isEditing}
                    onChange={e => handleChange("visitorsPerRow", +e.target.value)}
                />

                <div className="option-details-checkbox-group">
                    {["isPreRegistration", "isPhotoRequired", "isPhotoOptional", "isPhoneNumberRequired", "isEmailRequired"].map((key) => (
                        <label key={key}>
                            <input
                                type="checkbox"
                                checked={(option as any)[key]}
                                disabled={!isEditing}
                                onChange={e => handleChange(key as keyof VisitOption, e.target.checked)}
                            />
                            {key}
                        </label>
                    ))}
                </div>

                <div className="option-details-section">
                    <h3>Time Ranges</h3>
                    {option.timeRanges.map((range: TimeRange) => (
                        <div key={range.id} className="option-details-box">
                            <span>Start: {range.startTime}</span>
                            <span>End: {range.endTime}</span>
                        </div>
                    ))}
                </div>

                <div className="option-details-section">
                    <h3>Dynamic Questions</h3>
                    {option.dynamicQuestions.map((q) => (
                        <div key={q.id} className="option-details-box">
                            <p><strong>{q.questionText}</strong></p>
                            <p>Required: {q.isRequired ? "Yes" : "No"} | Type: {q.answerType}</p>
                        </div>
                    ))}
                </div>

                {option.servicePoints && option.servicePoints?.length > 0 && (
                    <div className="option-details-section">
                        <h3>Service Points</h3>
                        {option.servicePoints.map(sp => (
                            <ServicePointView key={sp.id} servicePoint={sp} />
                        ))}
                    </div>
                )}
            </div>

            <RightAlign>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="option-details-btn save">Save</button>
                        <button onClick={deleteOption} className="option-details-btn cancel">Delete</button>
                        <button onClick={cancelEdit} className="option-details-btn cancel">Cancel</button>
                    </>
                ) : (
                    <button onClick={toggleEdit} className="option-details-btn edit">Edit</button>
                )}
            </RightAlign>
        </div>
    );
};
