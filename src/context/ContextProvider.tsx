import { createContext, ReactNode, useState } from 'react';
import { getRole } from '../api/axios';
import { UserDto } from '../types/UserDto';

// Define the shape of the context value
interface UserContextType {
    user: UserDto | null | undefined;
    setUser: (newUser: UserDto | null) => void;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { }
});

// Define props for the provider component
interface ContextProviderProps {
    children: ReactNode;
}

// Create the provider component
const ContextProvider = ({ children }: ContextProviderProps) => {
    const [user, setUser] = useState<UserDto | null | undefined>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default ContextProvider;