import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Project } from './models/Project.js';
import { Task } from './models/Task.js';
import { User } from './models/User.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Project.deleteMany({}), Task.deleteMany({})]);

  const [admin, member] = await User.create([
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    },
    {
      name: 'Member User',
      email: 'member@example.com',
      password: 'password123',
      role: 'member'
    }
  ]);

  const project = await Project.create({
    title: 'Website Redesign',
    description: 'Refresh the product website and launch a cleaner team workflow.',
    owner: admin._id,
    members: [admin._id, member._id]
  });

  await Task.create([
    {
      title: 'Create wireframes',
      description: 'Draft key dashboard and task board screens.',
      priority: 'High',
      status: 'In Progress',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      project: project._id,
      assignedUser: member._id,
      createdBy: admin._id
    },
    {
      title: 'Review project scope',
      description: 'Confirm milestones and project owners.',
      priority: 'Medium',
      status: 'To Do',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      project: project._id,
      assignedUser: admin._id,
      createdBy: admin._id
    }
  ]);

  console.log('Seeded demo users: admin@example.com / member@example.com, password: password123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
