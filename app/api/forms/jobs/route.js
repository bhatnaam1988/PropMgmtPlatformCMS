import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';
import { sanitizeEmail, sanitizeText, sanitizePhone, escapeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, phone, position, message } = formData;

    // Validate required fields
    if (!name || !email || !position || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    let sanitizedData;
    try {
      sanitizedData = {
        name: sanitizeText(name, 100),
        email: sanitizeEmail(email),
        phone: sanitizePhone(phone || ''),
        position: sanitizeText(position, 100),
        message: sanitizeText(message, 5000)
      };
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME || 'swissalpine');
    const submission = {
      type: 'job_application',
      ...sanitizedData,
      submittedAt: new Date(),
      status: 'new',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification with escaped HTML
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${escapeHtml(sanitizedData.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(sanitizedData.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(sanitizedData.phone) || 'Not provided'}</p>
      <p><strong>Position Applied For:</strong> ${escapeHtml(sanitizedData.position)}</p>
      <p><strong>Cover Letter / Why They'd Be Great:</strong></p>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${escapeHtml(sanitizedData.message)}</pre>
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Job Application: ${sanitizedData.position} - ${sanitizedData.name}`,
      html: emailHtml
    });

    logger.secureLog('Job application submitted', { email: sanitizedData.email, position: sanitizedData.position });

    return NextResponse.json({
      success: true,
      message: 'Job application submitted successfully'
    });

  } catch (error) {
    logger.error('Job application submission error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit job application. Please try again later.' },
      { status: 500 }
    );
  }
}
