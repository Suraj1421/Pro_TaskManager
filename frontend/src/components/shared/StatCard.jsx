import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

export default function StatCard({ icon: Icon, label, value, progress }) {
  return (
    <Card asChild>
      <motion.div whileHover={{ y: -4 }} className="p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-neon-400">
              <Icon size={20} />
            </div>
          </div>
          {progress !== undefined && (
            <div className="mt-6">
              <Progress value={progress} />
            </div>
          )}
        </CardContent>
      </motion.div>
    </Card>
  );
}
