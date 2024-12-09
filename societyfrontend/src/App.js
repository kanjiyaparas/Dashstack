import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Component/Layout';
import ResidentScreen from './Screens/Resident Screen/ResidentScreen';
import MemberRegister from './Screens/Member Register/MemberRegister';
import IncomeScreen from './Screens/Finacial Screen/Income/IncomeScreen';
import DashboardScreen from './Screens/Dashboard/DashboardScreen';
import LoginScreen from './Screens/LoginScreen/LoginScreen';
import RegisterScreen from './Screens/LoginScreen/RegisterScreen';
import jwt from 'jsonwebtoken';
import React, { useEffect, useState } from 'react';
import Path from './Common/Path';
import FacilityManagement from './Screens/Facility Screen/FacilityScreen';
import ExpensesScreen from './Screens/Finacial Screen/Expenses/ExpensesScreen';
import EventScreen from './Screens/Finacial Screen/Income/EventScreen';
import NoteScreen from './Screens/Finacial Screen/Notes/NoteScreen';
import AnnouncementScreen from './Screens/Announcement/Announcement';
import VisitorScreen from './Screens/Security Management/VisitorScreen';
import SecurityProtocol from './Screens/Security Management/SecurityProtocol';
import CreateComplaint from './Screens/Complaint Tracking/CreateComplaint';
import RequestTracking from './Screens/Complaint Tracking/RequestTracking';
import UpdateMember from './Screens/Member Register/UpdateMember';
import SecurityGaurdScreen from './Screens/Security Gaurd/SecurityGaurdScreen';
import PersonalDetailScreen from './Screens/Resident/Personal Detail/PersonalDetailScreen';
import ServiceComplaint from './Screens/Resident/Service And Complaint/ServiceComplaint';
import EventsParticipation from './Screens/Resident/Events Participation/EventsParticipation';
import MaintenanceInvoices from './Screens/Resident/Payment Portal/MaintenanceInvoices';
import OtherIncomeInvoice from './Screens/Resident/Payment Portal/OtherIncomeInvoice';
import AccessForums from './Screens/Resident/Community/AccessForums';
import PollsScreen from './Screens/Resident/Community/PollsScreen';
import CommunitiesDiscussion from './Screens/Resident/Community/CommunitiesDiscussion';
import EmergencyManagement from './Screens/Security Admin/Security/EmergencyManagement';
import MaintenanceTable from './Screens/Resident/Payment Portal/Invoice Table/MaintenanceTable';
import OtherIncomeTable from './Screens/Resident/Payment Portal/Invoice Table/OthersIncomTable';
import ForgotPassword from './Screens/LoginScreen/ForgotPassword';
import OtpPage from './Screens/LoginScreen/OtpPage';
import ResetPassword from './Screens/LoginScreen/ResetPassword';
import EditProfile from './Screens/Profilescreen/EditProfile';
import { Navigate } from 'react-router-dom';
import { NotificationProvider, useNotification } from './Component/NotificationContext';

function ProtectedRoute({ auth, children }) {
  return auth ? children : <Navigate to={Path.LoginScreen} replace />;
}

