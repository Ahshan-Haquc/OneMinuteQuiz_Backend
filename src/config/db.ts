const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING_URI || 'mongodb://localhost:27017/CVgenerator', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    .then(()=>(console.log("1MinuteQuiz Database connected with cloud")))
    .catch((err)=>(console.log("Not conneted with database.")));
    } catch (err) {
        console.error(`Database connection error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;