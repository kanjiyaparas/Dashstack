import React, { useState } from "react";
import avatar from "../../../assets/Avatar.svg";
import avatar2 from "../../../assets/Avatar-2.svg";
import person1 from "../../../assets/person-1.png";
import eye from "../../../assets/icons/white-eye-icon.svg";

const PollOption = ({ option, selected, onChange }) => (
  <div className="flex flex-col items-start gap-2 w-full">
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2">
        <input
          className="orange-input"
          type="radio"
          checked={selected}
          onChange={onChange}
        />
        <label className="text-md font-medium text-gray-700">{option.label}</label>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex relative w-4 h-4">
          <img src={avatar} className="absolute" alt="Avatar" />
          <img src={avatar2} className="absolute right-1" alt="Avatar 2" />
        </div>
        <span className="text-md font-medium text-gray-700">{option.votes}</span>
      </div>
    </div>
    <div className="w-full bg-gray-300 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${option.percentage > 50 ? "bg-green-500" : "bg-red-500"
          }`}
        style={{ width: `${option.percentage}%` }}
      ></div>
    </div>
  </div>
);

const PollCard = ({ poll, selectedOption, onOptionChange }) => (
  <div className="shadow-md p-4 rounded-lg bg-white w-full max-w-[330px]">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <img
          src={person1}
          className="w-12 h-12 rounded-full object-cover"
          alt="Creator"
        />
        <div>
          <p className="font-semibold text-lg text-blue-500">{poll.creator}</p>
          <p className="text-sm text-gray-600">{poll.type}</p>
        </div>
      </div>
      <button className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-500 text-white">
        <img src={eye} alt="Views" />
        <span>{poll.views}</span>
      </button>
    </div>
    <div className="bg-gray-200 w-full h-0.5 mb-3"></div>
    <div className="flex flex-col gap-3">
      <span className="text-lg font-medium">{poll.question}</span>
      {poll.options.map((option, index) => (
        <PollOption
          key={index}
          option={option}
          selected={selectedOption?.label === option.label}
          onChange={() => onOptionChange(poll.id, option)}
        />
      ))}
      <div className="text-sm text-right text-gray-500">{poll.date}</div>
    </div>
  </div>
);

const PollsScreen = () => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const pollData = [
    {
      id: 1,
      creator: "Arlene McCoy",
      type: "Multichoice polls",
      question: "Sales Deal with Toyota - Azure HF - AMS Amplify?",
      options: [
        { label: "Yes", votes: 75, percentage: 75 },
        { label: "No", votes: 25, percentage: 25 },
      ],
      views: 20,
      date: "01/07/2024, 10:00 AM",
    },
    {
      id: 1,
      creator: "Arlene McCoy",
      type: "Multichoice polls",
      question: "Sales Deal with Toyota - Azure HF - AMS Amplify?",
      options: [
        { label: "Yes", votes: 75, percentage: 75 },
        { label: "No", votes: 25, percentage: 25 },
      ],
      views: 20,
      date: "01/07/2024, 10:00 AM",
    },
    {
      id: 1,
      creator: "Arlene McCoy",
      type: "Multichoice polls",
      question: "Sales Deal with Toyota - Azure HF - AMS Amplify?",
      options: [
        { label: "Yes", votes: 75, percentage: 75 },
        { label: "No", votes: 25, percentage: 25 },
      ],
      views: 20,
      date: "01/07/2024, 10:00 AM",
    },

    {
      id: 1,
      creator: "Arlene McCoy",
      type: "Multichoice polls",
      question: "Sales Deal with Toyota - Azure HF - AMS Amplify?",
      options: [
        { label: "Yes", votes: 75, percentage: 75 },
        { label: "No", votes: 25, percentage: 25 },
      ],
      views: 20,
      date: "01/07/2024, 10:00 AM",
    },
    {
      id: 1,
      creator: "Arlene McCoy",
      type: "Multichoice polls",
      question: "Sales Deal with Toyota - Azure HF - AMS Amplify?",
      options: [
        { label: "Yes", votes: 75, percentage: 75 },
        { label: "No", votes: 25, percentage: 25 },
      ],
      views: 20,
      date: "01/07/2024, 10:00 AM",
    },
    {
      id: 1,
      creator: "Arlene McCoy",
      type: "Multichoice polls",
      question: "Sales Deal with Toyota - Azure HF - AMS Amplify?",
      options: [
        { label: "Yes", votes: 75, percentage: 75 },
        { label: "No", votes: 25, percentage: 25 },
      ],
      views: 20,
      date: "01/07/2024, 10:00 AM",
    },





    // Add more polls as needed
  ];

  const handleOptionChange = (pollId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [pollId]: option }));
    console.log(`Poll ${pollId} - Selected Option: ${option.label}`);
  };

  return (
    <div className="bg-white flex flex-col gap-4 w-full h-full  p-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Polls</h3>
        <button className="button-gradient flex items-center gap-2 px-4 py-2 rounded-md">
          <span>Create Polls</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-14 justify-center md:justify-start">
        {pollData.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            selectedOption={selectedOptions[poll.id]}
            onOptionChange={handleOptionChange}
          />
        ))}
      </div>
    </div>
  );
};

export default PollsScreen;
