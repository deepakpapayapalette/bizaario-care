export default function Overview() {
  const stats = [
    { title: "Appointments", value: "150", change: "+11%", color: "#525FE1", chart: "bar" },
    { title: "Consultations", value: "22", change: "+6.5%", color: "#6A75EA", chart: "donut" },
    { title: "Cancelled", value: "03", change: "+0.6%", color: "#E85C43", chart: "bar" },
    { title: "Urgent Resolve", value: "05", change: "+51%", color: "#3EAD4B", chart: "donut" },
  ];

  return (
    <div className="p-4 md:p-6 bg-black/10 rounded-lg mt-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 lg:mb-8">
        <h2 className="text-2xl md:text-4xl font-semibold">Overview</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full lg:w-auto gap-4 sm:gap-6 p-3 rounded-lg">
          <label className="flex items-center gap-2 text-black text-base lg:text-lg font-normal cursor-pointer">
            <input
              type="radio"
              name="filter"
              className="scale-125 accent-[var(--web-primary)] cursor-pointer"
            />
            Patients referred to me
          </label>

          <label className="flex items-center gap-2 text-black text-base lg:text-lg font-normal cursor-pointer">
            <input
              type="radio"
              name="filter"
              className="scale-125 accent-[var(--web-primary)] cursor-pointer"
            />
            Patients referred by me
          </label>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({ title, value, change, color, chart }) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-sm transition-all hover:shadow-md">
      {/* Card Header */}
      <div
        className="px-4 py-3 lg:px-6 lg:py-4"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-lg lg:text-2xl font-semibold text-white">{title}</h3>
      </div>

      {/* Card Body */}
      <div className="flex items-center gap-4 lg:gap-6 p-4 lg:p-6">
        {chart === "bar" ? (
          /* Bar Chart Placeholder */
          <div className="flex items-end gap-1 lg:gap-2">
            <div className="w-2 h-12 lg:h-14 rounded bg-black/20"></div>
            <div className="w-2 h-16 lg:h-18 rounded" style={{ backgroundColor: color }}></div>
            <div className="w-2 h-8 lg:h-10 rounded bg-black/20"></div>
            <div className="w-2 h-12 lg:h-14 rounded bg-black/20"></div>
            <div className="w-2 h-14 lg:h-16 rounded bg-black/20"></div>
          </div>
        ) : (
          /* Donut Chart Placeholder */
          <div className="relative w-16 h-16 lg:w-18 lg:h-18">
            <svg
              viewBox="0 0 74 74"
              className="w-full h-full transform -rotate-90"
            >
              <circle
                cx="37"
                cy="37"
                r="30"
                stroke={color}
                strokeOpacity="0.2"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="37"
                cy="37"
                r="30"
                stroke={color}
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg lg:text-lg font-medium text-black">{value}</span>
              <span className="text-sm lg:text-xl font-medium text-black">%</span>
            </div>
          </div>
        )}

        {/* Text Section */}
        <div className="space-y-2 lg:space-y-3">
          <div className="space-y-1 lg:space-y-3">
            <div className="text-lg lg:text-md font-medium text-black">{value}</div>
            <div className="text-base lg:text-xl font-medium text-black/50">
              Todays
            </div>
          </div>
          <div className="text-xs font-medium text-black/50">{change}</div>
        </div>
      </div>
    </div>
  );
}


