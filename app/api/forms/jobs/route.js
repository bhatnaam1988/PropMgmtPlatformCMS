import { NextResponse } from 'next/server';
import { getEmailService } from '@/lib/email';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const formData = await request.json();
    const { name, email, phone, position, location, resume, coverLetter } = formData;

    // Validate required fields
    if (!name || !email || !phone || !position || !location || !resume) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db('swissalpine');
    const submission = {
      type: 'job_application',
      name,
      email,
      phone,
      position,
      location,
      resume,
      coverLetter: coverLetter || '',
      submittedAt: new Date(),
      status: 'new'
    };
    
    const result = await db.collection('form_submissions').insertOne(submission);

    // Send email notification
    const emailService = getEmailService();
    const emailHtml = `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Position Applied For:</strong> ${position}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Resume/CV:</strong></p>
      <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${resume}</pre>
      ${coverLetter ? `<p><strong>Cover Letter:</strong></p><pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${coverLetter}</pre>` : ''}
      <hr>
      <p><small>Submission ID: ${result.insertedId}</small></p>
      <p><small>Submitted: ${new Date().toLocaleString()}</small></p>
    `;

    await emailService.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Job Application: ${position} - ${name}`,
      html: emailHtml
    });

    return NextResponse.json({
      success: true,
      message: 'Job application submitted successfully',
      submissionId: result.insertedId
    });

  } catch (error) {
    console.error('Job application submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit job application' },
      { status: 500 }
    );
  }
}
