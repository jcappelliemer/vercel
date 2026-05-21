import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
        <link rel="shortcut icon" href="/assets/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/favicon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
