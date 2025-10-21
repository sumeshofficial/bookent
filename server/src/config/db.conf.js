import mongoose from "mongoose";

// Database configuration
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}bookent`)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;