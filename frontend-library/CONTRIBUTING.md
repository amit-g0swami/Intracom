# Contributing Guidelines

Thank you for your interest in contributing to our component library! To maintain high code quality and consistency, please follow these guidelines.

## 🚀 Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally: `git clone <your-fork-url>`
3.  **Install dependencies**: `npm install`
4.  **Create a branch** for your changes: `git checkout -b feature/your-feature-name`

## 🔄 Git Workflow

### Always Rebase
We prefer a clean, linear history. Always rebase your branch against the latest `main` before submitting a Pull Request:
```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
```
**Avoid merge commits** in your feature branches.

### Conventional Commits
We use [Conventional Commits](https://www.conventionalcommits.org/) for automated changelogs and versioning. Commits should follow this format:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

Example: `feat(button): add loading state to button component`

## ⚛️ Component Creation (Atomic Design)

Follow the **Atomic Design** pattern when adding new components:

-   **Atoms**: Basic building blocks (e.g., Button, Input, Spinner).
-   **Molecules**: Simple groups of atoms (e.g., FormField, SearchBar).
-   **Organisms**: Complex components composed of molecules and atoms (e.g., Header, CardGrid).

### Structure
Each component should live in its own directory:
```text
src/components/atoms/MyComponent/
├── MyComponent.tsx       # Component logic and Tailwind styles (CVA)
├── MyComponent.test.tsx  # Unit tests
├── MyComponent.stories.tsx # Storybook stories
└── index.ts              # Barrel export
```

### Composition Pattern
Prefer **Composition** over excessive props. Use the `asChild` pattern (via Radix UI Slot) whenever possible to allow consumers to change the underlying element.

## 🛠️ Hotfixes

1. Create a branch from `main` with the prefix `hotfix/`.
2. Fix the issue and add a regression test.
3. Submit a PR directly to `main`.
4. Ensure the commit message uses the `fix:` prefix.

## 🧪 Quality Assurance

- **Linting**: Ensure `npm run lint` passes.
- **Type Checking**: Ensure `npm run typecheck` passes.
- **Testing**: Ensure `npm run test` passes.
- **Storybook**: Verify your component looks and behaves correctly in Storybook (`npm run storybook`).

## 🍱 Styling

- Use **Tailwind CSS** for all styling.
- Use the `cn` utility (`src/lib/utils.ts`) for merging classes.
- Use `class-variance-authority` (cva) for managing variants and sizes.
