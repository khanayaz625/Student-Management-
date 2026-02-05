import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'AI Task Generation',
            description: 'Automatically generate coding challenges and assignments using Gemini AI.',
            icon: '🤖'
        },
        {
            title: 'Progress Tracking',
            description: 'Real-time analytics for both students and teachers to track growth.',
            icon: '📈'
        },
        {
            title: 'Interactive Leaderboard',
            description: 'Gamified learning experience with student rankings and badges.',
            icon: '🏆'
        }
    ];

    return (
        <div className="landing-page">
            <header className="hero-section">
                <div className="hero-content" style={{ maxWidth: '100%', padding: '0 40px', gap: '40px' }}>
                    <div className="hero-text animate-fade" style={{ maxWidth: '600px', textAlign: 'left' }}>
                        <h1>Elevate Your <span style={{ color: 'var(--primary)' }}>Classroom</span> Experience</h1>
                        <p>
                            DigiSkill is the next-generation platform for managing tasks,
                            tracking attendance, and fostering collaboration with AI-powered insights.
                        </p>
                        <div className="hero-btns" style={{ display: 'flex', gap: '20px' }}>
                            <button
                                className="btn-primary"
                                onClick={() => navigate('/login')}
                            >
                                Get Started
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                className="btn-secondary"
                                style={{ background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '12px 24px', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.2)' }}
                                onClick={() => navigate('/register')}
                            >
                                Join Now
                            </button>
                        </div>
                    </div>
                    <div className="hero-image animate-fade" style={{ animationDelay: '0.2s', width: '100%', flex: 1, maxHeight: 'none' }}>
                        <img src={heroImage} alt="DigiSkill Dashboard Preview" style={{ width: '100%', height: 'auto', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
                        <div className="glass" style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Active Students</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1,280+</div>
                            </div>
                            <div style={{ height: '30px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tasks Completed</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>15.4K</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section className="features-section" style={{ padding: '100px 20px', background: 'var(--bg-main)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '60px', fontSize: '2.5rem' }}>Why Choose DigiSkill?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {features.map((f, i) => (
                            <div key={i} className="card animate-fade" style={{ animationDelay: `${0.1 * i}s` }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>{f.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer style={{ padding: '60px 20px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-muted)' }}>© 2026 DigiSkill. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
