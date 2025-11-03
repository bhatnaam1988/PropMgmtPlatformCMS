# 🧪 Stripe Payment Flow - Testing Guide

## ✅ Configuration Complete

**Webhook Secret Added:** ✓
**Server Restarted:** ✓
**Webhook Verification Active:** ✓

---

## 🚀 How to Test the Complete Payment Flow

### **Step 1: Navigate to Property Page**

1. Go to: https://cozy-retreats-3.preview.emergentagent.com
2. Click on any property to view details
3. Or directly visit: https://cozy-retreats-3.preview.emergentagent.com/property/84656

---

### **Step 2: Select Booking Details**

1. Select **Check-in** and **Check-out** dates (future dates)
2. Select number of **guests** (adults, children, infants)
3. Click **"Reserve"** or **"Book Now"** button
4. You'll be redirected to checkout page

---

### **Step 3: Fill in Guest Details (Step 1)**

On the checkout page, fill in:

- **First Name:** (e.g., John)
- **Last Name:** (e.g., Doe)
- **Email:** (use a real email you can access, e.g., mike.schwitalla@radixfinance.ch)
- **Phone:** (e.g., +41 79 123 4567)
- ☑️ **Terms & Conditions** (must check)
- ☐ **Marketing Consent** (optional)

Click **"Continue to Payment"**

---

### **Step 4: Enter Payment Details (Step 2)**

You'll see the Stripe Payment Element.

#### **Use Stripe Test Cards:**

**✅ Success - No 3DS:**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/26)
CVC: Any 3 digits (e.g., 123)
```

**✅ Success - With 3DS Authentication:**
```
Card Number: 4000 0025 0000 3155
Expiry: Any future date
CVC: Any 3 digits
```
*(Will prompt for 3DS authentication - click "Complete" or "Authenticate")*

**❌ Declined - Insufficient Funds:**
```
Card Number: 4000 0000 0000 9995
Expiry: Any future date
CVC: Any 3 digits
```

**❌ Declined - Generic Decline:**
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

---

### **Step 5: Complete Payment**

1. Click **"Pay CHF XXX"** button
2. Wait for payment processing (usually 2-5 seconds)
3. If 3DS card used, complete authentication
4. Payment will be processed by Stripe

---

### **Step 6: Webhook Processing (Automatic)**

**Behind the scenes:**
1. Stripe sends webhook to: `/api/stripe/webhook`
2. Webhook verifies signature ✓
3. Retrieves booking from MongoDB ✓
4. Creates booking in Uplisting (Attempt 1)
5. If fails: Waits 2 seconds, retries (Attempt 2)
6. If fails again: Sends email to mike.schwitalla@radixfinance.ch

---

### **Step 7: Success Page**

If payment succeeds, you'll be redirected to:
```
/booking/success?bookingId=xxx&paymentIntentId=pi_xxx
```

You should see:
- ✅ Booking confirmation
- Booking reference number
- Property details
- Next steps

---

## 🔍 How to Verify Everything Worked

### **1. Check Stripe Dashboard**

Go to: https://dashboard.stripe.com/test/payments

You should see:
- New payment with status **"Succeeded"**
- Amount matches booking (with VAT)
- Customer email matches
- Payment Intent ID (starts with `pi_`)

### **2. Check Uplisting Dashboard**

Go to your Uplisting account:

You should see:
- New booking created
- Guest details match
- Dates match
- Property matches

### **3. Check Application Logs**

```bash
# View recent logs
tail -f /var/log/supervisor/nextjs.out.log

