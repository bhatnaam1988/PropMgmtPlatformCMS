import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';

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

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db('swissalpine');
    const submission = {
      type: 'contact',
      inquiryType,
      name,
      email,
      phone: phone || '',
      subject,
      message,
      submittedAt: new Date(),
      status: 'new'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Inquiry: ${subject}`,
      html: emailHtml
    });

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
