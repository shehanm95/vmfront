import React from 'react'
import { SpecificDate } from '../../../types/SpecificDate';
import { SimpleVisit, useVisit } from '../../../context/preRegContext';


type AvailablePrompt =
    {
        availableDates: SpecificDate[],
        selectedDate: string,
        setSelectedDate: (date: string) => void,


    }
export const AvailableDataListShow = ({ availableDates, selectedDate, setSelectedDate }: AvailablePrompt) => {

    return (
        <div>
            <div className="available-dates-list">
                <p>Available Dates:</p>
                <ul>
                    {availableDates
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(date => (
                            <li
                                key={date.id}
                                className={`date-option ${selectedDate === date.date ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedDate(date.date);
                                }}
                            >
                                {new Date(date.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </li>
                        ))}
                </ul>
            </div>

        </div>
    )
}
