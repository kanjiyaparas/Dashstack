import React, { useState } from "react";
import avatar from "../assets/Avatar.svg";
import trash from "../assets/icons/trash-icon.svg";
import edit from "../assets/icons/edit-icon.svg";
import eye from "../assets/icons/eye-icon.svg";

const ComplaintList = ({
  toggleViewComplainModal,
  toggleDeleteModal,
  toggleEditModal,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Last Month");

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const complaints = [
    {
      name: "Evelyn Harper",
      complaint: "Unethical Behavior",
      date: "01/02/2024",
      priority: "Medium",
      status: "Open",
    },
    {
      name: "Evelyn Harper",
      complaint: "Unethical Behavior",
      date: "01/02/2024",
      priority: "Low",
      status: "Pending",
    },
    {
      name: "Evelyn Harper",
      complaint: "Unethical Behavior",
      date: "01/02/2024",
      priority: "High",
      status: "Solve",
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full max-h-[285px] min-h-[350px] bg-white rounded-[15px] p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-[#202224] text-xl font-semibold">Complaint List</h3>
        <Dropdown
          isOpen={isDropdownOpen}
          selectedOption={selectedOption}
          toggleDropdown={toggleDropdown}
          handleOptionSelect={handleOptionSelect}
        />
      </div>

      <div className="relative h-[295px] overflow-y-auto pr-2 custom-scrollbar">
        <table className="w-full  text-left border-separate border-spacing-y-2">
          <thead className="bg-[#5678e91a]">
            <tr className="text-[#202224]">
              <th className="px-4 py-2 font-medium rounded-tl-[15px]">
                Complainer Name
              </th>
              <th className="px-4 py-2 font-medium">Complaint Name</th>
              <th className="px-4 py-2 font-medium text-center">Date</th>
              <th className="px-4 py-2 font-medium text-center">Priority</th>
              <th className="px-4 py-2 font-medium text-center w-[151px]">
                Complain Status
              </th>
              <th className="px-4 py-2 font-medium text-center rounded-tr-[15px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="static z-[-1]">
            {complaints.map((complaint, index) => (
              <tr
                key={index}
                className="bg-white text-base font-medium text-[#4F4F4F] "
              >
                <td className="px-3 py-2 flex items-center gap-2 border-b border-[#F4F4F4]">
                  <img
                    src={avatar}
                    alt="avatar"
                    className="rounded-full w-10 h-10"
                  />
                  {complaint.name}
                </td>
                <td className="px-3 py-2 border-b border-[#F4F4F4]">
                  {complaint.complaint}
                </td>
                <td className="px-3 py-2 text-center border-b border-[#F4F4F4]">
                  {complaint.date}
                </td>
                <td className="px-3 py-2 text-center border-b border-[#F4F4F4]">
                  <div
                    className={`max-w-[100px] py-[5px] rounded-full text-white text-sm ${
                      complaint.priority === "High"
                        ? "bg-[#E74C3C]"
                        : complaint.priority === "Medium"
                        ? "bg-[#5678E9]"
                        : "bg-[#39973D]"
                    }`}
                  >
                    <span>{complaint.priority}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-center border-b border-[#F4F4F4]">
                  <div
                    className={`max-w-[113px] py-[5px] rounded-full text-sm ${
                      complaint.status === "Open"
                        ? "bg-[#5678E91A] text-[#5678E9]"
                        : complaint.status === "Pending"
                        ? "bg-[#FFC3131A] text-[#FFC313]"
                        : "bg-[#39973D1A] text-[#39973D]"
                    }`}
                  >
                    <span>{complaint.status}</span>
                  </div>
                </td>
                <td className="text-center border-b border-[#F4F4F4]">
                  <div className="flex items-center justify-evenly">
                    <button
                      className="flex justify-center items-center w-[40px] h-[40px] bg-[#F6F8FB] rounded-[10px]"
                      onClick={toggleEditModal}
                    >
                      <img className="w-6 h-6" src={edit} alt="" />
                    </button>
                    <button
                      className="flex justify-center items-center w-[40px] h-[40px] bg-[#F6F8FB] rounded-[10px]"
                      onClick={toggleViewComplainModal}
                    >
                      <img className="w-6 h-6" src={eye} alt="" />
                    </button>
                    <button
                      className="flex justify-center items-center w-[40px] h-[40px] bg-[#F6F8FB] rounded-[10px]"
                      onClick={toggleDeleteModal}
                    >
                      <img className="w-6 h-6" src={trash} alt="" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintList;

const Dropdown = ({
  isOpen,
  selectedOption,
  toggleDropdown,
  handleOptionSelect,
}) => {
  const optionsList = ["Last Day", "Last Week", "Last Month"];

  return (
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
};
