import { useState, useEffect } from "react";
import { UserDto } from "../../../../types/UserDto";
import userService from "../../../../services/userService";
import { VisitorRow } from "./VisitorRow";
import { EditUserWindow } from "./EditUserWindow";
import { BlurBack } from "../../../common/BlurBack";
import { RightAlign } from "../../../common/RightAlign";
import { CsvService } from "../../../../frontServices/CsvService";
import { PageNumberChanger } from "../../../common/PageNumberChanger";

const VisitorList = ({ visitors }: { visitors: UserDto[] }) => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditWindow, setShowEditWindow] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

    useEffect(() => {
        if (users.length === 0) {
            const fetchUsers = async () => {
                try {
                    const data = await userService.getAllUsers();
                    setUsers(data);
                    setLoading(false);
                } catch (err) {
                    setError('Failed to load users');
                    setLoading(false);
                }
            };
            fetchUsers();
        }
    }, []);

    useEffect(() => {
        setUsers(visitors);
    }, [visitors]);

    const handleEditUser = (user: UserDto) => {
        setSelectedUser(user);
        setShowEditWindow(true);
    };

    const handleUserSave = (updatedUser: UserDto) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            )
        );
        setShowEditWindow(false);
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    const removeFromList = (id: number) => {
        const updatedUsers = users.filter((u) => u.id != id)
        setUsers(updatedUsers);
    }

    return (

        <div className="visitor-list p-4">
            {/* VisitorList */}
            <RightAlign>
                <button onClick={() => CsvService.downloadAsCsvFile(users)} className="mt-5 outline_button">
                    Download CSV
                </button>
            </RightAlign>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left">Picture</th>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Phone Number</th>
                        {/* <th className="py-2 px-4 text-left">Times Visited</th>
                        <th className="py-2 px-4 text-left">No of Notes</th> */}
                        <th className="py-2 px-4 text-left">Role</th>
                        <th className="py-2 px-4 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <VisitorRow key={user.id} user={user} onEditUser={handleEditUser} removeFromList={removeFromList} />
                    ))}
                </tbody>
            </table>

            <PageNumberChanger pageNumber={0} setPageNumber={function (pageNumber: number): void {
                throw new Error("Function not implemented.");
            }} pageLimit={50} currentListLength={49}></PageNumberChanger>

            {showEditWindow && selectedUser && (
                <BlurBack>
                    <EditUserWindow
                        user={selectedUser}
                        onClose={() => setShowEditWindow(false)}
                        onSave={handleUserSave}
                    />
                </BlurBack>
            )}
        </div>
    );
};

export default VisitorList;
