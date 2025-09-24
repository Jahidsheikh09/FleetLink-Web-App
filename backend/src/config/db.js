import mongoose from 'mongoose';

let cachedConnection = null;

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fleetlink';
  mongoose.set('strictQuery', true);
  cachedConnection = await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
  });
  mongoose.set('bufferCommands', false);
  return cachedConnection;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cachedConnection = null;
  }
}

