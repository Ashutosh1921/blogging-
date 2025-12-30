import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts/');
                setPosts(response.data);
            } catch (error) {
                console.error('Failed to fetch posts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '3rem' }}>Latest Stories</h1>
            {posts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>No posts found.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
                    {posts.map((post) => (
                        <div key={post.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {post.cover_image_url && (
                                <Link to={`/post/${post.slug}`} style={{ display: 'block', height: '240px', overflow: 'hidden' }}>
                                    <img
                                        src={post.cover_image_url}
                                        alt={post.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </Link>
                            )}
                            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Article
                                </div>
                                <h2 style={{ marginTop: 0, fontSize: '1.5rem', marginBottom: '1rem', lineHeight: '1.3' }}>
                                    <Link to={`/post/${post.slug}`} style={{ color: '#111827' }} onMouseOver={e => e.currentTarget.style.color = 'var(--primary-color)'} onMouseOut={e => e.currentTarget.style.color = '#111827'}>
                                        {post.title}
                                    </Link>
                                </h2>
                                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
                                    {post.summary}
                                </p>
                                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontFamily: 'var(--font-sans)' }}>
                                        {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <Link to={`/post/${post.slug}`} style={{ fontSize: '0.95rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        Read <span style={{ fontSize: '1.2em' }}>&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
