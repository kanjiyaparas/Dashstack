import React from "react";
import greyEyeIcon from "../../../assets/icons/greyEye-icon.svg";

const CommunityChatData = ({ selectedMember }) => {
  if (!selectedMember) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a member to view their details.
      </div>
    );
  }

  const { name, avatar, dataSets } = selectedMember;

  if (!dataSets || dataSets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available for this member.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {dataSets.map((currentDataSet, index) => {
        const { answersData, views, votes, answers } = currentDataSet;

        const voteColor = votes > 0 ? "#39973D" : "#A7A7A7";
        const answerColor = answersData.length > 0 ? "#5678E9" : "#A7A7A7";

        return (
          <div
            key={index}
            className="flex justify-between items-start rounded-[15px] w-full p-5 bg-[#5678e90d]"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="grid grid-cols-11 items-center font-normal text-sm w-full text-[#A7A7A7] gap-5">
                <span
                  className="col-span-1 text-right"
                  style={{ color: voteColor }}
                >
                  {votes} votes
                </span>
                <p className="col-span-10 font-medium text-base text-[#4F4F4F]">
                  {name}
                </p>
              </div>
              <div className="grid grid-cols-11 items-start font-normal text-sm w-full text-[#A7A7A7] gap-5">
                <span
                  className="col-span-1 text-right"
                  style={{ color: answerColor }}
                >
                  {answersData.length} answers
                </span>
                <div className="col-span-10 flex flex-col w-full gap-3">
                  {answersData.map((answer) => (
                    <p
                      key={answer.id}
                      className="font-light text-base text-[#4F4F4F]"
                    >
                      {answer.id}: {answer.answer}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-[100px] flex justify-center items-center gap-2">
              <button className="flex justify-between items-center font-normal text-sm gap-1 px-[10px] py-[5px] rounded-[30px] text-[#4F4F4F] bg-white">
                <img src={greyEyeIcon} alt="Views" />
                {views}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommunityChatData;
