const express = require('express')
const { Server } = require('socket.io');
const http = require('http');
const cors = require("cors")
const dotenv = require('dotenv')
const connection = require('./Config/db')
const societyRouter = require('./Society/SocietyRouter')
const societyHandlerRouter = require('./SocietyHandler/SocietyHandlerRouter')
const wingRouter = require('./Wing/WingRouter')
const unitRouter = require('./Unit/UnitRouter')
const memberRouter = require('./Society Member/MemberRouter')
const importantRouter = require('./importantnumber/ImportantRouter')
const maintenanceRouter = require('./Maintenance/MaintenanceRouter')
const eventRouter = require('./Events/EventRouter')
const securityRouter = require('./Security/SecurityRouter')
const securityProtocolRouter = require('./SecurityProtocol/SecurityProtocolRouter')
const eventDetailsRouter = require('./EventDetails/EventDetalisRouter')
const maintenanceDetailsRouter = require('./MaintenanceDetails/MaintenanceDetailsRouter')
const complaintRouter = require('./Complaint/ComplaintRouter')
const expanseRouter = require('./Expanse/ExpanseRouter')
const expanseNoteRouter = require('./ExpanseNote/ExpanseNoteRouter')
const announcementRouter = require('./Announcement/AnnouncementRouter')
const visitorRouter = require('./Visitor/VisitorRouter')
const userRouter = require('./Users/UserRouter')
const facilityRouter = require('./Facility/FacilityRouter')
const { cloudinary } = require('./cloudinaryConfig')
const { httpSuccess, extractPublicId } = require('./constents')
const session = require('express-session');
const notificationRouter = require('./Notification/NotificationRouter');
const { Schema, default: mongoose } = require('mongoose');



dotenv.config()
const app = express()
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend app URL
    methods: ["GET", "POST"]
  }
});


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Session expires in 15 minutes
}));


connection()

app.use("/society", societyRouter)
app.use("/society-handler", societyHandlerRouter)
app.use("/wing", wingRouter)
app.use("/unit", unitRouter)
app.use("/member", memberRouter)
app.use('/workernumber', importantRouter)
app.use('/maintain', maintenanceRouter)
app.use('/maintain-detail', maintenanceDetailsRouter)
app.use('/event', eventRouter)
app.use('/event-details', eventDetailsRouter)
app.use('/security', securityRouter)
app.use('/securityprotocol', securityProtocolRouter)
app.use('/user', userRouter)
app.use('/complain', complaintRouter)
app.use('/expanse', expanseRouter)
app.use('/expanseNote', expanseNoteRouter)
app.use('/announcement', announcementRouter)
app.use('/visitor', visitorRouter)
app.use('/facility', facilityRouter)
app.use("/notify", notificationRouter)
// const Grid = require('gridfs-stream');


app.post('/image-details', async (req, res) => {
  try {
    const imageDetailsPromises = Object.entries(req.body).map(async ([key, url]) => {
      const publicId = extractPublicId(url);
      const result = await cloudinary.api.resource(publicId);
      return { key, details: result };
    });

    const results = await Promise.all(imageDetailsPromises);

    const formattedResults = results.reduce((acc, { key, details }) => {
      acc[key] = details;
      return acc;
    }, {});

    return res.status(200).send({ message: httpSuccess, data: formattedResults });
  } catch (error) {
    console.error('Error fetching image details:', error);
    return res.status(500).send({ message: 'Error fetching image details', error });
  }
});


app.get("/", (req, res) => {
  return res.status(200).send({ message: "Success" })
})


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for incoming messages
  socket.on('sendMessage', (message) => {
    console.log('Received message:', message);
    // Broadcast to all clients
    socket.broadcast.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started")
})
