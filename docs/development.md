# Development & Operations — Wangoz Landing Page

## 1. Prerequisites

- **Node.js**: `>= 20.x` (Tested and verified with Node.js `v24.9.0`)
- **Package Manager**: `npm` `>= 10.x` (Tested and verified with npm `v11.6.0`)
- **Operating System**: macOS, Linux, or Windows (WSL recommended)

---

## 2. Setup & Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/CHAOSNicky/wangoz-landing-page.git
cd wangoz-landing-page

# Install dependencies exactly as locked
npm install
```

---

## 3. Available NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `vite` | Starts the local Vite development server with HMR. |
| `build` | `tsc -b && vite build` | Runs full TypeScript project build followed by Vite production bundling. |
| `lint` | `oxlint` | Fast linter checking code quality and React hook rules. |
| `preview` | `vite preview` | Locally serves the generated `dist/` directory for production inspection. |

### 3.1 Running Development Server
```bash
npm run dev
```
By default, the server starts at `http://localhost:5173/`.

### 3.2 Running the Linter
```bash
npm run lint
```
Runs Oxlint on all source files. Oxlint rules are configured in `.oxlintrc.json`.

> **Known Non-Blocking Warning**: Oxlint may report a `react(purity)` warning for `new Date().getFullYear()` at `src/App.tsx:310:15`. This is a non-breaking warning and does not prevent the build from passing.

### 3.3 Building for Production
```bash
npm run build
```
Executes two tasks:
1. `tsc -b`: Compiles TypeScript with project references using `tsconfig.app.json` and `tsconfig.node.json`.
2. `vite build`: Packages and optimizes JS, CSS, and asset bundles into the `dist/` directory.

---

## 4. Verification Workflow for AI Agents & Developers

Before committing any modifications or creating pull requests, execute this exact sequence:

```bash
# Step 1: Run Oxlint
npm run lint

# Step 2: Run Full Production Build (TypeScript + Bundler)
npm run build

# Step 3: Inspect Git Status and Diff
git status
git diff
```

**Pass Criteria**:
- Oxlint exits with code `0` (zero errors).
- TypeScript build passes with zero errors and generates output in `dist/`.
- `git status` shows only intended file changes.

---

## 5. TypeScript Configuration & Strictness

The TypeScript configuration in `tsconfig.app.json` enforces high-standard compile constraints:

```json
{
  "compilerOptions": {
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Important Compilation Rules:
1. **No Unused Variables**: `noUnusedLocals: true` and `noUnusedParameters: true` mean any declared variable, parameter, or imported symbol not used in the file will cause compilation to fail with `TS6133`.
2. **Verbatim Module Syntax**: `verbatimModuleSyntax: true` requires type-only imports to use `import type { ... }` syntax. Failure to do so may emit runtime errors or bundler warnings.
3. **Erasable Syntax Only**: `erasableSyntaxOnly: true` disallows TypeScript-specific syntax that cannot simply be erased (such as enums or runtime namespaces). Use union types and const objects instead.

---

## 6. Deployment

The project is configured for static hosting (inferred from commit `b0822b8` referencing Vercel deployment; no `vercel.json` exists in the repository):
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
