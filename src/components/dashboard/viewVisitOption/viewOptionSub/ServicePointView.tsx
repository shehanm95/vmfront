import React from "react";
import { ServicePoint } from "../../../../types/ServicePoint";

interface Props {
    servicePoint: ServicePoint;
}

export const ServicePointView: React.FC<Props> = ({ servicePoint }) => {
    return (
        <div className="border p-3 mb-4 rounded bg-gray-50">
            <h4 className="text-lg font-bold">{servicePoint.pointName}</h4>
            <p><strong>Location:</strong> {servicePoint.location}</p>
            <p><strong>Status:</strong> {servicePoint.servicePointStatus}</p>

            {servicePoint.duties?.length > 0 && (
                <div className="mt-2">
                    <p className="font-semibold">Officers:</p>
                    <ul className="list-disc list-inside">
                        {servicePoint.duties.map((duty, index) => (
                            <li key={index}>
                                {duty.officer?.firstName} {duty.officer?.lastName} - {duty.dutyState}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {servicePoint.officerQuestions?.length > 0 && (
                <div className="mt-2">
                    <p className="font-semibold">Officer Questions:</p>
                    <ul className="list-disc list-inside">
                        {servicePoint.officerQuestions.map((q) => (
                            <li key={q.id}>
                                {q.questionText} ({q.answerType})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
