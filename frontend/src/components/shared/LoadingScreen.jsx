import { Skeleton } from '../ui/skeleton';

export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-52" />
    </div>
  );
}
