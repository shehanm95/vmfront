import React, { useState } from 'react';
import VisitorFilter from './visitorList/VisitorFilter';
import VisitorList from './visitorList/VisitorList';
import './visitorList/visitor.css';
import { IconHeader } from '../../common/IconHeader';
import Header from '../../common/Header';
import { UserDto } from '../../../types/UserDto';

const VisitorPage: React.FC = () => {
    const [visitors, setVisitors] = useState<UserDto[]>([]);

    return (
        <div className="visitor-page">
            <IconHeader icon='fa-users' title='All Visitors' />
            <div className="my-4">
                <Header title="Visitor filter" tooltipText="Filter visitors based on various criteria" />

            </div>
            <VisitorFilter setVisitors={setVisitors} />
            <VisitorList visitors={visitors} />
        </div>
    );
};

export default VisitorPage;
