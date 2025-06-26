
# Color System Audit - SocialEventory

## Current Issues Identified:
1. **Multiple color systems overlapping**
2. **Hardcoded colors mixed with CSS variables**
3. **Inconsistent primary colors (teal vs blue vs purple vs yellow)**
4. **No single source of truth for colors**

## Current Color References Found:

### CSS Variables (src/index.css):
- `--primary: 56 178 172` (teal)
- `--accent: 20 184 166` (teal variant)
- `--interaction-like: 0 84.2% 60.2%` (red-ish)
- `--interaction-attend: 142.1 70.6% 45.3%` (green-ish)

### Hardcoded Colors Found:
- `text-yellow-500` (in screenshot)
- `bg-blue-700`, `bg-blue-600` (buttons)
- `text-pink-500`, `bg-pink-500` 
- `text-purple-600`, `bg-purple-500`
- `bg-green-500`, `text-green-500`
- `bg-red-500`, `text-red-500`

### Inconsistent Primary Usage:
- Some components use `bg-primary` (teal)
- Others use `bg-blue-500`
- Category pills use various colors
- Text colors mix yellow, pink, purple

## Solution:
Create a unified design system with consistent color usage across all components.
