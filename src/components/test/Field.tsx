// import '../dashboard/dashboardComponents/visitOptions/smallComp/timeRangeFileld.css'
// import React, { ChangeEvent } from 'react';

// type FieldProps = {
//     startValue: string;
//     endValue: string;
//     onChange: (type: 'start' | 'end', value: string) => void;
// };

// export const TimeRangInput: React.FC<FieldProps> = ({ startValue, endValue, onChange }) => {
//     const handleChange = (type: 'start' | 'end') => (e: ChangeEvent<HTMLInputElement>) => {
//         onChange(type, e.target.value);
//     };

//     return (
//         <div className="field-container">
//             <div className="inner-container">
//                 <i className="far fa-clock"></i>
//                 <div className="field-group">
//                     <input
//                         type="time"
//                         value={startValue}
//                         onChange={handleChange('start')}
//                         className="time-input"
//                     />
//                 </div>
//                 <span className="form-time-range-label">To:</span>
//                 <div className="field-group">
//                     <input
//                         type="time"
//                         value={endValue}
//                         onChange={handleChange('end')}
//                         className="time-input"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };


import '../dashboard/dashboardComponents/visitOptions/smallComp/timeRangeFileld.css'
import React, { ChangeEvent } from 'react';

type FieldProps = {
    startValue: string;
    endValue: string;
    onChange: (type: 'start' | 'end', value: string) => void;
};

export const TimeRangInput: React.FC<FieldProps> = ({ startValue, endValue, onChange }) => {
    const handleChange = (type: 'start' | 'end') => (e: ChangeEvent<HTMLInputElement>) => {
        onChange(type, e.target.value);
    };

    return (
        <div className="field-container">
            <div className="inner-container">
                <i className="far fa-clock"></i>
                <div className="field-group">
                    <input
                        type="time"
                        value={startValue}
                        onChange={handleChange('start')}
                        className="time-input"
                        required
                    />
                </div>
                <span className="form-time-range-label">To:</span>
                <div className="field-group">
                    <input
                        type="time"
                        value={endValue}
                        onChange={handleChange('end')}
                        className="time-input"
                        required
                    />
                </div>
            </div>
        </div>
    );
};