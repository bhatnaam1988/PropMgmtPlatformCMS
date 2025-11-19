const { execSync } = require('child_process');

const migrations = [
  'migrate-homepage.js',
  'migrate-contact.js',
  'migrate-cleaning-services.js',
  'migrate-rental-services.js',
  'migrate-jobs.js',
  'migrate-legal.js'
];

console.log('🚀 Running all migrations...\n');

for (const migration of migrations) {
  try {
    console.log(`➡️ Running ${migration}...`);
    execSync(`node scripts/${migration}`, { stdio: 'inherit', cwd: '/app' });
    console.log(`\n`);
  } catch (error) {
    console.error(`❌ Failed to run ${migration}`);
    process.exit(1);
  }
}

console.log('✨ All migrations completed successfully!\n');
