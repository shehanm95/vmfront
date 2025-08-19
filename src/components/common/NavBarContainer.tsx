import { ReactNode } from 'react'
import { NavBar } from './NavBar'

interface NavBarContainerProps {
    children: ReactNode;
}

export const NavBarContainer = ({ children }: NavBarContainerProps) => {
    return (
        <div className='vh-100 flex column'>
            <NavBar />
            <div className='flex-1 overflow-y-auto'>
                {children}
            </div>
        </div>
    )
}
