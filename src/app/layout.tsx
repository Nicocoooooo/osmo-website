// src/app/layout.tsx
import './globals.css'; // Import direct depuis le même répertoire

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <title>Osmo | Le savoir personnalisé par l'IA</title>
        <meta name="description" content="Osmo est une plateforme éducative innovante qui révolutionne la formation professionnelle grâce à l'intelligence artificielle." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}