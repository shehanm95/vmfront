import React from 'react'
import { UserDto } from '../../types/UserDto'
import { Utils } from '../../frontServices/Utils'

export const useFullNameHook = () => {

    const getFullName = (user: UserDto) => {

        if (!user) return '';
        return `${Utils.toTitleCase(user.firstName || "")} ${Utils.toTitleCase(user.lastName || "")}`;
    }
    return (
        { getFullName }
    )
}
