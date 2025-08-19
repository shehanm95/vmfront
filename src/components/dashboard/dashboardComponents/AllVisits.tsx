import React, { use, useEffect, useRef, useState } from 'react'
import { UserDto } from '../../../types/UserDto';
import { VisitService } from '../../../services/visitService';
import { Visit } from '../../../types/visit';
import { AllVisitList } from '../../common/AllVisitList';
import { Center } from '../../common/Center';
import { RightAlign } from '../../common/RightAlign';
import { PageNumberChanger } from '../../common/PageNumberChanger';
import { FilterVisits } from './FilterVisits';
import { VisitType } from '../../../types/visitType';
import { VisitOption } from '../../../types/visitOption';
import { CsvService } from '../../../frontServices/CsvService';


export interface VisitSearchObject {
    visitType?: VisitType,
    visitOption?: VisitOption,
    startDate?: string,
    endDate?: string
}




export const AllVisits = () => {
    const [allVisits, setAllVisits] = useState<Visit[]>([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [pageLimit, setPageLimit] = useState(10);
    const [searchObject, setSearchObject] = useState<VisitSearchObject>({});



    useEffect(() => {
        const fetchAllVisits = async () => {
            try {
                setPageNumber(0); // Reset to first page on search change
                const visits = await VisitService.getVisitsBySearchObj(pageLimit, 0, searchObject);
                console.log("Fetched all visits: ", visits);
                setAllVisits(visits);
            } catch (error) {
                console.error("Error fetching all visits:", error);
            }
        }
        fetchAllVisits();
    }, [searchObject, pageLimit]);

    useEffect(() => {
        const fetchAllVisits = async () => {
            try {
                console.log("Fetching all visits for page: ", pageNumber);
                const visits = await VisitService.getVisitsBySearchObj(pageLimit, pageNumber, searchObject);
                console.log("Fetched all visits: ", visits);
                setAllVisits(visits);
            } catch (error) {
                console.error("Error fetching all visits:", error);
            }
        }
        fetchAllVisits();
    }, [pageNumber, setPageLimit]);





    useEffect(() => {
        const getAllVisits = async () => {
            try {
                console.log("Fetching all visits for page: ", pageNumber);
                const visits = await VisitService.getAllVisits(pageLimit, pageNumber);
                console.log("Fetched all visits: ", visits);
                setAllVisits(visits);
            } catch (error) {
                console.error("Error fetching all visits:", error);
            }

        }
        getAllVisits();
    }, [pageNumber])
    return (
        <div>

            <FilterVisits setSearchObject={setSearchObject} setPageLimit={setPageLimit}></FilterVisits>

            <hr />
            <RightAlign>
                <div className="flex">
                    {allVisits.length > 0 && <h4>result showing for visit page {pageNumber + 1}</h4>}
                    <button onClick={() => CsvService.downloadVisitsAsCsvFile(allVisits)} className='outline_button ms-2'>Download CSV</button>
                </div>
            </RightAlign>
            {allVisits.length > 0 ? <AllVisitList setAllVisits={setAllVisits} visits={allVisits}></AllVisitList> :
                <Center>
                    <h2>No Visits To Show</h2>
                </Center>
            }
            <PageNumberChanger
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                pageLimit={pageLimit}
                currentListLength={allVisits.length} />

        </div>
    )
}
