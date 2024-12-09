import React from "react";
import moreIcon from "../../../assets/icons/more-icon.svg";

const getLastMessagePreview = (answersData) => {
  const lastMessage = answersData?.[answersData.length - 1]?.answer || "";
  const words = lastMessage.split(" ").slice(0, 4).join(" ");
  return words;
};

const CommunityChatHeader = ({ selectedMember }) => {
  const lastMessagePreview = selectedMember?.dataSets?.[0]?.answersData
    ? getLastMessagePreview(selectedMember.dataSets[0].answersData)
    : "";

  return (
    <div className="flex justify-between items-center bg-white w-full h-[90px] py-[18px] px-5 rounded-tr-[15px]">
      <div className="flex justify-center items-center gap-[15px]">
        {selectedMember ? (
          <>
            <img
              className="w-12 h-12 rounded-full"
              src={selectedMember.avatar}
              alt={selectedMember.name}
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-base font-medium">{selectedMember.name}</p>
              <span className="text-base text-[#A7A7A7]">
                {lastMessagePreview || selectedMember.status || "No messages"}..
              </span>
            </div>
          </>
        ) : (
          <p className="text-base font-medium">
            Select a member to view details
          </p>
        )}
      </div>
      <div className="flex justify-center items-center gap-[20px]">
        <button className="button-gradient flex items-center gap-2 !px-3 !py-2.5 rounded-md">
          <span className="font-semibold text-lg">Ask Question</span>
        </button>
        <button className="flex justify-center items-center w-10.5 h-10.5 bg-[#F6F8FB] gap-2 !px-3 !py-2.5 rounded-full">
          <img src={moreIcon} alt="More Options" />
        </button>
      </div>
    </div>
  );
};

export default CommunityChatHeader;
