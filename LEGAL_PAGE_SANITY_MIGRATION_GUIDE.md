# Legal Page - Sanity CMS Migration Guide

## ✅ What Has Been Fixed

### 1. Updated Sanity Schema
**File:** `/app/sanity/schemas/settings/legalSettingsHybrid.js`

The schema has been completely rewritten to match the code structure exactly:
- ✅ `pageHeader` with heading and description
- ✅ `navigationCards` array (fully configurable)
- ✅ `termsSection` with heading, lastUpdated, and sections array
- ✅ `privacySection` with heading, lastUpdated, and sections array
- ✅ `gdprSection` with heading, description, and sections array
- ✅ `footerText` object with text, linkText, and linkUrl

### 2. Comprehensive Legal Content Created
**File:** `/app/LEGAL_CONTENT_MIGRATION_DATA.json`

Complete legal content has been prepared for migration:
- **Terms & Conditions:** 10 detailed sections covering all aspects
- **Privacy Policy:** 11 comprehensive sections
- **GDPR Information:** 11 sections detailing all user rights

---

## 🚀 Migration Steps

### Step 1: Deploy Updated Schema

The Sanity schema has already been updated. You need to restart the Sanity Studio to load the new schema:

```bash
# Restart Next.js to reload Sanity Studio
sudo supervisorctl restart nextjs
```

### Step 2: Access Sanity Studio

1. Navigate to: `https://secure-forms-2.preview.emergentagent.com/studio`
2. Log in with your Sanity credentials

### Step 3: Create Legal Page Content Document

1. In Sanity Studio, click **"Create new"** or look for **"Legal Page Content"** in the document list
2. If you already have a "Legal Page Content" document, open it
3. If not, create a new one (there should only be ONE legal page content document)

### Step 4: Populate Content (Copy from JSON)

Open the file `/app/LEGAL_CONTENT_MIGRATION_DATA.json` and copy the content to Sanity Studio:

#### A. Page Header
```
Heading: Legal Information
Description: Important legal documents and policies for Swiss Alpine Journey
```

#### B. Navigation Cards (Add 3 cards)

**Card 1:**
- Icon: FileText
- Title: Terms & Conditions
- Description: Booking terms and rental conditions
- Anchor Link: #terms

**Card 2:**
- Icon: Shield
- Title: Privacy Policy
- Description: How we protect your personal data
- Anchor Link: #privacy

**Card 3:**
- Icon: Cookie
- Title: GDPR Information
- Description: Your data rights under GDPR
- Anchor Link: #gdpr

#### C. Terms & Conditions Section

1. Section Heading: `Terms & Conditions`
2. Last Updated: `December 2024`
3. Add 10 Content Sections (click "Add item" for each):

**Section 1:**
- Title: `1. Booking and Reservation`
- Content: `By making a reservation with Swiss Alpine Journey, you agree to these terms and conditions. All bookings are subject to availability and confirmation. A booking is only confirmed when you receive written confirmation from us via email. We reserve the right to refuse any booking at our discretion.`

**Section 2:**
- Title: `2. Payment Terms`
- Content: `A deposit of 30% of the total booking value is required to secure your reservation. The remaining balance must be paid 30 days before your arrival date. Payment can be made by bank transfer or major credit cards (Visa, Mastercard, American Express). All prices are quoted in Swiss Francs (CHF) and include applicable taxes unless otherwise stated.`

**Section 3:**
- Title: `3. Cancellation Policy`
- Content: `Free cancellation up to 48 hours before check-in. Cancellations within 48 hours: 50% of booking value retained. No-shows: 100% of booking value retained. Different policies may apply during peak seasons (Christmas, New Year, Swiss school holidays). Cancellations must be made in writing via email to be valid.`

**Section 4:**
- Title: `4. Check-in and Check-out`
- Content: `Check-in time is between 15:00 and 19:00. Check-out time is 10:00. Late check-in or early check-out can be arranged with advance notice and may incur additional charges. Guests must provide valid identification upon check-in. Keys must be returned at check-out, and failure to do so may result in a replacement charge.`

**Section 5:**
- Title: `5. Property Usage and Guest Responsibilities`
- Content: `The property must be used respectfully and maintained in good condition. Maximum occupancy limits must be strictly observed. Smoking is prohibited inside all properties. Pets are only allowed in designated pet-friendly properties with prior approval. Guests are responsible for any damage caused during their stay. Parties and events are not permitted without prior written consent.`

**Section 6:**
- Title: `6. House Rules`
- Content: `Quiet hours are from 22:00 to 07:00. Guests must respect neighbors and local community. Rubbish must be disposed of properly in designated bins. All appliances and facilities must be used according to provided instructions. Any issues or damage must be reported immediately to the property manager.`

**Section 7:**
- Title: `7. Liability and Insurance`
- Content: `Swiss Alpine Journey is not liable for any personal injury, loss, or damage to personal belongings during your stay. Guests are advised to arrange comprehensive travel and personal property insurance. The property owner's insurance does not cover guests' personal belongings. We recommend travel insurance that includes trip cancellation coverage.`

