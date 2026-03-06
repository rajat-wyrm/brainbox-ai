const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const backupDir = path.join(__dirname, '../backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `backup-${timestamp}`);

// Parse MongoDB URI
const uri = process.env.MONGODB_URI;
const matches = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);

if (!matches) {
  console.error('❌ Invalid MongoDB URI');
  process.exit(1);
}

const [, username, password, host, database] = matches;

// Create backup command
const cmd = `mongodump --uri="mongodb+srv://${username}:${password}@${host}/${database}" --out="${backupPath}"`;

console.log('💾 Starting database backup...');
console.log(`📁 Backup path: ${backupPath}`);

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
  
  console.log('✅ Backup completed successfully');
  console.log(`📁 Backup saved to: ${backupPath}`);
  
  // Create metadata file
  const metadata = {
    timestamp: new Date().toISOString(),
    database,
    files: fs.readdirSync(backupPath)
  };
  
  fs.writeFileSync(
    path.join(backupPath, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('✅ Metadata saved');
  process.exit(0);
});
