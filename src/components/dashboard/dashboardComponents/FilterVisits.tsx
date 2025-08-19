import React, { useEffect, useState } from 'react'
import { VisitType } from '../../../types/visitType';
import { VisitOption } from '../../../types/visitOption';
import { VisitTypeService } from '../../../services/visitTypeSerive';
import { VisitOptionService } from '../../../services/visitOptionService';
import { RightAlign } from '../../common/RightAlign';
import { VisitSearchObject } from './AllVisits';
import './visitFilter.css'; // Assuming you have a CSS file for styling

export const FilterVisits = ({ setSearchObject, setPageLimit }: { setSearchObject: (searchObject: VisitSearchObject) => void, setPageLimit: (count: number) => void }) => {
    const [visitTypes, setVisitTypes] = useState<VisitType[]>([]);
    const [visitOptions, setVisitOptions] = useState<VisitOption[]>([]);
    const [selectedVisitType, setSelectedVisitType] = useState<VisitType | undefined>(undefined);
    const [selectedVisitOption, setSelectedVisitOption] = useState<VisitOption | undefined>(undefined);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        const fetchVisitTypes = async () => {
            const types = await VisitTypeService.getAllVisitTypes();
            if (types) {
                setVisitTypes(types);
            }
        }
        fetchVisitTypes();
    }, []);

    useEffect(() => {
        console.log("Selected Visit Type: ", selectedVisitType);
        if (selectedVisitType) {
            const fetchVisitOptions = async () => {
                const options = await VisitOptionService.getVisitOptionsByVisitType(selectedVisitType.id!)
                if (options) {
                    setVisitOptions(options);
                }
            }
            fetchVisitOptions();
        } else {
            setVisitOptions([]);
        }
    }, [selectedVisitType]);

    const filterVisits = () => {
        const searchObject: VisitSearchObject = {
            visitType: selectedVisitType,
            visitOption: selectedVisitOption,
            startDate,
            endDate
        }
        setSearchObject(searchObject);
        console.log("Search Object: ", searchObject);

    }
    const handleVisitTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const type = visitTypes.find(t => t.id === Number(selectedId)) || undefined;
        setSelectedVisitType(type);
        setSelectedVisitOption(undefined); // Reset the option when type changes
    };

    const handleVisitOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const option = visitOptions.find(o => o.id === Number(selectedId)) || undefined;
        setSelectedVisitOption(option);
    };

    return (
        <div className='visits-filter'>
            <select onChange={handleVisitTypeChange} value={selectedVisitType?.id || ''}>
                <option value="">Select Visit Type</option>
                {visitTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.visitTypeName}
                    </option>
                ))}
            </select>

            {visitOptions.length > 0 && (
                <select
                    onChange={handleVisitOptionChange}
                    value={selectedVisitOption?.id || ''}
                >
                    <option value="">Select Visit Option</option>
                    {visitOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.visitOptionName}
                        </option>
                    ))}
                </select>
            )}

            {selectedVisitOption &&

                <div>
                    <label>
                        Start Date:
                        <input className='ms-2'
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </label>
                    <label className='ms-4'>
                        End Date:
                        <input
                            className='ms-2'
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </label>
                </div>
            }  <RightAlign>
                <div>
                    <button
                        className='outline_button m-2'
                        onClick={filterVisits}>
                        Apply Filter
                    </button>
                    <button
                        className='outline_button m-2'
                        onClick={() => {
                            setSelectedVisitType(undefined);
                            setSelectedVisitOption(undefined);
                            setStartDate('');
                            setEndDate('');
                            console.log("Filters cleared");
                            filterVisits();
                        }
                        }
                    >
                        Clear Filters
                    </button>

                </div>
            </RightAlign>

            <hr />
            <label htmlFor="itemsperPage" className='me-2'>Items Per Page</label>
            <input type="number" id='itemsperPage' placeholder='Items Per Page' defaultValue={10} onChange={(e) => setPageLimit(Number(e.target.value))} />
            <br />


        </div>
    )
}