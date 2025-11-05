import { Resend } from 'resend';

export class ResendProvider {
  constructor() {
    this.client = new Resend(process.env.RESEND_API_KEY);
    this.defaultFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  }

  /**
   * Send an email using Resend
   * @param {Object} options - Email options
   * @param {string} options.from - Sender email (optional, uses default if not provided)
   * @param {string|string[]} options.to - Recipient email(s)
   * @param {string} options.subject - Email subject
   * @param {string} options.html - Email HTML content
   * @param {string} options.text - Plain text content (optional)
   * @param {Object} options.metadata - Additional metadata
   */
  async sendEmail({ from, to, subject, html, text, metadata = {} }) {
    try {
      const { data, error } = await this.client.emails.send({
        from: from || this.defaultFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        tags: metadata.tags || [],
      });

      if (error) {
        console.error('Resend email error:', error);
        return {
          success: false,
          error,
          provider: 'resend'
        };
      }

      console.log('Email sent successfully via Resend:', data.id);
      return {
        success: true,
        messageId: data.id,
        provider: 'resend'
      };
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
      return {
        success: false,
        error: error.message,
        provider: 'resend'
      };
    }
  }
}
