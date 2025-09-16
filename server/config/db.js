import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fintract-lite';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Please ensure MongoDB is running or check your MONGO_URI environment variable');
    console.log('💡 For development, you can use: mongodb://localhost:27017/fintract-lite');
    console.log('🌐 For production, use your MongoDB Atlas connection string');
    console.log('🔄 Server will continue to run but database operations will fail');
    // Don't exit process in development to allow testing other endpoints
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;