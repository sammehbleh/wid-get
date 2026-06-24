import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function WidgetFrame({ id, title, Component, editMode, onHide }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex min-h-0 flex-1 flex-col">
      {editMode && (
        <div className="mb-1 flex items-center justify-between rounded-lg border border-dashed border-indigo-400/40 bg-indigo-500/10 px-2 py-1">
          <button
            {...attributes}
            {...listeners}
            className="flex items-center gap-1.5 text-xs text-indigo-200 cursor-grab active:cursor-grabbing"
          >
            <span aria-hidden="true">⠿⠿</span> {title}
          </button>
          <button
            onClick={() => onHide(id)}
            className="text-xs text-slate-300 hover:text-rose-300"
          >
            Hide
          </button>
        </div>
      )}
      <Component className="h-full min-h-0 flex-1" />
    </div>
  );
}
