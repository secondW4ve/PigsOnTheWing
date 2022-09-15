import Head from 'next/head';
import NavBar from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../helpers/create-urql-client';

const Index = () => (
  <>
    <Head>
      <title>Pigs on the Wing</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <NavBar />
  </>
);

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
