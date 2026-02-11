import { useState, useEffect } from 'react';
import type { Plan } from '../types/Plan';
import PlanCard from './PlanCard';
import PlanForm from './PlanForm';
import planService from '../services/planService';
import WeatherForecast from './WeatherForecast';

function Planner() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await planService.getAll();
      // Ensure data is always an array
      if (Array.isArray(data)) {
        setPlans(data);
      } else {
        setPlans([]);
        setError('Fetched plans are not an array.');
        console.error('Fetched plans are not an array:', data);
      }
    } catch (err) {
      setError('Failed to fetch plans. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (planData: Omit<Plan, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      if (editingPlan) {
        // Update existing plan
        const updatedPlan = await planService.update(editingPlan.id, planData);
        setPlans(plans.map(plan => 
          plan.id === editingPlan.id ? updatedPlan : plan
        ));
        setEditingPlan(null);
      } else {
        // Create new plan
        const newPlan = await planService.create(planData);
        setPlans([newPlan, ...plans]);
      }
    } catch (err) {
      setError('Failed to save plan. Please try again.');
      console.error('Save error:', err);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        setError(null);
        await planService.delete(id);
        setPlans(plans.filter(plan => plan.id !== id));
        if (editingPlan?.id === id) {
          setEditingPlan(null);
        }
      } catch (err) {
        setError('Failed to delete plan. Please try again.');
        console.error('Delete error:', err);
      }
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      setError(null);
      const plan = plans.find(p => p.id === id);
      if (plan) {
        const updatedPlan = await planService.toggleComplete(id, !plan.completed);
        setPlans(plans.map(p => p.id === id ? updatedPlan : p));
      }
    } catch (err) {
      setError('Failed to update plan. Please try again.');
      console.error('Toggle error:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
  };

  const filteredPlans = plans.filter(plan => {
    if (filter === 'active') return !plan.completed;
    if (filter === 'completed') return plan.completed;
    return true;
  });

  const activePlans = plans.filter(p => !p.completed).length;
  const completedPlans = plans.filter(p => p.completed).length;

  return (
    <div className="planner">
      {error && <div className="planner-error">{error}</div>}

      <WeatherForecast />       
      <PlanForm 
        onSubmit={handleAddPlan} 
        editingPlan={editingPlan}
        onCancelEdit={handleCancelEdit}
      />

      {loading ? (
        <div className="loading-state">Loading plans...</div>
      ) : (
        <>
          <div className="planner-stats">
            <div className="stat">
              <span className="stat-number">{plans.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-number">{activePlans}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat">
              <span className="stat-number">{completedPlans}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          <div className="plans-list">
            {filteredPlans.length === 0 ? (
              <div className="empty-state">
                <p>📋 No plans yet!</p>
                <p>Create your first plan above to get started.</p>
              </div>
            ) : (
              filteredPlans.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={handleEditPlan}
                  onDelete={handleDeletePlan}
                  onToggleComplete={handleToggleComplete}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Planner;
