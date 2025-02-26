const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    logging: false
});

// Import User model
const User = require('../models/User')(sequelize);

async function createAdminUser() {
    try {
        // Get admin credentials from command line arguments
        const email = process.argv[2];
        const password = process.argv[3];

        if (!email || !password) {
            console.error('Usage: node createAdmin.js <email> <password>');
            process.exit(1);
        }

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ where: { email } });
        if (existingAdmin) {
            console.error('User with this email already exists');
            process.exit(1);
        }

        // Create admin user
        const adminUser = await User.create({
            email,
            password,
            role: 'admin',
            isActive: true
        });

        console.log('Admin user created successfully!');
        console.log(`Email: ${adminUser.email}`);
        console.log('Role: admin');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await sequelize.close();
    }
}

createAdminUser();