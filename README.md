# Mia's Bakery — Website Project

## Student Information
- **Name:** [Sisanda Martins]
- **Student Number:** [ST10376718]
- **Group:** [NO GROUP]
- **Subject:** [Web Development WEDE5020]

## Project Overview
This repository contains the Portfolio of Evidence (PoE) for the Mia's Bakery website project. Mia's Bakery is a neighbourhood bakery based in Cape Town, South Africa, specialising in freshly baked bread, pastries, and custom celebration cakes. This project takes the website from initial planning (Part 1) through visual design (Part 2) to full functionality and SEO optimisation (Part 3).

## Website Goals and Objectives
- Showcase daily products and custom cakes.
- Allow customers to enquire about custom cake orders.
- Provide trading hours and location details.
- Increase walk-in and online orders.

## Key Features and Functionality
- Home page with hero section and introduction.
- About Us page with bakery history, mission, and vision.
- Products page detailing bread, pastry, and cake offerings.
- Enquiry form for custom cake orders and product questions.
- Contact page with two bakery locations and a contact form.
- Responsive design (added in Part 2).
- Interactive JavaScript features and SEO optimisation (added in Part 3).

## Timeline and Milestones
| Week | Activity |
|---|---|
| 1 | Research and planning |
| 2 | Complete project proposal |
| 3 | Create HTML pages |
| 4 | Apply CSS styling |
| 5 | Add JavaScript functionality |
| 6 | Testing and debugging |
| 7 | Final review and submission |

## Part 1 Details
Part 1 covers project initiation and planning: choosing the target organisation, writing the project proposal, researching and organising content, building the sitemap, and creating the initial HTML structure for all five pages (Home, About Us, Products, Enquiry, Contact Us).

## Part 2 Details
Part 2 focuses on the visual design and responsiveness of the website, and on correcting structural issues identified in the Part 1 HTML.

