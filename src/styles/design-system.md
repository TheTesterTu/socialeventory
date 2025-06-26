
# SocialEventory Design System

## Color System - Single Source of Truth

### Primary Brand Colors
- **Primary**: `hsl(20 184 166)` - Main teal brand color
- **Primary Light**: `hsl(45 212 191)` - Lighter teal variant  
- **Primary Dark**: `hsl(17 94 89)` - Darker teal variant
- **Accent**: `hsl(59 130 246)` - Complementary blue accent

### Status Colors
- **Success**: `hsl(34 197 94)` - Green for success states
- **Warning**: `hsl(251 191 36)` - Amber for warnings  
- **Info**: `hsl(59 130 246)` - Blue for information
- **Destructive**: `hsl(239 68 68)` - Red for errors

### Interaction Colors
- **Like**: `hsl(239 68 68)` - Red for likes
- **Attend**: `hsl(34 197 94)` - Green for attendance
- **Save**: `hsl(251 191 36)` - Amber for saves

### Category Colors
- **Music**: Purple `hsl(168 85 247)`
- **Technology**: Blue `hsl(59 130 246)`
- **Food & Drink**: Green `hsl(34 197 94)`
- **Art & Culture**: Pink `hsl(236 72 153)`
- **Sports**: Orange `hsl(249 115 22)`
- **Business**: Gray `hsl(107 114 128)`

## Usage Guidelines

### DO:
✅ Use CSS custom properties: `bg-primary`, `text-primary`
✅ Use utility classes: `category-music`, `text-success`
✅ Use unified button variants: `variant="primary"`
✅ Apply consistent glass effects: `glass-card`, `glass-panel`

### DON'T:
❌ Use hardcoded colors: `bg-blue-500`, `text-yellow-400`
❌ Mix color systems: combining teal primary with blue buttons
❌ Create custom colors outside the system
❌ Use opacity values inconsistently

## Component Standards

### Buttons
- Use `UnifiedButton` component for consistency
- Variants: `primary`, `secondary`, `outline`, `ghost`, `success`, `warning`, `destructive`

### Cards
- Use `glass-card` for consistent glass morphism
- Apply `event-card` for event-specific styling
- Use `modern-shadow` for elevation

### Text
- Titles: `text-gradient` or `font-display`
- Status messages: `text-success`, `text-warning`, `text-destructive`
- Categories: `category-{type}` classes

## Migration Checklist

### Completed:
✅ Unified CSS custom properties
✅ Created category color system
✅ Updated Tailwind config
✅ Created utility classes
✅ Updated QuickCategories component

### Next Steps:
🔄 Update all buttons to use UnifiedButton
🔄 Replace hardcoded colors in all components
🔄 Standardize card components
🔄 Update event badges and category pills
🔄 Audit and fix text colors
