# Charlie - HTML5 Game Toolkit


A production-ready toolkit for creating HTML5 and PC games with Phaser, Vue, and Vite.
This project is no longer just a starter template — it is a full-featured development toolkit for building, scaling, documenting, and configuring HTML5 games.
Optimized for PC and platforms like [itch.io](https://itch.io).
Supports fullscreen mode, desktop builds, localization, UI component development, and game parameter editing through CMS.


## Tech Stack:

- [Phaser](https://phaser.io) – used for game logic and graphics rendering
- [Vue](https://vuejs.org) – used for building user interfaces
- [Pinia](https://pinia.vuejs.org) – used for managing game state
- [Vite](https://vitejs.dev) – used for project bundling and development
- [Electron](https://www.electronjs.org/docs/latest/) – used for creating a desktop application version
- [Decap CMS](https://decapcms.org) – used for editing game parameters and content through a convenient admin panel
- [Storybook](https://storybook.js.org) – used for isolated development and documentation of UI components
- [i18next](https://www.i18next.com) – used for game localization
- [i18next-vue](https://github.com/i18next/i18next-vue) – used for integrating localization into Vue components
- [Vue Router](https://router.vuejs.org) – used for screen navigation and level transitions

## Authors:

- [Pavel Bezdornov](https://alpinweb.com/index.php/portfolio-archive/starter-template-for-html5-games/)
- [Mark Bezdornov](https://github.com/Bakuard)

Art is sourced from open resources.  
Character design and animation by Pavel Bezdornov.


## Built-in Game Mechanics:

- Top-down movement (WASD)
- Platformer movement (WAD)
- Level transitions powered by [Vue Router](https://router.vuejs.org)
- Health gain and loss system

## Installation and Build:

- Requires Node.js version 20+
- Install dependencies: `npm i`
- Start development server: `npm run dev`
- Build the project: `npm run build`
- Serve the built project: `npx serve dist`  
  (This allows running the template on a regular hosting or platforms like itch.io)
- Start electron application: `npm run electron:start`
- Package the Electron application: `npm run electron:package`
- Build the Electron application: `npm run electron:make`

## Storybook:

Storybook is used for developing, testing, and documenting UI components in isolation from the main game flow.

- Start Storybook: `npm run storybook`
- Storybook will be available at: `http://localhost:6006`

This is useful for building HUD elements, menus, dialogs, buttons, and other interface components without launching the whole game.

## Decap CMS:

Decap CMS is used for editing game parameters and content through an admin interface.

- Start CMS in development mode: `npm run dev:cms`
- CMS admin panel will be available at: `http://localhost:5173/admin/index.html`

This mode starts the Vite development server together with the local Decap backend, so you can manage editable game content and configuration during development.

## Project Structure:

- `src/composition` – contains files for game logic using the Phaser engine
- `src/configs` – contains constants for engine settings, game logic, and event names
- `src/scenes` – contains files for managing Phaser scenes (`Phaser.Scene`)
- `src/screens` – contains Vue components responsible for rendering game screens
- `src/store` – contains files for working with Pinia
- `src/ui-components` – contains Vue components for rendering the HUD and interface elements
- `src/utils` – contains helper functions
- `src/i18n.js` – contains initialization and configuration of localization
- `.storybook` – contains Storybook configuration for UI component development and documentation
- `public/admin` – contains Decap CMS admin panel files and CMS configuration
- `public/assets` – contains all assets
- `electron` – entry point of Electron application



