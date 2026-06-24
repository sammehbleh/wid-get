import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import WidgetFrame from "./WidgetFrame";
import { WIDGETS } from "../data/widgets";

export default function DashboardColumn({ id, items, editMode, onHide }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={items} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="flex h-full min-h-0 flex-col gap-6">
        {items.length === 0 && editMode && (
          <div className="rounded-lg border border-dashed border-white/20 p-4 text-center text-xs text-slate-400">
            Drop a widget here
          </div>
        )}
        {items.map((id) => (
          <WidgetFrame
            key={id}
            id={id}
            title={WIDGETS[id].title}
            Component={WIDGETS[id].component}
            editMode={editMode}
            onHide={onHide}
          />
        ))}
      </div>
    </SortableContext>
  );
}
