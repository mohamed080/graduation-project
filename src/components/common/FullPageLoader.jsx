import React from 'react';
import styles from './FullPageLoader.module.css';   // ← styles next section

export default function FullPageLoader() {
    return (
        <div className={styles.pgl}>
            {/* simple but elegant SVG spinner */}
            <svg className={styles.fpl__spinner} viewBox="0 0 50 50">
                <circle
                    className={styles.fpl__path}
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                />
            </svg>

            <p className={styles.fpl__text}>Loading&nbsp;project…</p>
        </div>
    );
}


