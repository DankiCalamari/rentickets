const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const config = {
  server: {
    port: 3001,
    jwtSecret: '',
    dbHost: 'localhost',
    dbPort: 3306,
    dbName: 'tickets',
    dbUser: '',
    dbPassword: '',
    dbSsl: false,
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    azureClientId: '',
    azureClientSecret: '',
    azureTenantId: ''
  },
  client: {
    apiUrl: 'http://localhost:3001',
    azureClientId: '',
    azureTenantId: ''
  }
};

async function generateSecureKey(length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function gatherServerConfig() {
  console.log('\n=== Server Configuration ===');
  
  // Database configuration
  config.server.dbUser = await question('Enter MySQL root username [root]: ') || 'root';
  config.server.dbPassword = await question('Enter MySQL root password: ');
  
  // Generate JWT secret
  config.server.jwtSecret = await generateSecureKey();
  
  // Email configuration (optional)
  console.log('\n=== Email Configuration (Optional) ===');
  config.server.smtpUser = await question('Enter SMTP email (leave empty to skip): ');
  if (config.server.smtpUser) {
    config.server.smtpPassword = await question('Enter SMTP password: ');
  }
  
  // Azure configuration (optional)
  console.log('\n=== Azure AD Configuration (Optional) ===');
  config.server.azureClientId = await question('Enter Azure Client ID (leave empty to skip): ');
  if (config.server.azureClientId) {
    config.server.azureClientSecret = await question('Enter Azure Client Secret: ');
    config.server.azureTenantId = await question('Enter Azure Tenant ID: ');
    config.client.azureClientId = config.server.azureClientId;
    config.client.azureTenantId = config.server.azureTenantId;
  }
}

async function setupDatabase() {
  try {
    // Connect to MySQL to create database and user
    const connection = await mysql.createConnection({
      host: config.server.dbHost,
      port: config.server.dbPort,
      user: config.server.dbUser,
      password: config.server.dbPassword
    });

    // Create database
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.server.dbName}`);
    
    // Create application database user
    const appDbUser = 'tickets';
    const appDbPassword = await generateSecureKey(16);
    
    await connection.query(`CREATE USER IF NOT EXISTS '${appDbUser}'@'localhost' IDENTIFIED BY '${appDbPassword}'`);
    await connection.query(`GRANT ALL PRIVILEGES ON ${config.server.dbName}.* TO '${appDbUser}'@'localhost'`);
    await connection.query('FLUSH PRIVILEGES');
    
    // Update config with application database user
    config.server.dbUser = appDbUser;
    config.server.dbPassword = appDbPassword;
    
    await connection.end();
    console.log('\n✅ Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

function writeEnvFile(envPath, envVars) {
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, envContent);
}

function createEnvFiles() {
  // Server .env
  const serverEnvVars = {
    PORT: config.server.port,
    DB_HOST: config.server.dbHost,
    DB_PORT: config.server.dbPort,
    DB_NAME: config.server.dbName,
    DB_USER: config.server.dbUser,
    DB_PASSWORD: config.server.dbPassword,
    DB_SSL: config.server.dbSsl,
    JWT_SECRET: config.server.jwtSecret,
    SMTP_HOST: config.server.smtpHost,
    SMTP_PORT: config.server.smtpPort,
    SMTP_USER: config.server.smtpUser,
    SMTP_PASSWORD: config.server.smtpPassword,
    AZURE_CLIENT_ID: config.server.azureClientId,
    AZURE_CLIENT_SECRET: config.server.azureClientSecret,
    AZURE_TENANT_ID: config.server.azureTenantId,
    CORS_ORIGIN: 'http://localhost:5173'
  };
  
  // Client .env
  const clientEnvVars = {
    VITE_APP_API_URL: config.client.apiUrl,
    VITE_APP_AZURE_CLIENT_ID: config.client.azureClientId,
    VITE_APP_AZURE_TENANT_ID: config.client.azureTenantId,
    VITE_APP_ENV: 'development'
  };
  
  writeEnvFile(path.join(__dirname, 'server', '.env'), serverEnvVars);
  writeEnvFile(path.join(__dirname, 'client', '.env'), clientEnvVars);
  
  console.log('\n✅ Environment files created successfully');
}

async function installDependencies() {
  try {
    console.log('\n📦 Installing server dependencies...');
    execSync('cd server && npm install', { stdio: 'inherit' });
    
    console.log('\n📦 Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });
    
    console.log('\n✅ Dependencies installed successfully');
  } catch (error) {
    console.error('Error installing dependencies:', error);
    process.exit(1);
  }
}

async function cloneRepository() {
  try {
    console.log('=== Cloning Repository ===');
    execSync('git clone https://github.com/DankiCalamari/rentickets .', {
      stdio: 'inherit'
    });
    console.log('\n✅ Repository cloned successfully');
  } catch (error) {
    console.error('Error cloning repository:', error);
    process.exit(1);
  }
}

async function checkDirectory() {
  return new Promise((resolve, reject) => {
    fs.readdir(__dirname, (err, files) => {
      if (err) reject(err);

      // Filter out hidden files/directories
      const visibleFiles = files.filter(file => !file.startsWith('.'));

      if (visibleFiles.length > 1) {
        console.error('Error: Directory is not empty. Please use an empty directory.');
        process.exit(1);
      }
      resolve();
    });
  });
}

async function main() {
  console.log('=== Modern Ticketing System Installation ===');
  
  try {
    await checkDirectory();
    await cloneRepository();
    await gatherServerConfig();
    await setupDatabase();
    createEnvFiles();
    await installDependencies();
    
    console.log('\n🎉 Installation completed successfully!');
    console.log('\nTo start the application:');
    console.log('1. Start the server: cd server && npm run dev');
    console.log('2. Start the client: cd client && npm run dev');
  } catch (error) {
    console.error('Installation failed:', error);
  } finally {
    rl.close();
  }
}

main();