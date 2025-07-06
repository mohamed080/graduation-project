import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import InvestmentGrowthChart from './InvestmentGrowthChart';
import styles from './Investments.module.css';

const InvestmentReportModal = ({ investment, project, onClose }) => {
    const reportRef = useRef(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateReturn = () => {
        return investment.amount * 0.15;
    };

    const handleDownloadPDF = () => {
        const input = reportRef.current;

        html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${project.title.replace(/\s+/g, '-')}-investment-report.pdf`);
        });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} ref={reportRef}>
                <div className={styles.modalHeader}>
                    <h2>{project.title} Investment Report</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        &times;
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.reportSummary}>
                        <div className={styles.summaryItem}>
                            <span>Investment Date</span>
                            <strong>{new Date(investment.date).toLocaleDateString()}</strong>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Amount Invested</span>
                            <strong>{formatCurrency(investment.amount)}</strong>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Current Value</span>
                            <strong>{formatCurrency(investment.amount + calculateReturn())}</strong>
                        </div>
                        <div className={styles.summaryItem}>
                            <span>Total Return</span>
                            <strong className={styles.positiveReturn}>
                                +{formatCurrency(calculateReturn())}
                            </strong>
                        </div>
                    </div>

                    <div className={styles.reportChart}>
                        <h3>Investment Growth</h3>
                        <InvestmentGrowthChart
                            investment={investment}
                            project={project}
                        />
                    </div>

                    <div className={styles.reportDetails}>
                        <div className={styles.detailSection}>
                            <h4>Project Overview</h4>
                            <p>{project.desc}</p>
                        </div>

                        <div className={styles.detailSection}>
                            <h4>Investment Terms</h4>
                            <ul className={styles.termsList}>
                                <li>Equity: <strong>{investment.equity}%</strong></li>
                                <li>Valuation Cap: <strong>{formatCurrency(project.valuationCap)}</strong></li>
                                <li>Discount: <strong>{project.discount}%</strong></li>
                                <li>Projected IRR: <strong>{project.irr}%</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        onClick={handleDownloadPDF}
                        className={styles.downloadButton}
                    >
                        Download PDF Report
                    </button>
                    <button
                        onClick={onClose}
                        className={styles.closeModalButton}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestmentReportModal;