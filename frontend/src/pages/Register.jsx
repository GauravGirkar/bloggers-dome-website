import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    }

    function validate() {
        if (!form.name.trim()) {
            setError("Full name is required.");
            return false;
        }
        if (!form.username.trim() || form.username.length < 3) {
            setError("Username must be at least 3 characters.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError("Enter a valid email address.");
            return false;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return false;
        }
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                // Pass state so Login route knows we just registered
                navigate("/login", { state: { registered: true } });
            } else {
                setError(data.message || "Registration failed. Try again.");
            }
        } catch {
            setError("Network error — make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="auth-container glass-card w-100" style={{ padding: '3rem 2.5rem' }}>

                <div className="text-center mb-5">
                    <p className="mono-text mb-2" style={{ color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '2px' }}>Join the network</p>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Create <em style={{ fontStyle: 'italic', color: 'var(--accent-purple)' }}>account.</em></h1>
                    <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Already have one? <Link to="/login" style={{ color: 'var(--accent-purple)' }}>Sign in →</Link>
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(226, 75, 74, 0.1)', color: '#f09595', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(226, 75, 74, 0.3)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group mb-4">
                        <label className="form-label">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="Alan Turing"
                            autoComplete="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Username</label>
                        <input
                            name="username"
                            type="text"
                            placeholder="alan_turing"
                            autoComplete="username"
                            value={form.username}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="alan@example.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Min 6 characters"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-5">
                        <label className="form-label">Confirm Password</label>
                        <input
                            name="confirm"
                            type="password"
                            placeholder="Must match"
                            autoComplete="new-password"
                            value={form.confirm}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, var(--accent-purple), #9974ff)' }}>
                        {loading ? "Creating account…" : "Sign up"}
                    </button>
                </form>

                <div className="mt-5 text-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <p className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        You're registering for Bloggers Dome. Welcome to the elite layer.
                    </p>
                </div>
            </div>
        </main>
    );
}