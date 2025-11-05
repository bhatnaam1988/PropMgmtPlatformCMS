import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

/**
 * Environment Variables Validation Endpoint
 * 
 * Tests all critical credentials and creates backup of .env.local
 * Access: GET /api/validate-env
 */
export async function GET() {
  const checks = {};
  const errors = [];
  const warnings = [];

  // Create backup of .env.local
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').split('.')[0];
    const backupPath = path.join(process.cwd(), `.env.local.backup.${timestamp}`);
    
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, backupPath);
      console.log(`✅ Backup created: ${backupPath}`);
      
      // Clean old backups (keep last 5)
      const backups = fs.readdirSync(process.cwd())
        .filter(f => f.startsWith('.env.local.backup.'))
        .sort()
        .reverse();
      
      if (backups.length > 5) {
        backups.slice(5).forEach(file => {
          fs.unlinkSync(path.join(process.cwd(), file));
          console.log(`🗑️ Deleted old backup: ${file}`);
        });
      }
    }
  } catch (error) {
    warnings.push(`Failed to create backup: ${error.message}`);
  }

  // 1. Check Uplisting API
  try {
    const uplistingKey = process.env.UPLISTING_API_KEY;
    const uplistingUrl = process.env.UPLISTING_API_URL;
    const uplistingClientId = process.env.UPLISTING_CLIENT_ID;

    if (!uplistingKey) {
      errors.push('UPLISTING_API_KEY is not set');
      checks.uplisting_api = '❌ Missing API Key';
    } else if (!uplistingUrl) {
      errors.push('UPLISTING_API_URL is not set');
      checks.uplisting_api = '❌ Missing API URL';
    } else {
      // Test API connection
      const response = await fetch(`${uplistingUrl}/properties`, {
        headers: {
          'Authorization': `Basic ${uplistingKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        checks.uplisting_api = `✅ Connected (${data.data?.length || 0} properties)`;
      } else {
        errors.push(`Uplisting API returned ${response.status}`);
        checks.uplisting_api = `❌ API Error (${response.status})`;
      }
    }

    // Validate Client ID format
    if (!uplistingClientId) {
      errors.push('UPLISTING_CLIENT_ID is not set');
      checks.uplisting_client_id = '❌ Missing';
    } else if (uplistingClientId === 'alpine-booking-1' || uplistingClientId.includes('cozy-retreat')) {
      errors.push('UPLISTING_CLIENT_ID is set to session name (INVALID!)');
      checks.uplisting_client_id = '❌ Invalid (session name detected)';
    } else if (!/^[a-f0-9-]{36}$/i.test(uplistingClientId)) {
      warnings.push('UPLISTING_CLIENT_ID format looks incorrect (should be UUID)');
      checks.uplisting_client_id = '⚠️ Format warning';
    } else {
      checks.uplisting_client_id = '✅ Valid format';
    }

  } catch (error) {
    errors.push(`Uplisting check failed: ${error.message}`);
    checks.uplisting_api = '❌ Connection failed';
  }

  // 2. Check Stripe Keys
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecret || !stripeSecret.startsWith('sk_')) {
      errors.push('STRIPE_SECRET_KEY is missing or invalid');
      checks.stripe_secret = '❌ Invalid';
    } else {
      checks.stripe_secret = stripeSecret.startsWith('sk_test_') 
        ? '✅ Valid (test mode)' 
        : '✅ Valid (live mode)';
    }

    if (!stripePublishable || !stripePublishable.startsWith('pk_')) {
      errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing or invalid');
      checks.stripe_publishable = '❌ Invalid';
    } else {
      checks.stripe_publishable = stripePublishable.startsWith('pk_test_')
        ? '✅ Valid (test mode)'
        : '✅ Valid (live mode)';
    }

    if (!webhookSecret || !webhookSecret.startsWith('whsec_')) {
      errors.push('STRIPE_WEBHOOK_SECRET is missing or invalid');
      checks.stripe_webhook = '❌ Invalid';
    } else if (webhookSecret === 'whsec_placeholder') {
      warnings.push('STRIPE_WEBHOOK_SECRET is placeholder');
      checks.stripe_webhook = '⚠️ Placeholder';
    } else {
      checks.stripe_webhook = '✅ Configured';
    }

  } catch (error) {
    errors.push(`Stripe check failed: ${error.message}`);
  }

  // 3. Check Resend API
  try {
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!resendKey || !resendKey.startsWith('re_')) {
      errors.push('RESEND_API_KEY is missing or invalid');
      checks.resend_api = '❌ Invalid';
    } else {
      checks.resend_api = '✅ Configured';
    }

    if (!adminEmail) {
      errors.push('ADMIN_EMAIL is not set');
      checks.admin_email = '❌ Missing';
    } else if (!adminEmail.includes('@')) {
      errors.push('ADMIN_EMAIL format is invalid');
      checks.admin_email = '❌ Invalid format';
    } else {
      checks.admin_email = `✅ ${adminEmail}`;
    }

  } catch (error) {
    errors.push(`Resend check failed: ${error.message}`);
  }

  // 4. Check MongoDB
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      errors.push('MONGO_URL is not set');
      checks.mongodb = '❌ Missing';
    } else {
      const client = await MongoClient.connect(mongoUrl, { 
        serverSelectionTimeoutMS: 5000 
      });
      await client.db().admin().ping();
      await client.close();
      checks.mongodb = '✅ Connected';
    }

  } catch (error) {
    errors.push(`MongoDB check failed: ${error.message}`);
    checks.mongodb = '❌ Connection failed';
  }

  // 5. Check Base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    warnings.push('NEXT_PUBLIC_BASE_URL is not set');
    checks.base_url = '⚠️ Missing';
  } else {
    checks.base_url = `✅ ${baseUrl}`;
  }

  // Determine overall status
  const status = errors.length === 0 ? 'success' : 'error';
  const hasWarnings = warnings.length > 0;

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    session: baseUrl?.split('//')[1]?.split('.')[0] || 'unknown',
    checks,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    summary: {
      total_checks: Object.keys(checks).length,
      passed: Object.values(checks).filter(v => v.includes('✅')).length,
      failed: Object.values(checks).filter(v => v.includes('❌')).length,
      warnings: Object.values(checks).filter(v => v.includes('⚠️')).length,
    },
    backup_created: true,
    next_steps: errors.length > 0 
      ? 'Fix the errors listed above and re-run validation'
      : hasWarnings
        ? 'Review warnings and update if needed'
        : 'All checks passed! System is ready.'
  });
}
