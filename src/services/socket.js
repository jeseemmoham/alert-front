import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'https://alert-back.onrender.com/api';
const SOCKET_URL = API_BASE.replace(/\/api\/?$/, '');

const IS_PRODUCTION = import.meta.env.MODE === 'production';

let socket = null;
let socketEnabled = true;

export const connectSocket = () => {
  if (!socketEnabled) return null;
  if (socket?.connected) return socket;

  try {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: IS_PRODUCTION ? 3 : 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('⚠️ Socket connection error:', error.message);
      // On production, disable socket after repeated connection errors
      if (IS_PRODUCTION) {
        socketEnabled = false;
        console.log('📡 Socket disabled - using polling fallback');
      }
    });

    return socket;
  } catch (error) {
    console.error('❌ Failed to initialize socket:', error);
    socketEnabled = false;
    return null;
  }
};

export const getSocket = () => socket;

export const isSocketEnabled = () => socketEnabled;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const joinZipRoom = (zipCode) => {
  if (socket?.connected && zipCode) {
    socket.emit('join-zip', zipCode);
  }
};

export const leaveZipRoom = (zipCode) => {
  if (socket?.connected && zipCode) {
    socket.emit('leave-zip', zipCode);
  }
};
