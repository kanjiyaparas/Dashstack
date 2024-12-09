import React from "react";
import document from "../assets/icons/document-icon.svg";
import moneySend from "../assets/icons/money-send.svg";
import moneyRecive from "../assets/icons/money-recive.svg";
import buildingIcon from "../assets/icons/building-icon.svg";

const DashboardCards = () => {
  const cardData = [
    {
      title: "Total Balance",
      value: "₹ 2,22,520",
      bgColor: "bg-white",
      borderColor: "border-[#FF6A00]",
      icon: document,
      iconBgColor: "#ff6a0026",
      bgDivColor: "#ff6a0080",
    },
    {
      title: "Total Income",
      value: "₹ 55,000",
      bgColor: "bg-white",
      borderColor: "border-[#000]",
      icon: moneyRecive,
      iconBgColor: "#39973d26",
      bgDivColor: "#39973d80",
    },
    {
      title: "Total Expense",
      value: "₹ 20,550",
      bgColor: "bg-white",
      borderColor: "border-[#000]",
      icon: moneySend,
      iconBgColor: "#869ff326",
      bgDivColor: "#869ff380",
    },
    {
      title: "Total Unit",
      value: "₹ 20,550",
      bgColor: "bg-white",
      borderColor: "border-[#000]",
      icon: buildingIcon,
      iconBgColor: "#eb37c326",
      bgDivColor: "#eb37c380",
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card, index) => (
        <div
          key={index}
          className={`flex items-center p-4 rounded-[15px] shadow-md ${card.bgColor} relative z-0 w-full h-auto min-h-[105px]`}
        >
          <div
            className="absolute w-[5px] h-1/2 top-1/2 left-0 transform -translate-y-1/2 rounded-tr-[10px] rounded-br-[10px]"
            style={{ backgroundColor: card.bgDivColor }}
          />

          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col justify-between ml-3">
              <h6 className="text-gray-700 font-semibold text-md">
                {card.title}
              </h6>
              <div className="text-gray-900 font-bold text-xl md:text-2xl">
                {card.value}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div
                className="rounded-[10px] w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center"
                style={{ backgroundColor: card.iconBgColor }}
              >
                <img
                  className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]"
                  src={card.icon}
                  alt={`${card.title} Icon`}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
