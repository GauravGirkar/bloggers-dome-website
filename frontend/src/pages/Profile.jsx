import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
    const { token, logout } = useAuth()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }

        async function fetchProfile() {
            try {
                // Decode JWT to get user ID
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodedToken = JSON.parse(jsonPayload);
                const userId = decodedToken.id;

                // Fetch user data from the backend route /api/user/:id
                const userRes = await fetch(`/api/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (!userRes.ok) throw new Error('Failed to fetch user profile')
                const userData = await userRes.json()
                setUser(userData.getUser)

                // Fetch all posts and filter for this user
                const postsRes = await fetch('/api/posts/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (postsRes.ok) {
                    const postsData = await postsRes.json()
                    const allPosts = postsData.postFetched || []
                    const myPosts = allPosts.filter(p => p.author?._id === userId)
                    setPosts(myPosts)
                }
            } catch (err) {
                setError('Could not load profile data.')
            } finally {
                setLoading(false)
            }
        }
        
        fetchProfile()
    }, [token, navigate])

    function handleLogout() {
        logout()
        navigate('/')
    }

    if (loading) return <div className="text-center mt-5" style={{ opacity: 0.5 }}>Loading profile...</div>

    if (error) {
        return (
            <main className="container main-content text-center mt-5">
                <div className="glass-card" style={{ maxWidth: 500, margin: '0 auto', borderColor: 'rgba(226,75,74,0.3)' }}>
                    <h2>Profile Error</h2>
                    <p style={{ color: '#f09595' }}>{error}</p>
                    <button onClick={handleLogout} className="btn btn-outline mt-4">Sign out</button>
                </div>
            </main>
        )
    }

    return (
        <main className="container main-content">
            <header className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-green))', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h1 className="page-title" style={{ fontSize: '2.5rem', marginBottom: 0 }}>@{user?.username || 'user'}</h1>
                <p className="mono-text" style={{ color: 'var(--text-muted)' }}>{user?.email || 'email@example.com'}</p>
                <div className="flex gap-4 mt-4">
                    <Link to="/create-post" className="btn btn-primary">New Post</Link>
                    <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                </div>
            </header>

            <section className="mt-5">
                <h3 className="mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Your Transmissions</h3>
                
                {posts.length === 0 ? (
                    <div className="glass-card text-center" style={{ padding: '3rem 1rem' }}>
                        <p className="mb-4">You haven't written anything yet.</p>
                        <Link to="/create-post" className="btn btn-secondary">Create your first post</Link>
                    </div>
                ) : (
                    <div className="grid">
                        {posts.map(post => (
                            <Link to={`/post/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
                                <article className="glass-card post-card" style={{ padding: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{post.title}</h4>
                                    <p className="post-card-excerpt" style={{ fontSize: '0.85rem' }}>
                                        {post.content?.substring(0, 100)}...
                                    </p>
                                    <div className="post-card-footer mt-auto pt-3">
                                        <span style={{ color: 'var(--accent-purple)' }}>Edit Post</span>
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}