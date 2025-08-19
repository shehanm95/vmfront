import React, { useEffect } from 'react';
import { UserDto } from '../../../../types/UserDto';
import { PersonCircle } from '../servicePointComps/PersonCircle';
import { useMyNavigator } from '../../../customHooks/useMyNavigator';
import userService from '../../../../services/userService';
import { getCurrentUser } from '../../../../api/axios';

interface VisitorRowProps {
    user: UserDto;
    onEditUser: (user: UserDto) => void;
    removeFromList: (id: number) => void
}

export const VisitorRow: React.FC<VisitorRowProps> = ({ user, onEditUser, removeFromList }) => {
    const [loggedInUser, setLoggedInUser] = React.useState<UserDto | null>(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    setLoggedInUser(user);
                }
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
            }
        };
        fetchLoggedInUser();
    }, []);


    function deleteUser(id: number): void {
        const deleteU = async () => {
            const response = await userService.deleteUser(id);
            if (response) {
                removeFromList(id)
                console.log("user deleted")
            }
            ;
        }
        deleteU()
    }

    return (
        <tr className="border-b">
            <td className="py-2 px-4">
                <div className="proImg flex center">
                    <PersonCircle user={user}></PersonCircle>
                    {/* <img src={`${user.imagePath}`} alt="" /> */}
                </div>
            </td>

            <td className="py-2 px-4">{`${user.firstName} ${user.lastName}`}</td>
            <td className="py-2 px-4">{user.email}</td>
            <td className="py-2 px-4">{user.phoneNumber || "-"}</td>
            {/* <td className="py-2 px-4">-</td>
            <td className="py-2 px-4">-</td> */}
            <td className="py-2 px-4">{user.role}</td>
            <td className="py-2 px-4">
                <button
                    onClick={() => onEditUser(user)}
                    disabled={!(loggedInUser && (loggedInUser.role === 'ROLE_ADMIN'))}
                    className={`outline_button m-1 w100px ${(loggedInUser && (loggedInUser.role == 'ROLE_ADMIN')) ? '' : "disable-button"}`}
                >
                    Edit User
                </button>
                <button
                    disabled={!(loggedInUser && (loggedInUser.role === 'ROLE_ADMIN'))}
                    onClick={() => deleteUser(user.id!)}
                    className={`outline_button m-1 w100px ${(loggedInUser && (loggedInUser.role == 'ROLE_ADMIN')) ? '' : "disable-button"}`}
                >
                    Delete User
                </button>
            </td>
        </tr>
    );
};
