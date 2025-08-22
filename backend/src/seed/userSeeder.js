import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import User from '../models/userModel.js';


const users = [
  { name: 'Employee1', password: 'password123', role: 'Employee' },
  { name: 'Employee2', password: 'password123', role: 'Employee' },
  { name: 'TeamLead1', password: 'password123', role: 'Team Lead' },
  { name: 'ProjectLead1', password: 'password123', role: 'Project Lead' },
  { name: 'HR1', password: 'password123', role: 'HR' },
  { name: 'CEO1', password: 'password123', role: 'CEO' },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // await User.deleteMany({});
    for (const userData of users) {
      const { name, password, role } = userData;

      const existingUser = await User.findOne({ name, role });
      if (existingUser) {
        console.log(`User ${name} (${role}) already exists, skipping...`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        password: hashedPassword,
        role,
      });

      await user.save();
    }
    console.log('User seeding completed successfully');
  } catch (error) {
    
    console.error('Error seeding users:', error.message);

  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};
seedUsers();