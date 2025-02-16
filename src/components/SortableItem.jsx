import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, term, submitted, correctTerm }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-4 text-sm rounded-lg border text-center cursor-pointer transition ${
        submitted && term === correctTerm ? "bg-green-100 border-green-500 text-green-700" :
        submitted ? "bg-red-100 border-red-500 text-red-700" :
        "bg-gray-100 border-gray-300 hover:bg-gray-200"
      }`}
    >
      {term}
    </div>
  );
};

export default SortableItem;
