import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Investments.module.css';
import InvestmentReportModal from './InvestmentReportModal';

const PortfolioCard = ({ investment, project }) => {
    const [showReport, setShowReport] = useState(false);

    if (!project) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateReturn = () => {
        // For demo - 15% return
        return investment.amount * 0.15;
    };

    return (
        <div className={styles.portfolioCard}>
            <div className={styles.cardHeader}>
                <h3>{project.title}</h3>
                <span className={styles.statusBadge}>Active</span>
            </div>

            <div className={styles.investmentDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.investmentLabel}>Investment</span>
                    <span>{formatCurrency(investment.amount)}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.investmentLabel}>Equity</span>
                    <span>{investment.equity}%</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.investmentLabel}>Current Value</span>
                    <span>{formatCurrency(investment.amount + calculateReturn())}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.investmentLabel}>Return</span>
                    <span className={styles.positiveReturn}>
                        +{formatCurrency(calculateReturn())}
                    </span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <Link to={`/offering/${project.slug}`} className={styles.viewBtn}>
                    View Project
                </Link>
                <button className={styles.reportBtn}
                    onClick={() => setShowReport(true)}>View Report</button>
            </div>
            {showReport && (
                <InvestmentReportModal
                    investment={investment}
                    project={project}
                    onClose={() => setShowReport(false)}
                />
            )}
        </div>
    );
};

export default PortfolioCard;