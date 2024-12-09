import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Logout from '@mui/icons-material/Logout';
import { Account } from '@toolpad/core/Account';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import SecurityIcon from '@mui/icons-material/Security';
import Path from '../Common/Path';
import { Avatar } from '@mui/material';
import Badge from '@mui/material/Badge';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import apiHelper from '../Common/ApiHelper';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'whitesmoke',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const drawerWidth = window.innerWidth > 998 ? 300 : 240;

export default function Layout({ component, userInfo, setAuth, notify },) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const [session, setSession] = React.useState({});
  // const authentication = React.useMemo(() => {
  //   return {
  //     signIn: () => {
  //       setSession({
  //         user: {
  //           name: userInfo?.fullName,
  //           email: userInfo?.email,
  //           image: 'https://avatars.githubusercontent.com/u/19550456',
  //         },
  //       });
  //     },
  //     signOut: () => {
  //       setSession(null);
  //     },
  //   };
  // }, []);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };


  const drawer = (
    <div className='drawer'>
      <Toolbar />
      <Divider />
      {
        userInfo && userInfo.role === "Chairman" ? <List>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === "/dashboard" ? "selected_tab" : ""}></div>
            <Link to={"/dashboard"} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === "/dashboard" ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <DashboardIcon className={location.pathname === "/dashboard" ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Dashboard"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === "/resident" ? "selected_tab" : ""}></div>
            <Link to={"/resident"} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === "/resident" ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <HomeWorkIcon className={location.pathname === "/resident" ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Resident Management"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className="d-flex justify-content-between">
            <Accordion style={{ width: "100%" }}>
              <AccordionSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>
                  <Link to={Path.IncomeScreen}>
                    <ListItemButton className={location.pathname === Path.IncomeScreen || location.pathname === Path.EventScreen || location.pathname === Path.expenses || location.pathname === Path.note || location.pathname === Path.EventView ? "btn btn_primary" : ""}>
                      <ListItemIcon>
                        <LocalAtmIcon className={location.pathname === Path.IncomeScreen || location.pathname === Path.EventScreen || location.pathname === Path.expenses || location.pathname === Path.note || location.pathname === Path.EventView ? "text-light" : ""} />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "14px",
                          fontWeight: "bold"
                        }}
                        primary={"Financial Management"} />
                    </ListItemButton>
                  </Link>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List className='mx-4 p-0'>
                  <div>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.IncomeScreen || location.pathname === Path.EventScreen || location.pathname === Path.EventView ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.IncomeScreen} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.IncomeScreen || location.pathname === Path.EventScreen || location.pathname === Path.EventView ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Income"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.expenses ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.expenses} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.expenses ? "btn btn_primary" : ""} >
                          <ListItemText
                            primary="Expanse"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding>
                      <div className={location.pathname === Path.note ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.note} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.note ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Notes"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </div>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === `${Path.FacilitiScreen}` ? "selected_tab" : ""}></div>
            <Link to={Path.FacilitiScreen} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === `${Path.FacilitiScreen}` ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <CorporateFareIcon className={location.pathname === `${Path.FacilitiScreen}` ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Facility Management"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className="d-flex justify-content-between">
            <Accordion style={{ width: "100%" }}>
              <AccordionSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>
                  <ListItemButton className={location.pathname === Path.createComplaint || location.pathname === Path.requestTraking ? "btn btn_primary" : ""}>
                    <ListItemIcon>
                      <SmsFailedIcon className={location.pathname === Path.createComplaint || location.pathname === Path.requestTraking ? "text-light" : ""} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                      primary={"Complaint Tracking"} />
                  </ListItemButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List className='mx-4 p-0'>
                  <div>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.createComplaint ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.createComplaint} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.createComplaint ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Create Complaint"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.requestTraking ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.requestTraking} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.requestTraking ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Request Tracking"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </div>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding className="d-flex justify-content-between">
            <Accordion style={{ width: "100%" }}>
              <AccordionSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>
                  <ListItemButton className={location.pathname === Path.visitor || location.pathname === Path.securityProtocol ? "btn btn_primary" : ""}>
                    <ListItemIcon>
                      <LocalPoliceIcon className={location.pathname === Path.visitor || location.pathname === Path.securityProtocol ? "text-light" : ""} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                      primary={"Security Management"} />
                  </ListItemButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List className='mx-4 p-0'>
                  <div>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.visitor ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.visitor} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.visitor ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Visitor Logs"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.securityProtocol ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.securityProtocol} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.securityProtocol ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Security Protocols"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </div>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === Path.securityGaurd ? "selected_tab" : ""}></div>
            <Link to={Path.securityGaurd} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === Path.securityGaurd ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <AdminPanelSettingsIcon className={location.pathname === Path.securityGaurd ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Security Guard"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === Path.announcement ? "selected_tab" : ""}></div>
            <Link to={Path.announcement} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === Path.announcement ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <AnnouncementIcon className={location.pathname === Path.announcement ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Announcement"} />
              </ListItemButton>
            </Link>
          </ListItem>
        </List> : userInfo && userInfo.role === "Member" ? <List>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === Path.DashboardScreen ? "selected_tab" : ""}></div>
            <Link to={Path.DashboardScreen} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === Path.DashboardScreen ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <DashboardIcon className={location.pathname === Path.DashboardScreen ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Dashboard"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === Path.personDetails ? "selected_tab" : ""}></div>
            <Link to={Path.personDetails} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === Path.personDetails ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <InfoIcon className={location.pathname === Path.personDetails ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Person Details"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === Path.service ? "selected_tab" : ""}></div>
            <Link to={Path.service} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === Path.service ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <MiscellaneousServicesIcon className={location.pathname === Path.service ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Service And Complaint"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === Path.event ? "selected_tab" : ""}></div>
            <Link to={Path.event} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === Path.event ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <InsertInvitationIcon className={location.pathname === Path.event ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Events Participation"} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem disablePadding className="d-flex justify-content-between">
            <Accordion style={{ width: "100%" }}>
              <AccordionSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography style={{ width: "100%" }}>
                  <ListItemButton className={location.pathname === Path.access || location.pathname === Path.polls || location.pathname === Path.decesion ? "btn btn_primary w-100" : "w-100"}>
                    <ListItemIcon>
                      <WhatsAppIcon className={location.pathname === Path.access || location.pathname === Path.polls || location.pathname === Path.decesion ? "text-light" : ""} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                      primary={"Community"} />
                  </ListItemButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List className='mx-4 p-0'>
                  <div>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.access ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.access} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.access ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Access Forums"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.polls ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.polls} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.polls ? "btn btn_primary" : ""} >
                          <ListItemText
                            primary="Polls"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding>
                      <div className={location.pathname === Path.decesion ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.decesion} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.decesion ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Communities Discussion"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </div>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding className="d-flex justify-content-between">
            <Accordion style={{ width: "100%" }}>
              <AccordionSummary
                // expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography style={{ width: "100%" }}>
                  <ListItemButton className={location.pathname === Path.maintenanceInvoices || location.pathname === Path.otherInvoices ? "btn btn_primary" : ""}>
                    <ListItemIcon>
                      <LocalAtmIcon className={location.pathname === Path.maintenanceInvoices || location.pathname === Path.otherInvoices ? "text-light" : ""} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: "bold"
                      }}
                      primary={"Payment Portal"} />
                  </ListItemButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List className='mx-4 p-0'>
                  <div>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.maintenanceInvoices ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.maintenanceInvoices} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.maintenanceInvoices ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Maintenance Invoices"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.otherInvoices ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.otherInvoices} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.otherInvoices ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Other Income Invoice"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </div>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
          <ListItem disablePadding className='d-flex justify-content-between'>
            <div className={location.pathname === Path.securityProtocol ? "selected_tab" : ""}></div>
            <Link to={Path.securityProtocol} style={{ width: "96%", padding: "5px" }} >
              <ListItemButton className={location.pathname === Path.securityProtocol ? "btn btn_primary" : ""}>
                <ListItemIcon>
                  <SecurityIcon className={location.pathname === Path.securityProtocol ? "text-light" : ""} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}
                  primary={"Security Protocols"} />
              </ListItemButton>
            </Link>
          </ListItem>
        </List> : <List>
          <ListItem disablePadding className="d-flex justify-content-between w-100">
            <Accordion style={{ width: "100%" }}>
              <AccordionSummary
                className='w-100'
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography className='w-100'>
                  <ListItemButton className={location.pathname === Path.visitor || Path.emergency ? "btn btn_primary w-100" : "w-100"}>
                    <ListItemIcon>
                      <LocalAtmIcon className={location.pathname === Path.visitor || Path.emergency ? "text-light" : ""} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                      primary={"Security"} />
                  </ListItemButton>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List className='mx-4 p-0'>
                  <div>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.visitor ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.visitor} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.visitor ? "btn btn_primary" : ""}>
                          <ListItemText
                            primary="Visitor Tracking"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                    <ListItem disablePadding className='p-0'>
                      <div className={location.pathname === Path.emergency ? "selected_subtab" : "notSelected_subtab"}></div>
                      <Link to={Path.emergency} style={{ width: "100%", padding: "5px" }}>
                        <ListItemButton className={location.pathname === Path.emergency ? "btn btn_primary" : ""} >
                          <ListItemText
                            primary="Emergency Management"
                            primaryTypographyProps={{
                              fontSize: "13px",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  </div>
                </List>
              </AccordionDetails>
            </Accordion>
          </ListItem>
        </List>
      }

    </div>
  );


  const handleNavigation = (type) => {
    switch (type) {
      case "Complain":
        navigate(Path.createComplaint);
        setOpen(false)
        break;
      case "Request":
        navigate(Path.requestTraking);
        setOpen(false)
        break;
      case "Event":
        navigate(Path.EventScreen);
        setOpen(false)
        break;
      case "Maintenance":
        navigate(Path.IncomeScreen);
        setOpen(false)
        break;
      default:
        break;
    }
  };

  // const location = useLocation();

  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Split the path into segments
  const pathSegments = location.pathname.split("/").filter((segment) => segment);



  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: "100%" },
          ml: { sm: `${drawerWidth}px` },
          zIndex: 1200,
          background: "white",
          color: 'black'
        }}
      >
        <Toolbar className='d-flex justify-content-between row'>
          <div className='d-flex col-6'>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography noWrap component="div" sx={{ width: `${drawerWidth}px` }}>
              <span className='h4 fw-bold'>Dash</span>
              <span className='h4 fw-bold' style={{ color: "#FE512E" }}>Stack</span>
            </Typography>
            {location.pathname === Path.DashboardScreen ? <Search className='d-none d-md-block'>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search> : <div className="d-flex">
              <div className="text-muted">{"Home >"}</div>

              {pathSegments.map((segment, index) => (
                <div key={index} className={`ms-1 ${index === pathSegments.length - 1 ? "text-primary" : "text-muted"}`}>
                  {index > 0 && " >"} {capitalizeFirstLetter(segment)}
                </div>
              ))}
            </div>}
          </div>
          <div className='col-6 d-flex justify-content-end align-items-center'>
            <div onClick={handleOpen} className='border p-1' style={{ borderRadius: "8px" }}>
              <Badge badgeContent={notify?.length} color="primary">
                <NotificationsIcon color="action" />
              </Badge>
            </div>
            <ul style={{ listStyle: "none" }}>
              <li className="px-2 py-1 border-0">
                <div className="icons d-flex gap-3 align-items-center justify-content-start">
                  <div>
                    <Avatar alt={userInfo?.fullName} src={userInfo.societyData.profileImage ? userInfo.societyData.profileImage : userInfo?.fullName} />
                  </div>
                  <div style={{ position: 'relative', zIndex: "2", top: 0 }} className="d-flex flex-column align-items-start icon_hover">
                    <span style={{ fontSize: "1.0rem", cursor: "pointer", fontWeight: 'bold' }} >{!userInfo ? "Profile" : userInfo.fullName}</span>
                    <span className='text-muted' style={{ fontSize: "0.7rem", cursor: "pointer" }} >{!userInfo ? "Profile" : userInfo.role}</span>
                    <ul style={{ listStyle: "none", background: "white", position: "absolute", marginTop: "2.5rem", zIndex: 1, width: "160px", padding: "1rem", borderRadius: '8px', lineHeight: '28px' }} className="shadow-lg hover_box">
                      <li className="border-0">
                        {/* <span className='text-dark' style={{ fontSize: "0.9rem", cursor: "pointer" }} >{!userInfo ? "Profile" : userInfo.fullName}</span> */}
                        {
                          userInfo ? <button onClick={() => {
                            localStorage.removeItem("token")
                            setAuth(null)
                            navigate(Path.LoginScreen)

                          }} className="w-100 rounded-2 btn_outline" style={{ paddingTop: "0.3rem", paddingBottom: "0.3rem", fontWeight: 700, }}>Sign Out</button> : <button className="btn w-100 btn_outline" onClick={() => navigate(Path.LoginScreen)}>Sign In</button>
                        }
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, zIndex: 1000 }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          className='drawer'
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, background: "whitesmoke", minHeight: "100vh" }}
      >
        <Toolbar />
        {
          component
        }
      </Box>

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Notification
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <div className="row">
                {
                  notify?.map((data) => {
                    return <div onClick={() => handleNavigation(data.type)} key={data._id} className="col-12 my-2">
                      <div className="card p-2" style={{ border: "2px solid #FE512E", background: "white" }}>
                        <div className='d-flex justify-between align-middle'>
                          <div className="fw-bold" style={{ fontSize: "15px", color: " #FE512E" }}>{data?.title}</div>
                          <div>
                            <CloseIcon style={{ fontSize: "20px", color: " #FE512E" }} />
                          </div>
                        </div>
                        <div style={{ fontSize: "14px" }} className="dis_name d-flex gap-2 align-middle">
                          <span> {data?.memberId?.userId?.fullName}</span>
                          <span className='text-muted'>({data?.memberId?.userId?.phoneNumber})</span>
                          <span style={{ border: "2px solid #FE512E", borderRadius: "5px", padding: "0px 0px", paddingRight: "4px", overflow: "hidden" }}>
                            <span style={{ background: "#FE512E", padding: "2px 3px", color: "white", height: "100%" }}>{data?.memberId?.wing?.wingName}</span>
                            <span>{data?.memberId?.unit?.unitNumber}</span>
                          </span>
                        </div>
                        <div style={{ fontSize: "14px", }} className="dis_content text-muted">
                          {data?.Description}
                        </div>
                      </div>
                    </div>
                  })
                }


              </div>
            </Typography>
          </Box>
        </Modal>
      </div>
    </Box>
  );
}