**Section 8:**
- Title: `8. Force Majeure`
- Content: `Swiss Alpine Journey is not responsible for failure to fulfill obligations due to circumstances beyond our control, including but not limited to natural disasters, extreme weather conditions, government restrictions, pandemics, or other force majeure events. In such cases, we will work with guests to find alternative arrangements or provide appropriate refunds.`

**Section 9:**
- Title: `9. Modifications to Booking`
- Content: `Requests to modify bookings (dates, number of guests, property) are subject to availability and may incur additional charges. Modifications must be requested at least 14 days before the original check-in date. We cannot guarantee that modification requests will be accommodated.`

**Section 10:**
- Title: `10. Dispute Resolution and Governing Law`
- Content: `These terms and conditions are governed by Swiss law. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in Switzerland. We encourage guests to contact us directly to resolve any issues before pursuing legal action.`

#### D. Privacy Policy Section

1. Section Heading: `Privacy Policy`
2. Last Updated: `December 2024`
3. Add 11 Content Sections:

**Section 1:**
- Title: `1. Information We Collect`
- Content: `We collect personal information that you provide when making a reservation, including your name, email address, phone number, postal address, and payment information. We also collect information about your stay preferences and any special requests. Additionally, we may collect information about how you use our website through cookies and similar technologies.`

**Section 2:**
- Title: `2. How We Use Your Information`
- Content: `We use your personal information to process and manage your bookings, communicate with you about your reservation, provide customer support, send booking confirmations and important updates, process payments securely, and improve our services. We may also use your information to send you marketing communications if you have opted in to receive them.`

**Section 3:**
- Title: `3. Data Sharing and Third Parties`
- Content: `We do not sell your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business, including payment processors (Stripe), property management systems (Uplisting), email services (Resend), and content management systems (Sanity). These providers are contractually obligated to protect your information and use it only for the purposes we specify.`

**Section 4:**
- Title: `4. Data Security`
- Content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of sensitive data, secure server infrastructure, regular security audits, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`

**Section 5:**
- Title: `5. Data Retention`
- Content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, comply with legal obligations, resolve disputes, and enforce our agreements. Booking information is typically retained for 7 years for accounting and legal purposes. You can request deletion of your data at any time, subject to legal retention requirements.`

**Section 6:**
- Title: `6. Your Rights`
- Content: `Under data protection laws, you have the right to access your personal information, request corrections to inaccurate data, request deletion of your data, object to processing of your data, request restriction of processing, and request data portability. To exercise these rights, please contact us using the information provided at the end of this policy.`

**Section 7:**
- Title: `7. Cookies and Tracking Technologies`
- Content: `Our website uses cookies and similar tracking technologies to enhance user experience, analyze website traffic, and personalize content. We use both first-party and third-party cookies. Essential cookies are necessary for the website to function properly. Analytics cookies help us understand how visitors use our site. You can control cookie preferences through your browser settings.`

**Section 8:**
- Title: `8. International Data Transfers`
- Content: `Your information may be transferred to and processed in countries other than Switzerland. We ensure that appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable data protection laws. We use standard contractual clauses approved by the European Commission where applicable.`

**Section 9:**
- Title: `9. Children's Privacy`
- Content: `Our services are not directed at children under 16, and we do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 16, we will take steps to delete that information promptly.`

**Section 10:**
- Title: `10. Changes to This Policy`
- Content: `We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the 'Last Updated' date. Your continued use of our services after such changes constitutes acceptance of the updated policy.`

**Section 11:**
- Title: `11. Contact Information`
- Content: `If you have any questions about this privacy policy or how we handle your personal information, please contact us at: Email: privacy@swissalpinejourney.com. We will respond to your inquiry within 30 days.`

#### E. GDPR Information Section

1. Section Heading: `GDPR Information`
2. Description: `Your rights under the General Data Protection Regulation`
3. Add 11 Content Sections:

**Section 1:**
- Title: `Right to Access`
- Content: `You have the right to request access to the personal data we hold about you. This includes the right to obtain confirmation of whether we are processing your data, access to your personal data, and information about how we process it. To request access, please contact us with your full name and email address used for booking.`

**Section 2:**
- Title: `Right to Rectification`
- Content: `If you believe that any personal information we hold about you is inaccurate or incomplete, you have the right to request that we correct or complete it. Please contact us with details of the information you believe is inaccurate and the corrections you would like us to make.`

**Section 3:**
- Title: `Right to Erasure (Right to be Forgotten)`
- Content: `You have the right to request that we delete your personal data in certain circumstances, such as when the data is no longer necessary for the purposes for which it was collected, you withdraw consent, or you object to processing. Please note that we may need to retain certain information for legal or legitimate business purposes.`

**Section 4:**
- Title: `Right to Restriction of Processing`
- Content: `You have the right to request that we restrict the processing of your personal data in certain circumstances, such as when you contest the accuracy of the data, the processing is unlawful but you don't want the data erased, or you need the data for legal claims. During the restriction period, we can only store your data and will only process it with your consent.`

