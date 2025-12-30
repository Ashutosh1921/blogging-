import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${slug}`);
                setPost(response.data);
                setLikes(response.data.likes || 0); // Initialize likes
            } catch (error) {
                console.error('Failed to fetch post', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    const handleLike = async () => {
        if (!post) return;
        try {
            // We need post ID for the API, but our post object should have it.
            // Wait, does the backend response include ID? Yes.
            const response = await api.post(`/posts/${post.id}/like`);
            setLikes(response.data.likes);
        } catch (err) {
            console.error("Failed to like", err);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!post) return <div className="container">Post not found</div>;

    return (
        <div className="container-reading" style={{ paddingBottom: '6rem' }}>
            <article>
                {post.cover_image_url && (
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                )}

                <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h1>

                    <div style={{ color: '#6b7280', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>•</span>
                        <button
                            onClick={handleLike}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#ef4444',
                                border: '1px solid #fee2e2',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '999px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            ❤️ <span style={{ fontWeight: 600 }}>{likes}</span>
                        </button>
                    </div>
                </header>

                <div className="prose">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            img: ({ node, ...props }) => <img style={{ maxWidth: '100%', borderRadius: '0.5rem', margin: '2rem 0' }} {...props} />,
                            p: ({ node, children }) => {
                                // Check if paragraph contains only a raw image URL
                                const text = node.children[0]?.value;
                                if (text && typeof text === 'string' && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(text.trim())) {
                                    return <img src={text.trim()} alt="Image" style={{ maxWidth: '100%', borderRadius: '0.5rem', margin: '2rem 0' }} />;
                                }
                                return <p>{children}</p>;
                            }
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
};

export default PostDetail;
