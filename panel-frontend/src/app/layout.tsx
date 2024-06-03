// app/layout.tsx
import './styles/globals.css'; // Import global styles
import { metadata } from './metadata.tsx'; // Import metadata
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Add any other head tags here */}
      </head>
      <body>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}