import "./globals.css";

import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Flood Routing AI",
  description: "Intelligent Flood Routing System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