# Look for these indicators:
✅ Payment Intent created: pi_xxx
📝 Booking record created: [booking-id]
📥 Webhook received: payment_intent.succeeded
🎉 Processing successful payment: pi_xxx
🔄 [Uplisting Booking Creation] Attempt 1/2
✅ Uplisting booking created: [uplisting-id]
✅ Booking completed successfully
```

### **4. Check MongoDB**

If you have MongoDB access:

```javascript
db.bookings.find().sort({createdAt: -1}).limit(1).pretty()
```

Should show:
- `paymentStatus: "succeeded"`
- `bookingStatus: "confirmed"`
- `uplistingBookingId: "8402xxx"`
- `stripePaymentIntentId: "pi_xxx"`

---

## 🎯 What to Look For

### **✅ Success Indicators:**

1. **Payment succeeds** - Green checkmark in Stripe Dashboard
2. **Webhook received** - Logs show "payment_intent.succeeded"
3. **Booking created in Uplisting** - Visible in Uplisting dashboard
4. **MongoDB updated** - Booking marked as "confirmed"
5. **Success page displayed** - User sees confirmation
6. **No admin email** - No failure alerts sent

### **⚠️ Failure Indicators:**

1. **Payment succeeds but no booking** - Check webhook logs
2. **Admin email received** - Uplisting booking creation failed
3. **Booking marked for manual review** - In MongoDB
4. **Webhook 500 error** - Check server logs for details

---

## 🧪 Test Scenarios to Try

### **Scenario 1: Happy Path (Recommended First)**
- Card: `4242 4242 4242 4242`
- Expected: Payment succeeds, booking created, success page shown

### **Scenario 2: 3DS Authentication**
- Card: `4000 0025 0000 3155`
- Expected: 3DS prompt appears, authenticate, payment succeeds

### **Scenario 3: Payment Declined**
- Card: `4000 0000 0000 9995`
- Expected: Error message shown, no booking created, can retry

### **Scenario 4: Multiple Bookings**
- Try 2-3 bookings in a row
- Expected: All succeed independently, no duplicate issues

---

## 📧 Email Notifications

### **When Admin Email is Sent:**

You'll receive email to **mike.schwitalla@radixfinance.ch** if:
- Uplisting booking creation fails after 2 retries
- Webhook processing encounters errors
- Manual review required

**Email will contain:**
- Payment Intent ID
- Booking ID
- Property ID
- Guest email
- Amount paid
- Error details
- Required action

---

## 🐛 Troubleshooting

### **Issue: Payment succeeds but no booking created**

**Check:**
1. Webhook endpoint configured in Stripe? ✓
2. Webhook secret correct? ✓
3. Server logs show webhook received?
4. Uplisting API credentials correct?

**Solution:**
- Check `/var/log/supervisor/nextjs.out.log`
- Look for webhook errors
- Verify Uplisting API key and Client ID

---

### **Issue: "Stripe is not defined" error**

**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

---

### **Issue: Payment Element not loading**

**Check:**
1. Stripe publishable key correct?
2. Network connectivity?
3. Browser console for errors?

**Solution:**
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in .env
- Check browser console
- Try different browser

---

### **Issue: Webhook signature verification failed**

**Possible causes:**
- Webhook secret mismatch
- Request not from Stripe (test with Stripe Dashboard)

**Solution:**
- Verify webhook secret: `whsec_2Gn2DMtKm6kMUkAQIpYvSWt9Nl54VMel`
- Restart server after adding secret
- Test webhook from Stripe Dashboard

---

## 📊 Monitoring Checklist

After testing, verify:

- [ ] Payment created in Stripe Dashboard
- [ ] Webhook received (check logs)
- [ ] Booking created in Uplisting
- [ ] MongoDB record exists with "confirmed" status
- [ ] Success page displayed to user
- [ ] No error emails received
- [ ] Payment amount correct (with VAT)
- [ ] Guest details correct
- [ ] Dates correct

---

## 🎉 Success Criteria

Your integration is working perfectly if:

1. ✅ User completes checkout flow smoothly
2. ✅ Payment processed by Stripe
3. ✅ Webhook received and verified
4. ✅ Booking created in Uplisting automatically
5. ✅ User sees success confirmation
6. ✅ No manual intervention needed

---

## 📞 Next Steps After Testing

**If everything works:**
1. ✅ Document any issues found
2. ✅ Test different property types
3. ✅ Test different date ranges
4. ✅ Test different guest counts
5. ✅ Ready for production!

**If issues found:**
1. Note exact error messages
2. Check logs for details
3. Share findings for debugging
4. I'll help resolve any issues

---

## 🚀 Ready to Test!

**Everything is configured and ready.** 

Just follow the steps above and test with card: **4242 4242 4242 4242**

Let me know how it goes! 🎉
