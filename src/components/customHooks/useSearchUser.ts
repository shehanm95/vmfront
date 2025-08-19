import React, { useEffect, useState } from 'react'
import { UserDto } from '../../types/UserDto';
import userService from '../../services/userService';

export const useSearchUser = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        if (input.length >= 3) {
            const findUsers = async () => {
                const newUsers = await userService.findUser(input)
                console.log(newUsers)
                setUsers(newUsers);
            }

            findUsers();
        }
    }, [input]);
    return ({
        users,
        setUsers,
        input,
        setInput,
    }
    )
}
