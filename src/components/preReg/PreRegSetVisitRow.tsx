import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useVisit } from '../../context/preRegContext';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css'; // Choose a theme
import { english } from 'flatpickr/dist/l10n/default'; // Localization
import './flatPickerStypes.css'
import 'flatpickr/dist/themes/material_blue.css';
import { SpecificDate } from '../../types/SpecificDate';
import { VisitService } from '../../services/visitService';
import { VisitRow } from '../../types/VisitRow';
import { AvailableDataListShow } from './subPreReg/AvailableDateListShow';
import './subPreReg/selectVisitRow.css'
import { ConfirmState, LoadingButton } from './subPreReg/LoadingButton';
import { Visit } from '../../types/visit';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../../types/ApiErrorResonse';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LinkService } from '../../frontServices/LinkService';
import { Utils } from '../../frontServices/Utils';
import { ShowOptionDetails } from './subPreReg/ShowOptionDetails';
import { VisitOptionService } from '../../services/visitOptionService';
import { useMyNavigator } from '../customHooks/useMyNavigator';

// Schema for visit row data
const visitRowSchema = z.object({
    id: z.number(),
    date: z.string().refine(val => !isNaN(Date.parse(val))),
});

export const PreRegSetVisitRow = () => {
    const { visit, setVisit } = useVisit();
    console.log(visit)
    const [availableDates, setAvailableDates] = useState<SpecificDate[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [visitRows, setVisitRows] = useState<VisitRow[]>();
    const [visitCircleId, setVisitCircleId] = useState<string>()
    const [selectedVisitRow, setSelectedVisitRow] = useState<number | undefined>()
    const [confirmState, setConfirmState] = useState<ConfirmState>(ConfirmState.readyToconfirm)

    const { navigate, links } = useMyNavigator()

    useEffect(() => {
        if (!visit.visitOption) {
            navigate(links.preReg.types)
            return;
        }

    }, [])


    const selectVisitCircle = (visitRow: VisitRow, circleId: number) => {
        if (visitRow.visits && visitRow.visits.filter(v => !v.canceled).length <= circleId) {
            setVisitCircleId(visitRow.id + "-" + circleId.toString())
            setSelectedVisitRow(visitRow.id)
        }
    }

    const confirmVisitRow = (visitRow: { id: number }) => {
        console.log('selected visitRow : ' + visitRow.id)
        setConfirmState(ConfirmState.confirming)

        const tempVisit: Visit = {
            visitOption: visit.visitOption!,
            visitor: visit.visitor!,
            dynamicAnswers: [],
            visitRow: visitRow as VisitRow,
            printed: false,

        }
        setConfirmState(ConfirmState.confirming)
        const createPreRegVisit = async () => {
            try {
                const createdVisit = await VisitService.createPreRegVisit(tempVisit)
                console.log('created visit :', createdVisit)
                setConfirmState(ConfirmState.success)
                setVisit({ ...visit, realVisit: createdVisit })
                setTimeout(() => {
                    navigate(LinkService.getInstance().preReg.questions)
                }, 1000)
            } catch (error) {
                const err = error as AxiosError<ApiErrorResponse>;
                setConfirmState(ConfirmState.error)
                toast.error(err.message)
                console.error(err)
            }
        }
        createPreRegVisit()
    }

    // Fetch available dates
    useEffect(() => {
        const fetchAvailableDates = async () => {
            const visitOption = await VisitOptionService.getVisitOptionById(visit.visitOption?.id!);
            const allowedDates = visitOption.specificDates;
            console.log(allowedDates)
            if (allowedDates) {
                setAvailableDates(allowedDates);
            }
        };
        fetchAvailableDates();
    }, []);

    const handleDateChange = (dates: Date[]) => {
        if (dates.length > 0) {
            const dateObj = dates[0];
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const selected = `${year}-${month}-${day}`;

            setSelectedDate(selected);

            const visitRow = { id: 1, date: selected };
            try {
                visitRowSchema.parse(visitRow);
                setVisit({ ...visit, visitRow });
            } catch (error) {
                console.error('Validation error:', error);
                alert('Invalid date selection');
                setSelectedDate('');
            }
        }
    };

    const checkTimePassed = (date: string, timeString: string): boolean => {
        if (!date || !timeString) return false;

        // Parse the input date (format: "YYYY-MM-DD")
        const [year, month, day] = date.split('-').map(Number);

        // Parse the input time (format: "HH:MM")
        const [hours, minutes] = timeString.split(':').map(Number);

        // Create Date object for the specified date and time
        const specifiedDateTime = new Date(year, month - 1, day, hours, minutes, 0);

        // Get current time
        const now = new Date();

        return now > specifiedDateTime;
    };

    // Convert available dates to Date objects for Flatpickr
    const enabledDates = availableDates
        .filter(date => !isNaN(Date.parse(date.date)))
        .map(date => new Date(date.date));

    useEffect(() => {
        const frows = async () => {
            console.log("tyring to peint visit rows")
            try {
                if (!visit.visitOption) {
                    throw new Error("Visit option is required");
                }

                const vr = await VisitService.getVisitRowsForDate({
                    visitOption: visit.visitOption,
                    date: selectedDate
                });
                console.log(vr)
                console.log("tyring to peint visit rows")
                setVisitRows(vr);
            } catch (error) {
                console.error("Failed to fetch visit rows:", error);
            }

        }
        frows();
    }, [selectedDate])


    return (
        <div className="date-selection-container">
            <ShowOptionDetails visitType={visit.visitType!} visitOption={visit.visitOption!}></ShowOptionDetails>

            <hr />

            <h3 className='my-3'>Select Your Visit Date</h3>

            <div className="date-input-container">
                <Flatpickr
                    id="visit-date"
                    options={{
                        dateFormat: 'Y-m-d',
                        enable: enabledDates,
                        locale: english, // Optional localization
                        minDate: 'today', // Optional: don't allow past dates
                        disableMobile: true, // Better UX on mobile devices
                    }}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="flatpickr-input"
                    placeholder="Select available date"
                />
            </div>

            <AvailableDataListShow
                availableDates={availableDates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate} />





            {visitRows && visitRows.length > 0 &&
                <div className="selectedDate my-4">
                    <h2>{selectedDate}</h2>
                    <h3>Select a appropriate time slot for you.</h3>
                </div>
            }
            {visitRows && visitRows.length > 0 ? (
                visitRows.map((R) =>
                    <div key={R.id} className="ms-3 row-container">
                        {R.visitorsPerRow < 5 ? <div className='row-time-slot-button'>
                            <div className={`row-timeAndSlotContainer  ${checkTimePassed(R.date, R.startTime) ? "disableHolder" : ""}`}>
                                <span className={`row-time`}>{Utils.formatTimeTo12Hour(R.startTime)} - {Utils.formatTimeTo12Hour(R.endTime)}:</span>
                                <div className="row-circles">
                                    {[...Array(R.visitorsPerRow)].map((_, i) => (
                                        <div key={i}
                                            onClick={() => selectVisitCircle(R, i,)}
                                            className={`row-circle ${R.visits && R.visits?.filter(v => !v.canceled).length > i || visitCircleId == (R.id + "-" + i.toString()) ? 'row-circle-filled' : 'row-circle-available'}`}>

                                        </div>

                                    ))}
                                </div>
                            </div>
                            {selectedVisitRow && selectedVisitRow === R.id && <LoadingButton
                                confirmState={confirmState}
                                itemToSelect={R}
                                confirmItem={confirmVisitRow}>
                            </LoadingButton>}
                        </div>
                            :
                            <div key={R.id} className='row-more-than'>
                                <div onClick={() => setSelectedVisitRow(R.id)} className="row-timeAndSlotContainer d-inline-block">
                                    <span className="row-time">{Utils.formatTimeTo12Hour(R.startTime)} - {Utils.formatTimeTo12Hour(R.endTime)}:</span>
                                    <h4 className='d-inline-block row-more-than-text'>{R.visits && R.visitorsPerRow - R.visits.length}/ {R.visitorsPerRow} {" "} Available </h4>
                                </div>
                                {selectedVisitRow && selectedVisitRow === R.id &&
                                    <button className='form-button' onClick={() => confirmVisitRow(R)}>Confirm Time Slot</button>}
                            </div>
                        }
                    </div>
                )
            ) : (
                <p>No visits scheduled</p>
            )}


        </div>
    );
};