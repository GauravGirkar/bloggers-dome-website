import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { token, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    function handleLogout() {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path ? 'active' : ''

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="logo-icon"></div>
                    Bloggers<span>Dome</span>
                </Link>
                <div className="nav-links">
                    {token ? (
                        <>
                            <Link to="/" className={isActive('/')}>Home</Link>
                            <Link to="/create-post" className={isActive('/create-post')}>Write</Link>
                            <Link to="/profile" className={isActive('/profile')}>Profile</Link>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className={isActive('/')}>Home</Link>
                            <Link to="/login" className={isActive('/login')}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}