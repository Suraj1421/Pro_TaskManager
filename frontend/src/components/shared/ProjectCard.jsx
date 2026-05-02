import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

export default function ProjectCard({ project, role, onSelect }) {
  return (
    <Card asChild>
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="flex h-full w-full flex-col justify-between gap-6 p-6 text-left"
        onClick={onSelect}
      >
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <Badge variant={project.status === 'active' ? 'success' : 'warning'}>
              {project.status}
            </Badge>
            {role && <Badge variant="info">{role}</Badge>}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-400">
            {project.description || 'No description yet'}
          </p>
        </CardContent>
      </motion.button>
    </Card>
  );
}
