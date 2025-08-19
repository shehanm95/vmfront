import React from 'react'
import { UserDto } from '../../../../types/UserDto'
import { PersonCircle } from './PersonCircle'
import { Utils } from '../../../../frontServices/Utils'

export const PersonItem = ({ user }: { user: UserDto }) => {

    return (


        <div className='m-3 flex centerV'>
            <PersonCircle user={user}></PersonCircle>
            <h4 className='ms-2 d-inline-block'>{"  "}{Utils.toTitleCase(user.firstName) + " " + Utils.toTitleCase(user.lastName)}</h4>
        </div>

    )
}
