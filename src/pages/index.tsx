import { FunctionComponent } from 'react'
import Head from 'next/head'

const Home: FunctionComponent = () => {
  return (
    <div>
      <Head>
        <title>3JS Playground</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main id="main">Go to /examples/1</main>
    </div>
  )
}

export default Home
