import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './EquityNegotiation.module.css';
import { projects } from '../../data/startups';
import { slugify } from '../../utils/slugify';
import { FaExchangeAlt, FaChartLine, FaHistory, FaCheck, FaTimes, FaUserTie } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';

const EquityNegotiation = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const project = projects.find((p) => slugify(p.title) === slug);
    
    // State management
    const [userOffer, setUserOffer] = useState({ 
        equity: '', 
        amount: '',
        note: '' 
    });
    const [offers, setOffers] = useState([]);
    const [status, setStatus] = useState('pending'); // pending, countered, accepted, rejected
    const [ownerCounter, setOwnerCounter] = useState(null);
    const [isOwner, setIsOwner] = useState(false); // Track if current user is the owner
    const [ownerOffer, setOwnerOffer] = useState({ 
        equity: '', 
        amount: '',
        note: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load saved negotiation if exists
    useEffect(() => {
        const savedNegotiation = localStorage.getItem(`negotiation-${slug}`);
        if (savedNegotiation) {
            const { offers: savedOffers, status: savedStatus, counter } = JSON.parse(savedNegotiation);
            setOffers(savedOffers);
            setStatus(savedStatus);
            if (counter) setOwnerCounter(counter);
        }
        
        // Check if user is owner (for demo purposes)
        setIsOwner(Math.random() > 0.7); // 30% chance of being owner for demo
    }, [slug]);

    // Save negotiation progress
    const saveNegotiation = () => {
        const negotiationData = {
            offers,
            status,
            counter: ownerCounter
        };
        localStorage.setItem(`negotiation-${slug}`, JSON.stringify(negotiationData));
    };

    if (!project) return <h2>Project not found</h2>;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserOffer(prev => ({ ...prev, [name]: value }));
    };

    const handleOwnerInputChange = (e) => {
        const { name, value } = e.target;
        setOwnerOffer(prev => ({ ...prev, [name]: value }));
    };

    const submitInvestorOffer = () => {
        setLoading(true);
        setError('');
        
        const equity = parseFloat(userOffer.equity);
        const amount = parseFloat(userOffer.amount);
        
        // Validation
        if (isNaN(equity) || isNaN(amount)) {
            setError('Please enter valid numbers for equity and amount');
            setLoading(false);
            return;
        }
        
        if (equity <= 0 || amount <= 0) {
            setError('Values must be greater than zero');
            setLoading(false);
            return;
        }

        // Create new offer object
        const newOffer = {
            id: Date.now(),
            equity,
            amount,
            note: userOffer.note,
            timestamp: new Date().toISOString(),
            type: 'investor'
        };

        // Add to offers history
        const updatedOffers = [...offers, newOffer];
        setOffers(updatedOffers);
        
        // Simulate processing time
        setTimeout(() => {
            setStatus('pending');
            setLoading(false);
            setUserOffer({ equity: '', amount: '', note: '' });
            saveNegotiation();
        }, 1000);
    };

    const submitOwnerCounter = () => {
        setLoading(true);
        setError('');
        
        const equity = parseFloat(ownerOffer.equity);
        const amount = parseFloat(ownerOffer.amount);
        
        // Validation
        if (isNaN(equity) || isNaN(amount)) {
            setError('Please enter valid numbers for equity and amount');
            setLoading(false);
            return;
        }
        
        if (equity <= 0 || amount <= 0) {
            setError('Values must be greater than zero');
            setLoading(false);
            return;
        }

        // Create new counter offer object
        const counterOffer = {
            id: Date.now(),
            equity,
            amount,
            note: ownerOffer.note,
            timestamp: new Date().toISOString(),
            type: 'owner'
        };
        
        setStatus('countered');
        setOwnerCounter(counterOffer);
        setOffers(prev => [...prev, counterOffer]);
        
        setLoading(false);
        setOwnerOffer({ equity: '', amount: '', note: '' });
        saveNegotiation();
    };

    const acceptOffer = () => {
        setStatus('accepted');
        saveNegotiation();
    };

    const rejectOffer = () => {
        setStatus('rejected');
        saveNegotiation();
    };

    const handleComplete = () => {
        localStorage.removeItem(`negotiation-${slug}`);
        navigate(`/project/${slug}`);
    };

    const withdrawOffer = (offerId) => {
        setOffers(prev => prev.filter(offer => offer.id !== offerId));
        setStatus('pending');
        saveNegotiation();
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get the latest offer
    const latestOffer = offers.length > 0 ? offers[offers.length - 1] : null;

    return (
<div className={styles.equityNegotiation}>
            <div className="container my-5">
                <div className="d-flex align-items-center gap-3 flex-column flex-md-row mb-5">
                    <Link to={`/offering/${slug}`} className={styles.backLink}>
                        <div className={styles.arrowIcon}>
                            <FaArrowLeftLong />
                        </div>
                        Back to Project
                    </Link>
                    <h2 className={`mb-0 mx-auto ${styles.reasonsTitle}`}>
                        <FaExchangeAlt className="me-2" />
                        Negotiate Equity for {project.title}
                    </h2>
                </div>
    
                <div className="row">
                    <div className="col-12 col-lg-8">
                        <div className={styles.negotiationContainer}>
                            {/* Negotiation Status Banner */}
                            <div className={`${styles.statusBanner} ${status === 'accepted' ? styles.accepted : ''} ${status === 'rejected' ? styles.rejected : ''}`}>
                                {status === 'pending' && (
                                    <div className="d-flex align-items-center">
                                        <div className={styles.statusIndicator}></div>
                                        <span>
                                            {isOwner 
                                                ? "Waiting for investor offers" 
                                                : "Negotiation in progress"
                                            }
                                        </span>
                                    </div>
                                )}
                                {status === 'countered' && (
                                    <div className="d-flex align-items-center">
                                        <FaHistory className="me-2" />
                                        <span>
                                            {isOwner 
                                                ? "Your counter offer has been sent" 
                                                : "Owner made a counter offer"
                                            }
                                        </span>
                                    </div>
                                )}
                                {status === 'accepted' && (
                                    <div className="d-flex align-items-center">
                                        <FaCheck className="me-2" />
                                        <span>Deal accepted! Congratulations!</span>
                                    </div>
                                )}
                                {status === 'rejected' && (
                                    <div className="d-flex align-items-center">
                                        <FaTimes className="me-2" />
                                        <span>Offer rejected</span>
                                    </div>
                                )}
                            </div>
    
                            {/* Owner's Terms */}
                            <div className={styles.termsCard}>
                                <h4>
                                    <FaChartLine className="me-2" />
                                    Owner's Terms
                                </h4>
                                <div className={styles.termsGrid}>
                                    <div>
                                        <p className={styles.termLabel}>Equity Offered</p>
                                        <p className={styles.termValue}>{project.equityOffered}%</p>
                                    </div>
                                    <div>
                                        <p className={styles.termLabel}>Amount Requested</p>
                                        <p className={styles.termValue}>{formatCurrency(project.amountRequested)}</p>
                                    </div>
                                    <div>
                                        <p className={styles.termLabel}>Valuation</p>
                                        <p className={styles.termValue}>
                                            {formatCurrency(project.amountRequested / (project.equityOffered / 100))}
                                        </p>
                                    </div>
                                </div>
                            </div>
    
                            {/* Negotiation History */}
                            {offers.length > 0 && (
                                <div className={styles.historySection}>
                                    <h5>Negotiation History</h5>
                                    <div className={styles.timeline}>
                                        {offers.map((offer) => (
                                            <div 
                                                key={offer.id} 
                                                className={`${styles.timelineItem} ${offer.type === 'investor' ? styles.investorOffer : styles.ownerOffer}`}
                                            >
                                                <div className={styles.timelineHeader}>
                                                    <span className={styles.offerType}>
                                                        {offer.type === 'investor' 
                                                            ? 'Investor Offer' 
                                                            : "Owner's Offer"
                                                        }
                                                    </span>
                                                    <span className={styles.offerDate}>
                                                        {new Date(offer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className={styles.offerDetails}>
                                                    <span>{offer.equity}% Equity</span>
                                                    <span className={styles.divider}>•</span>
                                                    <span>{formatCurrency(offer.amount)}</span>
                                                </div>
                                                {offer.note && (
                                                    <div className={styles.offerNote}>
                                                        <p>"{offer.note}"</p>
                                                    </div>
                                                )}
                                                
                                                {/* Action buttons for owner */}
                                                {isOwner && offer.type === 'investor' && status === 'pending' && (
                                                    <div className={styles.offerActions}>
                                                        <button 
                                                            className={styles.actionBtnAccept}
                                                            onClick={() => acceptOffer(offer)}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            className={styles.actionBtnCounter}
                                                            onClick={() => {
                                                                // Pre-fill counter form with current offer
                                                                setOwnerOffer({
                                                                    equity: offer.equity,
                                                                    amount: offer.amount,
                                                                    note: ''
                                                                });
                                                            }}
                                                        >
                                                            Counter
                                                        </button>
                                                        <button 
                                                            className={styles.actionBtnReject}
                                                            onClick={() => rejectOffer()}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {/* Action buttons for investor */}
                                                {!isOwner && offer.type === 'owner' && status === 'countered' && (
                                                    <div className={styles.offerActions}>
                                                        <button 
                                                            className={styles.actionBtnAccept}
                                                            onClick={() => acceptOffer(offer)}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button 
                                                            className={styles.actionBtnCounter}
                                                            onClick={() => {
                                                                // Pre-fill investor form with counter offer
                                                                setUserOffer({
                                                                    equity: offer.equity,
                                                                    amount: offer.amount,
                                                                    note: ''
                                                                });
                                                            }}
                                                        >
                                                            Counter
                                                        </button>
                                                        <button 
                                                            className={styles.actionBtnReject}
                                                            onClick={() => rejectOffer()}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {/* Withdraw button for offer creator */}
                                                {(status === 'pending' || status === 'countered') && (
                                                    <div className={styles.withdrawContainer}>
                                                        <button 
                                                            className={styles.withdrawBtn}
                                                            onClick={() => withdrawOffer(offer.id)}
                                                        >
                                                            Withdraw Offer
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
    
                            {/* Investor Offer Form */}
                            {!isOwner && status !== 'accepted' && status !== 'rejected' && (
                                <div className={styles.offerForm}>
                                    <h5>Make Your Investment Offer</h5>
                                    
                                    {ownerCounter && (
                                        <div className={styles.counterOffer}>
                                            <p>Owner countered with:</p>
                                            <div className={styles.counterValues}>
                                                <span>{ownerCounter.equity}% Equity</span>
                                                <span className={styles.divider}>•</span>
                                                <span>{formatCurrency(ownerCounter.amount)}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="equityInput">Equity Percentage (%)</label>
                                        <input
                                            type="number"
                                            id="equityInput"
                                            name="equity"
                                            value={userOffer.equity}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 12"
                                            min="0.1"
                                            step="0.1"
                                            className={styles.input}
                                        />
                                    </div>
                                    
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="amountInput">Investment Amount</label>
                                        <input
                                            type="number"
                                            id="amountInput"
                                            name="amount"
                                            value={userOffer.amount}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 120000"
                                            min="1"
                                            step="1000"
                                            className={styles.input}
                                        />
                                    </div>
                                    
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="noteInput">Your Message to Owner</label>
                                        <textarea
                                            id="noteInput"
                                            name="note"
                                            value={userOffer.note}
                                            onChange={handleInputChange}
                                            placeholder="Explain why your offer is fair..."
                                            rows="3"
                                            className={styles.input}
                                            maxLength={200}
                                        />
                                        <div className={styles.charCount}>
                                            {userOffer.note.length}/200
                                        </div>
                                    </div>
                                    
                                    {error && <div className={styles.errorMsg}>{error}</div>}
                                    
                                    <div className="d-flex justify-content-end mt-4">
                                        <button
                                            className={styles.submitOfferBtn}
                                            onClick={submitInvestorOffer}
                                            disabled={loading || !userOffer.equity || !userOffer.amount}
                                        >
                                            {loading ? (
                                                <span className={styles.spinner}></span>
                                            ) : (
                                                "Submit Offer"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
    
                            {/* Owner Counter Offer Form */}
                            {isOwner && status !== 'accepted' && status !== 'rejected' && (
                                <div className={styles.offerForm}>
                                    <div className={styles.ownerBadge}>
                                        <FaUserTie className="me-2" />
                                        You are the project owner
                                    </div>
                                    
                                    <h5>Make a Counter Offer</h5>
                                    
                                    {latestOffer && latestOffer.type === 'investor' && (
                                        <div className={styles.currentOffer}>
                                            <p>Current Investor Offer:</p>
                                            <div className={styles.counterValues}>
                                                <span>{latestOffer.equity}% Equity</span>
                                                <span className={styles.divider}>•</span>
                                                <span>{formatCurrency(latestOffer.amount)}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="ownerEquityInput">Equity Percentage (%)</label>
                                        <input
                                            type="number"
                                            id="ownerEquityInput"
                                            name="equity"
                                            value={ownerOffer.equity}
                                            onChange={handleOwnerInputChange}
                                            placeholder={`e.g., ${project.equityOffered}`}
                                            min="0.1"
                                            step="0.1"
                                            className={styles.input}
                                        />
                                    </div>
                                    
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="ownerAmountInput">Investment Amount</label>
                                        <input
                                            type="number"
                                            id="ownerAmountInput"
                                            name="amount"
                                            value={ownerOffer.amount}
                                            onChange={handleOwnerInputChange}
                                            placeholder={`e.g., ${project.amountRequested.toLocaleString()}`}
                                            min="1"
                                            step="1000"
                                            className={styles.input}
                                        />
                                    </div>
                                    
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="ownerNoteInput">Message to Investor</label>
                                        <textarea
                                            id="ownerNoteInput"
                                            name="note"
                                            value={ownerOffer.note}
                                            onChange={handleOwnerInputChange}
                                            placeholder="Explain your counter offer..."
                                            rows="3"
                                            className={styles.input}
                                            maxLength={200}
                                            
                                        />
                                        <div className={styles.charCount}>
                                            {ownerOffer.note.length}/200
                                        </div>
                                    </div>
                                    
                                    {error && <div className={styles.errorMsg}>{error}</div>}
                                    
                                    <div className="d-flex justify-content-end mt-4">
                                        <button
                                            className={styles.submitOfferBtn}
                                            onClick={submitOwnerCounter}
                                            disabled={loading || !ownerOffer.equity || !ownerOffer.amount}
                                        >
                                            {loading ? (
                                                <span className={styles.spinner}></span>
                                            ) : (
                                                "Submit Counter Offer"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
    
                            {/* Final Status */}
                            {(status === 'accepted' || status === 'rejected') && (
                                <div className={styles.finalStatus}>
                                    {status === 'accepted' ? (
                                        <>
                                            <div className={styles.successIcon}>
                                                <FaCheck />
                                            </div>
                                            <h5>Deal Accepted!</h5>
                                            <p className={styles.successMsg}>
                                                {isOwner 
                                                    ? `You've accepted an investment offer for ${project.title}.` 
                                                    : `Congratulations! Your investment in ${project.title} has been accepted.`
                                                }
                                            </p>
                                            <p className={styles.instructions}>
                                                You'll receive further instructions via email shortly.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className={styles.errorIcon}>
                                                <FaTimes />
                                            </div>
                                            <h5>Offer Rejected</h5>
                                            <p>
                                                {isOwner 
                                                    ? "You've rejected the investment offer." 
                                                    : "The owner has declined your offer."
                                                }
                                            </p>
                                            <p>
                                                Consider adjusting your terms or exploring other opportunities.
                                            </p>
                                        </>
                                    )}
                                    <button
                                        className={styles.completeBtn}
                                        onClick={handleComplete}
                                    >
                                        {status === 'accepted' ? 'View Investment Details' : 'Back to Project'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Valuation Sidebar */}
                    <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                        <div className={styles.valuationSidebar}>
                            <h5>Valuation Calculator</h5>
                            <div className={styles.calculator}>
                                <div className={styles.calcRow}>
                                    <span>Investment Amount:</span>
                                    <span>
                                        {isOwner && ownerOffer.amount 
                                            ? formatCurrency(ownerOffer.amount) 
                                            : !isOwner && userOffer.amount 
                                                ? formatCurrency(userOffer.amount) 
                                                : '--'
                                        }
                                    </span>
                                </div>
                                <div className={styles.calcRow}>
                                    <span>Equity Percentage:</span>
                                    <span>
                                        {isOwner && ownerOffer.equity 
                                            ? `${ownerOffer.equity}%` 
                                            : !isOwner && userOffer.equity 
                                                ? `${userOffer.equity}%` 
                                                : '--'
                                        }
                                    </span>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={`${styles.calcRow} ${styles.emphasis}`}>
                                    <span>Implied Valuation:</span>
                                    <span>
                                        {isOwner && ownerOffer.amount && ownerOffer.equity 
                                            ? formatCurrency((ownerOffer.amount / ownerOffer.equity) * 100) 
                                            : !isOwner && userOffer.amount && userOffer.equity 
                                                ? formatCurrency((userOffer.amount / userOffer.equity) * 100) 
                                                : '--'
                                        }
                                    </span>
                                </div>
                            </div>
                            
                            <div className={styles.comparison}>
                                <h6>Compared to Owner's Valuation:</h6>
                                <div className={styles.comparisonBar}>
                                    <div 
                                        className={styles.ownerValuation}
                                        style={{ width: '100%' }}
                                    >
                                        <span>Owner's Valuation</span>
                                        <span>
                                            {formatCurrency(project.amountRequested / (project.equityOffered / 100))}
                                        </span>
                                    </div>
                                    {((isOwner && ownerOffer.amount && ownerOffer.equity) || 
                                     (!isOwner && userOffer.amount && userOffer.equity)) && (
                                        <div 
                                            className={styles.userValuation}
                                            style={{ 
                                                width: `${Math.min(
                                                    100, 
                                                    ((isOwner ? ownerOffer.amount / ownerOffer.equity : userOffer.amount / userOffer.equity) * 100) / 
                                                    (project.amountRequested / (project.equityOffered / 100)) * 100
                                                )}%` 
                                            }}
                                        >
                                            <span>{isOwner ? "Counter" : "Your"} Valuation</span>
                                            <span>
                                                {formatCurrency(
                                                    (isOwner 
                                                        ? ownerOffer.amount / ownerOffer.equity 
                                                        : userOffer.amount / userOffer.equity
                                                    ) * 100
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className={styles.tips}>
                                <h6>Negotiation Tips:</h6>
                                <ul>
                                    {isOwner ? (
                                        <>
                                            <li>Consider the investor's experience and network</li>
                                            <li>Be open to negotiation but protect your ownership</li>
                                            <li>Higher valuations reduce dilution but may scare investors</li>
                                            <li>Professional investors expect 10-25% equity</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Start with 10-20% below the requested amount</li>
                                            <li>Consider offering more capital for better equity terms</li>
                                            <li>Be prepared to justify your valuation</li>
                                            <li>Professional messages increase acceptance rate</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
</div>
    );
};

export default EquityNegotiation;