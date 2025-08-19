import { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';
import './SpecificDateAdder.css';

interface SampleDateAdderPrompt {
    finalDates: { date: string }[];
    append: (value: { date: string }) => void;
    remove: (index: number) => void;
}

export const SpecificDateAdder: React.FC<SampleDateAdderPrompt> = ({ finalDates, append, remove }) => {
    const [newDate, setDate] = useState<string>('');

    function addDate(): void {
        if (newDate) {
            if (finalDates.some(d => d.date == newDate)) {
                toast.error("You cannot enter same date twice");
                return;
            }
            if (new Date(newDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
                toast.error("You cannot enter a past date");
                setDate('');
                return;
            }
            append({ date: newDate })
            setDate('');
        } else {
            toast.error("No Date Selected To Add");
        }
    }

    function handleDateChange(event: ChangeEvent<HTMLInputElement>): void {
        setDate(event.target.value);
    }

    return (
        <div className="spd-container">
            <div className="spd-dates-list">
                {finalDates.length > 0 ? (
                    finalDates.map((d, index) => (
                        <div key={index} className="spd-date-item">
                            <span className="spd-date-value">{d.date}</span>
                            <i
                                onClick={() => remove(index)}
                                className="fas fa-trash spd-delete-icon"
                            ></i>
                        </div>
                    ))
                ) : (
                    <p className="spd-no-dates">No dates to display</p>
                )}
            </div>

            <div className="spd-input-container">
                <input
                    type="date"
                    value={newDate}
                    onChange={handleDateChange}
                    className="spd-date-input"
                />
                <i

                    onClick={addDate}
                    className="spd-add-button fas fa-plus"
                >
                    Add Date
                </i>
            </div>
        </div>
    );
};