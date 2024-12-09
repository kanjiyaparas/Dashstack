// import { Paper } from "@mui/material";
// import ViewWeekIcon from '@mui/icons-material/ViewWeek';
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import HomeWorkIcon from '@mui/icons-material/HomeWork';
// import React, { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";
// // import addIcon from "../assets/icons/add-icon.svg";
// // import trash from "../assets/icons/trash-icon.svg";
// // import edit from "../assets/icons/edit-icon.svg";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import apiHelper from "../../Common/ApiHelper";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const optionsList = ["Last Week", "Last Month", "Last Year"];


// export default function Dashboard({ userInfo }) {

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState("Last Month");

//   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

//   const handleOptionSelect = (option) => {
//     setSelectedOption(option);
//     setIsDropdownOpen(false);
//   };

//   const data = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "",
//         data: [10, 18, 15, 27, 19, 22, 20, 30, 29, 28, 44],
//         fill: false,
//         borderColor: "#9CABFF",
//         tension: 0.4,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       title: { display: false },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 10,
//           callback: (value) => `${value}K`,
//         },
//       },
//     },
//   };




//   const contacts = [
//     { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
//     { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
//     { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
//     { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
//     { name: "Hanna Donin", phone: "+91 99587 33657", work: "Plumber" },
//   ];

//   const [pendingMaintenance, setpendingMaintenance] = useState([])
//   // async function getpendingMaintenance() {
//   //   try {
//   //     const result = await apiHelper.pendingMaintenance(userInfo?.societyData)
//   //     setpendingMaintenance(result.data.data)
//   //   } catch (error) {
//   //     console.log(error)
//   //   }
//   // }


//   useEffect(() => {
//     // getpendingMaintenance()
//   }, [])


//   return <>
//     <div className="row p-2 flex-wrap d-flex justify-content-between">
//       <Paper elevation={5} className="col-12 col-md-6 col-lg-3 py-2 pe-2" style={{ width: "24%" }}>
//         <div className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <div style={{ width: "5px", height: "40px", background: "orange", borderTopRightRadius: "10px", borderEndEndRadius: "10px" }}></div>
//             <div className="mx-3">
//               <div className="h5" style={{ fontSize: "14px" }}>Total Balance</div>
//               <div className="h4 fw-bold">₹ 2,22,520</div>
//             </div>
//           </div>
//           <div className="icon">
//             <ViewWeekIcon style={{ color: "chocolate", background: "orange", padding: "4px", borderRadius: "8px", fontSize: '32px' }} />
//           </div>
//         </div>
//       </Paper>
//       <Paper elevation={5} className="col-12 col-md-6 col-lg-3 py-2 pe-2" style={{ width: "24%" }}>
//         <div className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <div style={{ width: "5px", height: "40px", background: "green", borderTopRightRadius: "10px", borderEndEndRadius: "10px" }}></div>
//             <div className="mx-3">
//               <div className="h5" style={{ fontSize: "14px" }}>Total Income</div>
//               <div className="h4 fw-bold">₹ 2,22,520</div>
//             </div>
//           </div>
//           <div className="icon">
//             <CurrencyExchangeIcon style={{ color: "green", background: "lightgreen", padding: "4px", borderRadius: "8px", fontSize: '32px' }} />
//           </div>
//         </div>
//       </Paper>
//       <Paper elevation={5} className="col-12 col-md-6 col-lg-3 py-2 pe-2" style={{ width: "24%" }}>
//         <div className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <div style={{ width: "5px", height: "40px", background: "#4F46E5", borderTopRightRadius: "10px", borderEndEndRadius: "10px" }}></div>
//             <div className="mx-3">
//               <div className="h5" style={{ fontSize: "14px" }}>Total Expense</div>
//               <div className="h4 fw-bold">₹ 2,22,520</div>
//             </div>
//           </div>
//           <div className="icon">
//             <CurrencyRupeeIcon style={{ color: "black", background: "#4F46E5", padding: "4px", borderRadius: "8px", fontSize: '32px' }} />
//           </div>
//         </div>
//       </Paper>
//       <Paper elevation={5} className="col-12 col-md-6 col-lg-3 py-2 pe-2" style={{ width: "24%" }}>
//         <div className="d-flex justify-content-between align-items-center">
//           <div className="d-flex align-items-center">
//             <div style={{ width: "5px", height: "40px", background: "pink", borderTopRightRadius: "10px", borderEndEndRadius: "10px" }}></div>
//             <div className="mx-3">
//               <div className="h5" style={{ fontSize: "14px" }}>Total Unit</div>
//               <div className="h4 fw-bold">₹ 2,22,520</div>
//             </div>
//           </div>
//           <div className="icon">
//             <HomeWorkIcon style={{ color: "red", background: "lightpink", padding: "4px", borderRadius: "8px", fontSize: '32px' }} />
//           </div>
//         </div>
//       </Paper>
//     </div>
//     <div className="row">
//       <div className="col-12 col-lg-6">
//         <div className="flex flex-col w-full h-auto bg-white rounded-[15px] p-3" style={{ height: "300px" }}>
//           <div className="flex justify-between items-center">
//             <h3 className="text-[#202224] text-xl font-semibold" style={{ fontSize: "14px" }}>Total Balance</h3>
//             <Dropdown
//               isOpen={isDropdownOpen}
//               selectedOption={selectedOption}
//               toggleDropdown={toggleDropdown}
//               handleOptionSelect={handleOptionSelect}
//             />
//           </div>
//           <div className="w-full" >
//             <Line data={data} options={options} width={745} />
//           </div>
//         </div>
//       </div>



