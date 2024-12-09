
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   TextField,
//   IconButton,
//   Avatar,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Typography,
// } from '@mui/material';
// import {
//   Send as SendIcon,
//   Mic as MicIcon,
//   Phone as PhoneIcon,
//   MoreVert as MoreVertIcon,
//   VideoCall as VideoCallIcon,
//   AttachFile as AttachFileIcon,
// } from '@mui/icons-material';
// import apiHelper from '../../../Common/ApiHelper';

// const ChatApp = ({ userInfo, societyId }) => {
//   console.log(userInfo);

//   const [chats, setChats] = useState({});
//   const [currentChat, setCurrentChat] = useState('');
//   const [currentChatProfileImage, setCurrentChatProfileImage] = useState(''); // State for storing current chat's user profile image
//   const [inputMessage, setInputMessage] = useState('');
//   const [memberlist, setMemberList] = useState([]);

//   console.log(memberlist);

//   const chatmember = async () => {
//     try {
//       const result = await apiHelper.getmemberchat(userInfo?.societyData?.societyId);
//       if (result) {
//         setMemberList(result.data.data);

//         // Dynamically initialize the chats for each fetched user
//         const initialChatsState = {};
//         result.data.data.forEach((member) => {
//           initialChatsState[member?.userId?.fullName] = [];
//         });
//         setChats(initialChatsState);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleSend = () => {
//     if (inputMessage.trim()) {
//       setChats({
//         ...chats,
//         [currentChat]: [
//           ...chats[currentChat],
//           { sender: 'Me', text: inputMessage, time: 'Now', type: 'sent' },
//         ],
//       });
//       setInputMessage('');
//     }
//   };

//   const handleUserClick = (member) => {
//     setCurrentChat(member?.userId?.fullName);
//     setCurrentChatProfileImage(
//       member?.profileImage ? member?.profileImage : 'https://via.placeholder.com/40' // Fallback to placeholder if no image exists
//     );
//   };

//   useEffect(() => {
//     chatmember();
//   }, []);

//   return (
//     <Box className="chat-app" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '87vh' }}>
//       {/* Sidebar */}
//       <Box
//         sx={{
//           width: { xs: '100%', md: '25%' },
//           bgcolor: 'white',
//           p: 2,
//           borderRight: { md: '1px solid #ddd' },
//           overflowY: 'auto',
//         }}
//       >
//         <TextField
//           fullWidth
//           placeholder="Search Here"
//           variant="outlined"
//           size="small"
//           sx={{ mb: 2 }}
//         />
//         <List>
//           {memberlist.map((member) => (
//             <ListItem
//               key={member?.userId?.fullName}
//               button
//               onClick={() => handleUserClick(member)} // Update header info on click
//               selected={currentChat === member?.userId?.fullName}
//               sx={{
//                 bgcolor: currentChat === member?.userId?.fullName ? '#e3f2fd' : 'transparent',
//               }}
//             >
//               <ListItemAvatar>
//                 <Avatar alt={member?.userId?.fullName} src={member?.profileImage} />
//               </ListItemAvatar>
//               <ListItemText primary={member?.userId?.fullName} secondary="Last message preview..." />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Chat Window */}
//       <Box
//         sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           bgcolor: 'white',
//           height: '100%',
//         }}
//       >
//         {/* Static Header */}
//         <Box
//           sx={{
//             p: 2,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             borderBottom: '1px solid #ddd',
//             position: 'sticky',
//             top: 0,
//             bgcolor: 'white',
//             zIndex: 1,
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* Dynamically render the selected user's avatar and name */}
//             <Avatar src={currentChatProfileImage} sx={{ mr: 2 }} />
//             <Box>
//               <Typography variant="subtitle1">{currentChat || 'Select A User For Chat'}</Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {currentChat ? 'Active now' : ''}
//               </Typography>
//             </Box>
//           </Box>
//           <Box>
//             <IconButton>
//               <PhoneIcon />
//             </IconButton>
//             <IconButton>
//               <VideoCallIcon />
//             </IconButton>
//             <IconButton>
//               <MoreVertIcon />
//             </IconButton>
//           </Box>
//         </Box>

