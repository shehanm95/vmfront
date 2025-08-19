import React, { useState, useEffect } from 'react';
import { TimeRangInput } from './Field';
import '../dashboard/dashboardComponents/visitOptions/smallComp/timeRangeFileld.css';

interface TimeRange {
    startTime: string;
    endTime: string;
    error?: string;
}

interface TimeRangeAdderProps {
    ranges: { startTime: string; endTime: string }[];
    onChange: (ranges: { startTime: string; endTime: string }[]) => void;
    minDuration?: number;
}

export const TimeRangeAdder: React.FC<TimeRangeAdderProps> = ({
    ranges,
    onChange,
    minDuration = 1
}) => {
    const [fields, setFields] = useState<TimeRange[]>(ranges.map(range => ({
        startTime: range.startTime,
        endTime: range.endTime,
        error: undefined
    })));

    useEffect(() => {
        setFields(ranges.map(range => ({
            startTime: range.startTime,
            endTime: range.endTime,
            error: undefined
        })));
        validateTimeRanges(ranges.map(range => ({
            startTime: range.startTime,
            endTime: range.endTime,
            error: undefined
        })));
    }, [ranges]);

    const addNewField = () => {
        const newFields = [...fields, { startTime: '', endTime: '' }];
        setFields(newFields);
        onChange(newFields.map(({ error, ...rest }) => rest));
    };

    const timeToMinutes = (time: string) => {
        if (!time) return 0;
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const validateTimeRanges = (updatedFields: TimeRange[]) => {
        // First pass: validate individual fields
        let validatedFields = updatedFields.map(field => {
            if (!field.startTime || !field.endTime) {
                return { ...field, error: 'Both times are required' };
            }

            const start = timeToMinutes(field.startTime);
            const end = timeToMinutes(field.endTime);

            if (end <= start) {
                return { ...field, error: 'End time must be after start time' };
            }

            if ((end - start) < minDuration) {
                return { ...field, error: `Duration must be at least ${minDuration} minutes` };
            }

            return { ...field, error: undefined };
        });

        // Second pass: check for overlaps between valid fields
        const validFields = validatedFields.filter(f => !f.error);

        for (let i = 0; i < validFields.length; i++) {
            const current = validFields[i];
            const start1 = timeToMinutes(current.startTime);
            const end1 = timeToMinutes(current.endTime);

            for (let j = i + 1; j < validFields.length; j++) {
                const other = validFields[j];
                const start2 = timeToMinutes(other.startTime);
                const end2 = timeToMinutes(other.endTime);

                if ((start1 < end2 && end1 > start2)) {
                    validatedFields = validatedFields.map(f => {
                        if (
                            (f.startTime === current.startTime && f.endTime === current.endTime) ||
                            (f.startTime === other.startTime && f.endTime === other.endTime)
                        ) {
                            return { ...f, error: 'Time range overlaps with another' };
                        }
                        return f;
                    });
                }
            }
        }

        return validatedFields;
    };

    const handleFieldChange = (index: number, type: 'start' | 'end', value: string) => {
        const updatedFields = fields.map((field, i) =>
            i === index ? {
                ...field,
                [type === 'start' ? 'startTime' : 'endTime']: value
            } : field
        );

        const validatedFields = validateTimeRanges(updatedFields);
        setFields(validatedFields);
        onChange(validatedFields.map(({ error, ...rest }) => rest));
    };

    const removeField = (index: number) => {
        if (fields.length > 1) {
            const updatedFields = fields.filter((_, i) => i !== index);
            const validatedFields = validateTimeRanges(updatedFields);
            setFields(validatedFields);
            onChange(validatedFields.map(({ error, ...rest }) => rest));
        }
    };

    return (
        <div className="filedHolderandAddButton">
            <div className="fieldsOnly">
                {fields.map((field, index) => (
                    <div key={index} className='fieldHolder'>
                        <TimeRangInput
                            startValue={field.startTime}
                            endValue={field.endTime}
                            onChange={(type, value) => handleFieldChange(index, type, value)}
                        />
                        {field.error && <div className="time-range-error">{field.error}</div>}
                        {fields.length > 1 && (
                            <i
                                className="fas fa-trash"
                                onClick={() => removeField(index)}
                                style={{
                                    marginLeft: '10px',
                                    cursor: 'pointer',
                                    color: '#dc3545',
                                    display: 'inline-block',
                                    fontSize: '1.2rem'
                                }}
                                title="Remove time range"
                            ></i>
                        )}
                    </div>
                ))}
            </div>
            <div className="plusRoundButton">
                <i
                    onClick={addNewField}
                    className="fas fa-plus"
                    title="Add new time range"
                ></i>
            </div>
        </div>
    );
};