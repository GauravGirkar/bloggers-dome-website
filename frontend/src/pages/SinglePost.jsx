import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function SinglePost() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`/api/posts/${id}`)
                if (!res.ok) throw new Error('Post not found')
                const data = await res.json()
                if(data.postFetched){
                    setPost(data.postFetched)
                } else {
                    throw new Error('Post not found')
                }
            } catch (err) {
                setError('Failed to load this post.')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [id])

    if (loading) {
        return (
            <main className="container main-content text-center mt-5">
                <div style={{ padding: '4rem', opacity: 0.5 }}>Loading manuscript...</div>
            </main>
        )
    }

    if (error || !post) {
        return (
            <main className="container main-content text-center mt-5">
                <div className="glass-card" style={{ maxWidth: 500, margin: '0 auto', borderColor: 'rgba(226,75,74,0.3)' }}>
                    <h2 style={{ color: '#e24b4a' }}>Oh snap!</h2>
                    <p>{error || 'Post could not be found.'}</p>
                    <button onClick={() => navigate('/')} className="btn btn-outline mt-4">Back to safe zone</button>
                </div>
            </main>
        )
    }

    return (
        <main className="container main-content">
            <article className="single-post-container">
                <button onClick={() => navigate(-1)} className="btn btn-outline mb-4" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                    ← Back
                </button>
                
                <header className="single-post-header">
                    <h1 className="single-post-title">{post.title}</h1>
                    <div className="single-post-meta">
                        <span style={{ color: 'var(--accent-green)' }}>@{post.author?.username || 'unknown'}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span className="mono-text" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>Article</span>
                    </div>
                </header>

                {post.image && (
                    <figure style={{ marginBottom: 'var(--spacing-xl)', borderRadius: 'var(--border-radius-md)', overflow: 'hidden' }}>
                        <img src={post.image} alt={post.title} style={{ width: '100%', display: 'block' }} />
                    </figure>
                )}

                <div className="single-post-content glass-card" style={{ padding: 'var(--spacing-xl)', background: 'rgba(255,255,255,0.015)', border: 'none', borderLeft: '2px solid var(--accent-purple)', borderRadius: '0 var(--border-radius-md) var(--border-radius-md) 0' }}>
                    {post.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </article>
        </main>
    )
}