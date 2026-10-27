import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '')
  : undefined;

// One shared connection; pages connect when they need live seat updates.
export const socket = io(BACKEND_URL, { autoConnect: false, withCredentials: true });
