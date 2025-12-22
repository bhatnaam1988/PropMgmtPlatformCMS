# Post-Deployment Testing Script

## After Re-Deploying Application

### Test 1: Check Domain Accessibility (Wait 15 minutes after deploy)

**Test without www:**
```bash
curl -I https://swissalpinejourney.ch
```
✅ Expected: HTTP 200 or HTTP 301 (redirect to www)
❌ If timeout: Wait 5 more minutes, SSL still provisioning

**Test with www:**
```bash
curl -I https://www.swissalpinejourney.ch
```
✅ Expected: HTTP 200
❌ If timeout: Check DNS has A record for "www"

---

### Test 2: Verify SSL Certificate

**Browser test:**
1. Open: `https://www.swissalpinejourney.ch`
2. Click padlock 🔒 in address bar
3. Check certificate details
   - Issued by: Let's Encrypt
   - Valid for: swissalpinejourney.ch, www.swissalpinejourney.ch

---

### Test 3: Check Environment Variables Applied

**In browser, view page source:**
1. Visit: `https://www.swissalpinejourney.ch`
2. Right-click → "View Page Source"
3. Search for: `og:url` or `canonical`
4. ✅ Should show: `https://www.swissalpinejourney.ch`
5. ❌ If shows old domain: Environment variables not loaded, redeploy again

---

### Test 4: Check CORS Headers

**Browser console test:**
1. Open: `https://www.swissalpinejourney.ch`
2. Press F12 (Developer Tools)
3. Go to "Network" tab
4. Refresh page
5. Click on main document request
6. Check Response Headers
7. Look for: `access-control-allow-origin: https://www.swissalpinejourney.ch`

---

### Test 5: Test API Endpoints

**Test property API:**
```bash
curl https://www.swissalpinejourney.ch/api/properties
```
✅ Expected: JSON response with properties

**Test specific property:**
```bash
curl https://www.swissalpinejourney.ch/api/properties/84656
```
✅ Expected: JSON with property details

---

### Test 6: Test Forms (After updating reCAPTCHA)

1. ✅ Contact form submission
2. ✅ Newsletter signup
3. ✅ Booking flow (up to payment page)

---

### Test 7: Check Sitemap & Robots

**Sitemap:**
- Visit: `https://www.swissalpinejourney.ch/sitemap.xml`
- ✅ Should show new domain in all URLs

**Robots.txt:**
- Visit: `https://www.swissalpinejourney.ch/robots.txt`
- ✅ Should reference sitemap with new domain

---

## Troubleshooting

### If domain still times out after 20 minutes:

**Check 1: SSL Certificate Status**
```bash
openssl s_client -connect www.swissalpinejourney.ch:443 -servername www.swissalpinejourney.ch
```
- If "Connection refused" → SSL not ready yet
- If shows certificate → SSL is working

**Check 2: DNS Propagation**
```bash
dig www.swissalpinejourney.ch
```
- Should show: 34.57.15.54

**Check 3: Try without HTTPS**
```bash
curl http://www.swissalpinejourney.ch
```
- If this works but HTTPS doesn't → SSL certificate issue

---

## Success Criteria

✅ Domain loads: `https://www.swissalpinejourney.ch`
✅ SSL certificate valid (green padlock)
✅ Meta tags show new domain
✅ API endpoints return data
✅ Sitemap shows new domain
✅ Forms work (after reCAPTCHA update)

---

## Next Steps After Domain Works

1. [ ] Update Google reCAPTCHA domains
2. [ ] Update Stripe webhook URL
3. [ ] Test complete booking flow
4. [ ] Submit sitemap to Google Search Console
5. [ ] Update social media links
6. [ ] Set up 301 redirect from old domain (optional)
