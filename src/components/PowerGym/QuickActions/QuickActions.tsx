import React from 'react';
import styles from './QuickActions.module.css';

interface ActionItem {
  id: string;
  title: string;
  icon: string;
  onClick: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions: ActionItem[];
  title?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, title = "Tiện ích" }) => {
  return (
    <div className={styles.actionsContainer}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.actionsGrid}>
        {actions.map((action) => (
          <button
            key={action.id}
            className={styles.actionButton}
            onClick={action.onClick}
            style={{ '--action-color': action.color || '#ff4444' } as React.CSSProperties}
          >
            <div className={styles.actionIcon}>
              {action.icon}
            </div>
            <span className={styles.actionTitle}>{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;