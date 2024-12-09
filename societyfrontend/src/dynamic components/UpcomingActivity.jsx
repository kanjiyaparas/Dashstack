import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiHelper from "../Common/ApiHelper";

const UpcomingActivity = ({userInfo}) => {
console.log(userInfo)
  const filterOptions = ["Last Day", "Last Week", "Last Month"];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(filterOptions[0]);

  const colors = [
    { bgColor: "#ec954226", textColor: "#EC9542" },
    { bgColor: "#39973d26", textColor: "#39973D" },
    { bgColor: "#5678e926", textColor: "#5678E9" },
    { bgColor: "#e74c3c26", textColor: "#E74C3C" },
  ];

  const [eventData, seteventData] = useState([])
 console.log(eventData)
  const getEvent = async () => {
    try {
      const id = userInfo?.societyData?.societyId ? userInfo?.societyData?.societyId : userInfo?.societyData?.selectSociety
      const result = await apiHelper.listevent(id)
      console.log(result)
      if (result && result.data) {
        seteventData(result.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getEvent()
  },[])

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };


  return (
    <div className="flex flex-col gap-3 w-full bg-white rounded-[15px] max-h-[265px] min-h-[350px] p-5">
      <div className="flex justify-between items-center">
        <h3 className="text-[#202224] text-sm font-semibold">
          Upcoming Activity
        </h3>
        <Dropdown
        className="text-sm "
          isOpen={isDropdownOpen}
          selectedOption={selectedOption}
          toggleDropdown={toggleDropdown}
          handleOptionSelect={handleOptionSelect}
          options={filterOptions}
        />
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {eventData.map((activity) => {
          const { bgColor, textColor } = getRandomColor();
          return (
            <div
              key={activity._id}
              className="flex justify-between items-center pb-2 border-b-2 border-[#F6F8FB]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 flex justify-center items-center text-lg font-bold rounded-full"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                  }}
                >
                  {activity.title.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[#202224] text-sm">
                    {activity.title}
                  </p>
                  <p className="text-sm font-normal text-[#A7A7A7]">
                    {activity.time}
                  </p>
                </div>
              </div>
              <p className="text-[#4F4F4F] font-normal text-sm">
                {activity.date}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dropdown = ({
  isOpen,
  selectedOption,
  toggleDropdown,
  handleOptionSelect,
  options,
}) => {
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
            {options.map((option) => (
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

Dropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  selectedOption: PropTypes.string.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  handleOptionSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UpcomingActivity;