**Section 5:**
- Title: `Right to Data Portability`
- Content: `You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transmit that data to another controller. This right applies where the processing is based on consent or contract and is carried out by automated means.`

**Section 6:**
- Title: `Right to Object`
- Content: `You have the right to object to processing of your personal data where we are relying on legitimate interests as the legal basis for processing. You also have the right to object to processing for direct marketing purposes at any time. To exercise this right, please contact us or use the unsubscribe link in our marketing emails.`

**Section 7:**
- Title: `Rights Related to Automated Decision Making`
- Content: `You have the right not to be subject to decisions based solely on automated processing, including profiling, which produce legal effects or similarly significantly affect you. We do not currently use automated decision-making processes that would have such effects.`

**Section 8:**
- Title: `Right to Withdraw Consent`
- Content: `Where we process your personal data based on consent, you have the right to withdraw that consent at any time. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal. You can withdraw consent by contacting us or using the unsubscribe mechanism in our communications.`

**Section 9:**
- Title: `Right to Lodge a Complaint`
- Content: `If you believe that we have not complied with your data protection rights, you have the right to lodge a complaint with the relevant data protection authority. In Switzerland, this is the Federal Data Protection and Information Commissioner (FDPIC). You can also contact your local data protection authority if you are located in the EU/EEA.`

**Section 10:**
- Title: `How to Exercise Your Rights`
- Content: `To exercise any of the rights described above, please contact us at: Email: privacy@swissalpinejourney.com or via our contact form. Please include your full name, email address used for booking, and a clear description of your request. We will verify your identity before processing your request and respond within 30 days. There is no charge for exercising these rights unless your request is manifestly unfounded or excessive.`

**Section 11:**
- Title: `Data Protection Officer`
- Content: `For questions specifically related to data protection and your GDPR rights, you can contact our Data Protection Officer at: dpo@swissalpinejourney.com. Our Data Protection Officer is responsible for overseeing our data protection practices and ensuring compliance with GDPR requirements.`

#### F. Footer Contact Text

1. Text Before Link: `If you have any questions about these legal documents, please`
2. Link Text: `contact us`
3. Link URL: `/contact`

### Step 5: Publish the Document

1. Click the **"Publish"** button in the bottom right corner
2. Wait for the confirmation message

### Step 6: Verify on Website

1. Go to: `https://secure-forms-2.preview.emergentagent.com/legal`
2. Verify that all content is displayed correctly
3. Check all three sections (Terms, Privacy, GDPR)
4. Verify navigation cards work
5. Test anchor links (#terms, #privacy, #gdpr)

---

## 📋 What Changed

### Before:
- ❌ Schema and code structure mismatch
- ❌ Sanity content couldn't be rendered
- ❌ Privacy and GDPR sections empty
- ❌ Navigation cards hardcoded only

### After:
- ✅ Schema matches code structure exactly
- ✅ All content from Sanity renders properly
- ✅ Complete Terms (10 sections)
- ✅ Complete Privacy Policy (11 sections)
- ✅ Complete GDPR Information (11 sections)
- ✅ Navigation cards fully editable via Sanity
- ✅ Footer text fully editable via Sanity

---

## 🎯 Future Content Management

### To Update Legal Content:

1. Go to Sanity Studio: `https://secure-forms-2.preview.emergentagent.com/studio`
2. Navigate to **"Legal Page Content"**
3. Edit any section you want to update
4. Click **"Publish"**
5. Changes appear on the website immediately (with 5-minute cache)

### To Add New Sections:

1. Open the appropriate section (Terms, Privacy, or GDPR)
2. Click **"Add item"** in the sections array
3. Fill in Title and Content
4. Publish

### To Remove Sections:

1. Open the section you want to remove
2. Click the trash icon
3. Publish

---

## ⚠️ Important Notes

1. **Only ONE Document:** There should only be one "Legal Page Content" document in Sanity
2. **Cache:** Content changes may take up to 5 minutes to appear due to caching
3. **Backup:** The complete content is backed up in `/app/LEGAL_CONTENT_MIGRATION_DATA.json`
4. **Fallback:** If Sanity is unavailable, the site will use the fallback in the code

---

## 🔄 Rollback

If you need to rollback to hardcoded content:

1. The fallback data remains in `/app/app/legal/page.js`
2. If Sanity data is deleted or corrupted, the fallback will automatically be used
3. You can force fallback by removing the Sanity document

---

## ✅ Checklist

- [ ] Restart Next.js server
- [ ] Access Sanity Studio
- [ ] Create/Open "Legal Page Content" document
- [ ] Add Page Header content
- [ ] Add 3 Navigation Cards
- [ ] Add Terms & Conditions (10 sections)
- [ ] Add Privacy Policy (11 sections)
- [ ] Add GDPR Information (11 sections)
- [ ] Add Footer Text
- [ ] Publish document
- [ ] Verify on website
- [ ] Test anchor links
- [ ] Confirm all sections display correctly

---

**Migration Time Estimate:** 30-45 minutes (mostly copy-paste work)

**Difficulty:** Easy (just copy content from JSON to Sanity UI)
