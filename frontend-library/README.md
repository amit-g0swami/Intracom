# Intracom UI

[![npm version](https://img.shields.io/npm/v/intracom-ui.svg)](https://www.npmjs.com/package/intracom-ui)
[![license](https://img.shields.io/npm/l/intracom-ui.svg)](https://github.com/amit-g0swami/lib/blob/main/LICENSE)

A highly scalable, industry-standard React component library built with **Atomic Design**, **Radix UI**, and **Tailwind CSS**.

## Features

- **Atomic Design:** Organized as Atoms, Molecules, Organisms, and Layouts.
- **Tailwind CSS:** Utility-first styling with integrated support for Tailwind CSS 4.
- **Radix UI Primitives:** ARIA-rich and accessible (WAI-ARIA compliant).
- **Strict TypeScript:** 100% type safety with zero `any` types.
- **Storybook:** Interactive development and documentation for all components.
- **Modern UI:** Premium design with glassmorphism, smooth animations, and curated colors.

## Installation

```bash
npm install intracom-ui
```

## Quick Start

### 1. Style Setup

Intracom UI comes with **injected styles** by default. You don't need to import a separate CSS file! The styles are automatically injected when you import any component.

> [!NOTE]
> If you are using Tailwind CSS 4, the library is already optimized for it. For older versions, see the configuration below.

### 2. Configure Tailwind (Optional but Recommended)

To ensure Intracom UI's internal Tailwind styles blend perfectly with your project, add the library to your `tailwind.config.js` content:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/intracom-ui/dist/**/*.{js,cjs}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 3. Usage (JS & TS)

Intracom UI works seamlessly with both JavaScript and TypeScript.

#### TypeScript
```tsx
import { Button, Card } from 'intracom-ui';
```

#### JavaScript
```jsx
import { Button, Card } from 'intracom-ui';
```

## Usage Examples

Here are some common UI patterns you can build with Intracom UI.

### 1. Settings Form
Combine **Card**, **FormField**, and **Switch** for a premium settings interface.

```tsx
import { Card, CardHeader, CardTitle, CardContent, FormField, Input, Switch, Button, CardFooter } from 'intracom-ui';

export function SettingsForm() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField label="Full Name">
          <Input placeholder="John Doe" />
        </FormField>
        <FormField label="Email" description="We'll never share your email.">
          <Input type="email" placeholder="john@example.com" />
        </FormField>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Public Profile</div>
            <div className="text-xs text-gray-500">Allow others to see your profile.</div>
          </div>
          <Switch />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
```

### 2. Data Table with Status
Use **Table** and **Badge** to display structured data beautifully.

```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from 'intracom-ui';

export function UserList() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', status: 'Active' },
    { id: 2, name: 'Bob', email: 'bob@example.com', status: 'Pending' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>
                {user.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 3. Application Layout
Leverage **Header**, **Sidebar**, and **Grid** for a complete dashboard shell.

```tsx
import { Header, Sidebar, SidebarContent, Navbar, NavbarItem, Grid, Container, Card } from 'intracom-ui';

export function Dashboard() {
  return (
    <div className="flex h-screen flex-col">
      <Header>
        <div className="font-bold">Intracom Dash</div>
        <Navbar>
          <NavbarItem active>Overview</NavbarItem>
          <NavbarItem>Analytics</NavbarItem>
        </Navbar>
      </Header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          <SidebarContent>
            {/* Sidebar links here */}
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto p-6">
          <Container>
            <Grid cols={3}>
              <Card className="p-4">Activity</Card>
              <Card className="p-4">Revenue</Card>
              <Card className="p-4">Users</Card>
            </Grid>
          </Container>
        </main>
      </div>
    </div>
  );
}
```

## Available Components

### Atoms
`Button`, `Label`, `Input`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup`, `Badge`, `Avatar`, `Spinner`, `Skeleton`, `Separator`

### Molecules
`Dialog`, `FormField`, `Select`, `Tooltip`, `Alert`, `Tabs`, `Accordion`, `Popover`, `Progress`, `Breadcrumb`

### Organisms
`Card`, `Table`, `DropdownMenu`, `Toast`, `Pagination`, `Stepper`

### Layout
`Container`, `Grid`, `Header`, `Footer`, `Sidebar`, `Navbar`

## Theming

Intracom UI uses CSS Custom Properties (Tokens) for theming. You can override any token in your local CSS.

```css
:root {
  --sp-color-primary-500: #3b82f6;
  --sp-radius-md: 0.375rem;
}
```


## Development

1. **Setup:** `npm install`
2. **Storybook:** `npm run storybook`
3. **Build:** `npm run build`
4. **Test:** `npm run test`

## Roadmap

- [x] Core Atomic Components (Atoms, Molecules, Organisms)
- [x] Storybook Integration
- [x] Accessibility (A11y) Addon & Automated Tests
- [/] Comprehensive JSDoc Documentation
- [ ] Dark Mode Support (System-wide)
- [ ] Framer Motion Animations for Organisms
- [ ] Theme Builder/Generator Tool

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository.
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`.
3. **Commit your changes**: `git commit -m 'Add amazing feature'`.
4. **Push to the branch**: `git push origin feature/amazing-feature`.
5. **Open a Pull Request**.

Please ensure your code follows the existing style, passes linting, and includes tests.
