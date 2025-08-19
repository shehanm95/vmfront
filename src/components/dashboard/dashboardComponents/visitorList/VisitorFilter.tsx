import React, { useEffect, useState } from 'react';
import FilterOptions from './FilterOptions';
import { UserDto } from '../../../../types/UserDto';
import { useSearchUser } from '../../../customHooks/useSearchUser';
import { set } from 'react-hook-form';
import userService from '../../../../services/userService';
import { toast } from 'react-toastify';

const VisitorFilter = ({ setVisitors }: { setVisitors: (visitors: UserDto[]) => void }) => {

    const { users,
        setUsers,
        input,
        setInput, } = useSearchUser()

    useEffect(() => {
        setVisitors(users);
        console.log("set visitors in VisitorFilter: ", users);
    }, [users])

    useEffect(() => {
        if (input == '') {
            const fetchUsers = async () => {
                try {
                    const data = await userService.getAllUsers();
                    setVisitors(data);
                } catch (err) {
                    toast.error("error in loading visitors")
                    console.error("error in loading visitors")
                }
            };
            fetchUsers();


        }
    }, [input])


    return (
        <div className="visitor-filter">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search by name or email" />

            {/* <FilterOptions /> */}
        </div>
    );
};

export default VisitorFilter;
