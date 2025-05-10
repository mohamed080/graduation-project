import React from 'react'
import styles from './Questions.module.css'
import questionImg from '../../assets/QuestionMarks.png'
const Questions = () => {

    const FreqQuestions = [
        {
            question: 'What is FundX?',
            answer: 'FundX is a platform that connects you with top investment opportunities and offers the potential for attactive returns.'
        },
        {
            question: 'How much can I invest?',
            answer: `With Regulation A+, a non-accredited investor can only invest a maximum of 10% of their annual income or 10% of their net worth per year, whichever is greater. There are no restrictions for accredited investors.<br /><br />With Regulation Crowdfunding, non-accredited investors with an annual income or net worth less than $124,000, are limited to invest a maximum of 5% of the greater of those two amounts. For those with an annual income and net worth greater than $124,000, he/she is limited to investing 10% of the greater of the two amounts.`,
        },
        {
            question: 'When will I receive my shares?',
            answer:
                'At the close of an offering, all investors whose funds have “cleared” by this time will be included in the disbursement. At this time, each investor will receive an email from StartEngine with their countersigned Subscription Agreement, which will serve as their proof of purchase moving forward. < br /> <br /> For those who have not yet received their shares, please check your email for the latest updates on your subscription.'
        },
        {
            question: 'What will the return on my investment be?',
            answer: 'FundX assists companies in raising capital, and once the offering is closed, we are no longer involved with whether the company chooses to list shares on a secondary market, or what occurs thereafter. Therefore, StartEngine has no control or insight into your investment after the close of the live offering. In addition, we are not permitted to provide financial advice. You may want to contact a financial professional to discuss possible investment outcomes.'
        },
        {
            question: 'Can I cancel my investment?',
            answer: 'You can cancel your investment at any time before the close of the offering. If you cancel, you will be refunded your investment amount, less any applicable fees, in full.'
        }
    ]
    return (
        <div className={styles.questions}>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className={styles.questionImgContainer}>
                            <img src={questionImg} alt="question mark" className={styles.questionImg} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className={styles.questionContent}>
                            <h1>STILL HAVE QUESTIONS?</h1>
                            <p>We've got answers</p>
                            {/* make  accordion here with bootsrap */}
                            <div className={`accordion ${styles.accordion}`} id="faqAccordion">
                                {FreqQuestions.map((item, index) => (
                                    <div className={styles.accordionItem} key={index}>
                                        <h2 className="accordion-header" id={`heading${index}`}>
                                            <button
                                                className={`accordion-button ${styles.accordionButton} collapsed`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapse${index}`}
                                                aria-expanded={index === 0 ? 'true' : 'false'}
                                                aria-controls={`collapse${index}`}
                                            >
                                                {item.question}
                                            </button>
                                        </h2>
                                        <div
                                            id={`collapse${index}`}
                                            className={`accordion-collapse collapse`}
                                            aria-labelledby={`heading${index}`}
                                        >
                                            <div
                                                className={`accordion-body ${styles.accordionBody}`}
                                                dangerouslySetInnerHTML={{ __html: item.answer }}
                                            />
                                        </div>
                                        <svg width="60%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Questions
