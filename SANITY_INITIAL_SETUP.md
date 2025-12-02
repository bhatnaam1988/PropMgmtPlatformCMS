# Sanity Initial Setup - Navigation & Footer

Since the API token is not working, please follow these manual steps to create the Navigation and Footer documents in Sanity Studio.

---

## 🎯 Step 1: Access Sanity Studio

1. Open: `https://rental-fix.preview.emergentagent.com/studio`
2. Log in if prompted

---

## 📝 Step 2: Create Navigation Document

### Click "Navigation" in left sidebar → Click "+" button (Create new)

**Fill in the form with these exact values:**

### Name Field:
```
header
```
*(Type exactly "header" - this is critical!)*

---

### Items Array - Add 5 items:

#### **Item 1:**
- Text: `Stay`
- Link: `/stay`
- Children: *(leave empty, do not add any children)*

---

#### **Item 2:**
- Text: `Explore`
- Link: `#`
- Children: *(Click "Add item" 4 times and fill:)*
  1. Text: `Grächen` | Link: `/explore/graechen`
  2. Text: `Other Locations` | Link: `/explore/other-locations`
  3. Text: `Travel Tips` | Link: `/explore/travel-tips`
  4. Text: `Behind the Scenes` | Link: `/explore/behind-the-scenes`

---

#### **Item 3:**
- Text: `Blog`
- Link: `/blog`
- Children: *(leave empty)*

---

#### **Item 4:**
- Text: `Services`
- Link: `#`
- Children: *(Click "Add item" 2 times and fill:)*
  1. Text: `Cleaning Services` | Link: `/cleaning-services`
  2. Text: `Rental Services` | Link: `/rental-services`

---

#### **Item 5:**
- Text: `About`
- Link: `#`
- Children: *(Click "Add item" 3 times and fill:)*
  1. Text: `About` | Link: `/about`
  2. Text: `Contact` | Link: `/contact`
  3. Text: `Careers` | Link: `/jobs`

---

### ✅ Click "Publish" button (top right)

---

## 📝 Step 3: Create Footer Document

### Click "Footer" in left sidebar → Click "+" button (Create new)

**Fill in the form with these exact values:**

---

### Sections Array - Add 2 sections:

#### **Section 1:**
- Title: `Services`
- Links: *(Click "Add item" 3 times and fill:)*
  1. Text: `Cleaning Services` | URL: `/cleaning-services`
  2. Text: `Rental Management` | URL: `/rental-services`
  3. Text: `Careers` | URL: `/jobs`

---

#### **Section 2:**
- Title: `Legal`
- Links: *(Click "Add item" 3 times and fill:)*
  1. Text: `Privacy Policy` | URL: `/legal#privacy`
  2. Text: `Terms & Conditions` | URL: `/legal#terms`
  3. Text: `GDPR Information` | URL: `/legal#gdpr`

---

### Social Links Array - Add 1 item:

- Platform: Select `instagram` from dropdown
- URL: `https://instagram.com/swissalpinejourney`

---

### Copyright Text Field:
```
© 2024 Swiss Alpine Journey. All rights reserved.
```

---

### ✅ Click "Publish" button (top right)

---

## 🎉 Step 4: Verify

1. Refresh your website: `https://rental-fix.preview.emergentagent.com`
2. The header and footer should look exactly the same (now powered by Sanity!)
3. Try editing something in Sanity and republish to see changes

---

## 📸 Visual Reference

### Navigation Structure:
```
Navigation (name: "header")
├── Stay (/stay)
├── Explore (#)
│   ├── Grächen (/explore/graechen)
│   ├── Other Locations (/explore/other-locations)
│   ├── Travel Tips (/explore/travel-tips)
│   └── Behind the Scenes (/explore/behind-the-scenes)
├── Blog (/blog)
├── Services (#)
│   ├── Cleaning Services (/cleaning-services)
│   └── Rental Services (/rental-services)
└── About (#)
    ├── About (/about)
    ├── Contact (/contact)
    └── Careers (/jobs)
```

### Footer Structure:
```
Footer
├── Sections
│   ├── Services
│   │   ├── Cleaning Services (/cleaning-services)
│   │   ├── Rental Management (/rental-services)
│   │   └── Careers (/jobs)
│   └── Legal
│       ├── Privacy Policy (/legal#privacy)
│       ├── Terms & Conditions (/legal#terms)
│       └── GDPR Information (/legal#gdpr)
├── Social Links
│   └── Instagram (https://instagram.com/swissalpinejourney)
└── Copyright: © 2024 Swiss Alpine Journey. All rights reserved.
```

---

## ⚠️ Important Notes

1. **Navigation name MUST be "header"** - The code specifically looks for this
2. **Use exact URLs** - Copy them exactly as shown (including `/` and `#`)
3. **Children arrays** - Items with dropdowns need the Children array filled
4. **Click "Publish"** - Not just "Save" - changes won't appear until published
5. **Wait 1-2 minutes** - After publishing, wait a moment for cache to clear

---

## 🆘 Troubleshooting

**If navigation doesn't appear:**
- Double-check the name field is exactly `header` (lowercase)
- Make sure you clicked "Publish" not just "Save"
- Wait 2 minutes and hard refresh browser (Ctrl+Shift+R)

**If footer doesn't appear:**
- Make sure all fields are filled correctly
- Check that Social Links platform is set to `instagram`
- Verify you clicked "Publish"

---

## ✅ Success Checklist

- [ ] Created Navigation document with name="header"
- [ ] Added all 5 navigation items with correct children
- [ ] Published Navigation document
- [ ] Created Footer document
- [ ] Added 2 sections (Services, Legal) with all links
- [ ] Added Instagram social link
- [ ] Added copyright text
- [ ] Published Footer document
- [ ] Verified website looks the same as before
- [ ] Tested editing and republishing a small change

---

**Once complete, you can edit these documents anytime via Sanity Studio!**
