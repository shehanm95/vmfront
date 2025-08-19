import React, { use, useEffect, useState } from 'react'
import { UserDto } from '../../../types/UserDto'
import Header from '../../common/Header'
import PersonImage from '../../frontOfficePage/frontComp/profileImage.avif'
import './profileDetails.css'
import { usePorfileImageSetter } from '../../customHooks/usePorfileImageSetter'
import { BlurBack } from '../../common/BlurBack'
import { PopUpWindow } from '../../common/PopUpWindow'
import { SetProfilePic } from '../SetProfilePic'
import { useFullNameHook } from '../../customHooks/useFullNameHook'
import { boolean } from 'zod'
import EmailVerification from '../../frontOfficePage/frontComp/EmailVerificationForm'
import { useMyNavigator } from '../../customHooks/useMyNavigator'
import { EditUserWindow } from '../../dashboard/dashboardComponents/visitorList/EditUserWindow'

export const ProfileDetails = ({ user: initialUser, allowChange = false }: { user: UserDto, allowChange?: boolean }) => {
    const [user, setUser] = useState(initialUser);
    const { profileImage, setProfileImage } = usePorfileImageSetter({ user })
    const [newImageWindow, setNewImageWindow] = useState<boolean>(false);
    const { getFullName } = useFullNameHook()
    const [verificationVindowOn, setVerificationWindowOn] = useState(false)
    const { links, navigate } = useMyNavigator()
    const [showEditWindow, setShowEditWindow] = useState(false);

    const handleUserSave = (updatedUser: UserDto) => {
        setUser(updatedUser);
    };


    return (
        <>
            {user &&
                <div className='prof-outer'>

                    <Header title={'Profile Informations'} tooltipText={'this will show the users informations'}></Header>
                    <div className="prof-imageAndDetails">
                        <div onClick={() => setNewImageWindow(true)} className="prof-img">
                            <img src={profileImage} alt={`user image - ${user?.firstName + " " + user?.lastName}`} />
                            {user.isEmailVerified ? <div className={`prof-verifiedIcon verification-ok`}>
                                <i className="fa fa-check verificationIconTick" aria-hidden="true"></i>
                            </div>
                                :
                                <div className={`prof-verifiedIcon verification-warning`}>
                                    !
                                </div>

                            }
                        </div>

                        <div className="prof-details">

                            <div className="prof-details-slot">
                                <div className="prof-detail-title">User Id</div>
                                <div className="prof-detail-value-slot">
                                    <div className='prof-details-values-n-buttons'>
                                        <div className="prof-detail-value">
                                            {user && user.id}
                                        </div>
                                        <div onClick={() => setShowEditWindow(true)} className="prof-details-buttons">
                                            <button className='prof-button'>Edit Profile</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="prof-details-slot">
                                <div className="prof-detail-title">Name</div>
                                <div className="prof-detail-value-slot">
                                    <div className='prof-details-values-n-buttons'>
                                        <div className="prof-detail-value">
                                            {user && getFullName(user)}
                                        </div>
                                        <div className="prof-details-buttons">
                                            {/* <button className='prof-button'>Change Name</button> name can change in all visitor list */}
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div className="prof-details-slot">
                                <div className="prof-detail-title">Email</div>
                                <div className="prof-detail-value-slot">
                                    <div className='prof-details-values-n-buttons'>
                                        <div className="prof-detail-value">
                                            {`${user?.email}`}
                                        </div>
                                        <div className="prof-details-buttons">
                                            {/* <button className='prof-button'>Send Email</button> */}
                                            {!user.isEmailVerified && <button onClick={() => setVerificationWindowOn(true)} className='prof-button'>Verifiy Email</button>}
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div className="prof-details-slot">
                                <div className="prof-detail-title">Phone Number</div>
                                <div className="prof-detail-value-slot">
                                    {user?.phoneNumber ?
                                        <div className='prof-details-values-n-buttons'>
                                            <div className="prof-detail-value">
                                                {`${user?.phoneNumber}`}
                                            </div>
                                            <div className="prof-details-buttons">
                                                {/* <button className='prof-button'>Send Email</button> */}

                                            </div>
                                        </div>
                                        :
                                        <div className='prof-details-values-n-buttons'>

                                            <div className="prof-details-buttons">
                                                <button className='prof-button'>Add Phone Number</button>
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>


                        </div>
                    </div>

                    {allowChange && newImageWindow && <BlurBack>
                        <PopUpWindow title='Set new profile image'
                            onClose={() => setNewImageWindow(false)}>

                            <SetProfilePic
                                imagePath={profileImage}
                                setImagePath={setProfileImage}
                                user={user}
                                closeWindow={() => setNewImageWindow(false)}
                            ></SetProfilePic>

                        </PopUpWindow>
                    </BlurBack>}
                    {verificationVindowOn &&
                        <PopUpWindow onClose={() => setVerificationWindowOn(false)} title={'Verify Email'}>

                            <EmailVerification

                                nextUrl={links.preReg.base}
                                givenEmail={user.email}
                                notFromFrontOffice={true}
                                closeVindow={() => setVerificationWindowOn(false)}

                            ></EmailVerification>

                        </PopUpWindow>
                    }

                    {showEditWindow && user && (
                        <BlurBack>
                            <EditUserWindow
                                user={user}
                                onClose={() => setShowEditWindow(false)}
                                onSave={handleUserSave}
                            />
                        </BlurBack>
                    )}
                </div>
            }
        </>
    )
}
