import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Head>
        <title>BEnzMa - Home</title>
        <meta name="description" content="BEnzMa - Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]">
      <Header />
      <br></br>
      <br></br>
      <h1 className="wt-title text-gray-300">Home</h1>
      
      <div>
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pb-32 pt-20">
            <div>
              <div>
                <h1 className="dark:text-gray-300 text-gray-800 text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                  The blogging application that you have never seen!
                </h1>
                <p className="mt-6 text-lg leading-8 dark:text-gray-400 text-gray-700 sm:text-center">
                  We aim to provide the best service accross the world and give freedom to our user.
                  Writing articles and comments has never been easier...
                </p>
                <div className="mt-8 flex gap-x-4 sm:justify-center">
                <Link href="/login" className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700">
                Get started
                <span className="text-indigo-200" aria-hidden="true">
                      &rarr;
                    </span>
                </Link>
                <Link href="/articles" className="bg-gray-700 inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-300 ring-1 ring-gray-300/10 hover:ring-gray-900/20">
                Read articles
                <span className="text-indigo-200" aria-hidden="true">
                      &rarr;
                    </span>
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-60">
      <div className="dark:bg-slate-800 bg-slate-300">
      <div className="mx-auto max-w-7xl py-12 lg:flex lg:items-center lg:justify-between lg:py-16 px-8">
        <h2 className="text-3xl font-bold tracking-tight dark:text-gray-300 text-gray-700 sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-indigo-600">Start writing articles and comments.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700">Get started</Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
          <Link href="/about" className="inline-flex items-center justify-center rounded-md border border-transparent dark:bg-white bg-slate-700 hover:bg-slate-800 text-slate-100 px-5 py-3 text-base font-medium dark:text-indigo-600 dark:hover:bg-indigo-500">Learn more</Link>
          </div>
        </div>
      </div>
    </div>
    </div>

      </div>
      <Footer />
    </>
  );
};