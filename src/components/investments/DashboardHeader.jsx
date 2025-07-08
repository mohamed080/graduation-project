import React from 'react';
import styles from './Investments.module.css';

const DashboardHeader = ({ isOwner, activeTab, setActiveTab, portfolioValue, portfolioReturns, selectedProjectId, activeInvestments }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };


    return (
        <div className={styles.dashboardHeader}>
            <div className="container">
                <div className={styles.headerTop}>
                    <div className={styles.headerText}>
                        <h1>Investment Dashboard</h1>
                        <h4>{isOwner ? 'Project Owner' : 'Investor'}</h4>
                    </div>
                    <div className={styles.tabs}>
                        {!isOwner && (
                            <button
                                className={`${styles.tab} ${activeTab === 'portfolio' ? styles.active : ''}`}
                                onClick={() => setActiveTab('portfolio')}
                            >
                                Portfolio
                            </button>
                        )}
                        {isOwner && (
                            <>
                                {selectedProjectId && <button
                                    className={`${styles.tab} ${activeTab === 'offers' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('offers')}
                                >
                                    Offers
                                </button>}
                                <button
                                    className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
                                    onClick={() => setActiveTab('projects')}
                                >
                                    My Projects
                                </button>
                            </>
                        )}
                        <button
                            className={`${styles.tab} ${activeTab === 'transactions' ? styles.active : ''}`}
                            onClick={() => setActiveTab('transactions')}
                        >
                            Transactions
                        </button>
                    </div>
                </div>
                {!isOwner && (
                    <div className={styles.portfolioSummary}>
                        <div className={styles.summaryCard}>
                            <h3>Portfolio Value</h3>
                            <p className={styles.summaryValue}>{formatCurrency(portfolioValue)}</p>
                        </div>
                        <div className={styles.summaryCard}>
                            <h3>Total Returns</h3>
                            <p className={styles.summaryValue} style={{ color: '#27ae60' }}>
                                +{formatCurrency(portfolioReturns)}
                            </p>
                        </div>
                        <div className={styles.summaryCard}>
                            <h3>Active Investments</h3>
                            <p className={styles.summaryValue}>{activeInvestments}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHeader;