import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import styles from "./ViewOffers.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Format currency values
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

const ViewOffers = ({ project, selectedProjectId }) => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [counterOffer, setCounterOffer] = useState(null);
    const [counterForm, setCounterForm] = useState({
        offered_amount: '',
        requested_percentage: '',
        message: ''
    });
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [selectedProjectId]);

    useEffect(() => {
        if (!selectedProjectId) return;
        fetchOffers();
    }, [selectedProjectId]);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/businesses/${selectedProjectId}/offers`);
            setOffers(response.data);
            toast.success('Offers loaded successfully!', {
                className: styles.toastMessage
            });
        } catch (error) {
            console.error('Error fetching offers:', error);
            toast.error('Failed to load offers. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate valuation
    const calculateValuation = () => {
        if (!project || !project.amountRequested || !project.equityOffered) return 'N/A';
        return formatCurrency(project.amountRequested / (project.equityOffered / 100));
    };

    const handleAction = async (offerId, action) => {
        try {
            setOffers(offers.map(offer =>
                offer.id === offerId ? { ...offer, status: 'processing' } : offer
            ));

            await axiosInstance.post(`/offers/${offerId}/${action}`);
            toast.success(`Offer ${action}ed successfully!`, {
                className: styles.toastMessage
            });
            fetchOffers(); // Refresh offers after action
        } catch (error) {
            console.error(`Error ${action}ing offer:`, error);
            toast.error(`Failed to ${action} offer. Please try again.`);
            setOffers(offers.map(offer =>
                offer.id === offerId ? { ...offer, status: 'pending' } : offer
            ));
        }
    };

    const handleCounterClick = (offer) => {
        setCounterOffer(offer);
        setCounterForm({
            offered_amount: offer.offered_amount,
            requested_percentage: offer.requested_percentage,
            message: ''
        });
    };

    const handleCounterChange = (e) => {
        const { name, value } = e.target;
        setCounterForm(prev => ({ ...prev, [name]: value }));
    };

    const submitCounterOffer = async () => {
        if (!counterOffer) return;

        try {
            setOffers(offers.map(offer =>
                offer.id === counterOffer.id ? { ...offer, status: 'processing' } : offer
            ));

            await axiosInstance.post(`/offers/${counterOffer.id}/counter`, counterForm);
            toast.success('Counter offer submitted successfully!', {
                className: styles.toastMessage
            }); setCounterOffer(null); // Close counter form
            fetchOffers(); // Refresh offers
        } catch (error) {
            console.error('Error countering offer:', error);
            toast.error('Failed to submit counter offer. Please try again.');
            setOffers(offers.map(offer =>
                offer.id === counterOffer.id ? { ...offer, status: 'pending' } : offer
            ));
        }
    };

    if (loading) return <p className={styles.loading}>Loading offers...</p>;
    if (!offers.length) return <p className={styles.empty}>No offers found for this project.</p>;

    return (
        <div className={styles.viewOffers}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <h3 className={styles.title}>Offers for: {project?.title || 'Project'}</h3>

            <div className={styles.termsGrid}>
                <TermItem
                    label="Equity Offered"
                    value={`${project.equityOffered || 0}%`}
                />
                <TermItem
                    label="Amount Requested"
                    value={formatCurrency(project.amountRequested)}
                />
                <TermItem
                    label="Valuation"
                    value={calculateValuation()}
                />
            </div>

            <div className={styles.offersGrid}>
                {offers.map((offer) => (
                    <OfferCard
                        key={offer.id}
                        offer={offer}
                        onAccept={() => handleAction(offer.id, 'accept')}
                        onReject={() => handleAction(offer.id, 'reject')}
                        onCounter={() => handleCounterClick(offer)}
                    />
                ))}
            </div>

            {/* Counter Offer Modal */}
            {counterOffer && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Counter Offer for {counterOffer.investor.name}</h3>

                        <div className={styles.formGroup}>
                            <label>Amount Offered:</label>
                            <input
                                type="number"
                                name="offered_amount"
                                value={counterForm.offered_amount}
                                onChange={handleCounterChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Equity Requested (%):</label>
                            <input
                                type="number"
                                name="requested_percentage"
                                value={counterForm.requested_percentage}
                                onChange={handleCounterChange}
                                min="1"
                                max="100"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Message:</label>
                            <textarea
                                name="message"
                                value={counterForm.message}
                                onChange={handleCounterChange}
                                rows="4"
                                placeholder="Explain your counter terms..."
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setCounterOffer(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitBtn}
                                onClick={submitCounterOffer}
                                disabled={!counterForm.offered_amount || !counterForm.requested_percentage}
                            >
                                Submit Counter Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sub-components
const TermItem = ({ label, value }) => (
    <div className={styles.termItem}>
        <p className={styles.termLabel}>{label}</p>
        <p className={styles.termValue}>{value}</p>
    </div>
);

const OfferCard = ({ offer, onAccept, onReject, onCounter }) => {
    const isProcessing = offer.status === 'processing';

    return (
        <div className={styles.offerCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.investorName}>{offer.investor.name}</h4>
                <span className={`${styles.status} ${styles[offer.status.toLowerCase()]}`}>
                    {offer.status}
                </span>
            </div>

            <div className={styles.cardBody}>
                <OfferDetail label="Amount Offered" value={formatCurrency(offer.offered_amount)} />
                <OfferDetail label="Requested Equity" value={`${offer.requested_percentage}%`} />

                {offer.message && (
                    <div className={styles.message}>
                        <strong>Message:</strong>
                        <p>{offer.message}</p>
                    </div>
                )}

                <p className={styles.timestamp}>
                    {new Date(offer.created_at).toLocaleString()}
                </p>
            </div>

            {offer.status === 'pending' && (
                <div className={styles.offerActions}>
                    <button
                        className={`${styles.actionBtn} ${styles.accept}`}
                        onClick={onAccept}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Accept'}
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.counter}`}
                        onClick={onCounter}
                        disabled={isProcessing}
                    >
                        Counter
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.reject}`}
                        onClick={onReject}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Reject'}
                    </button>
                </div>
            )}
        </div>
    );
};

const OfferDetail = ({ label, value }) => (
    <div className={styles.detailRow}>
        <span className={styles.detailLabel}>{label}:</span>
        <span className={styles.detailValue}>{value}</span>
    </div>
);

export default ViewOffers;