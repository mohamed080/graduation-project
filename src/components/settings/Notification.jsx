import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Notification.module.css';
import { FaBell, FaCheck, FaTimes, FaExchangeAlt, FaUserTie } from 'react-icons/fa';
import { useNotification } from '../../context/AuthContext';

const Notification = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotification();
    
    const getIcon = (type) => {
        switch(type) {
            case 'offer':
                return <FaExchangeAlt className={styles.offerIcon} />;
            case 'accepted':
                return <FaCheck className={styles.acceptedIcon} />;
            case 'rejected':
                return <FaTimes className={styles.rejectedIcon} />;
            case 'counter':
                return <FaUserTie className={styles.counterIcon} />;
            default:
                return <FaBell className={styles.defaultIcon} />;
        }
    };

    const getMessage = (notification) => {
        switch(notification.type) {
            case 'offer':
                return `New offer for ${notification.projectTitle}`;
            case 'accepted':
                return `Your offer for ${notification.projectTitle} was accepted!`;
            case 'rejected':
                return `Your offer for ${notification.projectTitle} was rejected`;
            case 'counter':
                return `Counter offer received for ${notification.projectTitle}`;
            default:
                return notification.message;
        }
    };

    console.log(notifications);
    return (
        <div className={styles.notificationsPage}>
            <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className={styles.title}>Notifications</h1>
                    
                    <div className="d-flex gap-2">
                        {notifications.length > 0 && (
                            <>
                                <button 
                                    onClick={markAllAsRead} 
                                    className={styles.actionBtn}
                                    disabled={unreadCount === 0}
                                >
                                    Mark All as Read
                                </button>
                                <button 
                                    onClick={clearAll} 
                                    className={styles.actionBtn}
                                >
                                    Clear All
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                {notifications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaBell size={48} className={styles.emptyIcon} />
                        <h3>No notifications yet</h3>
                        <p>Your important updates will appear here</p>
                    </div>
                ) : (
                    <div className={styles.notificationsList}>
                        {notifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className={styles.notificationIcon}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className={styles.notificationContent}>
                                    <h4 className={styles.notificationTitle}>
                                        {getMessage(notification)}
                                    </h4>
                                    <p className={styles.notificationTime}>
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                    {notification.link && (
                                        <Link 
                                            to={notification.link} 
                                            className={styles.notificationLink}
                                        >
                                            View details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;