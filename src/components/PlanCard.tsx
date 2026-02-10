import type { Plan } from '../types/Plan';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

function PlanCard({ plan, onEdit, onDelete, onToggleComplete }: PlanCardProps) {
  const priorityColors: Record<string, string> = {
    LOW: '#4caf50',
    MEDIUM: '#ff9800',
    HIGH: '#f44336',
    URGENT: '#9c27b0'
  };

  return (
    <div className={`plan-card ${plan.completed ? 'completed' : ''}`}>
      <div 
        className="priority-indicator" 
        style={{ backgroundColor: priorityColors[plan.priority] || '#999' }}
      />
      <div className="plan-content">
        <div className="plan-header">
          <h3 className={plan.completed ? 'strike' : ''}>{plan.title}</h3>
          <span className="priority-badge" style={{ backgroundColor: priorityColors[plan.priority] || '#999' }}>
            {plan.priority}
          </span>
        </div>
        <p className="plan-description">{plan.description || 'No description'}</p>
        {plan.address && <p className="plan-address">📍 {plan.address}</p>}
        {plan.telephone && <p className="plan-telephone">📞 {plan.telephone}</p>}
        {plan.email && <p className="plan-email">✉️ {plan.email}</p>}
        <p className="plan-due-date">📅 Due: {plan.dueDate ? new Date(plan.dueDate).toLocaleDateString() : 'No due date'}</p>
        <div className="plan-actions">
          <button 
            className="btn btn-complete" 
            onClick={() => onToggleComplete(plan.id)}
          >
            {plan.completed ? '↩️ Undo' : '✓ Complete'}
          </button>
          <button 
            className="btn btn-edit" 
            onClick={() => onEdit(plan)}
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn-delete" 
            onClick={() => onDelete(plan.id)}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlanCard;
