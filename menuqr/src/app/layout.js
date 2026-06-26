export const metadata = {
    title: 'MenuQR',
    description: 'Cardápio digital com vídeos',
  }
  
  export default function RootLayout({ children }) {
    return (
      <html lang="pt-BR">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,300&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>{children}</body>
      </html>
    )
  }