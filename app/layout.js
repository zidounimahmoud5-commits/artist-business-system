export const metadata = {
  title: "Artist Business System",
  description: "Run your art studio like a real business.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
