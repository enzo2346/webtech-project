import { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useContext, useEffect } from "react";
import Header from "../../components/Header.js";
import Footer from "../../components/Footer.js";
import UserContext from "../../components/UserContext";

/* source: https://tailwindui.com/components/application-ui/forms/form-layouts */

export default function NewArticle() {
  const { user } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [message, setMessage] = useState(null);

  const exitNewArticle = async function () {
    router.push("/articles");
  }

  const checkSlug = async function () {
    const slugString = document.getElementById("slug").value;
    if (slugString.length === 0) {
      document.getElementById("slug").className = "mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
    } else {
      let { data } = await supabase
        .from('articles')
        .select('slug')
        .eq('slug', slugString)
        .single()
      if (data) {
        document.getElementById("slug").className = "mt-1 block w-full rounded-md border-red-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm";
      } else {
        document.getElementById("slug").className = "mt-1 block w-full rounded-md border-green-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm";
      }
    }
  }

  const onSubmit = async function (e) {
    e.preventDefault();
    const data2 = new FormData(e.target);
    if (!user) {
      setMessage(
        <div>
          <h2 className="text-center mt-3">Redirection...</h2>
          <p>You are not login.</p>
        </div>
      );

      window.setTimeout(function(){
        setMessage(null);
        router.push("/login");
      }, 2000);
    } else {
      let { data, error } = await supabase
        .from('profiles')
        .select('admin')
        .eq('uid', user.id)
        .single()
      if (!error) {
        if (data && data.admin === true) {
          setMessage(
            <div>
              <h2 className="text-center mt-3">Admin account</h2>
              <p>You can&apos;t write article.</p>
            </div>
          );
          window.setTimeout(function(){
            setMessage(null);
            router.push("/articles");
          }, 2000);
        } else {
          data2.append('uid', user.id);
          const { error } = await supabase
            .from("articles")
            .insert(Object.fromEntries(data2), { returning: "minimal" });
          if (error) {
            const slugString = document.getElementById("slug").value;
            let { data } = await supabase
              .from('articles')
              .select('slug')
              .eq('slug', slugString)
              .single()
            if (data) {
              setMessage(
                <div>
                  <h2 className="text-center mt-3">Slug already taken</h2>
                  <p>Please change your slug.</p>
                </div>
              );

              window.setTimeout(function(){
                setMessage(null);
              }, 2000);
            } else {
              setMessage("Sorry, an unexpected error occured.");
              window.setTimeout(function(){
                setMessage(null);
              }, 2000);
            } 
          } else {
            setMessage(
              <div>
                <h2 className="text-center mt-3">Confirmation</h2>
                <p>You have added a new article.</p>
              </div>
            );

            window.setTimeout(function(){
              setMessage(null);
              router.push("/articles");
            }, 2000);
          }
        }
      }
    }
  };
  return (
    <>
      <Head>
        <title>BEnzMa - New article</title>
        <meta name="description" content="BEnzMa - New article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]">
      <Header />
      <br></br>
      <br></br>
      <h1 className="wt-title text-gray-300">New article</h1>
        <div className="mx-auto sm:w-3/4 md:w-3/4 max-w-screen-lg inset-x-0 top-10 pb-40 px-10">
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={onSubmit}>
              <div className="border-gray-600 border shadow sm:overflow-hidden rounded-md">
                <div className="dark:bg-slate-800 bg-slate-300 space-y-6 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="title" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Title
                      </label>
                      <input
                        minlength="5"
                        maxlength="50"
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="slug" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Slug
                      </label>
                      <input
                        maxlength="25"
                        type="text"
                        name="slug"
                        id="slug"
                        onChange={checkSlug}
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                      Content
                    </label>
                    <div className="mt-1">
                      <textarea
                        minlength="50"
                        id="message"
                        name="message"
                        rows={15}
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Write you message here!"
                        defaultValue={''}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="dark:bg-slate-800 bg-slate-300 px-4 py-3 text-right sm:px-6">
                  <a
                    onClick={exitNewArticle}
                    className="select-none cursor-pointer inline-flex mr-0 justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </a>
                  <button
                    type="submit"
                    className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add new article
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {message && (
            <div
              aria-label="Overlow below the drawer dialog"
              className="fixed inset-0 bg-black/80 flex items-center justify-center"
              role="dialog"
            >
              <div
                aria-label="Alert pane"
                className="max-h-[90vh] max-w-[95vw] overflow-auto p-4 prose bg-white rounded"
              >
                {message}
              </div>
            </div>
          )}
      </div>
      <Footer />
    </>
  );
};