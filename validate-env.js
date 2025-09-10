#!/usr/bin/env node

/**
 * Environment Configuration Validator
 * Checks if all required environment variables are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 CareerNest Environment Validation\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envExamplePath)) {
  console.log('❌ .env.example file not found');
  process.exit(1);
}

const hasEnvFile = fs.existsSync(envPath);
console.log(hasEnvFile ? '✅ .env file exists' : '⚠️  .env file not found (using .env.example for validation)');

// Read environment file
const envContent = fs.readFileSync(hasEnvFile ? envPath : envExamplePath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#') && line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    envVars[key] = value;
  }
});

console.log(`\n📋 Found ${Object.keys(envVars).length} environment variables\n`);

// Validation rules
const validationRules = {
  // Required variables
  required: [
    'DATABASE_URL',
    'MOMO_COLLECTIONS_SUBSCRIPTION_KEY',
    'MOMO_DISBURSEMENTS_SUBSCRIPTION_KEY'
  ],
  
  // Variables that should not be placeholder values
  noPlaceholders: {
    'DATABASE_URL': ['postgresql://username:password@localhost', 'your-database-url'],
    'MOMO_COLLECTIONS_USER_ID': ['your-collections-api-user-id-here', '12345678-1234'],
    'MOMO_COLLECTIONS_API_KEY': ['your-collections-api-key-here', 'b9cd0d275aea'],
    'MOMO_DISBURSEMENTS_USER_ID': ['your-disbursements-api-user-id-here', '87654321-4321'],
    'MOMO_DISBURSEMENTS_API_KEY': ['your-disbursements-api-key-here', 'b9cd0d275aea'],
    'OPENAI_API_KEY': ['your-openai-api-key-here', 'sk-proj-'],
    'SMTP_USER': ['your-email@gmail.com'],
    'SMTP_PASS': ['your-app-password']
  },
  
  // Variables with specific format requirements
  formats: {
    'DATABASE_URL': /^postgresql:\/\/.+/,
    'MOMO_COLLECTIONS_SUBSCRIPTION_KEY': /^[a-f0-9]{32}$/,
    'MOMO_DISBURSEMENTS_SUBSCRIPTION_KEY': /^[a-f0-9]{32}$/,
    'PORT': /^\d+$/,
    'BCRYPT_ROUNDS': /^\d+$/
  },
  
  // Variables that should be URLs
  urls: [
    'MOMO_BASE_URL',
    'MOMO_SANDBOX_BASE_URL',
    'MOMO_CALLBACK_HOST'
  ],
  
  // Boolean variables
  booleans: [
    'ENABLE_MOMO_PAYMENTS',
    'ENABLE_AI_SERVICES',
    'ENABLE_JOB_ALERTS',
    'ENABLE_MULTILINGUAL'
  ]
};

let validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: []
};

function addIssue(type, variable, message) {
  validationResults.issues.push({ type, variable, message });
  if (type === 'error') {
    validationResults.failed++;
  } else if (type === 'warning') {
    validationResults.warnings++;
  }
}

function addSuccess() {
  validationResults.passed++;
}

// Check required variables
console.log('🔍 Checking required variables...');
validationRules.required.forEach(variable => {
  if (!envVars[variable] || envVars[variable].trim() === '') {
    addIssue('error', variable, 'Required variable is missing or empty');
    console.log(`❌ ${variable}: Missing or empty`);
  } else {
    addSuccess();
    console.log(`✅ ${variable}: Present`);
  }
});

// Check for placeholder values
console.log('\n🔍 Checking for placeholder values...');
Object.entries(validationRules.noPlaceholders).forEach(([variable, placeholders]) => {
  const value = envVars[variable];
  if (value) {
    const hasPlaceholder = placeholders.some(placeholder => value.includes(placeholder));
    if (hasPlaceholder) {
      addIssue('warning', variable, 'Contains placeholder value - needs to be updated');
      console.log(`⚠️  ${variable}: Contains placeholder value`);
    } else {
      addSuccess();
      console.log(`✅ ${variable}: Configured`);
    }
  }
});

// Check format requirements
console.log('\n🔍 Checking format requirements...');
Object.entries(validationRules.formats).forEach(([variable, regex]) => {
  const value = envVars[variable];
  if (value && !regex.test(value)) {
    addIssue('error', variable, `Invalid format. Expected pattern: ${regex}`);
    console.log(`❌ ${variable}: Invalid format`);
  } else if (value) {
    addSuccess();
    console.log(`✅ ${variable}: Valid format`);
  }
});

// Check URL variables
console.log('\n🔍 Checking URL variables...');
validationRules.urls.forEach(variable => {
  const value = envVars[variable];
  if (value) {
    try {
      new URL(value);
      addSuccess();
      console.log(`✅ ${variable}: Valid URL`);
    } catch (error) {
      addIssue('error', variable, 'Invalid URL format');
      console.log(`❌ ${variable}: Invalid URL`);
    }
  }
});

// Check boolean variables
console.log('\n🔍 Checking boolean variables...');
validationRules.booleans.forEach(variable => {
  const value = envVars[variable];
  if (value && !['true', 'false'].includes(value.toLowerCase())) {
    addIssue('warning', variable, 'Should be "true" or "false"');
    console.log(`⚠️  ${variable}: Should be boolean (true/false)`);
  } else if (value) {
    addSuccess();
    console.log(`✅ ${variable}: Valid boolean`);
  }
});

// Special validations
console.log('\n🔍 Running special validations...');

// Check MTN MoMo subscription keys
const collectionsKey = envVars['MOMO_COLLECTIONS_SUBSCRIPTION_KEY'];
const disbursementsKey = envVars['MOMO_DISBURSEMENTS_SUBSCRIPTION_KEY'];

if (collectionsKey === 'b09bff7ce0c54f9fafe3bd78bb74279d') {
  addSuccess();
  console.log('✅ Collections subscription key: Matches provided key');
} else if (collectionsKey) {
  addIssue('warning', 'MOMO_COLLECTIONS_SUBSCRIPTION_KEY', 'Does not match the provided key');
  console.log('⚠️  Collections subscription key: Does not match provided key');
}

if (disbursementsKey === '22dd0dec976649989455bf871abb24b0') {
  addSuccess();
  console.log('✅ Disbursements subscription key: Matches provided key');
} else if (disbursementsKey) {
  addIssue('warning', 'MOMO_DISBURSEMENTS_SUBSCRIPTION_KEY', 'Does not match the provided key');
  console.log('⚠️  Disbursements subscription key: Does not match provided key');
}

// Check database URL format
const dbUrl = envVars['DATABASE_URL'];
if (dbUrl && dbUrl.includes('localhost') && !dbUrl.includes('password')) {
  addIssue('warning', 'DATABASE_URL', 'Using localhost without password - may cause connection issues');
  console.log('⚠️  Database URL: Using localhost without password');
}

// Print summary
console.log('\n📊 Validation Summary:');
console.log('=====================');
console.log(`✅ Passed: ${validationResults.passed}`);
console.log(`⚠️  Warnings: ${validationResults.warnings}`);
console.log(`❌ Errors: ${validationResults.failed}`);

if (validationResults.failed === 0 && validationResults.warnings === 0) {
  console.log('\n🎉 All validations passed! Your environment is properly configured.');
} else if (validationResults.failed === 0) {
  console.log('\n✅ No critical errors found, but there are some warnings to address.');
} else {
  console.log('\n❌ Critical errors found. Please fix these before running the application.');
}

// Print detailed issues
if (validationResults.issues.length > 0) {
  console.log('\n📋 Detailed Issues:');
  console.log('==================');
  validationResults.issues.forEach(issue => {
    const icon = issue.type === 'error' ? '❌' : '⚠️ ';
    console.log(`${icon} ${issue.variable}: ${issue.message}`);
  });
}

// Print next steps
console.log('\n🎯 Next Steps:');
console.log('==============');

if (!hasEnvFile) {
  console.log('1. Copy .env.example to .env: cp .env.example .env');
}

if (validationResults.issues.some(issue => issue.variable.includes('USER_ID') || issue.variable.includes('API_KEY'))) {
  console.log('2. Generate MTN MoMo API credentials: node setup-momo-api.js');
}

if (validationResults.issues.some(issue => issue.variable === 'DATABASE_URL')) {
  console.log('3. Set up database (Supabase/Neon) and update DATABASE_URL');
}

if (validationResults.issues.some(issue => issue.variable === 'OPENAI_API_KEY')) {
  console.log('4. Get OpenAI API key from https://platform.openai.com/api-keys');
}

console.log('5. Run the application: npm run dev');
console.log('6. Open browser: http://localhost:5000');

// Exit with appropriate code
process.exit(validationResults.failed > 0 ? 1 : 0);
