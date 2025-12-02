import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';
import { sanitizeEmail, sanitizeText, sanitizePhone, escapeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { inquiryType, name, email, phone, subject, message } = formData;

    // Validate required fields
    if (!inquiryType || !name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    let sanitizedData;
    try {
      sanitizedData = {
        inquiryType: sanitizeText(inquiryType, 50),
        name: sanitizeText(name, 100),
        email: sanitizeEmail(email),
        phone: sanitizePhone(phone || ''),
        subject: sanitizeText(subject, 200),
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
      type: 'contact',
      ...sanitizedData,
      submittedAt: new Date(),
      status: 'new',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification with escaped HTML
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Inquiry Type:</strong> ${escapeHtml(sanitizedData.inquiryType)}</p>
      <p><strong>Name:</strong> ${escapeHtml(sanitizedData.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(sanitizedData.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(sanitizedData.phone) || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${escapeHtml(sanitizedData.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(sanitizedData.message).replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Inquiry: ${sanitizedData.subject}`,
      html: emailHtml
    });

    logger.secureLog('Contact form submitted', { email: sanitizedData.email, type: sanitizedData.inquiryType });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    });

  } catch (error) {
    logger.error('Contact form submission error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form. Please try again later.' },
      { status: 500 }
    );
  }
}
