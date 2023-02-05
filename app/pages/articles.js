import { useRouter } from "next/router";
import Head from "next/head";
import moment from "moment";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import { supabase } from "./api/supabase";
import { useContext, useEffect } from "react";
import UserContext from "../components/UserContext";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */

export default function Articles() {
  const { user, logout, loading } = useContext(UserContext);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [articles, setArticles] = useState([]);
  const [myArticles, setMyArticles] = useState([]);
  const [profile, setProfile] = useState('');
  const [pseudo, setPseudo] = useState(false);
 
  const newArticleRedirection = async function () {
    if (!(user || loading)) {
      router.push("/login");
    } else {
      if (profile.admin === true) {
        setMessage(
          <div>
            <h2 className="text-center mt-3">Admin account</h2>
            <p>You can&apos;t write article.</p>
          </div>
        );
        window.setTimeout(function(){
          setMessage(null);
        }, 2000);
      } else {
        if (!pseudo) {
          setMessage(
            <div>
              <h2 className="text-center mt-3">Redirection...</h2>
              <p>You need to have a pseudo.</p>
            </div>
          );
          window.setTimeout(function(){
            setMessage(null);
            router.push("/profile/edit");
          }, 2000);
        } else {
          router.push("/articles/new");
        }
      }
    }
  };

  const articleRedirection = async function (slug) {
    router.push(`/articles/${slug}`);
  };

  const editArticleRedirection = async function (slug) {
    router.push(`/articles/edit/${slug}`);
  };

  const expendMyArticle = async function () {
    if (document.getElementById("expendDivMyArticle").className === "") {
      document.getElementById("expendDivMyArticle").className = "h-20 overflow-hidden";
      document.getElementById("titleExpendDivMyArticle").innerHTML = "My articles&ensp;&#x25bc;";
    } else {
      document.getElementById("expendDivMyArticle").className = "";
      document.getElementById("titleExpendDivMyArticle").innerHTML = "My articles&ensp;&#x25b2;";
    }
  };

  const expendEditArticle = async function () {
    if (document.getElementById("expendDivEditArticle").className === "") {
      document.getElementById("expendDivEditArticle").className = "h-20 overflow-hidden";
      document.getElementById("titleExpendDivEditArticle").innerHTML = "Edit user articles&ensp;&#x25bc;";
    } else {
      document.getElementById("expendDivEditArticle").className = "";
      document.getElementById("titleExpendDivEditArticle").innerHTML = "Edit user articles&ensp;&#x25b2;";
    }
  };

  useEffect(() => {
    const fetchArticles = async function () {
      let articlesBuffer = [];
      let { data, error } = await supabase
        .from("articles")
        .select(`id, slug, message, title, created_at, uid`)
        .order('created_at', { ascending: false })
      if (!error) {
        articlesBuffer = data;

        for (let i = 0; i < articlesBuffer.length; i++) {
          let { data, error } = await supabase
            .from("profiles")
            .select(`pseudo`)
            .eq('uid', articlesBuffer[i].uid)
          if (!error) {
            articlesBuffer[i].pseudo = data[0].pseudo;
          }
          if (true) {
            let { data, error } = await supabase
              .from("likes")
              .select()
              .eq('id_article', articlesBuffer[i].id)
            if (!error) {
              articlesBuffer[i].numberLikes = data.length;
            } else {
              articlesBuffer[i].numberLikes = 0;
            }
          }
        }
        setArticles(articlesBuffer);
      }
    }
    
    const fetchMyArticles = async function () {
      if (user) {
        let { data, error } = await supabase
          .from("articles")
          .select(`id, slug, message, title, created_at, uid`)
          .eq('uid', user.id)
          .order('created_at', { ascending: false })
        if (!error) {
          setMyArticles(data);
        }
      }
    }

    const fetchProfile = async function () {
      if(user) {
        let { data, error } = await supabase
          .from('profiles')
          .select('pseudo, admin')
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

    const checkPseudo = async function () {
      if(user) {
        let { data, error } = await supabase
          .from('profiles')
          .select('pseudo')
          .eq('uid', user.id)
          .single()
        if (!error) {
          if (data.pseudo === null) {
            setPseudo(false);
          } else {
            setPseudo(true);
          }
        }
      }
    }


    fetchArticles();
    fetchProfile();
    fetchMyArticles();
    checkPseudo();
  }, [user, loading, router]);
  return (
    <>
      <Head>
        <title>BEnzMa - Articles</title>
        <meta name="description" content="BEnzMa - Articles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>



      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]" id="backgroundAdminId">
      <Header />
      <br></br>
      <br></br>
      <div
        onClick={newArticleRedirection}
        className="absolute right-0 select-none cursor-pointer inline-flex sm:mr-10 mr-4 justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        New article
      </div>
      {!profile.admin ? (
        <p className="hidden"></p>
      ) : (
        <>
          <h1 onClick={expendEditArticle} id="titleExpendDivEditArticle" className="dark:hover:text-gray-400 hover:text-gray-600 select-none cursor-pointer absolute sm:static pl-10 sm:pl-0 wt-title text-gray-300">Edit user articles&ensp;&#x25bc;</h1>
          <div id="expendDivEditArticle" className="h-20 overflow-hidden">
          <ul className="flex flex-1 flex-row flex-wrap justify-center w-full mt-20 pb-32 mx-auto max-w-7xl">
            {articles.map((article) => (
              <li key={article.id} onClick={() => articleRedirection(article.slug)} className="relative mb-10 mx-5 select-none cursor-pointer w-4/4 sm:w-5/12 max-w-screen-lg inset-x-0 top-10 md:px-10 dark:bg-slate-800 bg-slate-200 space-y-6 px-4 py-5 sm:p-6 border-gray-600 dark:hover:bg-slate-900 hover:bg-slate-300 border-2 shadow sm:overflow-hidden rounded-md w-full">
                <h2 className="text-xl font-bold leading-8 tracking-tight dark:text-gray-300 text-gray-800 line-clamp-1 pr-20 sm:pr-16">{article.title}</h2>
                <div
                  onClick={(e) => {e.stopPropagation(); editArticleRedirection(article.slug);}}
                  className="absolute sm:top-[-3px] top-[-7px] right-0 sm:right-[-25px] right-[-1px] select-none cursor-pointer inline-flex sm:mr-10 mr-4 justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >Edit</div>
              </li>
            ))}
          </ul>
          </div>
        </>
      )}

      {(!(user || loading) || (myArticles.length === 0)) ? (
        <p className="hidden"></p>
      ) : (
        <>
          <h1 onClick={expendMyArticle} id="titleExpendDivMyArticle" className="dark:hover:text-gray-400 hover:text-gray-600 select-none cursor-pointer absolute sm:static pl-10 sm:pl-0 wt-title text-gray-300">My articles&ensp;&#x25bc;</h1>
          <div id="expendDivMyArticle" className="h-20 overflow-hidden">
          <ul className="flex flex-1 flex-row flex-wrap justify-center w-full mt-20 pb-32 mx-auto max-w-7xl">
            {myArticles.map((article) => (
              <li key={article.id} onClick={() => articleRedirection(article.slug)} className="relative mb-10 mx-5 select-none cursor-pointer w-4/4 sm:w-5/12 max-w-screen-lg inset-x-0 top-10 md:px-10 dark:bg-slate-800 bg-slate-200 space-y-6 px-4 py-5 sm:p-6 border-gray-600 dark:hover:bg-slate-900 hover:bg-slate-300 border-2 shadow sm:overflow-hidden rounded-md w-full">
                <h2 className="text-xl font-bold leading-8 tracking-tight dark:text-gray-300 text-gray-800 line-clamp-1 pr-20 sm:pr-16">{article.title}</h2>
                <div
                  onClick={(e) => {e.stopPropagation(); editArticleRedirection(article.slug);}}
                  className="absolute sm:top-[-3px] top-[-7px] right-0 sm:right-[-25px] right-[-1px] select-none cursor-pointer inline-flex sm:mr-10 mr-4 justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >Edit</div>
              </li>
            ))}
          </ul>
          </div>
        </>
      )}

      <h1 className="absolute sm:static pl-10 sm:pl-0 wt-title text-gray-300">Articles</h1>
      <ul className="flex flex-1 flex-row flex-wrap justify-center w-full mt-20 pb-32 mx-auto max-w-7xl">
        {articles.map((article) => (
          <li key={article.id} onClick={() => articleRedirection(article.slug)} className="mb-10 mx-5 select-none cursor-pointer text-center w-4/4 sm:w-5/12 max-w-screen-lg inset-x-0 top-10 md:px-10 dark:bg-slate-800 bg-slate-200 dark:hover:bg-slate-900 hover:bg-slate-300 space-y-6 px-4 py-5 sm:p-6 border-gray-600 border-2 shadow sm:overflow-hidden rounded-md w-full">
            {(article.numberLikes !== 0) ? (
              <>
                <div className="absolute md:ml-[-18px] ml-[-2px] mt-[-8px]">
                  <img alt="" src="/heart-fill.svg" width="40px" id="heart" />
                  <div className="w-[40px] relative ml-[-1px] mt-[-32px]"><p className="text-white mx-auto">{article.numberLikes}</p></div>
                </div>
              </>
            ) : (
              <p className="hidden"></p>
            )}
            <h2 className="text-xl font-bold leading-8 tracking-tight dark:text-gray-300 text-gray-800 line-clamp-1">{article.title}</h2>
            <p className="relative top-[-10px] prose max-w-none dark:text-gray-500 text-gray-700 line-clamp-1">
              by <strong className="dark:text-sky-300 text-sky-600 font-bold">{article.pseudo}</strong>, the {moment(article.created_at).format("Do of MMMM YYYY")}
            </p>
            <p className="prose max-w-none dark:text-gray-400 text-gray-600 text-left line-clamp-3 break-all">
              {article.message}
            </p>
          </li>
        ))}
      </ul>

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