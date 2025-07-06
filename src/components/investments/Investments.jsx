import React, { useState, useEffect } from 'react';
import styles from './Investments.module.css';
import PortfolioCard from './PortfolioCard';
import ProjectCard from './ProjectCard';
import TransactionList from './TransactionList';
import PerformanceChart from './PerformanceChart';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '../../context/AuthContext';
// import { projects } from '../../data/startups';
import { investments } from '../../data/investments';
import NewProjectForm from './NewProjectForm';
import useBusinesses from '../../hooks/useBusinesses';


const Investments = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [userProjects, setUserProjects] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const { projects, loading, error } = useBusinesses();

  console.log('projects', projects)
  console.log('current user', currentUser);
  useEffect(() => {
    if (!currentUser) return;

    // Check if user is an owner
    const ownerProjects = projects.filter(p => p.ownerID === currentUser?.id);
    setIsOwner(ownerProjects.length > 0);
    setUserProjects(ownerProjects);

    console.log('owner projects', ownerProjects)

    // Load user's investments
    const userInvests = investments.filter(i => i.userId === currentUser?.id);
    setUserInvestments(userInvests);
  }, [currentUser, projects]);

  console.log(userInvestments)

  // Calculate portfolio value
  const portfolioValue = userInvestments.reduce(
    (sum, investment) => sum + investment.amount, 0
  );

  // Calculate returns
  const portfolioReturns = userInvestments.reduce(
    (sum, investment) => sum + (investment.amount * 0.15), // 15% return for demo
    0
  );


  return (
    <div className={styles.investments}>
      <DashboardHeader
        isOwner={isOwner}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portfolioValue={portfolioValue}
        portfolioReturns={portfolioReturns}
      />

      <div className='container'>
        <div className={styles.dashboardContent}>
          {activeTab === 'portfolio' && (
            <div className={styles.portfolioSection}>
              <h2>Your Investment Portfolio</h2>
              <div className={styles.portfolioGrid}>
                {userInvestments.length > 0 ? (
                  userInvestments.map(investment => {
                    const project = projects.find(p => p.id === investment.projectId);
                    return (
                      <PortfolioCard
                        key={investment.id}
                        investment={investment}
                        project={project}
                      />
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>
                    <p>You haven't made any investments yet</p>
                    <button
                      className={styles.exploreBtn}
                      onClick={() => setActiveTab('discover')}
                    >
                      Discover Investment Opportunities
                    </button>
                  </div>
                )}
              </div>

              {userInvestments.length > 0 && (
                <div className={styles.portfolioCharts}>
                  <PerformanceChart investments={userInvestments} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && isOwner && (
            <div className={styles.projectsSection}>
              <div className={styles.sectionHeader}>
                <h2>Your Projects</h2>
                <button className={styles.newProjectBtn} onClick={() => setShowNewProjectForm(true)}>+ New Project</button>
              </div>

              {showNewProjectForm && (
                <NewProjectForm
                  onSave={() => {
                    setShowNewProjectForm(false);
                  }}
                  onCancel={() => setShowNewProjectForm(false)}
                />
              )}

              <div className={styles.projectsGrid}>
                {userProjects.length > 0 ? (
                  userProjects.map(project => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isOwner={true}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>You haven't created any projects yet</p>
                    <button className={styles.newProjectBtn}>Create Your First Project</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className={styles.transactionsSection}>
              <h2>Transaction History</h2>
              <TransactionList
                investments={userInvestments}
                projects={userProjects}
                isOwner={isOwner}
              />
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Investments;