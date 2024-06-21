<img src="/logo.svg" width="200" height="200" alt="Discord clone logo" />

# Discord clone
I was bored and searched for discord clones on github and i couldn't find any good clones so i decided to make my own discord clone. 

## Technologies

### Backend
- Express.js for api
- Socket.io for real-time communication
- MongoDB (mongoose) for database
- nodemailer for sending emails
- JWT for authentication

#### Frontend
- React.js for ui
- Tailwindcss for styling
- socket.io-client for real-time communication

### future technologies:
- WebRTC for video and audio calls
- Firebase for webrtc signaling
- Maybe React Native for mobile app

## Todo
- [x] Messages
- [x] Direct messages
- [x] Friend requests
- [x] Friend list
- [x] Groups
- [x] user profiles (more customization)
- [x] Permissions
- [x] Guild management
- [x] user settings
- [x] Voice channels
- [x] Video channels
- [x] Notifications

## How to run
1. Clone the repository
2. Run `npm install` in both the client and server directories

### for the server directory:
3. Create a `.env` file in the server directory and add the following:
```
JWT=secret
URL=your url (http://localhost:3000)
MONGO_URI=your mongo uri

EMAIL=your email
EMAIL_PASSWORD=your email password
```

4. Run node . in the server directory

### for the client directory:
4. Create a `.env` file in the client directory and add the following:
```
eg:
VITE_API_URL=http://localhost:3000/api/v1
VITE_CDN_URL=http://localhost:3000/cdn
VITE_GATEWAY_URL=http://localhost:3000
```

5. Run npm run dev in the client directory
6. visit http://localhost:5173

## IMPORTANT
- This project is still in development and is not ready for production
- This project is not affiliated with discord in any way
- This project is not for commercial use

## License
[MIT](https://choosealicense.com/licenses/mit/)
