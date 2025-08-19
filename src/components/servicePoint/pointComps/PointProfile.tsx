import React from 'react'
import { UserDto } from '../../../types/UserDto'
import { usePorfileImageSetter } from '../../customHooks/usePorfileImageSetter';
import { useMyNavigator } from '../../customHooks/useMyNavigator';
import { GoToOptions } from '../../dashboard/dashboardComponents/goToOptions/GoToOptions';
import { replace } from 'react-router-dom';
import { useFullNameHook } from '../../customHooks/useFullNameHook';

export const PointProfile = ({ visitor, visitId }: { visitor: UserDto, visitId?: number }) => {
    const { profileImage } = usePorfileImageSetter({ user: visitor });
    const fullName = useFullNameHook().getFullName(visitor);
    const { navigate, links } = useMyNavigator()

    const goToProfile = () => {
        const path = links.profile.checkVisitor.replace(":id", visitor.id!.toString());
        navigate(path);
    };



    const goToFullVisit = (): void => {
        if (visitId) {
            const path = links.visit.fullVisit.replace(":id", visitId?.toString());
            console.log("link path: ", path)
            navigate(path)
        }
    }

    return (
        <div className="point-answering-prof-sec-outer">
            <div className="point-answering-profile-section">
                <img src={profileImage} alt="Profile" className="point-answering-profile-pic" />
                <div className="point-answering-profile-info">
                    <span className="point-answering-visitor-name">: {fullName}</span>
                    <button onClick={goToProfile} className="outline_button">View Full Profile</button>
                    {visitId && <button onClick={goToFullVisit} className="outline_button mt-1">Check Full Visit</button>}
                </div>
            </div>
        </div>
    )
}
