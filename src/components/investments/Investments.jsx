import React, { useState, useEffect } from 'react';
import styles from './Investments.module.css';
import PortfolioCard from './PortfolioCard';
import ProjectCard from './ProjectCard';
import TransactionList from './TransactionList';
import PerformanceChart from './PerformanceChart';
import DashboardHeader from './DashboardHeader';
import { useAuth } from '../../context/AuthContext';
// import { projects } from '../../data/startups';
import { useNavigate } from 'react-router-dom';
import useAcceptedOffers from '../../hooks/useAcceptedOffers';
import useDeals from '../../hooks/useDeals';
import NewProjectForm from './NewProjectForm';
import ViewOffers from './ViewOffers';
import useBusinesses from '../../hooks/useBusinesses';



const Investments = () => {
  const { currentUser } = useAuth();
  const { projects, loading: projectsLoading, refetch } = useBusinesses();
  const { investments: userInvestments, loading: invLoading } = useAcceptedOffers({ currentUserId: currentUser?.id });
  const navigate = useNavigate();

  const [isOwner, setIsOwner] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return storedUser?.type === 'owner' || storedUser?.role === 'owner';     // adjust if the field is called `role`
  });
  const { deals, loading: dealLoading } = useDeals(isOwner);
  const [activeTab, setActiveTab] = useState(isOwner ? 'projects' : 'portfolio');
  const [userProjects, setUserProjects] = useState([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    if (!projectsLoading && !currentUser) return;

    // Check if user is an owner
    const ownerProjects = projects.filter(p => p.ownerID === currentUser?.id);
    setUserProjects(ownerProjects);

    if(!isOwner && ownerProjects.length > 0) setIsOwner(true);
    
  }, [currentUser, projects, projectsLoading, isOwner]);


  // Calculate portfolio value
  const portfolioValue = userInvestments.reduce(
    (sum, investment) => sum + investment.amount, 0
  );

  // Calculate returns
  const portfolioReturns = userInvestments.reduce(
    (sum, investment) => sum + (investment.amount * 0.15), // 15% return for demo
    0
  );

  const ownerTransactions = deals.map(deal => ({
  id: deal.id,
  amount: deal.amount,
  equity: deal.equity,
  date: deal.date,
  status: deal.status,
  project: projects.find(p => p.id === deal.projectId),
}));

  // Handle project click to show offers tab
  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('offers');
  };


  if (!currentUser) {
    return (
      <div className={styles.loginPromptContainer}>
        <div className={styles.loginPrompt}>
          <h2>View Your Investment Portfolio</h2>
          <p>Login to track your investments, monitor performance, and manage your projects</p>
          <button 
            className={styles.loginButton}
            onClick={() => navigate('/login')}
          >
            Login to Continue
          </button>
          <p className={styles.signupPrompt}>
            Don't have an account? 
            <span 
              className={styles.signupLink}
              onClick={() => navigate('/register')}
            >
              Sign up now
            </span>
          </p>
        </div>
      </div>
    );
  }

  console.log(isOwner)

  return (
    <div className={styles.investments}>
      <DashboardHeader
        isOwner={isOwner}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portfolioValue={portfolioValue}
        portfolioReturns={portfolioReturns}
        selectedProjectId={selectedProjectId}
        activeInvestments={userInvestments.length}
      />

      <div className='container'>
        <div className={styles.dashboardContent}>
          {activeTab === 'portfolio' && (
            <div className={styles.portfolioSection}>
              <h2>Your Investment Portfolio</h2>
              {invLoading ? <p>Loading your investments...</p> :
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
                        onClick={() => navigate('/explore')}
                      >
                        Discover Investment Opportunities
                      </button>
                    </div>
                  )}
                </div>
              }


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
                    refetch();
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
                      onViewOffers={handleProjectClick}
                    />
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <p>You haven't created any projects yet</p>
                    <button className={styles.newProjectBtn} onClick={() => setShowNewProjectForm(true)}>Create Your First Project</button>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'offers' && isOwner && (
            <ViewOffers
              selectedProjectId={selectedProjectId}
              project={projects.find(p => p.id === selectedProjectId)}
            />
          )}

          {activeTab === 'transactions' && (
            <div className={styles.transactionsSection}>
              <h2>Transaction History</h2>
              {(isOwner ? dealLoading : invLoading) ? (
                <p>Loading transactions…</p>
              ) : (
                <TransactionList
                  investments={isOwner ? ownerTransactions : userInvestments}
                  projects={projects}
                  isOwner={isOwner}
                />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Investments;