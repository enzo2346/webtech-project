import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/Header.js";
import Footer from "../../components/Footer.js";
import UserContext from "../../components/UserContext";
import { useState } from "react";
import MD5 from "crypto-js/md5";

/* eslint-disable @next/next/no-img-element */

export default function Profile() {
  const { user, logout, loading } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [myArticles, setMyArticles] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [profile, setProfile] = useState('');
  const [urlGravatar, setUrlGravatar] = useState('');

  const updateProfileRedirection = async function () {
    router.push(`/profile/edit`);
  };

  const onClickLogout = function () {
    logout();
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

  const expendMyComments = async function () {
    if (document.getElementById("expendDivMyComments").className === "") {
      document.getElementById("expendDivMyComments").className = "h-20 overflow-hidden";
      document.getElementById("titleExpendDivMyComments").innerHTML = "My comments&ensp;&#x25bc;";
    } else {
      document.getElementById("expendDivMyComments").className = "";
      document.getElementById("titleExpendDivMyComments").innerHTML = "My comments&ensp;&#x25b2;";
    }
  };

  const editComment = async function (idComment) {
    if (user) {
      let { data, error } = await supabase
        .from('comments')
        .select('id_article')
        .eq('id', idComment)
        .single()
      if (!error) {
        let idArticle = data.id_article;
        if (true) {
          let { data, error } = await supabase
            .from('articles')
            .select('slug')
            .eq('id', idArticle)
            .single()
          if (!error) {
            router.push(`/articles/${data.slug}?comment=${idComment}`);
          }
        }
      } else {
        setMessage("Sorry, an unexpected error occured.");
        window.setTimeout(function(){
          setMessage(null);
        }, 2000);
      }
    }
  }

  const deleteComment = async function (idComment) {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq('id', idComment)
    if (error) {
      setMessage("Sorry, an unexpected error occured.");
      window.setTimeout(function(){
        setMessage(null);
      }, 2000);
    } else {
      router.push(`/profile?scroll=${window.pageYOffset}`);
    }
  }

  const articleRedirection = async function (slug) {
    router.push(`/articles/${slug}`);
  };

  const editArticleRedirection = async function (slug) {
    router.push(`/articles/edit/${slug}`);
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('scroll')) {
      var scroll = 0;
      scroll = urlParams.get('scroll');
      window.scrollTo(0, scroll);
    }

    const fetchMyComments = async function () {
      if (user) {
        let { data, error } = await supabase
          .from("comments")
          .select(`id, created_at, uid, content`)
          .eq('uid', user.id)
          .order('created_at', { ascending: true })
        if (!error) {
          setMyComments(data);
        }
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
      let profileArray = [];
      let profileBuffer = {};
      let profileMap;
      let { data, error } = await supabase
       .from('profiles')
       .select()
       .eq('uid', user.id)
       if (!error) {
         profileArray = data;
         if (!profileArray[0]) {
           const { error } = await supabase
             .from("profiles")
             .insert({ uid: user.id})
           if (!error) {
             fetchProfile();
           } else {
             setMessage("Sorry, an unexpected error occured.");
             window.setTimeout(function(){
               setMessage(null);
             }, 2000);
           }
         } else {
          profileMap = Object.entries(profileArray[0]);

          profileBuffer.uid = profileMap[1][1];
          profileBuffer.firstname = profileMap[2][1];
          profileBuffer.lastname = profileMap[3][1];
          profileBuffer.birthdate = profileMap[4][1];
          profileBuffer.pseudo = profileMap[5][1];
          profileBuffer.admin = profileMap[6][1];

          if (profileMap[6][1] === true) {
            var element = document.getElementById("backgroundAdminId");
            element.classList.add("backgroundAdmin");
          }

          profileBuffer.email = user.email;
          profileBuffer.phone = user.phone;

          setProfile(profileBuffer);
        }
      }
    }


    if (!(user || loading)) {
      router.push("/login");
    } else {
      fetchProfile();
      fetchMyComments();
      fetchMyArticles();
      setUrlGravatar("https://www.gravatar.com/avatar/" + MD5(((user.email).trim()).toLowerCase()) + "?s=90&d=identicon&r=g");
    }
  }, [user, loading, router, supabase]);
  return (
    <>
      <Head>
        <title>BEnzMa - Profile</title>
        <meta name="description" content="BEnzMa - Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]" id="backgroundAdminId">
      <Header />
      <br></br>
      <br></br>
      <div
        onClick={onClickLogout}
        className="absolute right-0 select-none cursor-pointer inline-flex sm:mr-10 mr-6 justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Logout
      </div>
      <h1 className="absolute sm:static pl-10 sm:pl-0 wt-title text-gray-300">Your profile</h1>
      <div className="mx-auto sm:w-3/4 md:w-3/4 max-w-screen-lg inset-x-0 top-10 pb-40 px-10">
          <div className="mt-5 md:col-span-2 md:mt-0 sm:pt-0 pt-16">
            <form>
              <div className="border-gray-600 border shadow sm:overflow-hidden rounded-md">
                <div className="dark:bg-slate-800 bg-slate-300 space-y-6 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 text-center">
                      <img alt="" className="mx-auto rounded-lg" src={urlGravatar} />
                      <label className="block text-sm font-medium dark:text-gray-300 text-gray-800 pt-1">
                        Avatar
                      </label>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="firstname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={profile.firstname}
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-0 focus:ring-gray-500 sm:text-sm"
                        readOnly={true}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="lastname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={profile.lastname}
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-0 focus:ring-gray-500 sm:text-sm"
                        readOnly={true}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="birthdate" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Birthdate
                      </label>
                      <input
                        type="text"
                        name="birthdate"
                        id="birthdate"
                        value={profile.birthdate}
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-0 focus:ring-gray-500 sm:text-sm"
                        readOnly={true}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="pseudo" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Pseudo
                      </label>
                      <input
                        type="text"
                        name="pseudo"
                        id="pseudo"
                        value={profile.pseudo}
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-0 focus:ring-gray-500 sm:text-sm"
                        readOnly={true}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Email
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        value={profile.email}
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-0 focus:ring-gray-500 sm:text-sm"
                        readOnly={true}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={profile.phone}
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-0 focus:ring-gray-500 sm:text-sm"
                        readOnly={true}
                        required
                      />
                    </div>
                  </div>
                  <div className="dark:bg-slate-800 bg-slate-300 px-4 py-3 text-right sm:px-6 w-full">
                      <a
                        onClick={updateProfileRedirection}
                        className="select-none cursor-pointer inline-flex mr-0 justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Modify profile
                      </a>
                    </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {(!(user || loading) || (myArticles.length === 0)) ? (
        <p className="hidden"></p>
      ) : (
        <>
          <div className="text-center pb-32 relative mt-[-60px]">
          <h1 onClick={expendMyArticle} id="titleExpendDivMyArticle" className="dark:hover:text-gray-400 hover:text-gray-600 select-none cursor-pointer absolute sm:static pl-10 sm:pl-0 wt-title text-gray-300">My articles&ensp;&#x25bc;</h1>
          <div id="expendDivMyArticle" className="h-20 overflow-hidden">
          <ul className="flex flex-1 flex-row flex-wrap justify-center w-full mt-0 pt-10 pb-32 mx-auto max-w-7xl">
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
          </div>
        </>
      )}

        {(!(user || loading) || (myComments.length === 0)) ? (
        <p className="hidden"></p>
      ) : (
        <>
          <div className="text-center pb-32 relative mt-[-60px]">
            <h1 onClick={expendMyComments} id="titleExpendDivMyComments" className="dark:hover:text-gray-400 hover:text-gray-600 select-none cursor-pointer absolute sm:static pl-10 sm:pl-0 wt-title text-gray-300">My comments&ensp;&#x25bc;</h1>
            <div id="expendDivMyComments" className="h-20 overflow-hidden">
            <ul className="flex flex-1 flex-row flex-wrap justify-center w-full mt-0 pt-10 pb-32 mx-auto max-w-7xl">
            {myComments.map((comment) => (
              <li key={comment.id} className="h-fit px-4 pb-1 relative inline-block mb-5 mx-2.5 select-none cursor-pointer inset-x-0 top-10 dark:bg-slate-800 bg-slate-300 dark:border-gray-600 border-gray-400 dark:hover:bg-slate-900 border-2 shadow rounded-2xl w-fit max-w-[500px]">
                <div className="whitespace-nowrap flex justify-between">
                  <h4 className="text-sm leading-8 text-left tracking-tight dark:text-gray-400 text-gray-600 inline-block">by <strong className="text-gray-300 dark:text-sky-300 text-sky-600 font-bold">Me</strong></h4>
                  <div className="pt-0.5">
                  <a
                      onClick={() => deleteComment(comment.id)}
                      className="select-none cursor-pointer inline-flex ml-4 justify-center rounded-md border border-transparent bg-red-600 px-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      &#x2702;
                    </a>
                    <a
                      onClick={() => editComment(comment.id)}
                      className="select-none cursor-pointer inline-flex ml-2 justify-center rounded-md border border-transparent bg-green-500 px-1 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      &#x270e;
                    </a>
                  </div>
                </div>
                <hr className="text-gray-300 border dark:border-gray-600 border-gray-400" />
                <p className="text-sm font-bold text-left leading-8 tracking-tight dark:text-gray-300 text-gray-600 break-words">{comment.content}</p>
              </li>
            ))}
          </ul>
          </div>
          </div>
        </>
      )}

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
}
