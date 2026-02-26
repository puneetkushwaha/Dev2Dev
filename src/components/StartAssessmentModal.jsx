import React from 'react';
import { Target, Clock, AlertCircle, PlayCircle, X } from 'lucide-react';

const StartAssessmentModal = ({ isOpen, onClose, assessment, onStart }) => {
    if (!isOpen || !assessment) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="modal-header">
                    <h2>Start Mock Assessment</h2>
                    <span className="assessment-title">{assessment.title}</span>
                </div>

                <div className="modal-body">
                    <p className="type-label">ONLINE ASSESSMENT</p>

                    <ul className="rules-list">
                        <li>
                            <div className="bullet"></div>
                            Each session will include up to 2 questions.
                        </li>
                        <li>
                            <div className="bullet"></div>
                            You will have 1 hour to complete all questions.
                        </li>
                        <li>
                            <div className="bullet"></div>
                            <span>Once a mock assessment session begins, you <strong>cannot</strong> pause the timer.</span>
                        </li>
                        <li>
                            <div className="bullet"></div>
                            The mock assessment session will end when you have successfully submitted a correct answer for each question, the allotted time has expired, or you end the session manually.
                        </li>
                    </ul>

                    <p className="good-luck">Good Luck!</p>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-start" onClick={onStart}>Start Mock Assessment</button>
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.2s ease-out;
                }

                .modal-content {
                    background: #fff;
                    color: #333;
                    width: 90%;
                    max-width: 600px;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    position: relative;
                    animation: slideUp 0.3s ease-out;
                    font-family: 'Inter', sans-serif;
                }

                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: transparent;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    transition: 0.2s;
                    padding: 4px;
                }
                .close-btn:hover { color: #333; }

                .modal-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #eee;
                }
                .modal-header h2 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #2c3e50;
                }
                .assessment-title {
                    font-size: 0.9rem;
                    color: #666;
                }

                .modal-body {
                    padding: 2rem;
                }

                .type-label {
                    font-size: 0.8rem;
                    color: #888;
                    margin: 0 0 1rem 0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .rules-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2rem 0;
                }
                .rules-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 1.25rem;
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #444;
                }
                .bullet {
                    width: 6px;
                    height: 6px;
                    background: #555;
                    border-radius: 50%;
                    margin-top: 8px;
                    flex-shrink: 0;
                }

                .good-luck {
                    font-size: 1rem;
                    color: #444;
                    margin: 0;
                }

                .modal-footer {
                    padding: 1.25rem 2rem;
                    background: #f8f9fa;
                    border-top: 1px solid #eee;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }

                .btn-cancel {
                    padding: 0.5rem 1rem;
                    background: #fff;
                    border: 1px solid #ddd;
                    color: #555;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .btn-cancel:hover { background: #f0f0f0; }

                .btn-start {
                    padding: 0.5rem 1.25rem;
                    background: #4f6b7d;
                    border: none;
                    color: #fff;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .btn-start:hover { background: #3d5463; }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default StartAssessmentModal;
