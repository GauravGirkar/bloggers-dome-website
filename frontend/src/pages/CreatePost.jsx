import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CreatePost() {
    const { token } = useAuth()
    const navigate = useNavigate()
    
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!token) {
        return (
            <div className="container main-content text-center">
                <h2>Access Denied</h2>
                <p>You must be logged in to create a post.</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/login')}>Login Now</button>
            </div>
        )
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!title || !content) {
            setError('Please fill in both title and content.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            })

            const data = await response.json()
            if (response.ok) {
                navigate('/')
            } else {
                setError(data.message || 'Failed to create post.')
            }
        } catch (err) {
            setError('Network error: Could not connect to the server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="container main-content">
            <div className="single-post-container" style={{ maxWidth: '700px' }}>
                <header className="page-header" style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
                    <h1 className="page-title" style={{ fontSize: '2.5rem' }}>Draft Your Next Post</h1>
                    <p className="page-subtitle" style={{ marginLeft: 0 }}>Share your ideas, theories, and code with the universe.</p>
                </header>

                {error && (
                    <div className="glass-card mb-4" style={{ borderColor: 'rgba(226,75,74,0.3)', padding: '1rem' }}>
                        <p style={{ color: '#e24b4a', margin: 0 }}>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="glass-card">
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">Post Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-control"
                            placeholder="An Interesting Perspective on Things"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group mb-5">
                        <label className="form-label" htmlFor="content">Your Content</label>
                        <textarea
                            id="content"
                            name="content"
                            className="form-control"
                            placeholder="Once upon a time in a codebase..."
                            rows={15}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center">
                        <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}