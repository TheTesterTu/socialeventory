# Color System Guidelines

## ✅ Semantic Color Tokens (ALWAYS USE THESE)

### Text Colors
```tsx
// ✅ CORRECT - Uses semantic tokens
<h1 className="text-foreground">Main Title</h1>
<p className="text-muted-foreground">Secondary text</p>
<Label>Form Label</Label> // Uses text-foreground by default

// ❌ WRONG - Hardcoded colors
<h1 className="text-white">Title</h1>
<p className="text-blue-200">Text</p>
<Label className="text-white">Label</Label>
```

### Background Colors
```tsx
// ✅ CORRECT
<div className="bg-background">Content</div>
<Card className="bg-card">Card content</Card>
<Input className="bg-background" />

// ❌ WRONG
<div className="bg-white/10">Content</div>
<Card className="bg-white/5">Card</Card>
<Input className="bg-white/10 text-white" />
```

### Border Colors
```tsx
// ✅ CORRECT
<div className="border border-border">Content</div>
<Input className="border-input focus:border-primary" />

// ❌ WRONG
<div className="border border-white/20">Content</div>
<Input className="border-primary/20" />
```

## 📋 Complete Semantic Token List

### Core Colors
- `bg-background` / `text-foreground` - Main background and text
- `bg-card` / `text-card-foreground` - Card backgrounds
- `bg-muted` / `text-muted-foreground` - Subtle backgrounds and secondary text
- `bg-popover` / `text-popover-foreground` - Dropdown/popover backgrounds

### Interactive Colors
- `bg-primary` / `text-primary-foreground` - Primary actions (buttons)
- `bg-secondary` / `text-secondary-foreground` - Secondary actions
- `bg-accent` / `text-accent-foreground` - Accent highlights
- `bg-destructive` / `text-destructive-foreground` - Delete/danger actions

### Status Colors
- `text-success` / `bg-success` - Success states
- `text-warning` / `bg-warning` - Warning states
- `text-info` / `bg-info` - Info states

### Form Elements
- `border-input` - Input borders
- `border-border` - General borders
- `ring-ring` - Focus rings

## 🎨 Brand Colors (Limited Use)

These should ONLY be used for special effects, not for basic UI:

```tsx
// ✅ ACCEPTABLE - Special gradient effects
<h1 className="text-gradient">Brand Title</h1>
<Button className="gradient-primary">Special CTA</Button>

// ❌ WRONG - Using for basic UI
<Label className="text-gradient">Form Label</Label>
<div className="bg-gradient-to-r from-primary to-accent">Content</div>
```

## 🌓 Dark Mode Support

All semantic tokens automatically adapt to dark mode:

```tsx
// ✅ This works in BOTH light and dark mode
<div className="bg-background text-foreground border border-border">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// ❌ This breaks in dark mode
<div className="bg-white text-black border border-gray-200">
  <h1 className="text-black">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

## 🚫 Common Mistakes to Avoid

### 1. Hardcoded Text Colors
```tsx
// ❌ WRONG
<Label className="text-white">Label</Label>
<p className="text-blue-200">Text</p>

// ✅ CORRECT
<Label>Label</Label> // Uses text-foreground
<p className="text-muted-foreground">Text</p>
```

### 2. Transparent Backgrounds with Wrong Text
```tsx
// ❌ WRONG - White text on potentially white background
<Input className="bg-white/10 text-white" />

// ✅ CORRECT - Semantic colors
<Input className="bg-background text-foreground" />
```

### 3. Gradient Backgrounds for Forms
```tsx
// ❌ WRONG - Decorative gradients on functional UI
<div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-pink-50/5 to-purple-50/10 -z-10" />

// ✅ CORRECT - Clean, functional design
<div className="bg-card border border-border">
  // Form content
</div>
```

### 4. HSL vs RGB Colors
```tsx
// ✅ CORRECT - All colors in index.css are HSL
--primary: 175 70% 41%;  // HSL format
--secondary: 265 75% 50%; // HSL format

// ❌ WRONG - Mixing RGB with HSL functions
--primary: 44 160 157;  // RGB in HSL context = BROKEN COLORS
```

## 🔧 How to Fix Color Issues

If you see broken colors (yellow, cyan, wrong colors):

1. **Check for hardcoded colors**
   ```bash
   # Search for these patterns
   text-white, text-black, text-blue-*, text-gray-*
   bg-white/, bg-black/, bg-blue-*
   border-white/, border-blue-*
   ```

2. **Replace with semantic tokens**
   - `text-white` → `text-foreground` or remove (default)
   - `text-blue-200` → `text-muted-foreground`
   - `bg-white/10` → `bg-card` or `bg-muted`
   - `border-white/20` → `border-border`

3. **Verify HSL format in index.css**
   All CSS variables should be in HSL format: `H S% L%`
   ```css
   /* ✅ CORRECT */
   --primary: 175 70% 41%;
   
   /* ❌ WRONG */
   --primary: rgb(44, 160, 157);
   --primary: #2ca09d;
   ```

## 📚 Reference

See these files for proper implementation:
- `src/index.css` - Color definitions (all HSL)
- `tailwind.config.ts` - Color mappings
- `src/components/ui/*.tsx` - Proper component usage

## 🎯 Quick Checklist

Before committing code with colors:
- [ ] No `text-white` or `text-black` in components
- [ ] No hardcoded color values (blue-200, gray-600, etc.)
- [ ] All colors use semantic tokens
- [ ] Tested in both light and dark mode
- [ ] Forms are readable in both modes
- [ ] No decorative gradients on functional UI
