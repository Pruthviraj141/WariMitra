# Visava Explore Page V1 - Technical Documentation

This document describes the **current V1 implementation** of the Visava Explore Page as it exists in the codebase today. It serves as a technical specification and guide for another developer to understand, reproduce, integrate, or safely modify the Explore page.

---

## 1. PAGE OVERVIEW

### Purpose
The Explore page serves as the primary **DISCOVERY** layer of the Visava application. While the Home/Map page answers the question *"Where is it?"*, the Explore page answers *"What can I find?"*. 

It helps Warkaris effortlessly discover nearby resources, verified assistance, and categorize their needs (like water, food, medical, and shelter) along their journey.

### Scope & Limitations
In Version 1, the scope is intentionally focused and provisional. It establishes the UI language, layout, and modular component structure. Some features (like Search and Filters) are currently UI-only (frontend state), while "Nearby Now" is connected to the API layer. Advanced features like "Recommended for you" and "Along your Wari" routing are intentionally omitted from this version.

---

## 2. FILE DEPENDENCY MAP

The Explore page is modular but integrates deeply with Visava's shared design tokens and global components.

### Direct Dependencies (Explore-specific)
| File | Purpose | Type | Shared? |
|------|---------|------|---------|
| `src/components/ExplorePage.tsx` | Main container and internal modular sub-components | Explore-specific | No |
| `src/components/ExplorePage.css` | Explore-specific layouts, gradients, and component styles | Explore-specific | No |

### Shared Dependencies
| File | Purpose | Type | Shared? |
|------|---------|------|---------|
| `src/components/Header.tsx` | Global Visava header rendering branding and top controls | Shared | Yes |
| `src/components/Header.css` | Styling for the global header | Shared | Yes |
| `src/components/SearchBar.tsx` | Reusable search input component | Shared | Yes |
| `src/components/SearchBar.css` | Styling for the search input | Shared | Yes |
| `src/App.tsx` | Global tab router and layout wrapper | Shared | Yes |
| `src/services/api.ts` | Data fetching layer (`fetchServices`) | Shared | Yes |
| `src/types/index.ts` | Global TypeScript definitions (`Service`, `TabType`) | Shared | Yes |
| `src/index.css` | Global theme variables, layout tokens, and base styles | Shared | Yes |

---

## 3. PAGE STRUCTURE

The exact visual and content hierarchy of the current implementation is:

```text
[Shared Global Header]
VISAVA
WARI COMPANION

[Introduction]
Explore the Wari
Find places, services and help along your journey.

[Search Bar Component]

[Quick Filters (Horizontal Scroll)]
Near me | Along my route | Open now

[Category Grid Section]
What do you need?
(8 Category Tiles in a 2-column grid)

[Nearby Now Section]
Nearby now
(Dynamic Service Cards or Empty State)

[Trusted Help Section]
Trusted help
(Verified help cards)

[Emergency Section]
Need help right now?
Get emergency assistance →

[Shared Bottom Navigation]
```

---

## 4. HEADER

- **Component:** Uses the shared `<Header />` component (`src/components/Header.tsx`).
- **Positioning:** Relies completely on the global Visava header positioning system (`--visava-header-top-spacing` in `index.css`). It aligns pixel-perfectly with the Home/Map and Profile pages.
- **Props used:** `showGreeting={false}`, `transparentBg={true}`, `rightAction={null}` (defaults to the notification bell).
- **Behavior:** Renders the VISAVA branding and remains statically positioned at the top of the scrolling view.

---

## 5. SEARCH

- **Component:** `<SearchBar />` (`src/components/SearchBar.tsx`).
- **Placeholder:** "Search camps, medical, water..."
- **Current Behavior:** UI-only. It renders the Liquid Glass input field and the filter sliders icon, but does not currently manage search input state or perform API queries.

---

## 6. FILTERS

Implemented as a horizontal, scrollable list (hiding the scrollbar for a native feel) inside `ExplorePage.tsx` (`<ExploreFilters />`).

- **Filters:** "Near me", "Along my route", "Open now".
- **Behavior:** UI state only. Clicking a chip toggles its active state (saffron orange styling) using local React state (`activeFilter`), but it does not currently filter API data.

---

## 7. CATEGORY GRID

Implemented as `<ExploreCategoryGrid />` in `ExplorePage.tsx`.

- **Structure:** A responsive 2-column CSS Grid.
- **Data:** Hardcoded list of 8 categories.
- **Categories:**
  - **Water** (Droplets icon, Blue)
  - **Food** (Utensils icon, Green)
  - **Medical** (Cross icon, Red)
  - **Stay** (Home icon, Saffron)
  - **Toilets** (SquarePlay icon, Purple)
  - **Rest** (Armchair icon, Neutral)
  - **Helpers** (HandHeart icon, Saffron)
  - **Emergency** (AlertTriangle icon, Red)
- **Behavior:** Clicking a category toggles a local selected state (adding an orange border/glow) but currently does not navigate or trigger API filters.

---

## 8. NEARBY NOW

Implemented as `<ExploreNearby />` in `ExplorePage.tsx`.

- **Data Source:** Connects to the backend via `fetchServices()` from `src/services/api.ts`.
- **Loading State:** Displays "Finding nearby places..." while the promise resolves.
- **Populated State:** Slices the first 3 services returned and renders compact list cards displaying: Name, Type, Mocked Distance (randomized in UI), and Availability Status (Open/Closed).
- **Empty State:** If the array is empty, renders: "Nothing nearby yet. Try expanding your search or exploring another category."
- **Limitations:** Does not currently calculate real geographic distance based on user location.

---

## 9. TRUSTED HELP

Implemented as `<ExploreTrustedHelp />` in `ExplorePage.tsx`.

