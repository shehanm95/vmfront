
import { useState, useEffect } from 'react';
import { NavBarContainer } from '../common/NavBarContainer'
import { Outlet, useNavigate, useLocation, Route } from 'react-router-dom';
import { LinkService } from '../../frontServices/LinkService';
import { UserDto } from '../../types/UserDto';
import { getCurrentUser } from '../../api/axios';

export const ModeratorDashboard = () => {
    const [activeItem, setActiveItem] = useState('Manage visit Options');
    const navigate = useNavigate();
    const location = useLocation();
    const links = LinkService.getInstance();
    const [currentUser, setCurrentUser] = useState<UserDto | undefined | null>();
    const [menuItems, setMenuItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        let currentSubRoute = location.pathname.split('/moderatorDashboard/')[1] || '';

        // You may want only the first segment after /moderatorDashboard/
        currentSubRoute = currentSubRoute.split('/')[0];

        const matchedItem = menuItems.find(item => item.route === currentSubRoute);
        if (matchedItem) {
            setActiveItem(matchedItem.label);
        } else {
            setActiveItem('Manage visit Options');
        }
    }, [location.pathname]);


    let menuItemsList = [
        // { label: 'Manage Tasks', icon: 'fas fa-tasks', badge: '3' },
        // { label: 'Set My Gate', icon: 'fas fa-calendar-alt' },
        { label: 'Manage visit Options', icon: 'fas fa-sliders-h', route: "visitOptions" }, // should go to the moderatorDashboard/visitOption
        { label: 'Go To visit Options', icon: 'fas fa-external-link-alt', route: "goToOptions" },
        { label: 'Scan visit', icon: 'fas fa-qrcode', route: links.servicePoint.scan }, // should go to the servicePoint/scan
        { label: 'All visitors', icon: 'fas fa-users', route: "allvisitors" },
        { label: 'All visits', icon: 'fa fa-compass', route: links.moderatorDashboard.allVisits }, // should go to the moderatorDashboard/allVisits
    ];

    useEffect(() => {
        if (currentUser && currentUser.role !== 'ROLE_ADMIN') {
            menuItemsList = menuItems.filter(item => item.label !== 'Manage visit Options');
        }
        setMenuItems(menuItemsList);
    }, [currentUser]);



    const handleMenuClick = (item: any) => {
        setActiveItem(item.label);
        if (item.route) {
            navigate(item.route); // Navigate to subroute like /moderatorDashboard/visitOption
        }
    };

    return (
        <div>
            <NavBarContainer>
                <div className='h-100 flex'>
                    <div className="sideBar">
                        <ul className="sidebar-menu">
                            {menuItems.map((item) => (
                                <li
                                    key={item.label}
                                    className={`sidebar-item ${activeItem === item.label ? 'active' : ''}`}
                                    onClick={() => handleMenuClick(item)}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.label}</span>
                                    {/* {item.badge && <span className="badge">{item.badge}</span>} */}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="contentHolder p-4 w-100">
                        <Outlet />
                    </div>
                </div>
            </NavBarContainer>
        </div>
    )
}
