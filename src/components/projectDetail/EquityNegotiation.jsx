import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './EquityNegotiation.module.css';
import { slugify } from '../../utils/slugify';
import { FaExchangeAlt, FaChartLine, FaHistory, FaCheck, FaTimes, FaUserTie } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useNotification, useAuth } from '../../context/AuthContext';
import useBusinesses from '../../hooks/useBusinesses';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

const EquityNegotiation = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { projects } = useBusinesses();
    const project = projects.find((p) => slugify(p.title) === slug);
    const { currentUser } = useAuth();
    const { addNotification } = useNotification();
    const isOwner = currentUser.type === 'owner' ? true : false;
    const [negotiationState, setNegotiationState] = useState({
        userOffer: { equity: '', amount: '', note: '' },
        offers: [],
        status: 'pending',
        loading: false,
        error: '',
        fetchError: '',
        canInvestorMakeOffer: true,
        ownerCounter: null,
    });

    const {
        userOffer,
        offers,
        status,
        loading,
        error,
        fetchError,
        canInvestorMakeOffer,
        ownerCounter,
    } = negotiationState;
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [slug]);

    useEffect(() => {
        const fetchOffers = async () => {
            if (!project || !currentUser) return;
            setNegotiationState((prev) => ({ ...prev, loading: true, fetchError: '' }));
            try {
                const response = await axiosInstance.get('/my-offers');
                const fetchedOffers = Array.isArray(response.data) ? response.data : [];

                // Filter offers for current project
                const projectOffers = fetchedOffers.filter(
                    offer => offer.business_id === project.id
                );

                projectOffers.sort(
                    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );

                const acceptedOffer = projectOffers.find(offer => offer.status === 'accepted');

                const finalStatus = acceptedOffer ? 'accepted' :
                    projectOffers.length > 0 ? projectOffers[0].status : 'pending';
                // find lastest owner counter offer
                const counter = projectOffers.find(
                    offer => offer.status === 'counter_offered'
                );

                // Determine if investor can make offer
                const lastOffer = projectOffers[0];
                const canMakeOffer = !isOwner && !acceptedOffer && (
                    !lastOffer ||
                    lastOffer.status === 'counter_offered' ||
                    lastOffer.status === 'rejected'
                );

                setNegotiationState((prev) => ({
                    ...prev,
                    offers: projectOffers.map((offer) => ({
                        ...offer,
                        offerid: offer.id,
                        type: 'investor',
                        timestamp: offer.created_at,
                        user_id: offer.investor_id,
                        requested_percentage: parseFloat(offer.requested_percentage),
                        offered_amount: parseFloat(offer.offered_amount),
                        status: offer.status
                    })),
                    status: finalStatus,
                    canInvestorMakeOffer: canMakeOffer,
                    ownerCounter: counter || null
                }));
            } catch (error) {
                setNegotiationState(prev => ({
                    ...prev,
                    fetchError: error.response?.data?.message || 'Failed to load offers',
                    offers: [],
                }));
                toast.error('Failed to load offers', { autoClose: 3000 });
            } finally {
                setNegotiationState(prev => ({ ...prev, loading: false }));
            }
        };

        if (project) fetchOffers();
    }, [project, currentUser, isOwner]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNegotiationState((prev) => ({ ...prev, userOffer: { ...prev.userOffer, [name]: value } }));
    };

    // Submit investor offer
    const submitInvestorOffer = async () => {
        if (!currentUser || !project || !canInvestorMakeOffer) return;

        setNegotiationState((prev) => ({ ...prev, loading: true, error: '' }));
        const equity = parseFloat(userOffer.equity);
        const amount = parseFloat(userOffer.amount);

        // Validation
        if (isNaN(equity) || isNaN(amount) || equity < 1 || equity > 100) {
            setNegotiationState((prev) => ({ ...prev, error: 'Equity must be between 1% and 100%' }));
            setNegotiationState((prev) => ({ ...prev, loading: false }));
            return;
        }
        const payload = {
            business_id: project.id,
            requested_percentage: equity,
            offered_amount: amount,
            message: userOffer.note,
            parent_offer_id: ownerCounter ? ownerCounter.offerid : null
        };
        try {
            const response = await axiosInstance.post('/offers', payload);
            const newOffer = {
                ...response.data,
                type: 'investor',
                timestamp: new Date().toISOString(),
                offerid: response.data.offer?.id || response.data.id,
                user_id: currentUser.id,
                requested_percentage: equity, // Parse to float
                offered_amount: amount, // Parse to float
                message: userOffer.note,
            };
            setNegotiationState((prev) => ({
                ...prev,
                offers: [...prev.offers, newOffer],
                status: 'pending',
                userOffer: { equity: '', amount: '', note: '' },
                canInvestorMakeOffer: false,
                ownerCounter: null
            }));
            addNotification({
                type: 'offer',
                projectTitle: project.title,
                link: `/${slug}/equity`,
                message: `You offered ${equity}% equity for ${formatCurrency(amount)}`
            });
        } catch (error) {
            setNegotiationState((prev) => ({ ...prev, error: error.response?.data?.message || 'Failed to submit offer. Please try again.' }));
        } finally {
            setNegotiationState((prev) => ({ ...prev, loading: false }));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };


    if (!project) return <h2 className="text-center my-5 h-100 d-flex align-items-center">Project not found</h2>;
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
                            {fetchError && <div className={styles.errorMsg}>{fetchError}</div>}
                            {/* {loading && <div className={styles.spinner}>Loading offers...</div>} */}
                            <div className={`${styles.statusBanner} 
                            ${status === 'accepted' ? styles.accepted : ''} 
                            ${status === 'rejected' ? styles.rejected : ''}
                            ${status === 'counter_offered' ? styles.countered : ''}`}>
                                {status === 'pending' && (
                                    <div className="d-flex align-items-center">
                                        <div className={styles.statusIndicator}></div>
                                        <span>Negotiation in progress</span>
                                    </div>
                                )}
                                {status === 'counter_offered' && (
                                    <div className="d-flex align-items-center">
                                        <FaHistory className="me-2" />
                                        <span>{isOwner ? "Your counter offer has been sent" : "Owner made a counter offer"}</span>
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
                            <div className={styles.historySection}>
                                <h5>Negotiation History</h5>
                                {offers.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p>No negotiation history yet</p>
                                    </div>
                                ) : (
                                    <div className={styles.timeline}>
                                        {offers.map((offer) => (
                                            <div
                                                key={offer.offerid}
                                                className={`${styles.timelineItem} 
                                                    ${offer.type === 'investor' ? styles.investorOffer : styles.ownerOffer}
                                                    ${offer.status === 'accepted' ? styles.acceptedOffer : ''}
                                                    ${offer.status === 'rejected' ? styles.rejectedOffer : ''}`}
                                            >
                                                <div className={styles.timelineHeader}>
                                                    <span className={styles.offerType}>
                                                        {offer.status === 'counter_offered' ? "Owner's Offer" : 'Your Offer'}
                                                    </span>
                                                    <span className={styles.offerDate}>
                                                        {new Date(offer.timestamp).toLocaleDateString()} at {' '}
                                                        {new Date(offer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className={styles.offerDetails}>
                                                    <span>{offer.requested_percentage}% Equity</span>
                                                    <span className={styles.divider}>•</span>
                                                    <span>{formatCurrency(offer.offered_amount)}</span>
                                                    {offer.status === 'counter_offered' && (
                                                        <span className={`badge ${styles.statusBadge}`}>
                                                            Countered
                                                        </span>
                                                    )}
                                                    {offer.status === 'accepted' && (
                                                        <span className={`badge ${styles.statusBadgeAccepted}`}>
                                                            Accepted
                                                        </span>
                                                    )}
                                                    {
                                                        offer.status === 'closed' && (
                                                            <span className={`badge ${styles.statusBadgeRejected}`}>
                                                                Closed
                                                            </span>
                                                        )
                                                    }
                                                </div>
                                                {offer.message && (
                                                    <div className={styles.offerNote}>
                                                        <p>"{offer.message}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Offer Form (only for investors when allowed) */}
                            {!isOwner && !['accepted', 'rejected'].includes(status) && (
                                <div className={styles.offerForm}>
                                    <h5>{offers.length ? 'Update Your Offer' : 'Make Your Investment Offer'}</h5>

                                    {ownerCounter && (
                                        <div className={styles.counterOffer}>
                                            <p>Owner countered with:</p>
                                            <div className={styles.counterValues}>
                                                <span>{ownerCounter.requested_percentage}% Equity</span>
                                                <span className={styles.divider}>•</span>
                                                <span>{formatCurrency(ownerCounter.offered_amount)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {!canInvestorMakeOffer && status === 'pending' && (
                                        <div className="alert alert-info">
                                            You must wait for the owner's response before making another offer.
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
                                            max="100"
                                            className={styles.input}
                                            disabled={!canInvestorMakeOffer}
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
                                            disabled={!canInvestorMakeOffer}
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
                                            disabled={!canInvestorMakeOffer}
                                        />
                                        <div className="text-end text-muted small mt-1">
                                            {userOffer.note.length}/200 characters
                                        </div>
                                    </div>

                                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                                    <div className="d-flex justify-content-end mt-4">
                                        <button
                                            className={`btn btn-primary ${styles.submitOfferBtn}`}
                                            onClick={submitInvestorOffer}
                                            disabled={
                                                loading ||
                                                !canInvestorMakeOffer ||
                                                !userOffer.equity ||
                                                !userOffer.amount
                                            }
                                        >
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                            ) : null}
                                            {offers.length ? 'Update Offer' : 'Submit Offer'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Final Status */}
                            {(status === 'accepted' || status === 'rejected') && (
                                <div className={`text-center p-5 ${styles.finalStatus}`}>
                                    {status === 'accepted' ? (
                                        <>
                                            <div className={styles.successIcon}>
                                                <FaCheck />
                                            </div>
                                            <h5>Deal Accepted!</h5>
                                            <p className={styles.successMsg}>
                                                {isOwner
                                                    ? `You've accepted an investment offer for ${project.title}.`
                                                    : `Congratulations! Your investment in ${project.title} has been accepted.`}
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
                                                    : "The owner has declined your offer."}
                                            </p>
                                            <p>
                                                Consider adjusting your terms or exploring other opportunities.
                                            </p>
                                        </>
                                    )}
                                    <button
                                        className={styles.completeBtn}
                                        onClick={() => navigate(`/offering/${slug}`)}
                                    >
                                        {status === 'accepted' ? 'View Investment Details' : 'Back to Project'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                        <div className={styles.valuationSidebar}>
                            <h5>Valuation Calculator</h5>
                            <div className={styles.calculator}>
                                <div className={styles.calcRow}>
                                    <span>Investment Amount:</span>
                                    <span>
                                        {userOffer.amount
                                            ? formatCurrency(userOffer.amount)
                                            : '--'}
                                    </span>
                                </div>
                                <div className={styles.calcRow}>
                                    <span>Equity Percentage:</span>
                                    <span>
                                        {userOffer.equity
                                            ? `${userOffer.equity}%`
                                            : '--'}
                                    </span>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={`${styles.calcRow} ${styles.emphasis}`}>
                                    <span>Implied Valuation:</span>
                                    <span>
                                        {userOffer.amount && userOffer.equity
                                            ? formatCurrency((userOffer.amount / userOffer.equity) * 100)
                                            : '--'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.comparison}>
                                <h6>Compared to Owner's Valuation:</h6>
                                <div className={styles.comparisonBar}>
                                    <div className={styles.ownerValuation} style={{ width: '100%' }}>
                                        <span>Owner's Valuation</span>
                                        <span>{formatCurrency(project.amountRequested / (project.equityOffered / 100))}</span>
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