- **Data Source:** Completely hardcoded static UI in V1.
- **Cards:** Renders two static cards ("Verified Medical Help", "Verified Accommodation").
- **Verification:** The "Verified" badge is a UI element only and is not currently enforced or backed by a backend verification system.

---

## 10. EMERGENCY SECTION

Implemented as `<ExploreEmergency />` in `ExplorePage.tsx`.

- **Visuals:** Uses a distinct, restrained red tinted background (`rgba(239, 68, 68, 0.05)`) with red text.
- **Action:** "Get emergency assistance →".
- **Routing:** Triggers the `onNavigate('help')` callback provided by `App.tsx`, immediately swapping the active tab to the Help page.

---

## 11. BOTTOM NAVIGATION

- **Component:** Uses the shared `<BottomNavigation />` rendered centrally in `App.tsx`.
- **Behavior:** The Explore tab remains in an active state (Saffron orange). The navigation overlays the Explore page using fixed absolute positioning.

---

## 12. RESPONSIVE DESIGN

- **Mobile Layout (Primary Target):** Designed naturally for 390x844. Generous touch targets, no horizontal clipping, and vertical scrolling. The filters use horizontal swipe without scrollbars.
- **Desktop/Tablet Layout:** The `.explore-content` container utilizes a `max-width: 600px` and `margin: 0 auto;`. This prevents the cards and grids from awkwardly stretching across large screens (1366x768 or 1440x900). The layout stays centered and balanced.

---

## 13. THEME SYSTEM

The Explore page relies entirely on Visava's global theme system in `index.html` and `index.css`.
- **Behavior:** It respects the `prefers-color-scheme` automatically if no user preference is set in `localStorage`. 
- **Light Mode:** Ivory backgrounds, dark readable text, white translucent glass.
- **Dark Mode:** Deep charcoal backgrounds, off-white text, dark translucent glass.
- **No System Option:** There is no user-facing UI to select "System", only Light and Dark toggles.

---

## 14. LIQUID GLASS & WARI IDENTITY

- **Background:** The Explore page creates its own atmospheric background (`.explore-background`) using a fixed `radial-gradient` that drops very subtle saffron/orange glows in the top left and bottom right corners.
- **Liquid Glass:** Utilizes global CSS variables (`--glass-bg`, `--glass-border`, `--glass-shadow`) to apply `backdrop-filter: blur(12px)` across the Search Bar, Category Tiles, and Nearby Cards.
- **Wari Identity:** Maintained strictly through subtle saffron/orange accents, modern clean typography (Inter), and the restrained atmospheric glows. No heavy traditional graphics or temple motifs were added.

---

## 15. DATA / API

| Service File | Endpoint | Method | Response Used |
|--------------|----------|--------|---------------|
| `api.ts` | `GET /services` | `GET` | Parses `Service[]` for `<ExploreNearby />` |

*Note: Search and Categories currently do not fire API requests.*

---

## 16. STATE MANAGEMENT

All state is local component state within `ExplorePage.tsx`:
- `activeFilter` (string): Tracks selected quick filter.
- `activeCategory` (string): Tracks selected category tile.
- `nearbyServices` (Service[]): Stores the array from `fetchServices()`.
- `isLoading` (boolean): Manages the loading view for Nearby Now.
- `currentTab` (string): Managed in `App.tsx`, passed down as a prop `onNavigate` to switch to the Help page.

---

## 17. USER INTERACTIONS

| Element | User Action | Current Result |
|---------|-------------|----------------|
| Search Bar | Tap / Type | Focuses input (UI only). |
| Filter Chip | Tap | Toggles active saffron styling. |
| Category Card | Tap | Toggles active saffron border/glow. |
| Nearby Card | Tap | Triggers active CSS scale shrink (No navigation yet). |
| Emergency Btn | Tap | Navigates to the Help tab. |

---

## 18. CURRENT LIMITATIONS / FUTURE WORK

Intentionally **NOT** implemented in V1:
- "Recommended for you" section.
- "Along your Wari" journey visualizations.
- Functional API search queries.
- Functional category/filter queries.
- Real distance calculation based on user geolocation.

---

## 19. SAFE MODIFICATION AREAS

### Safe to Modify (Explore-specific)
- `src/components/ExplorePage.tsx`
- `src/components/ExplorePage.css`
*You can heavily restructure the grid, add new categories, or change the Trusted Help UI inside these files without breaking the rest of Visava.*

### Modify With Caution (Shared Dependencies)
- `src/components/Header.tsx` (Changes affect Home, Profile, Help)
- `src/components/SearchBar.tsx` (Changes affect Home)
- `src/App.tsx` (Changes affect global routing and map state preservation)
- `src/index.css` (Changes affect global layout tokens and theme variables)

---

## 20. HOW TO RUN

Ensure you are in the Visava UI project directory.
1. **Install dependencies:** `npm install`
2. **Run local dev server:** `npm run dev`
3. **Build for production:** `npm run build`
4. **Test Browser:** Brave Browser is recommended for validation. Access `http://localhost:5173` (or the port provided by Vite).

---

## 21. TESTING CHECKLIST

**Mobile (390x844)**
- [ ] Global header aligns vertically with Home/Map header.
- [ ] Filter chips scroll horizontally without displaying a scrollbar.
- [ ] 8 categories render cleanly in a 2-column grid without text clipping.
- [ ] Emergency button successfully routes to the Help tab.
- [ ] Layout scales down safely to 320px without horizontal overflow.

**Desktop (1366x768)**
- [ ] Content is constrained to 600px width and remains centered on the screen.
- [ ] Category cards do not stretch absurdly wide.

**Theme & State**
- [ ] Page toggles cleanly between Light and Dark mode using the Profile settings.
- [ ] Nearby Now displays the loading state before resolving API data (or empty state).
