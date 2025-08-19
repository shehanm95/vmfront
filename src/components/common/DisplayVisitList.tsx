import React from 'react'
import { Visit } from '../../types/visit'
import { useCancelVisitHook } from '../customHooks/useCancelVisitHook'

export const DisplayVisitList = ({ filteredVisits: propVisits }: { filteredVisits: Visit[] }) => {
    const [filteredVisits, setFilteredVisits] = React.useState<Visit[]>(propVisits);

    const { cancelVisit, canceledVisit, loading } = useCancelVisitHook();

    const handleCancel = async (visitId: number) => {
        const updated = await cancelVisit(visitId);
        if (updated) {
            setFilteredVisits(filteredVisits.map(v => v.id === updated.id ? updated : v));
        }
    };



    return (
        <div className="visit-table-container">
            <table className="visit-table">
                <thead className="visit-table-header">
                    <tr>
                        <th className="visit-table-header-cell">Visit ID</th>
                        <th className="visit-table-header-cell">Option</th>
                        <th className="visit-table-header-cell">Date</th>
                        <th className="visit-table-header-cell">Start Time</th>
                        <th className="visit-table-header-cell">End Time</th>
                        <th className="visit-table-header-cell">Printed</th>
                        <th className="visit-table-header-cell">Cancelation</th>
                    </tr>
                </thead>
                <tbody className="visit-table-body">
                    {filteredVisits.map(v => (
                        <tr key={v.id} className={` visit-table-row ${v.canceled ? 'canceled-visit' : ''}`}>
                            <td className="visit-table-cell">V{v.id}</td>
                            <td className="visit-table-cell">{v.visitOption?.visitOptionName || '-'}</td>
                            <td className="visit-table-cell">{v.visitRow?.date || '-'}</td>
                            <td className="visit-table-cell">{v.visitRow?.startTime || '-'}</td>
                            <td className="visit-table-cell">{v.visitRow?.endTime || '-'}</td>
                            <td className="visit-table-cell">
                                <span className={`visit-table-status ${v.printed ? 'printed' : 'not-printed'}`}>
                                    {v.printed ? 'Yes' : 'No'}
                                </span>
                            </td>
                            <td className="visit-table-cell">
                                {v.canceled ? (
                                    <span className="visit-table-status canceled">Canceled</span>
                                ) :

                                    <button
                                        className='outline_button'
                                        onClick={() => handleCancel(v.id!)}
                                    >
                                        Cancel Visit
                                    </button>

                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
