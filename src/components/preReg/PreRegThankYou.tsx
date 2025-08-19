import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../frontServices/LinkService'
import { useVisit } from '../../context/preRegContext'
import { VisitService } from '../../services/visitService'
import { AxiosError } from 'axios'
import { ApiErrorResponse } from '../../types/ApiErrorResonse'
import './preRegThankYou.css';

export const PreRegThankYou = () => {
    const navigate = useNavigate()
    const links = LinkService.getInstance()
    const [count, setCount] = useState<number>(10)
    const [error, setError] = useState<string>('')
    const { visit, setVisit } = useVisit()

    useEffect(() => {
        const updateVisit = async () => {
            try {
                const updatedVisit = await VisitService.updateVisit(visit.realVisit?.id!, visit.realVisit!);
            } catch (error) {
                const err = error as AxiosError<ApiErrorResponse>
                setError(err.response?.data.message || 'An unknown error occurred')
                console.log(error)
            }
        }
        updateVisit()
    }, [visit])

    useEffect(() => {
        const timer = setInterval(() => {
            if (!error) {
                setCount(prevCount => {
                    if (prevCount <= 1) {
                        clearInterval(timer)
                        navigate(links.profile.base);
                        return 0
                    }
                    return prevCount - 1
                })
            }
        }, 1000);

        return () => clearInterval(timer)
    }, [error, navigate, links])

    return (
        <div className='pre-thank-container'>
            {error ?
                <div className='pre-thank-error'>
                    <h3 className='pre-thank-error-title'>Something went wrong with your visit registration</h3>
                    <h2 className='pre-thank-error-message'>{error}</h2>
                    <div className='pre-thank-error-actions'>
                        <button
                            className='pre-thank-button pre-thank-button-primary'
                            onClick={() => navigate(links.preReg.base)}
                        >
                            Try Again
                        </button>
                        <button
                            className='pre-thank-button pre-thank-button-secondary'
                            onClick={() => navigate(links.profile.base)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                :
                <div className='pre-thank-content'>
                    <h2 className='pre-thank-subtitle'>Thank you for registering with us...</h2>
                    <h1 className='pre-thank-title'>Check your visit time and come to the office at least 15 minutes early</h1>
                    <h2 className='pre-thank-instruction'>At the premises you can print your visit pass using your visit ID</h2>
                    <h3 className='pre-thank-countdown'>0{count}</h3>
                    <button
                        className='pre-thank-button pre-thank-button-main'
                        onClick={() => navigate(links.profile.base)}
                    >
                        Go To Profile
                    </button>
                </div>
            }
        </div>
    )
}