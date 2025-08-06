"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import KanbanSkeleton from "@/components/kanbanSkeleton";

interface IKanban {
  title: string;
  developer: string;
  priority: string;
  status: string;
  type: string;
}

const COLUMNS = [
  { status: "In Progress", color: "bg-yellow-600" },
  { status: "Ready to start", color: "bg-green-600" },
  { status: "Waiting for review", color: "bg-orange-600" },
  { status: "Done", color: "bg-blue-700" },
  { status: "Stuck", color: "bg-red-600" },
  { status: "Pending Deploy", color: "bg-purple-700" },
];

export default function Kanban() {
  const [kanban, setKanban] = useState<IKanban[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://mocki.io/v1/282222c9-43cf-4d92-9ba0-0e0d1447f403"
      );
      setKanban(data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredKanban = kanban.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const groupedKanban = COLUMNS.reduce((acc, col) => {
    acc[col.status] = filteredKanban.filter(
      (item) => item.status === col.status
    );
    return acc;
  }, {} as Record<string, IKanban[]>);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const draggedItem = kanban.find(
      (item) => `${item.title}-${item.developer}` === draggableId
    );

    if (!draggedItem) return;

    const updatedItem = { ...draggedItem, status: destination.droppableId };
    const updatedKanban = kanban.map((item) =>
      item === draggedItem ? updatedItem : item
    );
    setKanban(updatedKanban);
  };

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
      <form className="w-full mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none px-4 py-2 rounded-lg w-full md:w-1/4 transition"
        />
      </form>

      {loading ? (
        <KanbanSkeleton />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-wrap gap-4 overflow-x-auto">
            {COLUMNS.map((column) => (
              <div
                key={column.status}
                className="w-full md:w-[15.5%] flex-shrink-0"
              >
                <div className="rounded-xl border border-gray-300 bg-gray-200 shadow-md flex flex-col">
                  <div
                    className={`rounded-t-xl ${column.color} p-3 text-white text-center font-semibold text-sm`}
                  >
                    {column.status} ({groupedKanban[column.status]?.length || 0}
                    )
                  </div>

                  <Droppable droppableId={column.status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-3 overflow-y-auto max-h-[80vh] space-y-3 pb-6"
                      >
                        {groupedKanban[column.status]?.length ? (
                          groupedKanban[column.status].map((item, index) => (
                            <Draggable
                              key={`${item.title}-${item.developer}`}
                              draggableId={`${item.title}-${item.developer}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`rounded-lg bg-white shadow-sm p-3 border border-gray-200 hover:shadow-lg transition duration-200 ${
                                    snapshot.isDragging
                                      ? "ring-1 ring-gray-400 bg-blue-50"
                                      : ""
                                  }`}
                                >
                                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                                    {item.title}
                                  </h4>

                                  <div className="text-xs bg-gray-100 border-l-4 border-red-400 p-1 mb-2 text-gray-700">
                                    {item.type}
                                  </div>

                                  <div className="flex -space-x-2">
                                    {item.developer
                                      .split(",")
                                      .map((name, idx) => (
                                        <div
                                          key={idx}
                                          className="w-7 h-7 rounded-full bg-red-300 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow"
                                          title={name.trim()}
                                        >
                                          {name.trim().charAt(0).toUpperCase()}
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm text-center py-4 italic">
                            No tasks
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
