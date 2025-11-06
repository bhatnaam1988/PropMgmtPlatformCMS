import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';

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

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db('swissalpine');
    const submission = {
      type: 'cleaning_services',
      name,
      email,
      phone,
      propertyAddress,
      serviceType,
      message: message || '',
      submittedAt: new Date(),
      status: 'new'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Cleaning Services Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Property Address:</strong> ${propertyAddress}</p>
      <p><strong>Service Type:</strong> ${serviceType}</p>
      ${message ? `<p><strong>Additional Details:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Cleaning Services Request from ${name}`,
      html: emailHtml
    });

    return NextResponse.json({
      success: true,
      message: 'Cleaning services request submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    console.error('Cleaning services form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit cleaning services request' },
      { status: 500 }
    );
  }
}
