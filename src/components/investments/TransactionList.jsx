import React from 'react';
import styles from './Investments.module.css';

const TransactionList = ({ investments, projects, isOwner, onPromoteClick }) => {
    const formatCurrency = (amount) => {
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount || 0);
        } catch (error) {
            console.error('Error formatting currency:', error);
            return '$0';
        }
    };


    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) throw new Error('Invalid date');
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const handlePromoteClick = () => {
        if (onPromoteClick) {
            onPromoteClick();
        }
    };

    return (
        <section className={styles.transactionList} aria-label="Transaction History">
            <table className={styles.table}>
                <thead className={styles.tableHeader}>
                    <tr role="row">
                        <th scope="col">Project</th>
                        <th scope="col">Type</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Equity</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {investments.length > 0 ? (
                        investments.map((investment) => {
                            const project = investment.project || projects.find((p) => p.id === investment.projectId);
                            if (!project) {
                                console.warn(`Project not found for investment ID: ${investment.id}`);
                                return null;
                            }

                            return (
                                <tr
                                    key={investment.id}
                                    className={styles.transactionItem}
                                    role="row"
                                    aria-label={`Transaction for ${project.title}`}
                                >
                                    <td className={styles.projectCell}>
                                        <div className={styles.projectImage}>
                                            <img
                                                src={project.img}
                                                alt={`${project.title} thumbnail`}
                                                onError={(e) => {
                                                    e.target.src = '/fallback-image.png'; // Fallback image
                                                }}
                                            />
                                        </div>
                                        <span>{project.title}</span>
                                    </td>
                                    <td>{project.category}</td>
                                    <td className={styles.amountCell}>{formatCurrency(investment.amount)}</td>
                                    <td className={styles.equityCell}>{investment.equity}%</td>
                                    <td>{formatDate(investment.date)}</td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${styles.statusCompleted}`}
                                            aria-label="Transaction status: Completed"
                                        >
                                            Completed
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr className={styles.emptyTransactions}>
                            <td colSpan="5">
                                <p>No transactions found</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isOwner && investments.length === 0 && (
                <div className={styles.ownerEmpty}>
                    <p>You haven't received any investments yet</p>
                    <button
                        type="button"
                        className={styles.promoteBtn}
                        onClick={handlePromoteClick}
                        aria-label="Promote your projects"
                    >
                        Promote Your Projects
                    </button>
                </div>
            )}
        </section>
    );
};
export default TransactionList;