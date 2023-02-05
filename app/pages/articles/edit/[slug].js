import { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useContext, useEffect } from "react";
import Header from "../../../components/Header.js";
import Footer from "../../../components/Footer.js";
import UserContext from "../../../components/UserContext";
import { supabase } from "../../api/supabase";

export default function EditArticle({ slug, id }) {
  const { user, loading } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [article, setArticle] = useState('');
  const [profile, setProfile] = useState('');

  const exitEditArticle = async function () {
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
        .neq('id', id)
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
    const data = new FormData(e.target);
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
      let bufferId = user.id;
      if (profile.admin) {
        bufferId = article.uid;
      }
      const { error } = await supabase
        .from("articles")
        .update(Object.fromEntries(data), { returning: "minimal" })
        .eq('uid', bufferId)
        .eq('id', article.id)
      if (error) {
        setMessage("Sorry, an unexpected error occured.");
        window.setTimeout(function(){
          setMessage(null);
        }, 2000);
      } else {
        setMessage(
          <div>
            <h2 className="text-center mt-3">Confirmation</h2>
            <p>You have updated the article.</p>
          </div>
        );

        window.setTimeout(function(){
          setMessage(null);
          router.push("/articles");
        }, 2000);

      }
    }
  };

  const onDelete = async function () {
    if (user) {
      let bufferId = user.id;
      if (profile.admin) {
        bufferId = article.uid;
      }
      if (article.uid === bufferId) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq('id_article', article.id)
        if (error) {
          setMessage("Sorry, an unexpected error occured.");
          window.setTimeout(function(){
            setMessage(null);
          }, 2000);
        } else {
          const { error } = await supabase
            .from("comments")
            .delete()
            .eq('id_article', article.id)
          if (error) {
            setMessage("Sorry, an unexpected error occured.");
            window.setTimeout(function(){
              setMessage(null);
            }, 2000);
          } else {
            const { error } = await supabase
              .from("articles")
              .delete()
              .eq('uid', bufferId)
              .eq('id', article.id)
            if (error) {
              setMessage("Sorry, an unexpected error occured.");
              window.setTimeout(function(){
                setMessage(null);
              }, 2000);
            } else {
              setMessage(
                <div>
                  <h2 className="text-center mt-3">Confirmation</h2>
                  <p>You have deleted the article.</p>
                </div>
              );

              window.setTimeout(function(){
                setMessage(null);
                router.push("/articles");
              }, 2000);

            }
          }
        }
      } else {
        setMessage(
            <div>
              <h2 className="text-center mt-3">Nice try</h2>
              <p>Your are not allowed to delete somebody article.</p>
            </div>
          );

          window.setTimeout(function(){
            setMessage(null);
            router.push("/articles");
          }, 2000);
      }
    }
  };

  useEffect(() => {
    const fetchArticle = async function () {
      let { data, error } = await supabase
        .from("articles")
        .select(`id, slug, message, title, uid`)
        .eq('id', id)
        .single()
      if (!error) {
        setArticle(data);
      } else {
        router.push("/articles");
      }
    }

    const fetchProfile = async function () {
      if(user) {
        let { data, error } = await supabase
          .from('profiles')
          .select('admin')
          .eq('uid', user.id)
          .single()
        if (!error) {
          setProfile(data);
          if (data.admin === true) {
            var element = document.getElementById("backgroundAdminId");
            element.classList.add("backgroundAdmin");
          }
        }
      }
    }

    fetchArticle();
    if (user) {
      fetchProfile();
    }
  }, [user, loading, router, id, supabase, slug]);
  return (
    <>
      <Head>
        <title>BEnzMa - Edit - {article.title}</title>
        <meta name="description" content="BEnzMa - Edit article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]" id="backgroundAdminId">
      <Header />
      <br></br>
      <br></br>
      <h1 className="wt-title text-gray-300">Edit article</h1>
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
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={article.title}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="slug" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Slug
                      </label>
                      <input
                        onChange={checkSlug}
                        type="text"
                        name="slug"
                        id="slug"
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={article.slug}
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
                        id="message"
                        name="message"
                        rows={15}
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Write you message here!"
                        defaultValue={article.message}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="dark:bg-slate-800 bg-slate-300 px-4 py-3 text-right sm:px-6">
                  <a
                    onClick={exitEditArticle}
                    className="select-none cursor-pointer inline-flex mr-0 justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </a>
                  <a
                    onClick={() => onDelete()}
                    className="ml-5 select-none cursor-pointer inline-flex mr-5 justify-center rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Delete article
                  </a>

                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Update article
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


export async function getStaticProps(ctx) {
  let id = -1;
  let { data, error } = await supabase.from("articles").select(`id`).eq('slug', ctx.params.slug).single();
  if (!error) id = data.id;
  return {
    props: {
      slug: ctx.params.slug,
      id: id,
    },
  };
}

export async function getStaticPaths(ctx) {
  let articles = [];
  let { data, error } = await supabase.from("articles").select(`slug`);
  if (!error) articles = data;
  return {
    paths: articles.map((article) => `/articles/edit/${article.slug}`),
    fallback: true,
  };
}