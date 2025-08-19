import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkService } from '../../frontServices/LinkService'
import userService from '../../services/userService'
import { getCurrentUser, logout } from '../../api/axios'
import { UserDto } from '../../types/UserDto'
import { Utils } from '../../frontServices/Utils'
import { ProfileDetails } from './subProf/ProfileDetails'
import './profile.css'
import { NavBarContainer } from '../common/NavBarContainer'
import { RightAlign } from '../common/RightAlign'
import { VisitService } from '../../services/visitService'
import { Visit } from '../../types/visit'
import './visitTable.css'
import { DisplayVisitList } from '../common/DisplayVisitList'
import { Center } from '../common/Center'

export const UserProfile = () => {
    const navigate = useNavigate()
    const links = LinkService.getInstance()
    const [user, setUser] = useState<UserDto | undefined | null>(Utils.getUser);
    const [visits, setVisits] = useState<Visit[]>([])
    const [filteredVisits, setFilteredVisits] = useState<Visit[]>([])
    const [loadingVisits, setLoadingVisits] = useState(true)
    const [activeFilter, setActiveFilter] = useState<'all' | 'future' | 'past'>('all')

    const [currentUser, setCurrentUser] = useState<UserDto | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const currentU = await getCurrentUser();
                if (currentU && user) {
                    setCurrentUser(currentU);
                    if (!(currentU.role === 'ROLE_ADMIN' || currentU.role === 'ROLE_MODERATOR' || currentU.id === user.id)) {
                        navigate(links.preReg.types)
                    } else {
                        console.log("current user is allowed to view this profile")
                        console.log("current user: ", currentU.role)
                        console.log("current user: ", currentU.id)
                    }
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        fetchCurrentUser();
    }, [user])





    const goToDashboard = () => {
        console.log(user)
        if (user?.role === 'ROLE_MODERATOR') { navigate(links.moderatorDashboard.allVisits) }
        else if (user?.role === 'ROLE_ADMIN') { navigate(links.moderatorDashboard.visitOptions) }
        else if (user?.role === 'ROLE_VISITOR') { navigate(links.visitorDashboard) }
        else {
            alert("role not identified")
        }
    }

    useEffect(() => {
        if (!user) {
            navigate(links.preReg.base)
            return
        }
        const getVisits = async () => {
            try {
                setLoadingVisits(true)
                const visits = await VisitService.getVisitsByVisitorUserId(user?.id!)
                setVisits(visits);
                setFilteredVisits(visits);
                console.log("fetched visits: ", visits)
            } catch (error) {
                console.error("Error fetching visits:", error)
            } finally {
                setLoadingVisits(false)
            }
        }
        getVisits();
    }, [user?.id])

    const filterVisits = (filterType: 'all' | 'future' | 'past') => {
        setActiveFilter(filterType)

        if (filterType === 'all') {
            setFilteredVisits(visits)
            return
        }

        const currentDate = new Date()
        setFilteredVisits(visits.filter(visit => {
            if (!visit.visitRow?.date) return false

            const visitDate = new Date(visit.visitRow.date + 'T' + visit.visitRow.startTime)
            return filterType === 'future'
                ? visitDate >= currentDate
                : visitDate < currentDate
        }))
    }

    return (
        <NavBarContainer >
            <div className='prof-container'>
                <h2 className='mt-5 mb-3'>User Profile</h2>

                {user && <ProfileDetails allowChange={true} user={user}></ProfileDetails>}

                <RightAlign>
                    {user && !(user.role === 'ROLE_VISITOR') && <button onClick={goToDashboard} className='front-Button'>Dashboard </button>}
                    <button onClick={() => navigate(links.preReg.base)} className='front-Button'>Home </button>
                    <button onClick={logout} className='front-Button'>Logout</button>
                </RightAlign>

                <hr></hr>
                <h2>Your Visits</h2>

                <div className='prof-filters'>
                    <h4
                        className={`prof-filter-item ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => filterVisits('all')}
                    >
                        All
                    </h4>
                    <span className="prof-filter-divider">|</span>
                    <h4
                        className={`prof-filter-item ${activeFilter === 'future' ? 'active' : ''}`}
                        onClick={() => filterVisits('future')}
                    >
                        Future
                    </h4>
                    <span className="prof-filter-divider">|</span>
                    <h4
                        className={`prof-filter-item ${activeFilter === 'past' ? 'active' : ''}`}
                        onClick={() => filterVisits('past')}
                    >
                        Past
                    </h4>
                </div>

                {

                    loadingVisits ? (
                        <div>Loading visits...</div>
                    ) :


                        filteredVisits.length > 0 ? (
                            <DisplayVisitList filteredVisits={filteredVisits}></DisplayVisitList>
                        ) : (
                            <Center>
                                <div className='m-5'>
                                    <h2 className='m-5'>
                                        {activeFilter === 'all'
                                            ? 'You do not have any visits yet'
                                            : `No ${activeFilter} visits found`}
                                    </h2>
                                </div>
                            </Center>
                        )



                }
            </div>
        </NavBarContainer>
    )
}