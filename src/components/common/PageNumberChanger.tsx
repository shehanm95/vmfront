import React from 'react'
import { RightAlign } from './RightAlign';

export const PageNumberChanger = ({ pageNumber, setPageNumber, pageLimit, currentListLength }: { pageNumber: number, setPageNumber: (pageNumber: number) => void, pageLimit: number, currentListLength: number }) => {
    return (
        <div className='mt-3 me-3'>
            <RightAlign>
                {pageNumber > 0 && <button className='outline_button me-1' onClick={() => { setPageNumber(pageNumber - 1); }}>
                    Previous Page
                </button>}
                <button disabled={currentListLength < pageLimit} className={`outline_button me-1 ${currentListLength < pageLimit ? "disable-button" : ""}`} onClick={() => { setPageNumber(pageNumber + 1) }}>
                    Next Page
                </button>
            </RightAlign>
            <RightAlign>
                <h6 className='text-secondary mt-3'>Up to {pageLimit} items per page</h6>
            </RightAlign>
        </div>
    )
}
