import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const optionsList = ["Last Week", "Last Month", "Last Year"];

const BalanceChart = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Last Month");

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "",
        data: [10, 18, 15, 27, 19, 22, 20, 30, 29, 28, 44],
        fill: false,
        borderColor: "#9CABFF",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}K`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-5 w-5/7 h-auto bg-white rounded-[15px] p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-[#202224] text-xl font-semibold">Total Balance</h3>
        <Dropdown
          isOpen={isDropdownOpen}
          selectedOption={selectedOption}
          toggleDropdown={toggleDropdown}
          handleOptionSelect={handleOptionSelect}
        />
      </div>
      <div className="w-full h-[305px]">
        <Line data={data} options={options} width={745} />
      </div>
    </div>
  );
};

const Dropdown = ({
  isOpen,
  selectedOption,
  toggleDropdown,
  handleOptionSelect,
}) => (
  <div className="relative inline-block text-left">
    <button
      type="button"
      onClick={toggleDropdown}
      className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {selectedOption}
      <svg
        className="-mr-1 h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
    {isOpen && (
      <div
        className="absolute right-0 z-10 mt-2 w-[149px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="p-5 flex flex-col gap-2">
          {optionsList.map((option) => (
            <label key={option} className="flex items-center gap-3">
              <input
                className="orange-input"
                type="radio"
                name="filter"
                checked={selectedOption === option}
                onChange={() => handleOptionSelect(option)}
              />
              <span
                className={`text-sm font-normal cursor-pointer ${
                  selectedOption === option ? "text-black" : "text-[#A7A7A7]"
                }`}
              >
                {option}
              </span>
            </label>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default BalanceChart;
