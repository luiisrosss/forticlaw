# Repository Guidelines

## Project Structure & Module Organization
This repository is a Next.js App Router project. Route files live in `app/` (`app/page.tsx`, `app/privacy/page.tsx`) with shared layout and global styles in `app/layout.tsx` and `app/globals.css`. Reusable UI primitives are in `components/ui/`, landing-page sections are in `components/sections/`, providers live in `components/providers/`, shared hooks in `hooks/`, and utility helpers in `lib/`. Static images and icons belong in `public/`. Product and technical reference docs live in `Docs/`; treat `files/` as supporting collateral, not primary runtime code.

## Build, Test, and Development Commands
Use the existing npm scripts:

- `npm install` installs dependencies.
- `npm run dev` starts the local dev server on `http://localhost:3000`.
- `npm run build` creates the production build; run this before opening a PR.
- `npm run start` serves the production build locally.
- `npm run lint` is intended to run ESLint, but it currently fails because the repo does not include an `eslint.config.*` file yet.

Avoid introducing more lockfile churn. The repo already contains npm and pnpm lockfiles, and Next.js warns when multiple lockfiles are present.

## Coding Style & Naming Conventions
Write TypeScript with `strict` mode expectations in mind and prefer the `@/*` import alias over deep relative paths. Follow the existing style in source files: 2-space indentation, no semicolons, and concise functional React components. Use PascalCase for component exports, kebab-case for filenames such as `hero-section.tsx`, and `use-` prefixes for hooks. Keep Tailwind utility usage close to the JSX; shared tokens and theme variables belong in `app/globals.css`.

## Testing Guidelines
There is no automated test runner configured yet. Until one is added, contributors should at minimum run `npm run build` and manually smoke-test the `/` and `/privacy` routes. If you add non-trivial logic in `lib/`, `hooks/`, or complex components, add tests alongside the code using `*.test.ts` or `*.test.tsx` naming and describe how to run them in the PR.

## Commit & Pull Request Guidelines
Use Conventional Commit style, following the existing history (example: `feat: cleanup landing and connect social/legal links`). Keep commits focused and descriptive. PRs should include a short summary, linked issue if applicable, screenshots for visual changes, and the verification you ran (`build`, manual route checks, or added tests).

## Security & Configuration Tips
Never commit `.env*` files or secrets. When changing metadata, icons, or legal/privacy content, verify the matching assets in `public/` and the corresponding route files in `app/`.
