import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './EquityNegotiation.module.css';
import { projects } from '../../data/startups';
import { slugify } from '../../utils/slugify';
import { FaExchangeAlt, FaChartLine, FaHistory, FaCheck, FaTimes } from 'react-icons/fa';

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

    const handleNegotiation = () => {
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
            type: 'user'
        };

        // Add to offers history
        const updatedOffers = [...offers, newOffer];
        setOffers(updatedOffers);
        
        // Simulate API call/processing
        setTimeout(() => {
            // Owner's decision logic
            const minAmount = project.amountRequested * 0.8;
            const maxEquity = project.equityOffered * 1.8;
            const acceptableRange = project.amountRequested * 0.2;
            
            if (amount >= minAmount && equity <= maxEquity) {
                // Accept if within 20% of requested amount
                if (Math.abs(amount - project.amountRequested) <= acceptableRange) {
                    setStatus('accepted');
                    setOwnerCounter(null);
                } else {
                    // Counter offer
                    const counterEquity = Math.min(
                        maxEquity, 
                        equity + (project.equityOffered - equity) * 0.3
                    );
                    
                    const counterAmount = Math.max(
                        minAmount,
                        amount + (project.amountRequested - amount) * 0.2
                    );
                    
                    const counterOffer = {
                        id: Date.now(),
                        equity: parseFloat(counterEquity.toFixed(2)),
                        amount: parseFloat(counterAmount.toFixed(2)),
                        timestamp: new Date().toISOString(),
                        type: 'owner'
                    };
                    
                    setStatus('countered');
                    setOwnerCounter(counterOffer);
                    setOffers(prev => [...prev, counterOffer]);
                }
            } else {
                setStatus('rejected');
                setOwnerCounter(null);
            }
            
            setLoading(false);
            setUserOffer({ equity: '', amount: '', note: '' });
            saveNegotiation();
        }, 1500);
    };

    const handleAcceptCounter = () => {
        setStatus('accepted');
        saveNegotiation();
    };

    const handleNewOffer = () => {
        setStatus('pending');
        setOwnerCounter(null);
    };

    const handleComplete = () => {
        localStorage.removeItem(`negotiation-${slug}`);
        navigate(`/project/${slug}`);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
<div className={styles.equityNegotiation}>
            <div className="container">
                <div className="d-flex align-items-center mb-4">
                    <Link to={`/project/${slug}`} className={styles.backLink}>
                        &larr; Back to Project
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
                                        <span>Negotiation in progress</span>
                                    </div>
                                )}
                                {status === 'countered' && (
                                    <div className="d-flex align-items-center">
                                        <FaHistory className="me-2" />
                                        <span>Owner made a counter offer</span>
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
                                                className={`${styles.timelineItem} ${offer.type === 'user' ? styles.userOffer : styles.ownerOffer}`}
                                            >
                                                <div className={styles.timelineHeader}>
                                                    <span className={styles.offerType}>
                                                        {offer.type === 'user' ? 'Your Offer' : "Owner's Offer"}
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
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
    
                            {/* Offer Form */}
                            {status !== 'accepted' && status !== 'rejected' && (
                                <div className={styles.offerForm}>
                                    <h5>{ownerCounter ? 'Make a New Offer' : 'Make Your Offer'}</h5>
                                    
                                    {ownerCounter && (
                                        <div className={styles.counterOffer}>
                                            <p>Owner countered with:</p>
                                            <div className={styles.counterValues}>
                                                <span>{ownerCounter.equity}% Equity</span>
                                                <span className={styles.divider}>•</span>
                                                <span>{formatCurrency(ownerCounter.amount)}</span>
                                            </div>
                                            <button 
                                                className={styles.acceptCounterBtn}
                                                onClick={handleAcceptCounter}
                                            >
                                                Accept Counter Offer
                                            </button>
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
                                        <label htmlFor="noteInput">Your Message (Optional)</label>
                                        <textarea
                                            id="noteInput"
                                            name="note"
                                            value={userOffer.note}
                                            onChange={handleInputChange}
                                            placeholder="Add a message to the owner..."
                                            rows="3"
                                            className={styles.input}
                                            maxLength={200}
                                        />
                                        <div className={styles.charCount}>
                                            {userOffer.note.length}/200
                                        </div>
                                    </div>
                                    
                                    {error && <div className={styles.errorMsg}>{error}</div>}
                                    
                                    <div className="d-flex justify-content-between mt-4">
                                        {offers.length > 0 && (
                                            <button 
                                                className={styles.secondaryBtn}
                                                onClick={handleNewOffer}
                                            >
                                                Start New Offer
                                            </button>
                                        )}
                                        <button
                                            className={styles.submitOfferBtn}
                                            onClick={handleNegotiation}
                                            disabled={loading || !userOffer.equity || !userOffer.amount}
                                        >
                                            {loading ? (
                                                <span className={styles.spinner}></span>
                                            ) : ownerCounter ? (
                                                "Submit Counter Offer"
                                            ) : (
                                                "Submit Offer"
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
                                            <p>
                                                Congratulations! Your investment in {project.title} has been accepted.
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
                                                The owner has declined your offer. Consider adjusting your terms or 
                                                exploring other investment opportunities.
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
                                    <span>{userOffer.amount ? formatCurrency(userOffer.amount) : '--'}</span>
                                </div>
                                <div className={styles.calcRow}>
                                    <span>Equity Percentage:</span>
                                    <span>{userOffer.equity ? `${userOffer.equity}%` : '--'}</span>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={`${styles.calcRow} ${styles.emphasis}`}>
                                    <span>Implied Valuation:</span>
                                    <span>
                                        {userOffer.amount && userOffer.equity ? 
                                            formatCurrency((userOffer.amount / userOffer.equity) * 100) : 
                                            '--'
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
                                    {userOffer.amount && userOffer.equity && (
                                        <div 
                                            className={styles.userValuation}
                                            style={{ 
                                                width: `${Math.min(
                                                    100, 
                                                    ((userOffer.amount / userOffer.equity) * 100) / 
                                                    (project.amountRequested / (project.equityOffered / 100)) * 100
                                                )}%` 
                                            }}
                                        >
                                            <span>Your Valuation</span>
                                            <span>
                                                {formatCurrency((userOffer.amount / userOffer.equity) * 100)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className={styles.tips}>
                                <h6>Negotiation Tips:</h6>
                                <ul>
                                    <li>Start with 10-20% below the requested amount</li>
                                    <li>Consider offering more capital for better equity terms</li>
                                    <li>Be prepared to justify your valuation</li>
                                    <li>Professional messages increase acceptance rate</li>
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