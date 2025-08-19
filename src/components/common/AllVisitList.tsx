import React, { useEffect } from 'react'
import './css/allVisitList.css'
import { Visit } from '../../types/visit';
import { useFullNameHook } from '../customHooks/useFullNameHook';
import { PersonCircle } from '../dashboard/dashboardComponents/servicePointComps/PersonCircle';
import { useMyNavigator } from '../customHooks/useMyNavigator';
import { VisitService } from '../../services/visitService';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../../api/axios';
import { UserDto } from '../../types/UserDto';
import { useCancelVisitHook } from '../customHooks/useCancelVisitHook';

export const AllVisitList = ({ visits, setAllVisits }: { visits: Visit[], setAllVisits: (visits: Visit[]) => void }) => {
    const { getFullName } = useFullNameHook()
    const { links, navigate } = useMyNavigator()
    const [loggedInUser, setLoggedInUser] = React.useState<UserDto | undefined | null>(null);
    const { cancelVisit, canceledVisit, loading } = useCancelVisitHook()





    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setLoggedInUser(user);
                }
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
            }
        };
        fetchLoggedInUser();
    }, []);



    const delteVisit = (visitId: number) => {
        const deleteV = async () => {
            try {
                await VisitService.deleteVisit(visitId);
                setAllVisits(visits.filter(v => v.id !== visitId));
                toast.success('Visit deleted successfully');
            } catch (error) {
                console.error("Error deleting visit:", error);
                toast.error('Failed to delete visit');
            }
        }
        deleteV();

    }

    const handleCancel = async (visitId: number) => {
        const updated = await cancelVisit(visitId);
        if (updated) {
            setAllVisits(visits.map(v => v.id === updated.id ? updated : v));
        }
    };


    return (
        <div className="visit-table-container">
            <table className="visit-table">
                <thead className="visit-table-header">
                    <tr >
                        <th className="visit-table-header-cell">Visit ID</th>
                        <th className="visit-table-header-cell">Option</th>
                        <th className="visit-table-header-cell">visitor Prof</th>
                        <th className="visit-table-header-cell">visitor</th>
                        <th className="visit-table-header-cell">Date</th>
                        <th className="visit-table-header-cell">Start Time</th>
                        <th className="visit-table-header-cell">End Time</th>
                        <th className="visit-table-header-cell">Printed</th>
                        <th className="visit-table-header-cell">Actions</th>
                    </tr>
                </thead>
                <tbody className="visit-table-body">
                    {visits.map(v => (
                        <tr key={v.id} onClick={() => navigate(links.visit.fullVisitMethod(v.id!))}
                            className={`visit-table-row ${v.canceled ? 'canceled-visit' : ''}`}>
                            <td className="visit-table-cell">V{v.id}</td>
                            <td className="visit-table-cell">{v.visitOption?.visitOptionName || '-'}</td>
                            <td className="visit-table-cell"><PersonCircle user={v.visitor}></PersonCircle></td>
                            <td className="visit-table-cell">{getFullName(v.visitor) || '-'}</td>
                            <td className="visit-table-cell">{v.visitRow?.date || '-'}</td>
                            <td className="visit-table-cell">{v.visitRow?.startTime || '-'}</td>
                            <td className="visit-table-cell">{v.visitRow?.endTime || '-'}</td>
                            <td className="visit-table-cell">
                                <span className={`visit-table-status ${v.printed ? 'printed' : 'not-printed'}`}>
                                    {v.printed ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td className="visit-table-cell">
                                <button
                                    disabled={!(loggedInUser && (loggedInUser.role === 'ROLE_ADMIN'))}
                                    className={`outline_button ${(loggedInUser && (loggedInUser.role == 'ROLE_ADMIN')) ? '' : "disable-button"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        delteVisit(v.id!)
                                    }}>
                                    Delete
                                </button>
                                <button
                                    disabled={!(loggedInUser && (loggedInUser.role === 'ROLE_ADMIN'))}
                                    className={`outline_button ms-1 ${(loggedInUser && (loggedInUser.role == 'ROLE_ADMIN')) ? '' : "disable-button"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancel(v.id!);
                                    }}

                                >
                                    Cancel Visit
                                </button>
                            </td>




                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
