# Alyaa Events - Premium Wedding & Engagement Decoration Website

## 1. Project Overview

- **Project Name:** Alyaa Events
- **Type:** Premium wedding decoration agency website (Single Page Application)
- **Core Functionality:** Showcase luxury wedding decoration services, display portfolio, and enable client inquiries via WhatsApp
- **Target Users:** Couples planning weddings, engagements, and special events seeking premium decoration services

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections (in order):**
1. Navigation (fixed)
2. Hero Section (fullscreen video)
3. Featured Projects Gallery
4. About Us
5. Services
6. Interactive Event Planner
7. Process Timeline
8. Client Testimonials
9. Instagram Gallery
10. Contact Section
11. Footer

**Responsive Breakpoints:**
- Mobile: 0 - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Visual Design

**Color Palette:**
- Primary Background: `#FDF6EF` (warm cream)
- Secondary Background: `#F4D9CC` (blush pink)
- Accent: `#B7AE84` (sage green)
- Text/Accent Dark: `#5B3E2B` (warm brown)
- White: `#FFFFFF`
- Overlay: `rgba(93, 62, 43, 0.85)`

**Typography:**
- Headings: 'Cormorant Garamond', serif
  - H1: 72px / 64px mobile
  - H2: 48px / 36px mobile
  - H3: 32px / 24px mobile
- Body: 'Poppins', sans-serif
  - Regular: 16px
  - Small: 14px
  - Large: 18px

**Spacing System:**
- Section padding: 120px vertical / 80px mobile
- Container max-width: 1400px
- Grid gap: 32px
- Card padding: 32px

**Visual Effects:**
- Soft shadows: `0 20px 60px rgba(93, 62, 43, 0.08)`
- Glassmorphism: `backdrop-filter: blur(20px)` with `rgba(255,255,255,0.7)` background
- Border radius: 24px for cards, 12px for buttons, 50% for avatars
- Transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1)

### Components

**Navigation:**
- Fixed top, transparent initially, solid on scroll
- Logo left, menu right
- Mobile: hamburger menu with fullscreen overlay
- Links: Home, Portfolio, About, Services, Contact

**Hero Section:**
- Fullscreen (100vh) with background video (wedding decoration)
- Dark overlay for text readability
- Centered content with staggered animation
- Headline: "Crafting Unforgettable Moments"
- Subheadline: "Luxury Wedding & Event Decorations"
- Two CTA buttons: "View Portfolio" (outline), "Plan Your Event" (filled)

**Featured Projects Gallery:**
- Masonry layout (3 columns desktop, 2 tablet, 1 mobile)
- 6 featured project cards
- Lightbox on click with image preview
- Hover: scale(1.02) with overlay fade

**About Us:**
- Split layout: image left, content right
- Story timeline with animated counters
- Statistics: Years (12+), Events (500+), Clients (1000+)
- Counter animations on scroll into view

**Services:**
- 4 service cards in grid
- Icons with service name and description
- Soft hover lift effect
- Services: Weddings, Engagements, Corporate Events, Special Celebrations

**Interactive Event Planner:**
- Multi-step form (6 steps)
- Steps: Event Type, Guest Count, Style, Colors, Budget, Notes & Images
- File upload for inspiration images
- Generate WhatsApp message on submit
- Progress indicator
- Glassmorphism card container

**Process Timeline:**
- Vertical timeline with 5 steps
- Alternating left/right on desktop
- Animated reveal on scroll
- Steps: Consultation, Design, Proposal, Execution, Celebration

**Client Testimonials:**
- Horizontal scroll carousel (no traditional slider)
- Auto-scroll with pause on hover
- Quote, client name, event type, avatar
- Navigation dots

**Instagram Gallery:**
- Instagram-style grid (4 columns)
- Hover overlay with like icon
- Link to Instagram profile

**Contact Section:**
- Contact info cards (phone, email, location)
- Map placeholder
- Social media links

**Footer:**
- 4 columns: About, Quick Links, Services, Contact
- Newsletter signup
- Copyright

---

## 3. Functionality Specification

### Core Features

1. **Smooth Scroll Navigation**
   - Click nav links to scroll to sections
   - Active state highlighting

2. **Video Hero**
   - Autoplay loop muted video
   - Fallback image for slow connections

3. **Masonry Gallery**
   - CSS Grid masonry simulation
   - Lightbox with close button

4. **Animated Counters**
   - Count up animation when in viewport
   - Target numbers: 12+ years, 500+ events, 1000+ clients

5. **Event Planner Form**
   - Step-by-step form navigation
   - Form validation
   - Image upload preview
   - WhatsApp message generation with all form data

6. **Testimonials Carousel**
   - Auto-advance every 5 seconds
   - Manual navigation
   - Pause on hover

7. **Scroll Animations**
   - Fade in up on scroll
   - Staggered children animations
   - Using Framer Motion

### User Interactions

- **Navigation:** Smooth scroll to sections
- **Gallery:** Click to open lightbox, ESC to close
- **Event Planner:** Next/Previous buttons, form submission
- **Testimonials:** Click dots to navigate, auto-play
- **Instagram:** Hover to show overlay, click to open

### WhatsApp Integration

- Generate message with:
  - Event type
  - Guest count
  - Decoration style
  - Colors
  - Budget
  - Notes
  - Images (if any, mention filenames)
- Open WhatsApp with pre-filled message

---

## 4. Acceptance Criteria

### Visual Checkpoints

- [ ] Navigation is fixed and changes background on scroll
- [ ] Hero video plays automatically (muted)
- [ ] Gallery displays in masonry layout
- [ ] About section shows animated counters
- [ ] Services display with hover effects
- [ ] Event planner form works through all steps
- [ ] WhatsApp message generates correctly
- [ ] Testimonials carousel auto-advances
- [ ] All sections responsive on mobile
- [ ] Animations are smooth (60fps)
- [ ] Colors match the specified palette
- [ ] Typography uses Cormorant Garamond and Poppins

### Functional Checkpoints

- [ ] All navigation links work
- [ ] Lightbox opens and closes
- [ ] Form validation prevents empty required fields
- [ ] Image upload shows preview
- [ ] WhatsApp link opens with correct message
- [ ] Scroll animations trigger correctly
- [ ] No console errors
- [ ] Page loads under 3 seconds