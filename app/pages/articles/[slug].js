import Head from "next/head";
import moment from "moment";
import { useContext, useEffect } from "react";
import { supabase } from "../api/supabase";
import Header from "../../components/Header.js";
import Footer from "../../components/Footer.js";
import { useState } from "react";
import { useRouter } from "next/router";
import UserContext from "../../components/UserContext";

/* eslint-disable @next/next/no-img-element */

export default function Article({ slug, id }) {
  const { user, loading } = useContext(UserContext);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [idCommentEdit, setIdCommentEdit] = useState(-1);
  const [article, setArticle] = useState('');
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(false);
  const [numberLikes, setNumberLikes] = useState(0);
  const [profile, setProfile] = useState('');
  
  const editComment = async function (idComment, uidComment) {
    if (user) {
      setIdCommentEdit(idComment);
      let bufferId = user.id;
      if (profile.admin) {
        bufferId = uidComment;
      }
      let { data, error } = await supabase
        .from('comments')
        .select('content')
        .eq('id', idComment)
        .eq('uid', bufferId)
      if (!error) {
        var array = data;
        if (array[0]) {
          var content = array[0];
          var contentMap = Object.entries(content);
          document.getElementById("content").value = String(contentMap[0][1]);
          document.getElementById("content").className = "block mx-auto w-full max-w-[800px] rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm";
          document.getElementById("commentButton").innerHTML = "Save";
          document.getElementById("commentButton").className = "rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none";
          
        }
      } 
    }
  }

  const deleteComment = async function (idComment, uidComment) {
    if (user) {
      let bufferId = user.id;
      if (profile.admin) {
        bufferId = uidComment;
      }
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq('uid', bufferId)
        .eq('id', idComment)
      if (error) {
        setMessage("Sorry, an unexpected error occured.");
        window.setTimeout(function(){
          setMessage(null);
        }, 2000);
      } else {
        router.push(`/articles/${article.slug}?scroll=${window.pageYOffset}`);
      }
    }
  }

  const likeArticle = async function () {
    if (user) {
      if (like) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq('uid', user.id)
          .eq('id_article', id)
        if (!error) {
          setLike(false);
          let { data, error } = await supabase
            .from("likes")
            .select()
            .eq('id_article', id)
          if (!error) {
            setNumberLikes(data.length);
          } else {
            setNumberLikes(0);
          }
        }
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ id_article: id, uid: user.id })
        if (!error) {
          setLike(true);
          let { data, error } = await supabase
            .from("likes")
            .select()
            .eq('id_article', id)
          if (!error) {
            setNumberLikes(data.length);
          } else {
            setNumberLikes(0);
          }
        }
      }
    } else {
      router.push("/login");
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('scroll')) {
      var scroll = urlParams.get('scroll');
      if (scroll === "max") {
        window.scrollTo(0, 99999);
      } else {
        window.scrollTo(0, scroll);
      }
    }

    setIdCommentEdit(-1);
    document.getElementById("content").value = "";
    document.getElementById("content").className = "block mx-auto w-full max-w-[800px] rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm";
    document.getElementById("commentButton").innerHTML = "Comment";
    document.getElementById("commentButton").className = "rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none";

    const fetchArticle = async function () {
      let { data, error, status } = await supabase
        .from("articles")
        .select(`id, slug, message, title, created_at, uid`)
        .eq('id', id)
        .single()
      if (!error) {
        data.date = moment(data.created_at).format("Do of MMMM YYYY, h:mm:ss a");
        let dataBuffer = data;
        if (true) {
          let { data, error } = await supabase
            .from("profiles")
            .select(`pseudo`)
            .eq('uid', dataBuffer.uid)
            .single()
          if (!error) {
            dataBuffer.pseudo = data.pseudo;
          }
        }
        setArticle(dataBuffer);
      } else {
        router.push("/articles");
      }
    }

    const fetchComments = async function () {
      let { data, error } = await supabase
        .from("comments")
        .select(`id, created_at, uid, content`)
        .eq('id_article', id)
        .order('created_at', { ascending: true })
      if (!error) {
        let dataBuffer = data;
        for (let i = 0; i < dataBuffer.length; i++) {
          let { data, error } = await supabase
            .from("profiles")
            .select(`pseudo, admin`)
            .eq('uid', dataBuffer[i].uid)
            .single()
          if (!error) {
            dataBuffer[i].pseudo = data.pseudo;
            dataBuffer[i].admin = data.admin;
          }
        }
        setComments(dataBuffer);
      }
    }

    const fetchCommentsUser = async function () {
      if (user) {
        let { data, error } = await supabase
          .from("comments")
          .select(`id, created_at, uid, content`)
          .eq('id_article', id)
          .order('created_at', { ascending: true })
        if (!error) {
          let dataBuffer = data;
          for (let i = 0; i < dataBuffer.length; i++) {
            let { data, error } = await supabase
              .from("profiles")
              .select(`pseudo, admin`)
              .eq('uid', dataBuffer[i].uid)
              .single()
            if (!error) {
              dataBuffer[i].admin = data.admin;
              if (user.id === dataBuffer[i].uid) {
                dataBuffer[i].pseudo = "Me";
              } else {
                dataBuffer[i].pseudo = data.pseudo;
              }
            }
          }
          setComments(dataBuffer);
        }
      }
    }

    const editCommentFromProfile = async function () {
      if (user) {
        if (urlParams.get('comment')) {
          if (!(urlParams.get('scroll'))) {
            router.push(`/articles/${slug}?comment=${urlParams.get('comment')}&scroll=max`);
          }
          
          setIdCommentEdit(urlParams.get('comment'));

          let { data, error } = await supabase
            .from('comments')
            .select('content, uid')
            .eq('id', urlParams.get('comment'))
            .single()
          if (!error) {
            if (profile.admin || data.uid === user.id) {
              document.getElementById("content").value = data.content;
              document.getElementById("content").className = "block mx-auto w-full max-w-[800px] rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm";
              document.getElementById("commentButton").innerHTML = "Save";
              document.getElementById("commentButton").className = "rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none";
            }
          } else {
            setIdCommentEdit(-1);

            setMessage("Sorry, an unexpected error occured.");
            window.setTimeout(function(){
              setMessage(null);
            }, 2000);
          }
        }
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
        }
      }
    }

    const fetchLike = async function () {
      if (user) {
        let { data, error } = await supabase
          .from("likes")
          .select()
          .eq('id_article', id)
          .eq('uid', user.id)
          .single()
        if (!error) {
          if(data) {
            setLike(true);
          } else {
            setLike(false);
          }
        } else {
          setLike(false);
        }
      } else {
        setLike(false);
      }
    }

    const fetchNumberLikes = async function () {
      let { data, error } = await supabase
        .from("likes")
        .select()
        .eq('id_article', id)
      if (!error) {
        setNumberLikes(data.length);
      } else {
        setNumberLikes(0);
      }
    }


    fetchLike();
    fetchNumberLikes();
    fetchArticle();
    if (user) {
      fetchCommentsUser();
      fetchProfile();
    } else {
      fetchComments();
    }
    editCommentFromProfile();
  }, [user, loading, router, id, slug, profile.admin]);

  const onSubmit = async function () {
    if (!(document.getElementById("content").value === "")) {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("pseudo, admin")
          .eq('uid', user.id)
          .single()
        if (!error) {
          if (!(data.pseudo === null)) {
            if (!(idCommentEdit === -1)) {
              const data2 = new FormData();
              data2.append('content', document.getElementById("content").value);
              let bufferId = user.id;
              if (data.admin) {
                const { data, error } = await supabase
                  .from("comments")
                  .select("uid")
                  .eq('id', idCommentEdit)
                  .single()
                if(!error) {
                  bufferId = data.uid;
                }
              }
              const { error } = await supabase
                .from("comments")
                .update(Object.fromEntries(data2), { returning: "minimal" })
                .eq('id', idCommentEdit)
                .eq('uid', bufferId)
              if (error) {
                setMessage(
                  <div>
                    <h2 className="text-center mt-3">Error</h2>
                    <p>Your comment may not have been updated.</p>
                  </div>
                );

                window.setTimeout(function(){
                  setMessage(null);
                }, 2000);
              } else {
                document.getElementById("content").value = "";
                router.push(`/articles/${article.slug}?scroll=${window.pageYOffset}`);
              }
            } else {
              const data2 = new FormData();
              data2.append('content', document.getElementById("content").value);
              data2.append('uid', user.id);
              data2.append('id_article', article.id);
              const { error } = await supabase
                .from("comments")
                .insert(Object.fromEntries(data2), { returning: "minimal" });
              if (error) {
                setMessage(
                  <div>
                    <h2 className="text-center mt-3">Error</h2>
                    <p>Your comment may not have been sent.</p>
                  </div>
                );

                window.setTimeout(function(){
                  setMessage(null);
                }, 2000);
              } else {
                document.getElementById("content").value = "";
                router.push(`/articles/${article.slug}?scroll=${window.pageYOffset}`);
              }
            }
          } else {
            setMessage(
              <div>
                <h2 className="text-center mt-3">Redirection...</h2>
                <p>Your pseudo is not setup.</p>
              </div>
            );

            window.setTimeout(function(){
              setMessage(null);
              router.push("/profile/edit");
            }, 2000);
          }
        } else {
          setMessage("Sorry, an unexpected error occured.");
          window.setTimeout(function(){
            setMessage(null);
          }, 2000);
        }
      } else {
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
      }
    }
  };

  return (
    <>
      <Head>
        <title>WebTech - {article.title}</title>
        <meta name="description" content="WebTech - Article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]">
      <Header />
      <br></br>
      <br></br>
      <div className="mx-8 sm:mx-16">
        <h1 className="pt-10 sm:ml-16 text-gray-200 wt-title sm:text-left break-words">{article.title}</h1>
        {(numberLikes === 0) ? (
          <p className="hidden"></p>
        ) : (
          <p className="font-bold absolute dark:text-white text-slate-900 top-24 right-24 mt-[-2px] mr-[-4px]">{numberLikes}</p>
        )}
        {(like) ? (
          <img alt="" src="/heart-fill.svg" width="50px" className="absolute top-20 right-8" id="heart" onClick={likeArticle} />
        ) : (
          <img alt="" src="/heart.svg" width="50px" className="absolute top-20 right-8" id="heart" onClick={likeArticle} />
        )}
        <p  className="sm:ml-16 dark:text-gray-500 text-gray-600 sm:mt-[-30px] mt-0 break-words">by <strong className="dark:text-sky-300 text-sky-600 font-bold">{article.pseudo}</strong>, the {article.date}.</p>
        <pre className="whitespace-pre-wrap"><p className="pt-10 text-justify dark:text-gray-300 text-gray-800 pb-20 break-words">{article.message}</p></pre>
        <hr className="my-6 text-gray-300 border-2 border-gray-500 mb-9" />
        <div className="text-center pb-56 relative mt-[-60px]">
          <h1 className="absolute sm:static left-10 wt-title dark:text-gray-300 text-gray-700 inline-block dark:bg-slate-900 bg-slate-200 px-5 pb-6">Comments</h1>
          <div className="w-full mx-auto absolute sm:mt-6 mt-0 sm:static sm:top-0 top-28 max-w-screen-md inset-x-0 top-10 md:px-10 space-y-6 sm:overflow-hidden">
            <div className="relative text-center w-full">
              <div id="scrollComment" className="inline-block sm:w-7/12 w-full">
              <input
                type="text"
                id="content"
                name="content"
                placeholder="Write your comment here!"
                className="block mx-auto w-full max-w-[800px] rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
              </div>
              <div className="inline-block sm:ml-10 ml-0 sm:mt-0 mt-6">
              <button
              onClick={onSubmit}
              id="commentButton"
              className="rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none"
            >
              Comment
            </button>
            </div>
            </div>
          </div>
          <ul className="flex flex-1 flex-row flex-wrap justify-center w-full pt-64 sm:pt-14 mx-auto max-w-7xl sm:pt-0 pt-20">
            {comments.map((comment) => (
              <li key={comment.id} className="h-fit px-4 pb-1 relative inline-block mb-5 mx-2.5 select-none cursor-pointer inset-x-0 top-10 dark:bg-slate-800 bg-slate-300 dark:border-gray-600 border-gray-400 dark:hover:bg-slate-900 border-2 shadow rounded-2xl w-fit max-w-[500px]">
                <div className="whitespace-nowrap flex justify-between">
                  {(comment.admin && !profile.admin) ? (
                    <h4 className="text-sm leading-8 text-left tracking-tight dark:text-gray-400 text-gray-600 inline-block">by <strong className="text-gray-300 dark:text-sky-300 text-sky-600 font-bold">{comment.pseudo}</strong><strong className="text-gray-300 dark:text-red-500 text-red-600 font-bold"> (admin)</strong></h4>
                  ) : (
                    <h4 className="text-sm leading-8 text-left tracking-tight dark:text-gray-400 text-gray-600 inline-block">by <strong className="text-gray-300 dark:text-sky-300 text-sky-600 font-bold">{comment.pseudo}</strong></h4>
                  )}
                  {(!(user || loading) || (comment.pseudo !== "Me" && !profile.admin)) ? (
                    <p className="hidden"></p>
                  ) : (
                    <>
                      <div className="pt-0.5">
                      <a
                          onClick={() => deleteComment(comment.id, comment.uid)}
                          className="select-none cursor-pointer inline-flex ml-4 justify-center rounded-md border border-transparent bg-red-600 px-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          &#x2702;
                        </a>
                        <a
                          onClick={() => editComment(comment.id, comment.uid)}
                          className="select-none cursor-pointer inline-flex ml-2 justify-center rounded-md border border-transparent bg-green-500 px-1 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          &#x270e;
                        </a>
                      </div>
                    </>
                  )}
                </div>
                <hr className="text-gray-300 border dark:border-gray-600 border-gray-400" />
                <p className="text-sm font-bold text-left leading-8 tracking-tight dark:text-gray-300 text-gray-600 break-words">{comment.content}</p>
              </li>
            ))}
          </ul>
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
}

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
    paths: articles.map((article) => `/articles/${article.slug}`),
    fallback: true,
  };
}