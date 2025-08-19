import React, { useState, useEffect } from 'react';
import './visitOptions.css';
import { Center } from '../../../common/Center';
import { BlurBack } from '../../../common/BlurBack';
import { CreateVisitType } from './CreateVisitType';
import { VisitType } from '../../../../types/visitType';
import { VisitTypeService } from '../../../../services/visitTypeSerive';
import { setTypeDetails } from '../../../../services/typeKeeper';
import { useNavigate } from 'react-router-dom';
import { IconHeader } from '../../../common/IconHeader';
import { useMyNavigator } from '../../../customHooks/useMyNavigator';

export const ShowVisitTypesNVisitOptionsDashboard = () => {
    const [visitTypeWindow, setVisitTypeWindow] = useState(false);
    const [visitTypes, setVisitTypes] = useState<VisitType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all visit types on component mount
    useEffect(() => {
        const fetchVisitTypes = async () => {
            try {
                console.log("tring to getting visit types")
                const types = await VisitTypeService.getAllVisitTypes();
                setVisitTypes(types);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching visit types:', err);
                setError('Failed to load visit types.');
                setLoading(false);
            }
        };
        fetchVisitTypes();
    }, []);

    const toggleCollapse = (e: React.MouseEvent<HTMLDivElement>) => {
        const header = e.currentTarget;
        const content = header.nextElementSibling as HTMLElement | null;
        const icon = header.querySelector('i');

        if (content && icon) {
            content.classList.toggle('hidden');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        }
    };

    const handleAddVisitType = () => {
        setVisitTypeWindow(true);
    };

    const getSavedType = (visitType: VisitType) => {
        console.log('Saved Visit Type:', visitType);
        setVisitTypes([...visitTypes, visitType]); // Optimistically add to list
    };

    const { navigate, links } = useMyNavigator()

    const openCreateVisitOptionVindow = (visitType: VisitType) => {
        setTypeDetails({
            vistTypes: visitTypes,
            currentVisitType: visitType
        })
        navigate('/moderatorDashboard/visitOptions/create')
    }

    function ShowVisitOptionDetails(id: number): void {
        navigate(links.moderatorDashboard.visitOptionDetailsMethod(id))
    }

    return (

        <div>
            <IconHeader icon='fa-sliders-h' title='Visit Options' />
            {/* Visit Types Sections */}
            {loading ? (
                <div className="collapsible-container">
                    <div className="collapsible-header">
                        <span>Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="collapsible-container">
                    <div className="collapsible-header">
                        <span>{error}</span>
                    </div>
                </div>
            ) : visitTypes.length === 0 ? (
                <div className="collapsible-container">
                    <div className="collapsible-header">
                        <span>No Visit Types Available</span>
                    </div>
                </div>
            ) : (
                visitTypes.map((visitType) => (
                    <div className="collapsible-container" key={visitType.id}>
                        <div className="collapsible-header" onClick={toggleCollapse}>
                            <span>{visitType.visitTypeName}</span>
                            <i className="fas fa-chevron-down"></i>
                        </div>
                        <div className="bd-content hidden">
                            {visitType.visitOptions && <>
                                {visitType.visitOptions.length != 0 && visitType.visitOptions.map((visitOption) => (
                                    <div className="item" key={visitOption.id}>
                                        <span>{visitOption.visitOptionName}</span>
                                        <div className="buttonHolder">
                                            {visitOption && <button onClick={() => ShowVisitOptionDetails(visitOption.id!)}>Check</button>}
                                            {/* <button>Edit</button> */}
                                        </div>
                                    </div>
                                ))}</>}
                            {/* Placeholder visit options (replace with actual data if available) */}

                            <Center>
                                <button onClick={() => openCreateVisitOptionVindow(visitType)} className="vO-add-button">
                                    <i className="fas fa-plus-circle"></i> Add New Visiting Option
                                </button>
                            </Center>
                        </div>
                    </div>
                ))
            )}

            {/* Add New Visit Type Button */}
            <Center>
                <button onClick={handleAddVisitType} className="vO-add-button">
                    <i className="fas fa-plus-circle"></i> Add New Visit Type
                </button>
            </Center>

            {/* Create Visit Type Popup */}
            {visitTypeWindow && (
                <BlurBack>
                    <CreateVisitType
                        onClose={() => setVisitTypeWindow(false)}
                        getSavedType={getSavedType}
                    />
                </BlurBack>
            )}
        </div>
    );
};