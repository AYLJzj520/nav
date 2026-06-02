# AGENTS.md

This file is for AI coding agents working on this repository. Read it before
editing. Keep changes small, verifiable, and consistent with the existing
Angular codebase.

## Project Overview

This is a personal navigation page based on Angular standalone components. It
builds a static navigation site from JSON/YAML configuration and data files.

Important runtime flow:

- `src/main.ts` bootstraps `AppComponent` with `src/app/app.config.ts`.
- `src/app/app.routes.ts` defines the view routes/themes.
- `src/app/app.component.ts` initializes locale, token checks, navigation data,
  routing, notifications, and service worker update handling.
- `src/store/index.ts` holds Angular signals for settings, search, tags,
  internal links, components, and nav data.
- `src/utils/web.ts` loads nav data, filters login-only data, emits
  `WEB_FINISH`, and stores user edits in localforage when logged in.
- `data/*.json` and `nav.config.json` are the main static inputs.
- `scripts/start.ts` and `scripts/build.ts` prepare data and inject config/SEO
  into the build output.

## Directory Map

- `src/app/`: Angular app shell, routes, and root providers.
- `src/components/`: reusable UI components such as cards, search, tags,
  drawers, modals, upload controls, and fixed toolbar.
- `src/view/`: routed pages/themes and system/admin pages.
- `src/store/`: global signal state and static data loading.
- `src/utils/`: shared utilities for nav data, user state, routing helpers,
  service worker helpers, and pure data transforms.
- `src/api/`: API helpers and GitHub/data update logic.
- `src/constants/`: paths, storage keys, and shared constants.
- `src/types/`: project type definitions.
- `src/locale/`: Chinese/English locale strings.
- `data/`: generated/static navigation data used by the app.
- `scripts/`: setup/build scripts that transform data and HTML.
- `public/`: public assets copied by Angular.
- `dist/`: build output. Do not commit generated changes from here unless the
  user explicitly asks.

## Commands

Install dependencies if needed:

```bash
npm install
```

Run development server:

```bash
npm run start
```

Default dev server:

```text
http://127.0.0.1:7002/
```

Production build:

```bash
npm run build
```

Build for GitHub Pages:

```bash
npm run build-gh-pages
```

Format TypeScript-like files:

```bash
npm run format
```

Targeted lint for touched files:

```bash
./node_modules/.bin/oxlint path/to/file.ts
```

Full lint:

```bash
npm run lint
```

Known caveat: full lint may report a pre-existing TypeScript ambient-context
issue in `src/types/type.d.ts`. Do not fix unrelated type-definition issues
unless the task is about that file.

## Build Side Effects

`npm run build` and `npm run setup` can rewrite generated data files:

- `data/component.json`
- `data/db.json`
- `data/internal.json`
- `data/tag.json`

If the task is not about regenerating data, restore those files after build:

```bash
git restore --source=HEAD -- data/component.json data/db.json data/internal.json data/tag.json
```

Then confirm the intended diff:

```bash
git status -sb
git diff --stat
git diff --check
```

## Navigation Data Loading

Be careful with `data/db.json`.

The repository version of `data/db.json` may be an LZString base64-compressed
string, while build output may contain plain JSON. Runtime loading in
`src/store/index.ts` must support both formats:

1. Try `JSON.parse(text)`.
2. If that fails, use `lz-string` and `decompressFromBase64(text.trim())`.
3. Parse the decompressed JSON.

Do not change this back to a simple `res.json()` call. That can make the page
load with no navigation data.

## Root Provider Gotcha

`AppComponent` injects NG-ZORRO services, including `NzModalService`. The root
app config must include the required provider setup.

Current fix:

- `src/app/app.config.ts` imports `importProvidersFrom`.
- `src/app/app.config.ts` imports `NzModalModule`.
- `appConfig.providers` includes `importProvidersFrom(NzModalModule)`.

Removing this can cause Angular `NG0201` at startup and leave the page blank
because `app-xiejiahe` never renders its template.

## Local Preview And Browser Verification

After frontend/runtime changes, verify the production output, not only the
build command.

One simple local static preview for the production build:

```bash
ruby -run -e httpd dist/browser -p 8097 -b 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8097/
```

Expected visible content includes:

- `个人导航页`
- `实用工具`
- `开发神器`
- `Github-CLI`

If the page is blank, check browser console logs. Angular `NG0201` usually means
a missing provider, not missing data.

## Editing Rules

- Make the smallest change that solves the user request.
- Do not do unrelated refactors, formatting sweeps, renames, or cleanup.
- Do not overwrite, revert, or delete user changes unless explicitly requested.
- Do not bulk-delete files or directories.
- If deleting is truly needed, delete only one explicit file path at a time.
- Prefer existing project patterns over new abstractions.
- Use structured parsers/APIs for JSON/YAML instead of ad hoc string edits.
- Keep generated build artifacts out of commits unless explicitly requested.
- Future commit messages for this repository should be in Chinese.

## Recommended Workflow

1. Inspect status:

```bash
git status -sb
```

2. Read the relevant files before editing.

3. Apply the smallest patch.

4. Run targeted checks for touched files:

```bash
npx prettier --check path/to/file.ts
./node_modules/.bin/oxlint path/to/file.ts
git diff --check
```

5. For runtime/frontend changes, run:

```bash
npm run build
```

6. Restore build-generated data side effects unless the task is about data
   regeneration.

7. Verify in a browser or static preview when user-facing behavior changed.

8. Commit with a Chinese message if the user asked to publish or the change is
   ready to push.

## GitHub Notes

The active branch is expected to be `main`. The remote is:

```text
https://github.com/AYLJzj520/nav.git
```

When pushing, use Chinese commit messages, for example:

```text
修复：补齐弹窗服务依赖
修复：兼容压缩导航数据加载
文档：补充模型协作指南
```
