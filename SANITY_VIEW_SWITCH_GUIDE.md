# How to Switch Sanity Studio Views

## 🎯 Problem
You're seeing the JSON/code view in Sanity Studio and want to switch back to the normal form editor view.

---

## ✅ Quick Solution

### Option 1: Use the View Toggle Button (Easiest)

**Look for the view toggle button in Sanity Studio:**

1. In the top-right corner of the document editor, look for an icon that looks like:
   - `</>` (code/brackets icon) OR
   - `📄` (document icon) OR
   - A toggle switch

2. Click this button to switch between:
   - **Form View** (visual editor with fields)
   - **JSON View** (raw code view)

---

### Option 2: Close and Reopen the Document

1. Click the **"X"** or **"Close"** button in the top-right
2. Go back to the document list
3. Click on the document again
4. It should open in Form View by default

---

### Option 3: Refresh Sanity Studio

1. Refresh the browser page (F5 or Ctrl+R / Cmd+R)
2. Navigate back to your document
3. Should open in Form View

---

### Option 4: Check Document Actions Menu

1. Look for a **"..."** (three dots) menu in the top-right
2. Click it to see available actions
3. Look for "Switch to Form View" or similar option

---

## 🖼️ Visual Guide

### What You're Seeing Now (JSON View):
```
The screen shows code/JSON with fields like:
{
  "_id": "...",
  "_type": "rentalServicesSettingsHybrid",
  "heroSection": { ... }
}
```

### What You Want (Form View):
```
Visual form with labeled fields:
┌─────────────────────────────┐
│ Hero Section               │
│ ┌─────────────────────────┐│
│ │ Heading: [text input]   ││
│ │ Description: [textarea] ││
│ │ Background Image: [img] ││
│ └─────────────────────────┘│
└─────────────────────────────┘
```

---

## 🔧 If Toggle Button is Missing

### The view toggle might be hidden or unavailable. Try this:

1. **Check if you're in "Inspect" mode**
   - Press `Ctrl+Shift+I` (Windows) or `Cmd+Option+I` (Mac) to close DevTools
   - The JSON view might be from browser DevTools, not Sanity

2. **Check your Sanity Studio version**
   - Older versions might not have easy view switching
   - The view you're in might be the intended view for that schema

3. **Check if this is a custom view**
   - Some schemas are configured to show JSON by default
   - Check with your team if this is intentional

---

## 📝 For Rental Services Page Specifically

Based on your screenshot showing `rentalServicesSettingsHybrid`:

### Current Status
- You have an empty document (no content populated)
- The JSON view shows the document structure
- You want to edit it using the form editor

### Steps:
1. **Close the current JSON view**
2. **Go back to the document list** in Sanity Studio sidebar
3. **Click on "Rental Services Settings Hybrid"** from the list
4. **Should open in Form View** with these sections to populate:
   - Hero Section
   - Services Grid
   - Benefits Section
   - Form Section

---

## 🎨 Expected Form View Layout

When you switch to Form View, you should see:

```
┌────────────────────────────────────────┐
│ Rental Services Settings Hybrid        │
├────────────────────────────────────────┤
│                                        │
│ 📸 Page Header                         │
│ ├─ Heading: [____________]            │
│ └─ Description: [____________]        │
│                                        │
│ 🔢 Navigation Cards                    │
│ ├─ [+ Add item]                       │
│ └─ (empty)                            │
│                                        │
│ 📋 Services Grid                       │
│ ├─ Services: [+ Add item]             │
│ └─ (empty)                            │
│                                        │
│ ✅ Benefits Section                    │
│ ├─ Heading: [____________]            │
│ └─ Benefits: [+ Add item]             │
│                                        │
│ 📧 Form Section                        │
│ ├─ Heading: [____________]            │
│ └─ Description: [____________]        │
│                                        │
└────────────────────────────────────────┘
```

---

## ⚠️ Important Note

### About Empty Documents

Since your Sanity document is empty (no content):
- The Form View will show empty fields
- The JSON View shows the basic document structure
- **Both views are valid** - just different ways to see the same empty document

### What You Should Do

1. **Switch to Form View** (easier to edit)
2. **Start populating fields:**
   - Add Hero Section heading and description
   - Add Navigation Cards (3 items)
   - Add Services (6 items)
   - Add Benefits (4 items)
   - Add Form Section details

3. **Click "Publish"** when done

---

## 🚨 If Nothing Works

If you still can't switch views, the issue might be:

### 1. Browser DevTools Open
- You're not looking at Sanity Studio, but at browser inspect element
- **Fix:** Close DevTools (press F12)

### 2. Embedded JSON Editor
- Some Sanity fields use JSON editor for complex data
- **Fix:** Click outside the field to return to form view

### 3. Custom Schema Configuration
- Your schema might be set to show JSON by default
- **Fix:** Contact developer to change schema settings

### 4. Sanity Studio Glitch
- Rare, but Studio might be stuck in JSON view
- **Fix:** 
  - Clear browser cache
  - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
  - Logout and login again

---

## 📞 Quick Checklist

Try these in order:

- [ ] Look for view toggle button (</> icon) in top-right
- [ ] Close and reopen the document
- [ ] Refresh the browser
- [ ] Check if browser DevTools is open (close it)
- [ ] Try a different browser
- [ ] Clear browser cache
- [ ] Restart Sanity Studio tab

---

## 🎯 Most Likely Solution

**Based on your screenshot, here's what I think happened:**

You probably clicked on "Inspect" or opened the document in a way that shows the raw JSON view. 

**Try this:**
1. Look at the very top of the Sanity Studio interface
2. Find the close button (X) for the current document
3. Click it to go back to the document list
4. Click on "Rental Services Settings Hybrid" again
5. It should open in the normal Form View

**If you see a code/JSON icon in the toolbar, click it to toggle back to Form View.**

---

## 📧 Still Need Help?

If none of these work:
1. Take a screenshot of the full Sanity Studio interface
2. Check if there's a toolbar with view options
3. Look for any error messages
4. Try accessing Sanity Studio from a fresh browser tab

The Form View is the default and most common view, so it should be easily accessible!
