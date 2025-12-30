import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">AshuBlogs</Link>
                <nav className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>

                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            marginRight: '1rem',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            color: 'var(--text-color)',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Toggle Dark Mode"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {user && ( // Only show these links if user is authenticated
                        <>
                            <Link to="/admin">Dashboard</Link>
                            <button
                                onClick={logout}
                                className="btn btn-danger"
                                style={{ marginLeft: '1.5rem' }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