//       <div className="col-12 col-md-6 col-lg-3">
//         <div className="scroll_number flex flex-col bg-white rounded-[15px] h-full max-w-md" style={{ height: "365px", overflow: "scroll" }}>
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold" style={{ fontSize: "14px" }}>Important Numbers</h2>
//             <button
//               className="button-gradient flex items-center gap-2 px-4 py-2 rounded-md"
//               onClick={"toggleModal"}
//             >
//               {/* <img src={addIcon} alt="Add" className="w-5 h-5" /> */}
//               <span className="btn btn_primary">Add</span>
//             </button>
//           </div>

//           <div className="overflow-y-auto h-[295px] pr-2 custom-scrollbar scroll_number">
//             {contacts.map((contact, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between items-center border-2 border-[#F6F8FB] bg-white rounded-[10px] px-3 py-2.5 mb-3"
//               >
//                 <div>
//                   <p className="font-medium text-sm text-[#202224]">
//                     Name : <span className="text-[#A7A7A7]">{contact.name}</span>
//                   </p>
//                   <p className="font-medium text-sm text-[#202224]">
//                     Ph Number:{" "}
//                     <span className="text-[#A7A7A7]">{contact.phone}</span>
//                   </p>
//                   <p className="font-medium text-sm text-[#202224]">
//                     Work: <span className="text-[#A7A7A7]">{contact.work}</span>
//                   </p>
//                 </div>
//                 <div className="bg-[#F6F8FB] w-[1px] h-[46px]"></div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     className="flex justify-center items-center w-[30px] h-[30px] bg-[#F6F8FB] rounded-full"
//                     onClick={"toggleDeleteModal"}
//                   >
//                     {/* <img src={trash} alt="Delete" /> */}
//                   </button>
//                   <button
//                     className="flex justify-center items-center w-[30px] h-[30px] bg-[#F6F8FB] rounded-full"
//                     onClick={""}
//                   >
//                     {/* <img src={edit} alt="Edit" /> */}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="col-12 col-md-6 col-lg-3">

//       </div>
//     </div>
//   </>
// }






// const Dropdown = ({
//   isOpen,
//   selectedOption,
//   toggleDropdown,
//   handleOptionSelect,
// }) => (
//   <div className="relative inline-block text-left">
//     <button
//       type="button"
//       onClick={toggleDropdown}
//       className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//       aria-expanded={isOpen}
//       aria-haspopup="true"
//     >
//       {selectedOption}
//       <svg
//         className="-mr-1 h-5 w-5 text-gray-400"
//         viewBox="0 0 20 20"
//         fill="currentColor"
//         aria-hidden="true"
//       >
//         <path
//           fillRule="evenodd"
//           d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
//           clipRule="evenodd"
//         />
//       </svg>
//     </button>
//     {isOpen && (
//       <div
//         className="absolute right-0 z-10 mt-2 w-[149px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
//         role="menu"
//         aria-orientation="vertical"
//         aria-labelledby="menu-button"
//       >
//         <div className="p-5 flex flex-col gap-2">
//           {optionsList.map((option) => (
//             <label key={option} className="flex items-center gap-3">
//               <input
//                 className="orange-input"
//                 type="radio"
//                 name="filter"
//                 checked={selectedOption === option}
//                 onChange={() => handleOptionSelect(option)}
//               />
//               <span
//                 className={`text-sm font-normal cursor-pointer ${selectedOption === option ? "text-black" : "text-[#A7A7A7]"
//                   }`}
//               >
//                 {option}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// );



import React from "react";
import DashboardCards from "../../dynamic components/DashboardCards.jsx";
import BalanceChart from "../../dynamic components/BalanceChart.jsx";
import ImportantNumbers from "../../dynamic components/ImportantNumbers.jsx";
import PendingMaintenances from "../../dynamic components/PendingMaintenances.jsx";
import ComplaintList from "../../dynamic components/ComplaintList.jsx";
import UpcomingActivity from "../../dynamic components/UpcomingActivity.jsx";

const Dashboard = ({ userInfo, societyId }) => {
  console.log(userInfo)
  return (
    <>
      <div className="overflow-auto static z-0 p-[0px] h-full bg-[#F0F5FB]">
        <div className="flex flex-col gap-3">
          <div className="start-row">
            <DashboardCards />
          </div>

          <div className="center-row grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
            <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-6">
              <BalanceChart />
            </div>

            <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 h-full">
              <ImportantNumbers userInfo={userInfo} societyId={societyId}
              />
            </div>

            <div className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 h-full">
              <PendingMaintenances userInfo={userInfo} societyId={societyId} />
            </div>
          </div>

          <div className="end-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="col-span-1 sm:col-span-2 lg:col-span-9">
              <ComplaintList
              />
            </div>
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 h-full">
              <UpcomingActivity userInfo={userInfo} societyId={societyId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

