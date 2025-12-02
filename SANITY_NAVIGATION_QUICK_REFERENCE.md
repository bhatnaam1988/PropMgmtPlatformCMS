# 🚀 Quick Reference: Edit Navigation in Sanity CMS

## ✅ Status: ACTIVE & WORKING

Your website navigation is **already managed by Sanity CMS**. This is a quick reference for making changes.

---

## 🔗 Access Sanity Studio

**URL:** https://www.sanity.io/manage
- Login → Select Project ID: `vrhdu6hl` → Open Studio

---

## 📝 Quick Edits

### Edit Header Navigation
1. Sanity Studio → **Navigation** → Click "header"
2. Add/edit/reorder navigation items
3. Click **"Publish"**
4. Refresh website (wait 1-2 min)

### Edit Footer
1. Sanity Studio → **Footer** → Click footer document
2. Edit sections, links, social media, or copyright
3. Click **"Publish"**
4. Refresh website (wait 1-2 min)

---

## 🎯 Common Tasks

### Add New Menu Item
```
Navigation → header → Add item
├─ Text: "New Page"
├─ Link: "/new-page"
└─ Dropdown Items: (optional sub-menu)
```

### Add Dropdown/Submenu
```
In any nav item → Dropdown Items → Add item
├─ Text: "Sub Page"
└─ Link: "/sub-page"
```

### Change Footer Link
```
Footer → Sections → Select section → Links → Edit
├─ Text: "New Link Text"
└─ URL: "/new-url"
```

### Update Copyright
```
Footer → Copyright Text → Edit text → Publish
```

### Add Social Media
```
Footer → Social Media Links → Add item
├─ Platform: Select from dropdown
└─ URL: https://...
```

---

## ⚡ Remember

1. **Always click "Publish"** (not just save)
2. **Wait 1-2 minutes** after publishing
3. **Hard refresh** browser (Ctrl+Shift+R / Cmd+Shift+R)
4. **Test all links** after changes

---

## 🔧 Need Help?

**Detailed Guide:** See `/app/SANITY_NAVIGATION_GUIDE.md`

**Verify Data:**
```bash
cd /app
node verify-sanity-navigation.js
```

**Current Navigation Structure:**
- Header: 5 main items (Stay, Explore, Blog, Services, About)
- Footer: 2 sections (Services, Legal) + Social + Copyright

---

## ✨ Pro Tips

- Use `#` for links that only have dropdowns
- Start internal links with `/`
- Keep top-level items to 5-7 max
- Group related pages in dropdowns
- Test on mobile after changes

---

**Last Verified:** December 2, 2025 ✅
