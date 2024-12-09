import React, { useEffect, useState } from "react";
import person1 from "../assets/person-1.png";
import person2 from "../assets/person-2.png";
import person3 from "../assets/person-3.png";
import person4 from "../assets/person-4.png";
import person5 from "../assets/person-5.png";
import apiHelper from "../Common/ApiHelper";

const PendingMaintenances = ({userInfo}) => {
const [pendingMaintennance , setpendingMaintenance] = useState([])
  async function getpendingMaintenance() {
    try {
      const result = await apiHelper.pendingMaintenance(userInfo?.societyData?._id)
      setpendingMaintenance(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getpendingMaintenance()
  },[])


//  const maintenanceItems = []

  return (
    <div className="flex flex-col gap-5 bg-white h-full p-4 rounded-[15px] ">
      <div className="flex justify-between items-center w-auto">
        <h2 className="text-md font-semibold">Pending Maintenances</h2>
        <span  className="text-xs w-20 text-blue-500 font-semibold">
          View all
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto h-[295px] pr-2 custom-scrollbar">
        {pendingMaintennance.map((item, index) => (
          <div key={index} className="flex justify-between items-center pb-2 border-b-2 border-[#F6F8FB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200">
                <img
                  src={item?.memberId?.profileImage}
                  alt={item.memberId.profileImage}
                  className="border-2 border-[#D3D3D3] rounded-full w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{item.memberId.userId.fullName}</p>
                <p className="text-sm text-gray-500">{item.maintenanceId.dueDays} Days Pending</p>
              </div>
            </div>
            <p className="text-red-500 font-bold">₹ {item.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingMaintenances;
