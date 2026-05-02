import { Button } from '../ui/button';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 p-12 text-center">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
      {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
