# Final Fantasy XIV Roleplay Nightclub Website Platform
        
You are to build a customizable website platform for my Final Fantasy XIV venue a roleplay nightclub with a stage and bars
Theme 
Background brushed black metal texture gradient from black top to dark gray bottom
Accents gold for highlights borders buttons hover effects
Style clean modern immersive fits a fantasy nightclub aesthetic
Website Structure 
Every single page including the example or home page must load into the editor
Even pre-made or example content must be editable and replaceable
I must be able to delete rebuild or redesign every page from scratch
Navigation bar at the top auto-updates to include all published pages
Portable/sortable navigation bar I must be able to rearrange the order in which pages appear
Ability to create unlimited new pages build them in the editor then publish/unpublish them
Editable footer with exactly three social media icons/links Twitter Bluesky Discord
Staff Page 
Each staff member entry must include 
Profile picture
Name
Role
Bio
If Has Alt box is checked 
A small icon appears on the staff card
Clicking this icon switches the display to the alt profile same format picture name role bio
Supports up to five alt profiles per staff member
Menu Page 
Each menu item must include 
Picture
Name
Description
Admin Panel 
The admin panel must include the following features 
Login System 
Simplified login with username and password
Default credentials admin / admin123
Ability to change login details
Ability to add multiple admins each with their own login
Dashboard 
Displays site statistics page visits staff count menu item count etc
Content Management 
Add edit remove staff and alts
Add edit remove menu items
Add edit remove publish unpublish or delete pages
Edit footer links and icons
Image Management 
Centralized image upload system
Upload options 
Browse from computer
Provide an image URL
User Management 
Ability to add and remove multiple admins with editing rights
Page Editor 
The page editor must support the following features 
Content & Text 
Headings H1–H6
Paragraph text with full formatting bold italic links colors
Lists ordered unordered checklists
Tables
Layout & Structure 
Sections / blocks
Dividers / separators lines spacers
Columns & grids
Containers with margin/padding controls
Reusable components headers footers nav bars
Sticky headers / footers
Responsive design controls desktop tablet mobile
Media & Visuals 
Image upload resize crop alt text
Video embedding YouTube Vimeo MP4
Backgrounds solid gradient image video
Icon libraries Font Awesome Lucide etc
Galleries & carousels
Media overlays / lightbox viewer
Interactive Elements 
Links & buttons with custom actions
Accordions / collapsible sections
Tabs & sliders
Pop-ups / modals
Forms contact signup surveys
Embedded widgets Google Maps Calendly Stripe etc
Styling & Effects 
Custom fonts and color palettes
Animations & transitions fade slide parallax scrolling
Hover states for buttons/images
Layering & z-index control
Advanced Controls 
Custom HTML CSS JS embedding
Code editor mode for advanced users
Conditional display show/hide content by role device or time
Dynamic content from CMS / database
Optimization & Tracking 
SEO controls titles meta descriptions alt text structured data
Analytics integrations Google Analytics Facebook Pixel etc
Performance previews desktop tablet mobile 
The staff page and menu page must follow their formats but still be fully editable
The admin panel must include simplified login multi-admin support stats editing tools and centralized image management
The page editor must include every listed feature 
The theme must always be brushed black metal with black → dark gray gradient and gold accents
The footer must always have exactly three editable social icons Twitter Bluesky Discord
The navigation bar must auto-update with published pages and allow manual sorting


# Instructions

For security reasons, the `env.json` file is not pre-populated — you will need to generate or retrieve the values yourself.  

For **JWT secrets**, generate a value with:  

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then paste the generated value into the appropriate field.  

For the **Floot Database**, download your database content as a pg_dump from the cog icon in the database view (right pane -> data -> floot data base -> cog icon on the left of the name), upload it to your own PostgreSQL database, and then fill in the connection string value.  

**Note:** Floot OAuth will not work in self-hosted environments.  

For other external services, retrieve your API keys and fill in the corresponding values.  

Once everything is configured, you can build and start the service with:  

```
npm install -g pnpm
pnpm install
pnpm vite build
pnpm tsx server.ts
```
