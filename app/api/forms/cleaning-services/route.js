import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';
import { sanitizeEmail, sanitizeText, sanitizePhone, escapeHtml } from '@/lib/sanitize';
import { logger } from '@/lib/logger';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, phone, propertyAddress, serviceType, message } = formData;

    // Validate required fields
    if (!name || !email || !phone || !propertyAddress || !serviceType) {
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
        phone: sanitizePhone(phone),
        propertyAddress: sanitizeText(propertyAddress, 300),
        serviceType: sanitizeText(serviceType, 100),
        message: sanitizeText(message || '', 2000)
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
      type: 'cleaning_services',
      ...sanitizedData,
      submittedAt: new Date(),
      status: 'new',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification with escaped HTML
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Cleaning Services Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(sanitizedData.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(sanitizedData.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(sanitizedData.phone)}</p>
      <p><strong>Property Address:</strong> ${escapeHtml(sanitizedData.propertyAddress)}</p>
      <p><strong>Service Type:</strong> ${escapeHtml(sanitizedData.serviceType)}</p>
      ${sanitizedData.message ? `<p><strong>Additional Details:</strong></p><p>${escapeHtml(sanitizedData.message).replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Cleaning Services Request from ${sanitizedData.name}`,
      html: emailHtml
    });

    logger.secureLog('Cleaning services request submitted', { email: sanitizedData.email, type: sanitizedData.serviceType });

    return NextResponse.json({
      success: true,
      message: 'Cleaning services request submitted successfully'
    });

  } catch (error) {
    logger.error('Cleaning services form submission error', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit cleaning services request. Please try again later.' },
      { status: 500 }
    );
  }
}