**Corrections carried over from Part 1 feedback:**
- Fixed an unclosed `<img>` tag in the Home page hero section.
- Replaced an invalid nested `<head>` element in `about.html` with the correct `<header>` element (a `<head>` tag inside `<body>` is not valid HTML and broke the page's document structure).
- Fixed two unclosed `<img>` tags and three malformed `class="price"` attributes in `products.html`.
- Fixed an unclosed `<form>` tag and an unclosed `<select>` tag in `enquiry.html`, and corrected an `<label type="email">` element that should have been an `<input type="email">`.
- Standardised "About Us" capitalisation and corrected a typo in the Products nav link across all pages.

**CSS styling added:**
- Created an external stylesheet (`css/style.css`) linked from every HTML page, using a single consistent filename.
- Added a minimal CSS reset for consistent rendering across browsers.
- Defined a design-token system using CSS custom properties (`:root` variables) for colour palette, typography scale, and spacing scale, so the whole site can be restyled from one place.
- Applied a warm bakery-themed colour palette (roasted-crust brown, cherry-compote red, toasted-crust gold, warm cream) and paired the "Fraunces" display serif with the "Inter" body sans-serif (via Google Fonts).
- Built the page layout using Flexbox (header/nav, highlights list, locations, forms) and CSS Grid (hero overlay, products grid).
- Added interactive states (`:hover`, `:focus-visible`, `:active`) to navigation links, buttons, form fields, and product cards.

**Responsive design added:**
- Implemented two breakpoints using media queries: tablet (`max-width: 900px`) and mobile (`max-width: 600px`).
- Products grid changes from 3 columns (desktop) → 2 columns (tablet) → 1 column (mobile).
- Header/navigation switches from a horizontal row to a stacked layout on mobile.
- Font sizes and spacing reduce at each breakpoint using rem-based custom properties.
- Generated three resolutions (480px / 900px / 1600px wide) of every photograph and implemented `srcset` and `sizes` attributes so browsers download an appropriately sized image instead of the original 4000px+ originals.

## Part 3 Details
Part 3 adds JavaScript interactivity, search engine optimisation (SEO), validated forms and deployment, and applies the feedback from Part 2.

**Live website:** https://github.com/Sanda218/Sisanda/tree/master *(replace with your real link once deployed)*

**Feedback from Part 2 that was applied:**
- Added a hamburger toggle for mobile navigation (visible at 600px and below, keyboard accessible, closes with Escape or when a link is chosen).
- Added a large-desktop breakpoint (1400px and wider) with a wider content column, larger text and a header aligned to the content.
- Added "Our Mission" and "Our Vision" headings on the About page so each paragraph sits under its own heading.
- Replaced the en dash in "Mon–Sat" (and "7am–5pm") on the Contact page with a hyphen for consistency.

**JavaScript features (`js/script.js`):**
| Feature | Page | What it does |
|---|---|---|
| Hamburger menu | All pages | Opens and closes the mobile navigation and updates `aria-expanded` for screen readers |
| Dynamic product listings | Products | Builds the product cards from a JavaScript array instead of fixed HTML |
| Search, filter and sort | Products | Live text search, category filter and sort by price or name, with a result count |
| Gallery with lightbox | Home | Thumbnails open a larger image in a native `<dialog>`, with next/previous, keyboard arrows and Escape to close |
| FAQ accordion | Enquiry | One question open at a time, with arrow-key navigation |
| Interactive map | Contact | Leaflet map with a marker for each branch and "Show on map" buttons |
| Scroll animations | All pages | Sections fade in as they scroll into view (disabled for visitors who prefer reduced motion) |
| Enquiry form | Enquiry | Validates input, then shows an estimated cost and availability for the chosen product and date |
| Contact form | Contact | Validates input and compiles the message into an email addressed to info@miasbakery.co.za |

**Form validation and security:**
- Client-side checks for name, email, South African phone numbers, quantity, dates (no past dates, no Sundays, notice periods) and message length, with an inline error message under each field.
- The enquiry form submits with AJAX (`fetch`) so the page does not reload. Replace the placeholder in `CONFIG.formEndpoint` with a Formspree form ID to send enquiries for real; until then the form runs in demo mode.
## SEO Strategy

**On-page SEO**
| Page | Main keywords | Where they are used |
|---|---|---|
| Home | bakery Cape Town, fresh bread, custom celebration cakes | Page title, meta description, hero heading and paragraph |
| About Us | neighbourhood bakery Cape Town, our story | Page title, meta description, headings |
| Products | sourdough bread, croissants and pastries, celebration cakes, wedding cake | Page title, meta description, product names and descriptions |
| Enquiry | custom cake order Cape Town, order a birthday cake | Page title, meta description, heading, FAQ |
| Contact Us | bakery Cape Town CBD, bakery Observatory, bakery opening hours | Page title, meta description, branch headings, structured data |

*Keywords were chosen by considering what a local customer would type into a search engine when looking for a bakery in Cape Town.*

- **Title tags and meta descriptions:** every page has its own title (under 65 characters) and meta description (under 160 characters).
- **Header tags:** each page has exactly one `<h1>`, followed by `<h2>` and `<h3>` headings in order. The site name in the header is a link, not a heading.
- **Image optimisation:** descriptive file names (e.g. `product-bread-900.jpg`), meaningful alt text, `width` and `height` attributes, lazy loading below the fold and resized versions served with `srcset`.
- **URL structure:** short, readable page names (`products.html`, `enquiry.html`, `contact.html`).
- **Internal linking:** pages link to each other from the body text, the home page category links open the Products page pre-filtered, and every page has a footer navigation.
- **Mobile-friendliness:** responsive layout with a hamburger menu, tested at 375px, 768px, 1440px and 1920px.
- **Structured data:** JSON-LD `Bakery` markup on the home page lists both branches, addresses, phone numbers and trading hours (local SEO).
- **Canonical links and social tags:** each page declares its canonical URL and Open Graph tags for sharing.

**Off-page SEO (recommended actions)**
- *Backlinks:* ask local directories and Cape Town food blogs to link to the website.
- *Social media:* share the products and the website link on the bakery's social media pages (Open Graph tags give link previews an image and description).
- *Local SEO:* claim a Google Business Profile for each branch using the same name, address, phone number and hours shown on the Contact page.

**Additional**
- `robots.txt` allows all crawlers and points to the sitemap.
- `sitemap.xml` lists all five pages.
- *Page speed:* resized responsive images, lazy loading, `fetchpriority` on the hero image, font `display=swap`, and no large JavaScript libraries (Leaflet loads on the Contact page only).
- *Security:* the site is served over HTTPS by the host, external links use `rel="noopener noreferrer"`, and forms use a honeypot and text-only output.

## Deployment
The website is deployed on **GitHub Pages** from the `master` branch (root folder): https://sanda218.github.io/Sisanda/

### Part 3 Features in Action
| Hamburger menu (mobile) | Search and filter | Lightbox gallery | FAQ accordion |
| ![Hamburger menu open on mobile](docs/hamburger-menu.png) | ![Searching the products page](docs/product-search.png) | ![Gallery lightbox open](docs/lightbox-gallery.png) | ![FAQ accordion with one answer open](docs/faq-accordion.png) |

| Estimate and availability | Interactive map | Contact email ready to send |

| ![Enquiry response with cost estimate](docs/enquiry-estimate.png) | ![Map with both branch markers](docs/store-map.png) | ![Compiled contact email preview](docs/contact-email.png) |


## Sitemap
![Mia's Bakery sitemap](docs/sitemap.png)

Shared across all five pages:
Home
├── About Us
├── Products
├── Enquiry
└── Contact Us

## Wireframe
![Mia's Bakery wireframe](docs/wireframe.png)

## Responsive Design Testing
Screenshots were captured using Chrome DevTools' device toolbar at three widths: Desktop (1440px), Tablet (768px), and Mobile (375px).
### Home
| Desktop | Tablet | Mobile |
|---|---|---|
| ![Home desktop](docs/home-desktop.png) | ![Home tablet](docs/home-tablet.png) | ![Home mobile](docs/home-mobile.png) |

### Products
| Desktop | Tablet | Mobile |
|---|---|---|
| ![Products desktop](docs/product-desktop.png) | ![Products tablet](docs/product-tablet.png) | ![Products mobile](docs/product-mobile.png) |

### Enquiry
| Desktop | Tablet | Mobile |
|---|---|---|
| ![Enquiry desktop](docs/enquiry-desktop.png) | ![Enquiry tablet](docs/enquiry-tablet.png) | ![Enquiry mobile](docs/enquiry-mobile.png) |

### Contact Us
| Desktop | Tablet | Mobile |
|---|---|---|
| ![Contact desktop](docs/contactus-desktop.png) | ![Contact tablet](docs/contactus-tablet.png) | ![Contact mobile](docs/contactus-mobile.png) |

## Changelog
| Date | Change |
|---|---|
| [04/08/26] | Initial repository setup and folder structure created |
| [04/08/26] | Created HTML files for all five pages (index, about, products, enquiry, contact) |
| [12/08/26] | Added placeholder content pending final research |
| [28/08/26] | Fixed unclosed `<img>` tag in `index.html` hero section |
| [28/08/26] | Replaced invalid nested `<head>` element with `<header>` in `about.html` |
| [28/08/26] | Fixed two unclosed `<img>` tags and three malformed `class="price"` attributes in `products.html` |
| [28/08/26] | Fixed unclosed `<form>` and `<select>` tags in `enquiry.html`; corrected mislabelled email `<input>` |
| [28/08/26] | Standardised "About Us" capitalisation and fixed "Product" → "Products" nav typo across all pages |
| [28/08/26] | Added `class="active"` to the current page's nav link on every page for a visual "you are here" indicator |
| [28/08/26] | Created external stylesheet `css/style.css` with a CSS reset, design-token custom properties, and base typography, linked from all five HTML pages |
| [28/08/26] | Added Google Fonts ("Fraunces" and "Inter") link tags to all pages |
| [28/08/26] | Built header/navigation, hero, product grid, team card, locations, and form layouts using Flexbox and CSS Grid |
| [28/08/26] | Added `:hover`, `:focus-visible`, and `:active` interactive states to nav links, buttons, product cards, and form fields |
| [28/08/26] | Generated 480px/900px/1600px responsive image versions for all photographs and added `srcset`/`sizes` attributes to reduce page weight on smaller screens |
| [28/08/26] | Added media queries at 900px (tablet) and 600px (mobile) breakpoints; product grid and header layout adapt at each breakpoint |
| [16/09/26] | Captured responsive design screenshots (Home, Products, Enquiry and Contact Us) at desktop (1440px), tablet (768px), and mobile (365px) widths using Chrome DevTools, and added them to the docs folder and README
| [16/09/26] | Resolved a merge conflict between local and remote repository history.
| [16/09/26] | Fixed duplicate '.png.png' file extensions on all responsive design screenshot files in the docs folder.
| [24/10/26] | Part 2 feedback: added a hamburger toggle for mobile navigation (button, JavaScript menu toggle with `aria-expanded`, closes on Escape or link click, animated bars) and hid the link list behind it at 600px and below |
| [24/10/26] | Part 2 feedback: added a large-desktop breakpoint at 1400px (wider content column, larger base text, header aligned with content, larger hero and map) |
| [25/10/26] | Part 2 feedback: added "Our Mission" and "Our Vision" headings to the About page so the two paragraphs are no longer headingless, and fixed a missing space in "ingredients, while" |
| [25/10/26] | Part 2 feedback: replaced en dashes with hyphens in "Mon-Sat" and "7am-5pm" on the Contact page |
| [25/10/26] | Restructured headings so every page has one `<h1>` (page title), moved the site name in the header to a link, and made product and branch titles `<h2>` for correct heading order |
| [25/10/26] | Added a "Skip to main content" link and visible keyboard focus styles for accessibility |
| [25/10/26] | Built the product list from a JavaScript array and added live search, category filter and price/name sorting on the Products page; category links on the home page now open the Products page pre-filtered |
| [25/10/26] | Added the enquiry form validation (name, email, phone, quantity, date, message), an estimated cost and availability response, an "Enquire" button on each product that pre-selects it, and AJAX submission with `fetch` |
| [25/10/26] | Added the contact form validation and a message-type field; the validated message is compiled into an email to info@miasbakery.co.za that the visitor can open in their email app or copy |
| [25/10/26] | Added a honeypot field and text-only output to both forms to reduce spam and prevent script injection |
| [25/10/26] | Replaced the map placeholder with an interactive Leaflet/OpenStreetMap map with a marker for each branch and "Show on map" buttons |
| [25/10/26] | Added a gallery with a lightbox (native `<dialog>`) to the home page and an accordion FAQ to the Enquiry page |
| [25/10/26] | Added CSS animations and transitions (hero fade-in, scroll reveal, gallery zoom, accordion, lightbox) with a `prefers-reduced-motion` fallback |
| [25/10/26] | Capped the hero image height and cropped the photo to fit, so the home page content is no longer pushed far below the screen |
| [25/10/26] | SEO: wrote unique page titles and meta descriptions, canonical links, Open Graph tags, descriptive alt text, image width/height, lazy loading and JSON-LD local business data |
| [25/10/26] | SEO: created `robots.txt` and `sitemap.xml` |
| [25/10/26] | Deployed the website to GitHub Pages (add this row once you have actually deployed it) |


## References
- Bynamnamnam, n.d. *Bakery pastries display photograph*. [Photograph]. Pexels. Available at: https://www.pexels.com/photo/29445730 [Accessed: [04/08/26]].
- Eat Kubba, n.d. *Sliced sourdough bread photograph*. [Photograph]. Pexels. Available at: https://www.pexels.com/photo/11842163 [Accessed: [04/08/26]].
- Fatih Guney, n.d. *Bakery display case photograph*. [Photograph]. Pexels. Available at: https://www.pexels.com/photo/17869890 [Accessed: [04/08/26]].
- Oleksandr Plakhota, n.d. *Baker kneading dough photograph*. [Photograph]. Pexels. Available at: https://www.pexels.com/photo/30232344 [Accessed: [04/08/26]].
- Patricio Ledeill, n.d. *Celebration cake photograph*. [Photograph]. Pexels. Available at: https://www.pexels.com/photo/19036040 [Accessed: [04/08/26]].
- Google Fonts, n.d. *Fraunces* [typeface]. Available at: https://fonts.google.com/specimen/Fraunces [Accessed: 28/08/26].
- Google Fonts, n.d. *Inter* [typeface]. Available at: https://fonts.google.com/specimen/Inter [Accessed: 28/08/26].
- Agafonkin, V., n.d. *Leaflet: an open-source JavaScript library for interactive maps*. Available at: https://leafletjs.com/ [Accessed: 25/10/26].
- OpenStreetMap contributors, n.d. *OpenStreetMap*. Available at: https://www.openstreetmap.org/copyright [Accessed: 25/10/26].
- Formspree, n.d. *Formspree: form backend for static websites*. Available at: https://formspree.io/ [Accessed: 25/10/26].
- Schema.org, n.d. *Bakery*. Available at: https://schema.org/Bakery [Accessed: 25/10/26].
- Sitemaps.org, n.d. *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html [Accessed: 25/10/26].