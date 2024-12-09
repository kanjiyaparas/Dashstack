

import React, { useState } from "react";
import searchIcon from "../../../assets/icons/Search-icon.svg";
import Avatar from "../../../assets/Avatar.svg";
import Avatar2 from "../../../assets/Avatar-2.svg";

const members = [
  {
    id: 1,
    name: "Michael John",
    dataSets: [
      {
        id: 1,
        answersData: [
          { id: 1, answer: "Hii, John! how are you doing?" },
          { id: 2, answer: "I'm doing great, thanks!" },
        ],
        views: 10,
        votes: 5,
        answers: 2,
      },
      {
        id: 2,
        answersData: [
          { id: 1, answer: "This is another set of data for Michael." },
          { id: 2, answer: "With different answers, views, and votes." },
        ],
        views: 20,
        votes: 3,
        answers: 2,
      },
    ],
    avatar: Avatar,
    lastOnline: "10:45 AM",
  },
  {
    id: 2,
    name: "Jenny Wilson",
    dataSets: [
      {
        id: 1,
        answersData: [
          { id: 1, answer: "Hello, Jenny" },
          { id: 2, answer: "How can I help you today?" },
        ],
        views: 15,
        votes: 0,
        answers: 2,
      },
    ],
    avatar: Avatar2,
    lastOnline: "Yesterday",
  },
  {
    id: 3,
    name: "Emma Watson",
    dataSets: [
      {
        id: 1,
        answersData: [
          { id: 1, answer: "Typing..." },
          { id: 2, answer: "I'm almost done, just a sec!" },
        ],
        views: 25,
        votes: 3,
        answers: 2,
      },
    ],
    avatar: Avatar2,
    lastOnline: "5:30 PM",
  },
];

const CommunityChatSidebar = ({ onSelectMember }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getLastMessagePreview = (answersData) => {
    const lastMessage = answersData?.[answersData.length - 1]?.answer || "";
    const words = lastMessage.split(" ").slice(0, 4).join(" ");
    return words;
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-l-[15px] h-full bg-white">
      <div className="flex flex-col gap-2.5 py-5 w-full bg-white rounded-[15px]">
        <div className="flex justify-between items-center px-5">
          <h3 className="text-[#202224] text-xl font-semibold">Chat</h3>
        </div>
        <div className="relative w-full flex-grow px-5">
          <span className="absolute left-10 top-3 font-semibold text-black">
            <img src={searchIcon} alt="Search Icon" />
          </span>
          <input
            type="text"
            placeholder="Search Here"
            className="indent-14 w-full h-12 rounded-[10px] py-3 focus:outline-none focus:ring-2 bg-[#F6F8FB]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col overflow-y-auto custom-scroll">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex justify-between items-center cursor-pointer p-5 hover:bg-[#5678e91a]"
              onClick={() => onSelectMember(member)}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex justify-center items-center text-lg font-bold rounded-full">
                  <img
                    className="w-full"
                    src={member.avatar}
                    alt={member.name}
                  />
                  <div className="absolute -top-1 -right-1 rounded-full border-2 border-white w-[15px] h-[15px] bg-[#D1D5DB]"></div>
                </div>
                <div>
                  <p className="text-base font-medium text-[#4F4F4F]">
                    {member.name}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{
                      color:
                        member.dataSets &&
                          member.dataSets.length > 0 &&
                          member.dataSets[0].answersData &&
                          member.dataSets[0].answersData[
                            member.dataSets[0].answersData.length - 1
                          ].answer === "Typing..."
                          ? "#5678E9"
                          : "#A7A7A7",
                    }}
                  >
                    {member.dataSets && member.dataSets.length > 0
                      ? getLastMessagePreview(member.dataSets[0].answersData)
                      : "No messages"}
                    ...
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="font-medium text-xs text-[#A7A7A7]">
                  {member.lastOnline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityChatSidebar;
