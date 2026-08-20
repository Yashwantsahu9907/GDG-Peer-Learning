import { io } from'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL ||'http://localhost:5000';

class SocketService {
 constructor() {
 this.socket = null;
 }

  connect(token, userId) {
    if (this.socket) return;
 
 this.socket = io(SOCKET_URL, {
 auth: {
 auth_token: token,
 userId: userId
 },
 transports: ['websocket'],
 });

 this.socket.on('connect', () => {
 // Socket connected
 });

 this.socket.on('connect_error', (err) => {
 console.error('[Socket] Connection error:', err.message);
 });

 this.socket.on('disconnect', (_reason) => {
 // Socket disconnected
 });
 }

 disconnect() {
 if (this.socket) {
 this.socket.disconnect();
 this.socket = null;
 }
 }

 emit(event, data) {
 if (this.socket) {
 this.socket.emit(event, data);
 }
 }

 on(event, callback) {
 if (this.socket) {
 this.socket.on(event, callback);
 }
 }

 off(event, callback) {
 if (this.socket) {
 if (callback) {
 this.socket.off(event, callback);
 } else {
 this.socket.off(event);
 }
 }
 }
}

export const socketService = new SocketService();
