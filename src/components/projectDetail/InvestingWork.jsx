import React from 'react'
import styles from './ProjectDetail.module.css';
import timeline from '../../assets/faq-timeline.svg';
import { FiLoader } from 'react-icons/fi';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { VscSettings } from 'react-icons/vsc';
import style from '../home/Questions.module.css';
const InvestingWork = () => {
    const FreqQuestions = [
        {
            question: 'What is FundX?',
            answer: 'With Regulation A+, a non-accredited investor can only invest a maximum of 10% of their annual income or 10% of their net worth per year, whichever is greater. There are no restrictions for accredited investors.<br /> <br/> With Regulation Crowdfunding, non-accredited investors with an annual income or net worth less than $124,000 are limited to invest a maximum of 5% of the greater of those two amounts. For those with an annual income and net worth greater than $124,000, they are limited to investing 10% of the greater of the two amounts.'
        },
        {
            question: 'How much can I invest?',
            answer: `FUNDX makes it easy to invest using your retirement funds. You can open a self-directed IRA account through <span style="font-weight: bold;">Equity Trust</span>, a trusted provider fully integrated with our platform. This integration allows for a <span style="font-weight: bold;">fast, secure, and seamless investing experience</span>, and includes <span style="font-weight: bold;">a special offer on annual fees</span>exclusively for StartEngine investors.<br><br> Already have a self-directed IRA with another provider? You can still invest on StartEngine, but please note that the process will be <span style="font-weight: bold;">manual and may take longer</span> to complete.<br><br> To get started, simply <span style="font-weight: bold;">visit our IRA page</span> for more information and step-by-step instructions.
. There are no restrictions for accredited investors.<br /><br />With Regulation Crowdfunding, non-accredited investors with an annual income or net worth less than $124,000, are limited to invest a maximum of 5% of the greater of those two amounts. For those with an annual income and net worth greater than $124,000, he/she is limited to investing 10% of the greater of the two amounts.`,
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
        },
        {
            question: 'How do I invest using my retirement funds?',
            answer: `Both Title III (Regulation Crowdfunding) and Title IV (Reg A+) help entrepreneurs crowdfund capital investments from unaccredited and accredited investors. The differences between these regulations are related to the investor limitations, the differing amounts of money companies are permitted to raise, and differing disclosure and filing requirements. To learn more about Regulation Crowdfunding,`
        }
    ]
    return (
        <div className={styles.investingWork}>
            <h4 className={`mb-0 ${styles.reasonsTitle}`}>HOW INVESTING WORKS</h4>
            <p className={styles.investingWorkText}>Cancel anytime before 48 hours before a rolling close or the offering end date.</p>

            <div class={styles.timelineContainer}>
                <img alt="FAQ Timeline" loading="lazy" width="772" height="112" decoding="async" data-nimg="1" src={timeline} className={styles.timelineImage} />
            </div>
            <svg width="100%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
            <div className={styles.whyFundx}>
                <h4 className={styles.reasonsTitle} style={{ color: 'var(--primary-color)', margin: '0px 0px 16px' }}>WHY FUNDX?</h4>
                <div className={styles.whyFundxText}>
                    <FiLoader />
                    <div>
                        <h6>REWARDS</h6>
                        <p>We want you to succeed and get the most out of your money by offering rewards and memberships!</p>
                    </div>
                </div>
                <div className={styles.whyFundxText}>
                    <HiOutlineLockClosed />
                    <div>
                        <h6>SECURE</h6>
                        <p>Your info is your info. We take pride in keeping it that way!</p>
                    </div>
                </div>
                <div className={styles.whyFundxText}>
                    <VscSettings />
                    <div>
                        <h6>DIVERSE INVESTMENTS</h6>
                        <p>Invest in over 200 start-ups and collectibles!</p>
                    </div>
                </div>
            </div>
            <h5 className={styles.faqTitle}>FAQS</h5>
            <div className={`accordion ${style.accordion}`} id="faqAccordion">
                {FreqQuestions.map((item, index) => (
                    <div className={style.accordionItem} key={index}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                                className={`accordion-button ${style.accordionButton} collapsed`}
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
                                className={`accordion-body ${style.accordionBody}`}
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                        </div>
                        <svg width="60%" height="2" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="#999999" strokeLinecap="round" strokeDasharray="0.5 8"></line></svg>
                    </div>
                ))}
            </div>
            <div className={styles.marginBottom_80}></div>
        </div>
    )
}

export default InvestingWork
