import React, { useEffect, useState } from 'react'
import './loadingButton.css'
import { VisitRow } from '../../../types/VisitRow';

export enum ConfirmState {
    confirming, readyToconfirm, error, success
}

interface LoadingButtonProps {
    confirmState: ConfirmState,
    itemToSelect: { id: number },
    confirmItem: (itemToSelect: { id: number }) => void
}

export const LoadingButton = ({
    confirmState,
    itemToSelect,
    confirmItem
}: LoadingButtonProps) => {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 800);
    }, [])

    return (
        <div>
            {loading ? <div className="loading-button">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
            </div> :
                <div onClick={() => confirmItem(itemToSelect)} className="loading-button">
                    {confirmState === ConfirmState.readyToconfirm && 'Confirm'}
                    {confirmState === ConfirmState.confirming && 'Confirming..'}
                    {confirmState === ConfirmState.error && 'error'}
                    {confirmState === ConfirmState.success && 'success'}
                </div>}
        </div>
    )
}

