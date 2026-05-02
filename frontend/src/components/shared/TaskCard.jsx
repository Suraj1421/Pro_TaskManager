import { Draggable } from '@hello-pangea/dnd';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const statusMap = {
  todo: 'default',
  in_progress: 'info',
  review: 'warning',
  done: 'success',
};

export default function TaskCard({ task, index }) {
  const taskId = (task.id || task._id).toString();
  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="cursor-grab"
        >
          <CardContent className="p-4">
            <Badge variant={statusMap[task.status] || 'default'}>{task.status}</Badge>
            <h4 className="mt-3 text-base font-semibold text-white">{task.title}</h4>
            <p className="mt-2 text-xs text-slate-400">
              {task.description || 'No description'}
            </p>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
