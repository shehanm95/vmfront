import React from 'react';
import { logout } from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    const navigateTo = (link: string) => {
        console.log(link)
        navigate(link);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to the Dashboard</h1>
            <p style={styles.description}>This is the protected home page.</p>

            <div style={styles.buttonGroup}>
                <button style={styles.button} onClick={logout}>Logout</button>
                <button style={styles.button} onClick={() => navigateTo("/visitorDashboard")}>Visitor Dashboard</button>
                <button style={styles.button} onClick={() => navigateTo("/moderatorDashboard")}>Moderator Dashboard</button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f7fcff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        padding: '2rem',
        color: '#0281d0'
    },
    title: {
        fontSize: '32px',
        marginBottom: '10px'
    },
    description: {
        fontSize: '16px',
        marginBottom: '20px'
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'center'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#0281d0',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    }
};

