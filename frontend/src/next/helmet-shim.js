import Head from 'next/head';

const Helmet = ({ children }) => <Head>{children}</Head>;

const HelmetProvider = ({ children }) => children;

export { Helmet, HelmetProvider };
