# Cancellation Policy Design Proposals

## Current Design Issues
- ❌ Too bold with strong colored backgrounds
- ❌ Stands out too much from rest of page
- ❌ Takes up significant vertical space
- ❌ Heavy visual weight

## Proposed Alternatives

---

## **Option 1: Minimal Timeline Style** ⭐ RECOMMENDED

```
┌─────────────────────────────────────────────┐
│  Cancellation Policy                        │
├─────────────────────────────────────────────┤
│                                             │
│  ● Before 31 Oct 2025                       │
│  │ 100% refund                              │
│  │                                          │
│  ● 31 Oct - 30 Dec 2025                     │
│  │ 80% refund                               │
│  │                                          │
│  ● 30 Dec 2025 - 21 Jan 2026                │
│  │ 50% refund                               │
│  │                                          │
│  ● After 21 Jan 2026                        │
│    Non-refundable                           │
│                                             │
│  ℹ️ Refunds via Stripe. View full policy   │
└─────────────────────────────────────────────┘
```

**Benefits:**
- Clean timeline metaphor
- Subtle color dots instead of backgrounds
- Vertical connector line
- More compact
- Elegant and professional

---

## **Option 2: Compact Table Style**

```
┌─────────────────────────────────────────────┐
│  Cancellation Policy                        │
├─────────────────────────────────────────────┤
│                                             │
│  Before 31 Oct 2025         100% refund  ✓ │
│  31 Oct - 30 Dec 2025        80% refund  ✓ │
│  30 Dec 2025 - 21 Jan 2026   50% refund  ✓ │
│  After 21 Jan 2026           Non-refundable │
│                                             │
│  ℹ️ Refunds via Stripe. View full policy   │
└─────────────────────────────────────────────┘
```

**Benefits:**
- Most compact
- Easy to scan
- Clean alignment
- Subtle checkmarks
- No bold colors

---

## **Option 3: Subtle Cards with Icons**

```
┌─────────────────────────────────────────────┐
│  Cancellation Policy                        │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ Before 31 Oct 2025                       │
│    100% refund                              │
│                                             │
│  ✓ 31 Oct - 30 Dec 2025                     │
│    80% refund                               │
│                                             │
│  ⚠ 30 Dec 2025 - 21 Jan 2026                │
│    50% refund                               │
│                                             │
│  ✕ After 21 Jan 2026                        │
│    Non-refundable                           │
│                                             │
│  ℹ️ Refunds via Stripe. View full policy   │
└─────────────────────────────────────────────┘
```

**Benefits:**
- Simple icons only (no colors)
- Light gray dividers
- Breathing room
- Professional
- Cohesive with page

---

## Visual Comparison

### Current (Bold)
- Background colors: bg-green-50, bg-blue-50, etc.
- Border colors: border-green-200, etc.
- Large icons with colors
- Padding: p-3
- Visual weight: Heavy

### Proposed (Subtle)
- No background colors (just white)
- Subtle gray dividers or timeline
- Small monochrome icons OR colored dots
- Padding: py-2 or py-3
- Visual weight: Light

---

## Recommendation: **Option 1 - Timeline Style**

**Why:**
1. ✅ Modern and elegant
2. ✅ Clear visual hierarchy (vertical flow)
3. ✅ Subtle color (only small dots)
4. ✅ Easy to scan
5. ✅ Matches booking flow metaphor
6. ✅ Professional and trustworthy
7. ✅ Compact but readable

**Color Palette (Subtle):**
- Green dot: `bg-green-500` (small 8x8 circle)
- Blue dot: `bg-blue-500`
- Yellow dot: `bg-yellow-500`
- Red dot: `bg-red-500`
- Connector line: `border-gray-200`
- Text: `text-gray-700` / `text-gray-500`

---

## Mobile Considerations

All three options work well on mobile:
- Option 1: Timeline stacks naturally
- Option 2: Table rows stack
- Option 3: Cards stack vertically

---

## Next Steps

1. Implement Option 1 (Timeline Style)
2. Review with user
3. Adjust if needed

