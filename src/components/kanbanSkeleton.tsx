export default function KanbanSkeleton() {
  const columns = Array(6).fill(null);

  return (
    <div className="w-full flex flex-wrap gap-4 animate-pulse">
      {columns.map((_, colIdx) => (
        <div
          key={colIdx}
          className="w-full md:w-[15.5%] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="h-10 bg-gray-300 rounded-t-xl" />

          <div className="p-3 space-y-4 max-h-[80vh] overflow-y-auto">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded-lg p-3 border border-gray-200 shadow-sm space-y-3"
              >
                <div className="h-4 w-3/4 bg-gray-300 rounded" />
                <div className="h-3 w-1/2 bg-gray-300 rounded" />

                <div className="flex -space-x-2 pt-1">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white shadow"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
