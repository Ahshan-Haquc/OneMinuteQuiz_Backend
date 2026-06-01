import app from './app';
import { connectDB } from './config/db';
import { env } from './config/validateEnv';

const startServer = async (): Promise<void> => {
  await connectDB(env.MONGODB_CONNECTION_STRING_URI);

  const port = env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
