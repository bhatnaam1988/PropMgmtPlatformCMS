# Alternative Design: Compact Table Style

If you prefer an even more minimal approach, here's Option 2:

## Code for Compact Table Style

Replace the timeline section with:

```jsx
{checkIn && (() => {
  const checkInDate = new Date(checkIn);
  
  // Calculate threshold dates
  const date90DaysBefore = new Date(checkInDate);
  date90DaysBefore.setDate(checkInDate.getDate() - 90);
  
  const date30DaysBefore = new Date(checkInDate);
  date30DaysBefore.setDate(checkInDate.getDate() - 30);
  
  const date8DaysBefore = new Date(checkInDate);
  date8DaysBefore.setDate(checkInDate.getDate() - 8);
  
  // Format dates
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  return (
    <div className="divide-y divide-gray-100 mb-4">
      {/* Row 1 */}
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm text-gray-600">Before {formatDate(date90DaysBefore)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">100% refund</span>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      </div>
      
      {/* Row 2 */}
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm text-gray-600">{formatDate(date90DaysBefore)} - {formatDate(date30DaysBefore)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">80% refund</span>
          <CheckCircle className="w-4 h-4 text-blue-500" />
        </div>
      </div>
      
      {/* Row 3 */}
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm text-gray-600">{formatDate(date30DaysBefore)} - {formatDate(date8DaysBefore)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">50% refund</span>
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
      </div>
      
      {/* Row 4 */}
      <div className="flex items-center justify-between py-3">
        <div>
          <p className="text-sm text-gray-600">After {formatDate(date8DaysBefore)}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">Non-refundable</span>
          <XCircle className="w-4 h-4 text-red-500" />
        </div>
      </div>
    </div>
  );
})()}
```

## Visual Comparison

### Timeline (Current - Option 1)
- Vertical timeline with dots
- Left-aligned information
- Progressive disclosure flow
- More "storytelling" feel

### Table (Option 2)
- Two-column layout
- Date on left, refund on right
- More compact
- Business-like, professional

## When to Use Each

**Use Timeline (Option 1) if:**
- You want a more narrative flow
- Space is not a major concern
- You prefer visual metaphors
- Users appreciate guided reading

**Use Table (Option 2) if:**
- Maximum compactness needed
- Users want quick scanning
- Mobile space is critical
- Prefer business-style layout

## Current Implementation

✅ **Timeline Style** is currently implemented
- Most elegant and modern
- Good balance of form and function
- Recommended for your audience