//         {/* Messages */}
//         <Box
//           sx={{
//             flex: 1,
//             p: 2,
//             overflowY: 'auto',
//             bgcolor: '#f9f9f9',
//           }}
//         >
//           {chats[currentChat]?.map((msg, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: 'flex',
//                 justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start',
//                 mb: 2,
//               }}
//             >
//               <Box
//                 sx={{
//                   bgcolor: msg.type === 'sent' ? '#1976d2' : '#e0e0e0',
//                   color: msg.type === 'sent' ? 'white' : 'black',
//                   p: 1.5,
//                   borderRadius: 2,
//                   maxWidth: '70%',
//                 }}
//               >
//                 <Typography variant="body1">{msg.text}</Typography>
//                 <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
//                   {msg.time}
//                 </Typography>
//               </Box>
//             </Box>
//           ))}
//         </Box>

//         {/* Input */}
//         <Box
//           sx={{
//             p: 2,
//             borderTop: '1px solid #ddd',
//             display: 'flex',
//             alignItems: 'center',
//           }}
//         >
//           <IconButton>
//             <AttachFileIcon />
//           </IconButton>
//           <TextField
//             fullWidth
//             variant="outlined"
//             size="small"
//             placeholder="Type a message..."
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             sx={{ mx: 2 }}
//           />
//           <IconButton color="primary" onClick={handleSend}>
//             <SendIcon />
//           </IconButton>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ChatApp;

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {
  Box,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Send as SendIcon,
  Mic as MicIcon,
  Phone as PhoneIcon,
  MoreVert as MoreVertIcon,
  VideoCall as VideoCallIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import apiHelper from '../../../Common/ApiHelper';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Socket.IO client connection
let socket;

const ChatApp = ({ userInfo, societyId }) => {
  console.log(userInfo);

  const [chats, setChats] = useState({});
  const [currentChat, setCurrentChat] = useState('');
  const [currentChatProfileImage, setCurrentChatProfileImage] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [memberlist, setMemberList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const fileCameraInputRef = useRef();
  const [file, setFile] = useState(null);

  console.log(memberlist);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent unintended behavior
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      console.log('File selected: ', file.name);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  // Handle camera upload button click
  const handlePhotoClick = () => {
    fileCameraInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Photo selected: ', file.name);
    }
  };


  useEffect(() => {
    socket = io('http://localhost:5000');

    socket.on('receive_message', (data) => {
      const { from, text } = data;
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChats((prevChats) => ({
        ...prevChats,
        [from]: [
          ...(prevChats[from] || []),
          { sender: from, text, time: currentTime, type: 'received' },
        ],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chatmember = async () => {
    try {
      const result = await apiHelper.getmemberchat(userInfo?.societyData?.societyId, userInfo?._id);
      if (result) {
        setMemberList(result.data.data);

        const initialChatsState = {};
        result.data.data.forEach((member) => {
          initialChatsState[member?.userId?.fullName] = [];
        });
        setChats(initialChatsState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = () => {
    if (inputMessage.trim() && currentChat) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Emit message to server with the socket
      socket.emit('send_message', {
        to: currentChat,
        from: userInfo?.user?.fullName,
        text: inputMessage,
      });

      setChats({
        ...chats,
        [currentChat]: [
          ...(chats[currentChat] || []),
          { sender: 'Me', text: inputMessage, time: currentTime, type: 'sent' },
        ],
      });
      setInputMessage('');
    }
  };

  const handleUserClick = (member) => {
    setCurrentChat(member?.userId?.fullName);
    setCurrentChatProfileImage(
      member?.profileImage ? member?.profileImage : 'https://via.placeholder.com/40'
    );

    // Establish socket connection with a specific user when clicked
    socket.emit('join_chat', {
      user: userInfo?.user?.fullName,
      chatting_with: member?.userId?.fullName,
    });
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit('send_file', {
          to: currentChat,
          from: userInfo?.user?.fullName,
          fileName: selectedFile.name,
          fileData: reader.result, // Send base64 encoded file data to server
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    chatmember();
  }, []);

  return (
    <Box className="chat-app" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '87vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', md: '25%' },
          bgcolor: 'white',
          p: 2,
          borderRight: { md: '1px solid #ddd' },
          overflowY: 'auto',
        }}
      >
        <TextField
          fullWidth
          placeholder="Search Here"
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />
        <List>
          {memberlist.map((member) => (
            <ListItem
              key={member?.userId?.fullName}
              button
              onClick={() => handleUserClick(member)}
              selected={currentChat === member?.userId?.fullName}
              sx={{
                bgcolor: currentChat === member?.userId?.fullName ? '#e3f2fd' : 'transparent',
              }}
            >
              <ListItemAvatar>
                <Avatar alt={member?.userId?.fullName} src={member?.profileImage} />
              </ListItemAvatar>
              <ListItemText primary={member?.userId?.fullName} secondary="Last message preview..." />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Window */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'white',
          height: '100%',
        }}
      >
        {/* Static Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #ddd',
            position: 'sticky',
            top: 0,
            bgcolor: 'white',
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Dynamically render the selected user's avatar and name */}
            <Avatar src={currentChatProfileImage} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle1">{currentChat || 'Select A User For Chat'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentChat ? 'Active now' : ''}
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton>
              <PhoneIcon />
            </IconButton>
            <IconButton>
              <VideoCallIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>


        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
            bgcolor: '#f9f9f9',
          }}
        >
          {chats[currentChat]?.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: msg.type === 'sent' ? '#1976d2' : '#e0e0e0',
                  color: msg.type === 'sent' ? 'white' : 'black',
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '70%',
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {msg.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)} // Handle changes in the input
            onKeyDown={handleKeyDown} // Trigger message send on Enter press
            sx={{ mx: 2 }}
          />

          <IconButton
            onClick={handleAttachmentClick}
          >
            <AttachFileIcon />
          </IconButton>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <IconButton
            onClick={handlePhotoClick}
          >
            <PhotoCameraIcon />
          </IconButton>

          <input
            type="file"
            ref={fileCameraInputRef}
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />

          <IconButton>
            <MicIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatApp;


// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';
// import {
//   Box,
//   TextField,
//   IconButton,
//   Avatar,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Typography,
//   Snackbar,
// } from '@mui/material';
// import {
//   Send as SendIcon,
//   Mic as MicIcon,
//   Phone as PhoneIcon,
//   MoreVert as MoreVertIcon,
//   VideoCall as VideoCallIcon,
//   AttachFile as AttachFileIcon,
// } from '@mui/icons-material';
// import apiHelper from '../../../Common/ApiHelper';

// // const socket = io('http://localhost:5000');
// let socket = io('http://localhost:5000');


// const ChatApp = ({ userInfo, societyId }) => {

//   const [chats, setChats] = useState({});
//   const [currentChat, setCurrentChat] = useState('');
//   const [currentChatProfileImage, setCurrentChatProfileImage] = useState('');
//   const [inputMessage, setInputMessage] = useState('');
//   const [memberlist, setMemberList] = useState([]);


//   const chatMembers = async () => {
//     try {
//       const result = await apiHelper.getmemberchat(userInfo?.societyData?.societyId);
//       if (result?.data?.data) {
//         setMemberList(result.data.data);

//         const initialChatsState = {};
//         result.data.data.forEach((member) => {
//           initialChatsState[member?.userId?.fullName] = [];
//         });
//         setChats(initialChatsState);
//       }
//     } catch (error) {
//       console.log('Error fetching members: ', error);
//     }
//   };

//   useEffect(() => {
//     chatMembers();
//   }, []);

//   const handleUserClick = (member) => {
//     setCurrentChat(member?.userId?.fullName);
//     setCurrentChatProfileImage(member?.profileImage || 'https://via.placeholder.com/40');
//   };

//   // const handleSend = () => {
//   //   if (inputMessage.trim() && currentChat) {
//   //     setChats({
//   //       ...chats,
//   //       [currentChat]: [
//   //         ...(chats[currentChat] || []),
//   //         { sender: 'Me', text: inputMessage, time: new Date().toISOString(), type: 'sent' },
//   //       ],
//   //     });
//   //     setInputMessage('');
//   //   }
//   // };

//   const handleSend = () => {
//     if (inputMessage.trim() && currentChat) {
//       const message = {
//         sender: userInfo?.societyData?.societyId, // Replace with logged-in user info
//         receiver: currentChat,
//         text: inputMessage,
//       };

//       setChats({
//         ...chats,
//         [currentChat]: [
//           ...(chats[currentChat] || []),
//           { ...message, time: new Date().toISOString(), type: 'sent' },
//         ],
//       });

//       socket.emit('sendMessage', message);
//       setInputMessage('');
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   useEffect(() => {
//     socket.on('receiveMessage', (message) => {
//       setChats((prevChats) => ({
//         ...prevChats,
//         [message.receiver]: [
//           ...(prevChats[message.receiver] || []),
//           { sender: message.sender, text: message.text, time: new Date().toISOString(), type: 'received' },
//         ],
//       }));
//     });

//     return () => {
//       socket.off('receiveMessage'); // Clean up event listener
//     };
//   }, []);

//   return (
//     <Box className="chat-app" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '87vh' }}>
//       {/* Sidebar for members */}
//       <Box
//         sx={{
//           width: { xs: '100%', md: '25%' },
//           bgcolor: 'white',
//           p: 2,
//           borderRight: { md: '1px solid #ddd' },
//           overflowY: 'auto',
//         }}
//       >
//         <TextField fullWidth placeholder="Search Here" variant="outlined" size="small" sx={{ mb: 2 }} />
//         <List>
//           {memberlist.map((member) => (
//             <ListItem
//               key={member?.userId?.fullName}
//               button
//               onClick={() => handleUserClick(member)}
//               selected={currentChat === member?.userId?.fullName}
//               sx={{
//                 bgcolor: currentChat === member?.userId?.fullName ? '#e3f2fd' : 'transparent',
//               }}
//             >
//               <ListItemAvatar>
//                 <Avatar alt={member?.userId?.fullName} src={member?.profileImage} />
//               </ListItemAvatar>
//               <ListItemText primary={member?.userId?.fullName} secondary="Click to chat" />
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       {/* Chat Window */}
//       <Box
//         sx={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           bgcolor: 'white',
//           height: '100%',
//         }}
//       >
//         <Box sx={{ p: 2, borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
//           <Avatar src={currentChatProfileImage} />
//           <Typography variant="subtitle1" sx={{ ml: 2 }}>
//             {currentChat || 'Select a member to start chat'}
//           </Typography>
//         </Box>

//         <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#f9f9f9' }}>
//           {chats[currentChat]?.map((msg, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: 'flex',
//                 justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start',
//                 mb: 2,
//               }}
//             >
//               <Box
//                 sx={{
//                   bgcolor: msg.type === 'sent' ? '#1976d2' : '#e0e0e0',
//                   color: msg.type === 'sent' ? 'white' : 'black',
//                   p: 1.5,
//                   borderRadius: 2,
//                   maxWidth: '70%',
//                 }}
//               >
//                 <Typography variant="body1">{msg.text}</Typography>
//               </Box>
//             </Box>
//           ))}
//         </Box>

//         <Box sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
//           <TextField
//             fullWidth
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Type a message..."
//           />
//           <IconButton onClick={handleSend}>
//             <SendIcon />
//           </IconButton>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ChatApp;








