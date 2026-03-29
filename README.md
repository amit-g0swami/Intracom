# Intracom (Intercom Clone)

Intracom is an enterprise-grade, embeddable customer communication platform built with a highly decoupled microservices architecture. It allows businesses to inject a secure, completely visually isolated chat widget onto any website.

## 🚀 Live Widget Usage

Once a client signs up for an Intracom account, they simply need to copy and paste the snippet below into the `<head>` or `<body>` of their website.

```html
<!-- 👇 THIS IS YOUR ACTUAL LIVE SCRIPT 👇 -->
<script src="https://intracom.goswamiempire.workers.dev/widget.js" data-app-id="my-first-test-app" defer></script>
```

### Why This Architecture Works
The widget is built using **Preact**, **Zustand**, and **Vanilla CSS** wrapped tightly inside a **Web Components Shadow DOM**. 
- **Shadow DOM Shielding**: It natively ignores the host website's CSS. The widget will look perfect whether it is installed on a site with massive `margin: 0 !important` rules or toxic font resets.
- **Micro-Bundle Size**: Because we compile Preact to an IIFE (Immediately Invoked Function Expression) with Vite via Library Mode, the total gzipped footprint is only `~11kb`, guaranteeing your clients' Google PageSpeed SEO scores remain untouched.

## 📁 Repository Structure

*   **/widget**: The embeddable Preact SDK and chat bubble interface.
*   **/frontend-library**: Custom UI components for the internal admin dashboard.
*   *(Coming Soon) /backend*: NestJS Core mapping websockets to postgres.
*   *(Coming Soon) /dashboard*: The Next.js admin dashboard to reply to users.
