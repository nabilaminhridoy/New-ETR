import bcrypt from 'bcryptjs';
import { db } from '../src/lib/db';

async function createAdminUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Hridoy@08112021', 10);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: 'eidticketresell@gmail.com' }
    });

    if (existingUser) {
      console.log('User with this email already exists!');
      console.log('User ID:', existingUser.id);
      console.log('Role:', existingUser.role);
      return;
    }

    // Create the admin user
    const user = await db.user.create({
      data: {
        email: 'eidticketresell@gmail.com',
        name: 'ETR Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true,
        isEmailVerified: true,
        isActive: true,
      }
    });

    console.log('Admin user created successfully!');
    console.log('User ID:', user.id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

createAdminUser();
