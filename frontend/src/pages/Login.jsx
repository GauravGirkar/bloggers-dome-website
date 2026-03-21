import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const justRegistered = location.state?.registered;

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    }

    function validate() {
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError("Enter a valid email address.");
            return false;
        }
        if (!form.password) {
            setError("Password is required.");
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
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email.trim(),
                    password: form.password,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                login(data.token);
                navigate("/");
            } else {
                setError(data.message || "Invalid email or password.");
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
                {justRegistered && (
                    <div style={{ background: 'rgba(29, 158, 117, 0.1)', color: 'var(--accent-green)', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(29, 158, 117, 0.3)' }}>
                        Account created! Sign in to continue.
                    </div>
                )}

                <div className="text-center mb-5">
                    <p className="mono-text mb-2" style={{ color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: '2px' }}>Welcome back</p>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Sign <em style={{ fontStyle: 'italic', color: 'var(--accent-green)' }}>in.</em></h1>
                    <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No account yet? <Link to="/register" style={{ color: 'var(--accent-green)' }}>Create one →</Link>
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(226, 75, 74, 0.1)', color: '#f09595', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(226, 75, 74, 0.3)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group mb-4">
                        <label className="form-label">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="ada@example.com"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-5">
                        <div className="flex justify-between items-center mb-1">
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <a href="#" className="mono-text" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Forgot password?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-control"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                <div className="mt-5 text-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <p className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Protected by JWT authentication.
                    </p>
                </div>
            </div>
        </main>
    );
}