import { useState, useEffect } from 'react';
import type { Plan } from '../types/Plan';

interface PlanFormProps {
  onSubmit: (plan: Omit<Plan, 'id' | 'createdAt'>) => void;
  editingPlan: Plan | null;
  onCancelEdit: () => void;
}

function PlanForm({ onSubmit, editingPlan, onCancelEdit }: PlanFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlan) {
      setTitle(editingPlan.title);
      setDescription(editingPlan.description || '');
      setDueDate(editingPlan.dueDate || '');
      setPriority(editingPlan.priority);
    } else {
      resetForm();
    }
  }, [editingPlan]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('MEDIUM');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!title.trim() || !dueDate) {
        throw new Error('Title and due date are required');
      }

      onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null,
        priority,
        completed: editingPlan?.completed || false
      });

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Submit error:', err);
    }
  };

  const handleCancel = () => {
    try {
      setError(null);
      resetForm();
      onCancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Cancel error:', err);
    }
  };

  return (
    <form className="plan-form" onSubmit={handleSubmit}>
      <h2>{editingPlan ? '✏️ Edit Plan' : '➕ Create New Plan'}</h2>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter plan title..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter plan description..."
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT')}
          >
            <option value="LOW">🟢 Low</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="HIGH">🔴 High</option>
            <option value="URGENT">🚨 Urgent</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          {editingPlan ? '💾 Update Plan' : '➕ Add Plan'}
        </button>
        {editingPlan && (
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            ❌ Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default PlanForm;
