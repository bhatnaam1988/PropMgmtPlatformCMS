import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, phone, propertyAddress, propertyType, message } = formData;

    // Validate required fields
    if (!name || !email || !propertyAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db('swissalpine');
    const submission = {
      type: 'rental',
      name,
      email,
      phone: phone || '',
      propertyAddress,
      propertyType: propertyType || '',
      message: message || '',
      submittedAt: new Date(),
      status: 'new'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Property Management Partnership Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Property Address:</strong> ${propertyAddress}</p>
      <p><strong>Property Type:</strong> ${propertyType || 'Not specified'}</p>
      ${message ? `<p><strong>About the Property:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Partnership Request: ${propertyAddress}`,
      html: emailHtml
    });

    return NextResponse.json({
      success: true,
      message: 'Partnership request submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    console.error('Rental form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit partnership request' },
      { status: 500 }
    );
  }
}
