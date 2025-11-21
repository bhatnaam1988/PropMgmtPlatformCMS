import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, phone, propertyAddress, propertyType, bedrooms, message } = formData;

    // Validate required fields
    if (!name || !email || !phone || !propertyAddress || !propertyType || !bedrooms) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB_NAME || 'swissalpine');
    const submission = {
      type: 'rental_services',
      name,
      email,
      phone,
      propertyAddress,
      propertyType,
      bedrooms,
      message: message || '',
      submittedAt: new Date(),
      status: 'new'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Rental Services Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Property Address:</strong> ${propertyAddress}</p>
      <p><strong>Property Type:</strong> ${propertyType}</p>
      <p><strong>Number of Bedrooms:</strong> ${bedrooms}</p>
      ${message ? `<p><strong>Additional Information:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Rental Services Inquiry from ${name}`,
      html: emailHtml
    });

    return NextResponse.json({
      success: true,
      message: 'Rental services inquiry submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    console.error('Rental services form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit rental services inquiry' },
      { status: 500 }
    );
  }
}
