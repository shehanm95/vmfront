import React, { useEffect, useState } from 'react'
import EmailVerification from '../frontOfficePage/frontComp/EmailVerificationForm'
import { useMyNavigator } from '../customHooks/useMyNavigator'
import { getCurrentUser } from '../../api/axios';
import { UserDto } from '../../types/UserDto';
import { Center } from '../common/Center';

export const PreRegVerifyEmail = () => {
    const { links, navigate } = useMyNavigator();
    const [currentUser, setCurrentUser] = useState<UserDto | undefined>()

    useEffect(() => {
        const getUser = async () => {
            const user = await getCurrentUser()
            if (user)
                setCurrentUser(user);
        }
        getUser();
    }, [])
    return (
        <div>
            {currentUser ?
                <EmailVerification
                    nextUrl={links.preReg.types}
                    givenEmail={currentUser.email}
                    notFromFrontOffice={true}
                ></EmailVerification>
                :
                <Center>
                    <h3>
                        waiting for email verification
                    </h3>
                </Center>}
        </div >
    )
}
