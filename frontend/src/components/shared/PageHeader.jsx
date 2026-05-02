import { Button } from '../ui/button';

export default function PageHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {actionLabel && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
