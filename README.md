# Gutenberg Project – Frontend Assignment

## Overview

This project is a production-grade, responsive web application built using React and Vite. It enables users to explore and search books from Project Gutenberg via the Gutendex API.

The implementation focuses on:

- Clean architecture and maintainability  
- Performance optimization  
- Scalable state and API handling  
- UI consistency with design specifications  

The application consists of:

- Category selection interface  
- Book listing with search and infinite scroll  

---

## Live Behavior Summary

- Selecting a category navigates to a filtered book listing  
- Search dynamically refines results with debounced API calls  
- Infinite scrolling loads additional results seamlessly  
- Clicking a book opens the best available readable format  

---

## Tech Stack

- React.js (Vite)  
- JavaScript (ES6+)  
- CSS3 (custom styling, responsive design)  
- React Router DOM  
- React Icons  
- Intersection Observer API  

---

## Architecture Decisions

### Component Structure

The application follows a modular structure:

- `pages/` – Page-level components (Home, Books)  
- `components/` – Reusable UI blocks (cards, layout pieces)  
- `constants/` – Centralized configuration (text, labels)  

This separation ensures:

- Reusability  
- Scalability  
- Easier debugging and testing  

---

### State Management Strategy

- Local state used via React hooks  
- API state isolated per page  
- AbortController used to prevent stale updates  

This avoids:

- Race conditions  
- Memory leaks  
- UI inconsistencies  

---

## API Integration

### Provided API Limitation

The assignment provided API:

http://skunkworks.ignitesol.com:8000/

Issues observed:

- Frequent downtime  
- Inconsistent responses  
- Not suitable for reliable development  

### Adopted Solution

Used the official Gutendex API:

https://gutendex.com/books/

Justification:

- Identical data structure  
- Supports required filters (`topic`, `search`, `mime_type`)  
- Stable and production-ready  

---

## Core Features

### Category Navigation

- Displays curated categories  
- Enables navigation to filtered results  

---

### Book Listing

- Fetches books dynamically based on category  
- Maintains query consistency during search  
- Handles empty and error states gracefully  

---

### Search (Debounced)

- Reduces unnecessary API calls  
- Improves performance and UX  
- Uses controlled input with delay  

---

### Infinite Scrolling

- Implemented using Intersection Observer  
- Automatically loads next dataset using `next` API URL  
- Prevents duplicate entries  

---

### Book Access Logic

Books are opened based on format priority:

1. text/html  
2. application/pdf  
3. text/plain  

Fallback:

- Displays message if no readable format is available  

---

## Responsive Design

- Mobile-first approach  
- Grid adapts dynamically based on screen size  
- Optimized for:

  - Mobile devices  
  - Tablets  
  - Desktop screens  

### Testing Method

- Chrome DevTools device simulation  
- Multiple viewport breakpoints  

---

## UI Implementation Notes

### Icons

- Design did not include icon assets  
- Used `react-icons` for consistency and scalability  

---

### Background Design

- No background asset provided  
- Implemented using CSS-based SVG/pattern approximation  

---

### Design Fidelity

- Spacing, typography, and layout closely follow design reference  
- Minor deviations handled with best-fit approximations  

---

## Performance Considerations

- Debounced search input  
- Lazy loading for images  
- AbortController for request cancellation  
- Efficient pagination handling  
- Duplicate filtering during infinite scroll  

---

## Scalability Considerations

The codebase is structured to support:

- Multi-language support (via centralized constants)  
- Theming (via CSS variables)  
- Component reuse and extension  

---

## Challenges and Solutions

### API Reliability

- Switched to official Gutendex API  
- Ensured uninterrupted development  

---

### Infinite Scroll Complexity

- Avoided duplicate data merging  
- Controlled loading state transitions  

---

### Loader Visibility Issue

- Prevented unnecessary loader rendering  
- Ensured smooth UX during pagination  

---

### Responsive Grid Layout

- Adjusted layout dynamically for smaller screens  
- Ensured readability and spacing consistency  

---

### Missing Design Assets

- Replaced icons with react-icons  
- Approximated background design using CSS  

---

## Assumptions

- Gutendex API is an acceptable substitute  
- UI assets not provided can be approximated  
- Focus is on functionality, performance, and UX  

---

## How to Run

```bash
npm install
npm run dev