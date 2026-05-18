# InvoiceKit 🦉
## 🌐 Live Demo

febrits/habitgrid


A sleek, dark-themed invoice generator for freelancers. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Features

- **Create & Edit Invoices** — sender info, client info, line items, notes, due dates
- **Auto-calculations** — subtotal, tax, and total computed automatically
- **Professional Preview** — clean, print-ready invoice layout
- **Dashboard** — stats overview with revenue, pending, and invoice counts
- **Mark as Paid/Unpaid** — track payment status
- **Print** — one-click print via `window.print()`
- **Search** — filter invoices by number, client, or sender
- **Local Storage** — all data persisted in browser
- **Sample Invoice** — pre-loaded example to get started
- **Dark Theme** — easy on the eyes (#0a0a0f base)

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- lucide-react (icons)
- uuid (unique IDs)
- date-fns (date formatting)

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```

## Project Structure

```
src/
├── types/invoice.ts          # TypeScript interfaces
├── hooks/useLocalStorage.ts  # localStorage persistence hook
├── utils/
│   ├── calculations.ts       # subtotal, tax, total
│   └── sampleData.ts         # sample invoice generator
├── components/
│   ├── InvoiceForm.tsx       # create/edit form
│   ├── InvoicePreview.tsx    # print-ready preview
│   └── InvoiceList.tsx       # dashboard list
├── App.tsx                   # main app with routing
├── main.tsx                  # entry point
└── index.css                 # Tailwind + theme
```

## License

MIT
