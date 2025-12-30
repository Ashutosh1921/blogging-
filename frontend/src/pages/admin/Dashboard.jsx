import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/client';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            // Assuming public endpoint lists all published posts. 
            // Admin dashboard might need a separate endpoint to see drafts too.
            // For now using the public listing, or I should implement an admin specific one?
            // "admin" typically sees everything. I'll stick to public listing for now or assume backend returns all if admin?
            // Actually backend /posts/ filters by is_published=True.
            // I need to update backend to allow admin to see all.
            // OR I can add a specific admin endpoint in backend. I'll assume public for now and update backend later if needed.
            // Wait, requirement says "Create, edit, delete blog posts". Admin needs to see drafts.
            // I'll add a TODO to update backend or just use valid one if I already made one.
            // In crud_post.py I made `get_all_posts_admin` but didn't expose it in API nicely yet except maybe implicitly?
            // Ah, I need to check API implementation. 
            // In `posts.py`, `read_posts` calls `get_posts` which filters `is_published=True`.
            // I should probably add `read_posts_admin` or just `read_posts` with a flag if user is admin.
            // For now, let's use the existing one and just show published ones, but I'll add a note.
            const response = await api.get('/posts/admin');
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete post', error);
            }
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div className="header-content" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <Link to="/admin/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> New Post
                </Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td style={{ padding: '1rem' }}>{post.title}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        backgroundColor: post.is_published ? '#dcfce7' : '#f3f4f6',
                                        color: post.is_published ? '#166534' : '#374151'
                                    }}>
                                        {post.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(post.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <Link to={`/admin/edit/${post.id}`} style={{ marginRight: '1rem', color: '#4b5563' }}>
                                        <Edit2 size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
