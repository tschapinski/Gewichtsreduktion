---
name: vansol_funnel_creator
description: Create high-converting funnels with Van Sol branding and animations.
---

# Van Sol Funnel Creator Skill

This skill allows you to rapidly scaffold new funnel projects that adhere strictly to the Van Sol Corporate Identity (CI) and include the signature animations (GSAP).

## Prerequisites

- Node.js installed
- Access to the `Antigravity_Skills/vansol_funnel_creator/resources` directory

## Instructions

### 1. Initialize a New Vite Project

Run the following command to create a new React project (replace `[project-name]` with your desired name):

```bash
npm create vite@latest [project-name] -- --template react
cd [project-name]
npm install
```

### 2. Install Dependencies

Install the required libraries for animations and styling:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install gsap canvas-confetti
```

### 3. Apply Van Sol Branding

Copy the resource files from this skill to your new project:

**Tailwind Configuration:**
Copy `Antigravity_Skills/vansol_funnel_creator/resources/tailwind.config.js` to your project root, overwriting the default one.

**Global Styles:**
Copy `Antigravity_Skills/vansol_funnel_creator/resources/index.css` to `src/index.css`.

**React Template:**
Copy `Antigravity_Skills/vansol_funnel_creator/resources/AppTemplate.jsx` to `src/App.jsx`.

### 4. Setup Fonts

The branding requires custom fonts (`TAN-AEGEAN`, `Nicky Laatz Very Vogue`).

1. Create a `public/fonts` directory in your new project.
2. Ensure you have the `.ttf` or `.otf` files for these fonts.
3. Place them in `public/fonts` so the `index.css` can load them.

### 5. Run the Project

```bash
npm run dev
```

## Customization Guide

- **Questions:** Edit the `questionsData` array in `src/App.jsx` to define your funnel steps.
- **Colors:** The `vansol-*` colors are available as Tailwind utility classes (e.g., `bg-vansol-green`, `text-vansol-dark`).
- **Animations:** Use the `useGSAP` hook provided in `App.jsx` for complex animations. Simple transitions use the CSS classes `animate-fade-in-up`, `animate-bounce-in`, etc.
