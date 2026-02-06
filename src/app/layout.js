import './globals.css';

export const metadata = {
  title: 'Symbol Amplifier',
  description:
    'A medium to the collective unconscious. Explore the mythological, cultural, and religious dimensions of dream symbols.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
