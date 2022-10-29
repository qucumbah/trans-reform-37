import Head from "next/head";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Транспортная реформа города Иваново</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="description"
          content="Карта маршрутов общественного транспорта города Иваново после транспортной реформы"
        />
        <meta
          name="keywords"
          content="Иваново, реформа транспорта, развитие транспортной сети, новая транспортная сеть, общественный транспорт"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="theme-color" content="#3377e4" />
        <meta property="og:url" content="https://trans-reform-37.vercel.app/" />
        <meta
          property="og:title"
          content="Транспортная реформа города Иваново"
        />
        <meta
          property="og:description"
          content="Карта маршрутов общественного транспорта города Иваново после транспортной реформы"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="stop.png" />
        <link rel="canonical" href="https://trans-reform-37.vercel.app/" />
        <link rel="icon" type="image/png" href="stop.png" />
        <link
          rel="preconnect"
          href="https://core-renderer-tiles.maps.yandex.net"
        />
        <link rel="preconnect" href="https://api-maps.yandex.ru" />
        <link rel="preconnect" href="https://yastatic.net" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