function App() {
  // const {notify} = useNotification(); // Access notify from context
  console.log(useNotification());
  const JWTDECODE = (arg) => {
    try {
      return jwt.decode(arg)
    } catch (error) {
      console.log(error)
    }
  }



  const [societyId, setsocietyId] = React.useState("");

  async function getSociety() {
    try {
      if (userInfo?.role === "Chairman") {
        setsocietyId(userInfo?.societyData?.selectSociety)
      } else if (userInfo?.role === "Member") {
        setsocietyId(userInfo?.societyData?.societyId)
      } else {
        setsocietyId(null)
      }
    } catch (error) {
      console.log(error)
    }
  }


  React.useEffect(() => {
    getSociety()
  }, []);


  const [userInfo, setuserInfo] = useState(JWTDECODE(localStorage.getItem("token")))
  const [Auth, setAuth] = useState(localStorage.getItem("token"))

  useEffect(() => {
    setAuth(localStorage.getItem("token"))
    setuserInfo(JWTDECODE(localStorage.getItem("token")))
    setsocietyId(userInfo?.societyData?.selectSociety)
    // eslint-disable-next-line
  }, [localStorage.getItem("token")])

  return (
    <NotificationProvider userInfo={userInfo}>
      <BrowserRouter>
        <Routes>
          <Route path={Path.RegisterScreen} element={<RegisterScreen Auth={Auth} setAuth={setAuth} userInfo={userInfo} />} />
          <Route path={Path.ForgotPassword} element={<ForgotPassword Auth={Auth} setAuth={setAuth} userInfo={userInfo} />} />
          <Route path={Path.OtpPage} element={<OtpPage Auth={Auth} setAuth={setAuth} userInfo={userInfo} />} />
          <Route path={Path.updatePassword} element={<ResetPassword Auth={Auth} setAuth={setAuth} userInfo={userInfo} />} />

          <Route path={Path.LoginScreen} element={Auth ? <Navigate to={Path.DashboardScreen} replace /> : <LoginScreen Auth={Auth} setAuth={setAuth} />} />

          <Route path={Path.DashboardScreen} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<DashboardScreen societyId={societyId} userInfo={userInfo}
              setAuth={setAuth} />} />
          </ProtectedRoute>} />

          <Route path={Path.ResidentScreen} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<ResidentScreen societyId={societyId}
              userInfo={userInfo} setAuth={setAuth} />} /></ProtectedRoute>} />

          <Route path={Path.EditProfile} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<EditProfile societyId={societyId}
              userInfo={userInfo} setAuth={setAuth} />} /></ProtectedRoute>} />

          <Route path={Path.MemberRegister} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<MemberRegister societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.UpdateMember} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<UpdateMember societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.IncomeScreen} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<IncomeScreen societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.EventScreen} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<EventScreen societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.expenses} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<ExpensesScreen societyId={societyId} />} /> </ProtectedRoute>} />

          <Route path={Path.note} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<NoteScreen societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.FacilitiScreen} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<FacilityManagement societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.createComplaint} element={<ProtectedRoute auth={Auth}>
            <Layout setAuth={setAuth} userInfo={userInfo} component={<CreateComplaint societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.requestTraking} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<RequestTracking societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.visitor} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<VisitorScreen societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.securityProtocol} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<SecurityProtocol societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.securityGaurd} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<SecurityGaurdScreen societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.announcement} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<AnnouncementScreen societyId={societyId} />} /></ProtectedRoute>} />

          {/* Resident  */}
          <Route path={Path.personDetails} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<PersonalDetailScreen userInfo={userInfo} societyId={societyId} />} /> </ProtectedRoute>} />

          <Route path={Path.service} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<ServiceComplaint userInfo={userInfo} societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.event} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<EventsParticipation userInfo={userInfo} societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.access} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<AccessForums societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.polls} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<PollsScreen societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.decesion} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<CommunitiesDiscussion societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.maintenanceInvoices} element={<ProtectedRoute auth={Auth}><Layout setAuth={setAuth} userInfo={userInfo} component={<MaintenanceInvoices userInfo={userInfo} societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.tableMaintenanceInvoices} element={<ProtectedRoute auth={Auth}><Layout userInfo={userInfo} setAuth={setAuth} component={<MaintenanceTable userInfo={userInfo} societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.otherInvoices} element={<ProtectedRoute auth={Auth}><Layout userInfo={userInfo} setAuth={setAuth} component={<OtherIncomeInvoice societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

          <Route path={Path.tableOtherInvoices} element={<ProtectedRoute auth={Auth}><Layout userInfo={userInfo} setAuth={setAuth} component={<OtherIncomeTable userInfo={userInfo} societyId={societyId} />} /></ProtectedRoute>} />

          <Route path={Path.emergency} element={<ProtectedRoute auth={Auth}><Layout userInfo={userInfo} setAuth={setAuth} component={<EmergencyManagement societyId={societyId} userInfo={userInfo} />} /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
