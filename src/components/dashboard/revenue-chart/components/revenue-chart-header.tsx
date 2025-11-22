const RevenueChartHeader = () => {
  return (
    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
      <div
        className="flex items-center gap-4 text-xs font-medium"
        role="list"
        aria-label="Chart legend"
      >
        <div className="flex items-center gap-2" role="listitem">
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#0DA06A]"
            aria-hidden="true"
          ></span>
          <span className="text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-2" role="listitem">
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#C8EE44]"
            aria-hidden="true"
          ></span>
          <span className="text-gray-600">Expense</span>
        </div>
      </div>

      <label htmlFor="time-period-select" className="sr-only">
        Select time period
      </label>
      <select
        id="time-period-select"
        className="bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-lg px-2 py-1 outline-none focus:border-[#C8EE44]"
        aria-label="Time period filter"
      >
        <option>Last 7 days</option>
        <option>Last Month</option>
      </select>
    </div>
  );
};

export default RevenueChartHeader;
