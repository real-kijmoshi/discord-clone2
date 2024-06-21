<p align="center">
  <img src="/logo.svg" width="200" height="250" alt="Discord Clone Logo" style="display: block; margin-bottom: 20px;">
</p>

<h1 align="center">Discord Clone</h1>
<p align="center">
  Tired of searching for a good Discord clone on GitHub and finding none? So was I! That's why I decided to create my own.
</p>

## Technologies

### Backend
- **Express.js** for the API
- **Socket.io** for real-time communication
- **MongoDB** (using Mongoose) for the database
- **Nodemailer** for sending emails
- **JWT** for authentication

### Frontend
- **React.js** for the UI
- **TailwindCSS** for styling
- **Socket.io-client** for real-time communication

### Future Technologies:
- **WebRTC** for video and audio calls
- **Firebase** for WebRTC signaling
- **React Native** for a mobile app (possibly)

## Features
- [ ] Messages
- [ ] Direct messages
- [ ] Friend requests
- [ ] Friend list
- [ ] Groups
- [ ] User profiles (with more customization)
- [ ] Permissions
- [ ] Guild management
- [ ] User settings
- [ ] Voice channels
- [ ] Video channels
- [ ] Notifications

## How to Run

1. Clone the repository
2. Run `npm install` in both the client and server directories

### For the Server Directory:
3. Create a `.env` file in the server directory and add the following:
```
JWT=secret
URL=http://localhost:3000
MONGO_URI=your_mongo_uri
EMAIL=your_email
EMAIL_PASSWORD=your_email_password
```

4. Run `node .` in the server directory

### For the Client Directory:
4. Create a `.env` file in the client directory and add the following:
```
VITE_API_URL=http://localhost:3000/api/v1
VITE_CDN_URL=http://localhost:3000/cdn
VITE_GATEWAY_URL=http://localhost:3000
```

5. Run `npm run dev` in the client directory
6. Visit [http://localhost:5173](http://localhost:5173)

## Important Notes
- This project is still in development and not ready for production.
- This project is not affiliated with Discord in any way.
- This project is not intended for commercial use.

## License
This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
