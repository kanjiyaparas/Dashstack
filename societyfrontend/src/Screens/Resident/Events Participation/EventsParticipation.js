// import Paper from '@mui/material/Paper';
// import { Avatar, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Slide } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import apiHelper from "../../../Common/ApiHelper"
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import AddHomeIcon from '@mui/icons-material/AddHome';
// import PersonIcon from '@mui/icons-material/Person';
// import ThreePIcon from '@mui/icons-material/ThreeP';
// import { useNavigate } from 'react-router-dom';
// import BeenhereIcon from '@mui/icons-material/Beenhere';
// import Loader from '../../../Component/Loader/Loader';


// export default function EventsParticipation({ userInfo }) {
//   const [isLoading, setisLoading] = useState(false)
//   const navigate = useNavigate()
//   const [Submission, setSubmission] = useState("Event")
//   const [Participer, setParticiper] = useState([])

//   async function geteventParticiper() {
//     try {
//       setisLoading(true)
//       const result = await apiHelper.completedEvent(userInfo?.societyData?._id)
//       setParticiper(result?.data?.data)
//       setisLoading(false)
//     } catch (error) {
//       setisLoading(false)
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     geteventParticiper()
//   }, []);

//   console.log(Participer)

//   return <>
//     <div className='d-flex'>
//       <button onClick={() => setSubmission("Event")} className={Submission === "Event" ? "btn btn_primary" : "btn btn_outline"}>Events Participate</button>
//       <button onClick={() => setSubmission("Activity")} className={Submission === "Activity" ? "btn btn_primary" : "btn btn_outline"}>Activity Participate</button>
//     </div>
//     <Paper className='p-2' >
//       <div className="d-flex justify-content-between p-3 align-items-center">
//         <div className="h4" style={{ fontSize: "20px" }}>Events Participation</div>
//       </div>
//       <TableContainer>
//         <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
//           <TableHead style={{ background: "aliceblue" }}>
//             <TableRow>
//               <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Participator Name</TableCell>
//               <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Description</TableCell>
//               <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Event Date</TableCell>
//               <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Event Time</TableCell>
//               <TableCell style={{ fontSize: "12px", fontWeight: "bold" }} align="center">Event Name</TableCell>
//             </TableRow>
//           </TableHead>
//           {isLoading ? (
//             <Loader message="Please wait, we are fetching data..." />
//           ) : (
//             <TableBody>
//               {Participer?.map((row) => (
//                 <TableRow
//                   key={row._id}
//                   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                 >
//                   <TableCell component="th" scope="row" className='d-flex align-items-center justify-content-evenly'>
//                     <Avatar alt="Remy Sharp" src={row?.memberId?.profileImage} /> <span>  {row?.memberId?.userId?.fullName}</span>
//                   </TableCell>
//                   <TableCell align="center">{row?.eventId?.description}</TableCell>
//                   <TableCell align="center">{row?.eventId?.date?.split("T")[0]}</TableCell>
//                   <TableCell align="center"><span style={{ background: "lightgrey", borderRadius: "10%", padding: "5px 8px" }}>{"8:00 PM"}</span></TableCell>
//                   <TableCell align="center">{row.eventId?.title}</TableCell>

//                 </TableRow>
//               ))}
//             </TableBody>)}
//         </Table>
//       </TableContainer>
//     </Paper>
//   </>
// }

import Paper from '@mui/material/Paper';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import apiHelper from "../../../Common/ApiHelper";
import Loader from '../../../Component/Loader/Loader';
import { useMediaQuery } from '@mui/material';

export default function EventsParticipation({ userInfo }) {
  const [isLoading, setisLoading] = useState(false);
  const [Participer, setParticiper] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width:768px)'); // Media Query to determine screen size

  async function geteventParticiper() {
    try {
      setisLoading(true);
      const result = await apiHelper.completedEvent(userInfo?.societyData?._id);
      setParticiper(result?.data?.data);
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    geteventParticiper();
  }, []);

  return (
    <>
      {/* Section for the header/buttons */}
      <div className='d-flex'>
        {/* Responsive buttons */}
        <button className="btn btn_primary">Events Participate</button>
      </div>

      {/* Paper container */}
      <Paper className="p-2">
        <div className="d-flex justify-content-between p-3 align-items-center">
          <div className="h4" style={{ fontSize: '20px' }}>Events Participation</div>
        </div>

        {/* Wrap the table inside scrollable div to ensure responsiveness */}
        <div style={{
          overflowX: 'auto',
          maxWidth: '100%',
          border: 0,
        }}>
          <TableContainer>
            <Table sx={{ minWidth: 650, border: 0 }} aria-label="simple table">
              {/* Table Header */}
              <TableHead style={{ background: 'aliceblue' }}>
                <TableRow>
                  <TableCell style={{ fontSize: '12px', fontWeight: 'bold' }} align="center">Participator Name</TableCell>
                  <TableCell style={{ fontSize: '12px', fontWeight: 'bold' }} align="center">Description</TableCell>
                  <TableCell style={{ fontSize: '12px', fontWeight: 'bold' }} align="center">Event Date</TableCell>
                  <TableCell style={{ fontSize: '12px', fontWeight: 'bold' }} align="center">Event Time</TableCell>
                  <TableCell style={{ fontSize: '12px', fontWeight: 'bold' }} align="center">Event Name</TableCell>
                </TableRow>
              </TableHead>

              {/* Loading state */}
              {isLoading ? (
                <Loader message="Please wait, we are fetching data..." />
              ) : (
                <TableBody>
                  {/* Map over participants to display rows */}
                  {Participer?.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" className="d-flex align-items-center justify-content-center">
                        <Avatar alt="Remy Sharp" src={row?.memberId?.profileImage} />
                        <span style={{ paddingLeft: '8px' }}>{row?.memberId?.userId?.fullName}</span>
                      </TableCell>
                      <TableCell align="center" className="truncate-text">{row?.eventId?.description}</TableCell>
                      <TableCell align="center">{row?.eventId?.date?.split("T")[0]}</TableCell>
                      <TableCell align="center">
                        <span style={{ background: 'lightgrey', borderRadius: '10%', padding: '5px 8px' }}>8:00 PM</span>
                      </TableCell>
                      <TableCell align="center">{row.eventId?.title}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
      </Paper>

      <style>{`
        .truncate-text {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 120px; /* Adjust this value to control description width */
        }
      `}</style>
    </>
  );
}
