import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts/')
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setPosts(data.postFetched || [])
            } catch (err) {
                setError('Failed to load posts or the server is unavailable.')
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return (
        <main className="main-content container">
            <header className="page-header">
                <h1 className="page-title">Explore Ideas</h1>
                <p className="page-subtitle">A minimal, developer-centric space to share knowledge, stories, and the latest insights in tech.</p>
            </header>

            {loading ? (
                <div className="text-center mt-4">
                    <p>Loading the latest content...</p>
                </div>
            ) : error ? (
                <div className="text-center mt-4 glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', borderColor: 'rgba(226, 75, 74, 0.3)' }}>
                    <h3 style={{ color: '#e24b4a' }}>Error</h3>
                    <p>{error}</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center mt-4 glass-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h3 className="mb-2">It's quiet here</h3>
                    <p className="mb-4">Be the first to share your thoughts with the community.</p>
                    <Link to="/create-post" className="btn btn-primary">Start Writing</Link>
                </div>
            ) : (
                <div className="grid">
                    {posts.map((post) => (
                        <Link to={`/post/${post._id}`} key={post._id} style={{ textDecoration: 'none' }}>
                            <article className="glass-card post-card">
                                {post.image && (
                                    <div style={{ margin: '-1.5rem -1.5rem 1.5rem -1.5rem', borderRadius: '16px 16px 0 0', overflow: 'hidden', height: '180px' }}>
                                        <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div className="post-card-meta">
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>@{post.author?.username || 'unknown'}</span>
                                    <span className="post-card-tag">{post.tags?.[0] || 'Article'}</span>
                                </div>
                                <h2 className="post-card-title">{post.title}</h2>
                                <p className="post-card-excerpt">
                                    {post.content ? (post.content.length > 120 ? post.content.substring(0, 120) + '...' : post.content) : 'No content preview available.'}
                                </p>
                                <div className="post-card-footer">
                                    <span>Read post →</span>
                                    <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    )
}