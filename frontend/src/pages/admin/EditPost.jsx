import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        summary: '',
        cover_image_url: '',
        is_published: false
    });
    const [loading, setLoading] = useState(false);
    const [uploadedImageMeta, setUploadedImageMeta] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await api.post('/utils/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadedImageMeta(response.data.url);
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Failed to upload image');
        }
    };

    useEffect(() => {
        if (!isNew) {
            const fetchPost = async () => {
                try {
                    // Note: Public endpoint /posts/{slug} expects slug, not ID.
                    // But we need to edit by ID or fallback to listing and filtering?
                    // Or I should expose GET /posts/{id} for admin?
                    // Currently backend only has GET /posts/{slug} public.
                    // AND Admin PUT /posts/{id}.
                    // So to load data for edit form, I need GET /posts/{id} in backend or guess slug.
                    // Using ID is safer. I should add GET /posts/id/{id} or similar, or just fix backend route.
                    // For now, I will assume I can't easily fetch by ID without backend change.
                    // I'll update backend to support GET /posts/admin/{id} or just GET /posts/{id} checking permissions?
                    // Actually, I can use the list endpoint and find it client side as a temporary hack if list has full data.
                    // Better: update backend.
                    // For this iteration, I'll update backend task to include GET /posts/{id} for admin.
                    // But for now, let's implement the form assuming the backend exists or I'll fix it next tool call.
                    // I'll leave the fetch logic commented or placeholder.
                    // Actually I'll implement fetch by ID assuming it exists, then fix backend.
                    const response = await api.get(`/posts/admin/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Failed to fetch post', error);
                }
            };
            fetchPost();
        }
    }, [id, isNew]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isNew) {
                await api.post('/posts/', formData);
            } else {
                await api.put(`/posts/${id}`, formData);
            }
            navigate('/admin');
        } catch (error) {
            console.error('Failed to save post', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
            <h1>{isNew ? 'New Post' : 'Edit Post'}</h1>
            <form onSubmit={handleSubmit} className="card">
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                    <input
                        className="input-field"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Slug</label>
                    <input
                        className="input-field"
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Summary</label>
                    <textarea
                        className="input-field"
                        value={formData.summary}
                        onChange={e => setFormData({ ...formData, summary: e.target.value })}
                        rows={3}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cover Image URL</label>
                    <input
                        className="input-field"
                        value={formData.cover_image_url}
                        onChange={e => setFormData({ ...formData, cover_image_url: e.target.value })}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content (HTML/Markdown)</label>

                    {/* Image Upload Helper */}
                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', marginTop: 0 }}>Insert Image</p>

                        {!uploadedImageMeta ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="upload-helper"
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('upload-helper').click()}
                                    className="btn"
                                    style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                                >
                                    📷 Upload New Image
                                </button>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                    Upload an image to get a Markdown code or URL.
                                </span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '120px', height: '120px', flexShrink: 0, borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#000' }}>
                                    <img
                                        src={uploadedImageMeta}
                                        alt="Uploaded Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {/* Action: Copy Markdown */}
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-light)' }}>FOR CONTENT (Markdown)</div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    readOnly
                                                    value={`![Image](${uploadedImageMeta})`}
                                                    style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', borderRadius: '0.25rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`![Image](${uploadedImageMeta})`);
                                                        alert("Copied Markdown!");
                                                    }}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action: Copy URL / Set Cover */}
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem', color: 'var(--text-light)' }}>FOR FIELDS (Raw URL)</div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    readOnly
                                                    value={uploadedImageMeta}
                                                    style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace', borderRadius: '0.25rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(uploadedImageMeta);
                                                        alert("Copied URL!");
                                                    }}
                                                    className="btn"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
                                                >
                                                    Copy URL
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, cover_image_url: uploadedImageMeta });
                                                    }}
                                                    className="btn"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--primary-color)' }}
                                                >
                                                    Set as Cover
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setUploadedImageMeta(null)}
                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}
                                        >
                                            Clear / Upload Another
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <SimpleMDE
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        options={useMemo(() => ({
                            spellChecker: false,
                            placeholder: 'Write your post content here... Use the toolbar for formatting!',
                            toolbar: [
                                'bold', 'italic', 'heading', '|',
                                'quote', 'unordered-list', 'ordered-list', '|',
                                'link', 'image', '|',
                                'preview', 'side-by-side', 'fullscreen', '|',
                                'guide'
                            ],
                            status: ['lines', 'words', 'cursor'],
                            minHeight: '400px'
                        }), [])}
                    />
                </div>
                <div style={{ padding: '1rem 0' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.is_published}
                            onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                        /> Publish
                    </label>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Post'}
                </button>
            </form>
        </div>
    );
};

export default EditPost;
