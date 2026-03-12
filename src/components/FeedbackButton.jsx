import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { getApiUrl } from '../api/config';
import './FeedbackButton.css';

const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [screenshot, setScreenshot] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description) {
            setError('Please provide a description of the problem.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const formData = new FormData();
        formData.append('description', description);
        if (screenshot) {
            formData.append('screenshot', screenshot);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(getApiUrl('/api/feedback'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
                setDescription('');
                setScreenshot(null);
            }, 3000);
        } catch (err) {
            console.error('Feedback submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please upload an image file.');
                return;
            }
            setScreenshot(file);
            setError('');
        }
    };

    return (
        <>
            <div className="feedback-button-container">
                <button 
                    className="feedback-toggle" 
                    onClick={() => setIsOpen(true)}
                    title="Give Feedback"
                >
                    <MessageSquare size={24} />
                </button>
            </div>

            {isOpen && (
                <div className="feedback-modal-overlay" onClick={() => !isSubmitting && setIsOpen(false)}>
                    <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
                        {isSuccess ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <CheckCircle2 size={64} color="#4ade80" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Thank You!</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Your feedback has been submitted successfully. Our team will look into it.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="feedback-modal-header">
                                    <h3>Send Feedback</h3>
                                    <button className="close-modal-btn" onClick={() => setIsOpen(false)}>
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="feedback-form-group">
                                        <label>What's the issue? (Mention page or problem)</label>
                                        <textarea
                                            className="feedback-textarea"
                                            placeholder="Please describe the issue in detail..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="feedback-form-group">
                                        <label>Attach Screenshot (Optional)</label>
                                        <label className={`feedback-file-input-container ${screenshot ? 'has-file' : ''}`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleFileChange}
                                            />
                                            {screenshot ? (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#4ade80' }}>
                                                    <CheckCircle2 size={20} />
                                                    <span>{screenshot.name}</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)' }}>
                                                    <ImageIcon size={32} />
                                                    <span>Click to upload a screenshot</span>
                                                    <span style={{ fontSize: '0.7rem' }}>Max size: 5MB</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>

                                    {error && (
                                        <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                                            {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit" 
                                        className="feedback-submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                <span>Submit Feedback</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedbackButton;
