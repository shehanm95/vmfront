import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './ContextProvider';
import { LinkService } from '../frontServices/LinkService';
import { getCurrentUser } from '../api/axios';
import { UserDto } from '../types/UserDto';
import { Utils } from '../frontServices/Utils';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles: string[];
}

interface UserContextType {
    user: UserDto | null;
    setUser: (newUser: UserDto | null | undefined) => void;
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { user, setUser } = useContext(UserContext);
    const [role, setRole] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("Entered useEffect");
        const fetchCurrentUser = async () => {
            try {
                let currentUserToUse = user;


                if (!currentUserToUse) {
                    const currentUser = await getCurrentUser();
                    if (currentUser) {
                        setUser(currentUser);
                        Utils.setUser(currentUser);
                    }
                    else console.error("no current user available")
                    currentUserToUse = currentUser;
                }


                const userRole = currentUserToUse?.role;
                if (typeof userRole === 'string' && userRole.startsWith("ROLE_")) {
                    const newRole = userRole.split("ROLE_")[1] || '';
                    setRole(newRole);
                    console.log("Current role set:", newRole);
                } else {
                    setRole(userRole || '');
                    console.log("Current role set (no ROLE_ prefix):", userRole || '');
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setRole('');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [user, setUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user || !roles.includes(role)) {
        return <Navigate to={LinkService.getInstance().unauthorized} />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;