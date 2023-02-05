import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/Header.js";
import Footer from "../../components/Footer.js";
import UserContext from "../../components/UserContext";
import { useState } from "react";

export default function EditUserProfiles() {
  const { user, loading } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [id, setId] = useState(-1);

  const exitEditProfile = async function () {
    router.push("/profiles");
  }

  const onSubmit = async function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const { error } = await supabase
      .from("profiles")
      .update(Object.fromEntries(data), { returning: "minimal" })
      .eq('id', id)
    if (error) {
      document.getElementById("pseudo").className = "mt-1 block w-full rounded-md border-rose-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm ring-0 border-2 focus:border-rose-500 focus:ring-rose-500 sm:text-sm";
      
      setMessage(
        <div>
          <h2 className="text-center mt-3">Try again</h2>
          <p>The pseudo is already taken.</p>
        </div>
      );
      window.setTimeout(function(){
        setMessage(null);
      }, 2000);
    } else {
      setMessage(
        <div>
          <h2 className="text-center mt-3">Confirmation</h2>
          <p>You have updated user profile.</p>
        </div>
      );

      window.setTimeout(function(){
        setMessage(null);
        router.push("/profiles");
      }, 2000);
    }
  };

  useEffect(() => {
    let idBuffer = -1;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('id')) {
      idBuffer = urlParams.get('id');
      setId(idBuffer);
    } else {
      router.push("/profiles");
    }

    const fetchProfile = async function () {
      if(user) {
        let { data, error } = await supabase
          .from('profiles')
          .select('admin')
          .eq('uid', user.id)
          .single()
        if (!error) {
          if (data.admin === false) {
            router.push(`/profile`);
          }
        }
      }
    }

    const fetchProfileUser = async function (idBuffer) {
      let profileArray = {};
      let profile = {};
      let profileMap = Object();
      let { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', idBuffer)
      if (!error) {
        profileArray = data;

        if (!profileArray) {
          setMessage("Sorry, an unexpected error occured.");
          window.setTimeout(function(){
            setMessage(null);
            router.push(`/profiles`);
          }, 2000);
        } else {
          profile = profileArray[0];
          profileMap = Object.entries(profile);

          document.getElementById("firstname").value = profileMap[2][1];
          document.getElementById("lastname").value = profileMap[3][1];
          document.getElementById("birthdate").value = profileMap[4][1];
          document.getElementById("pseudo").value = profileMap[5][1];

        }
      } else {
        setMessage("Sorry, an unexpected error occured.");
        window.setTimeout(function(){
          setMessage(null);
        }, 2000);
      }
    }

    if (!(user || loading)) {
      router.push("/login");
    } else {
      fetchProfile();
      if (idBuffer !== -1) {
        fetchProfileUser(idBuffer);
      }
    }
  }, [user, loading, router, supabase]);

  return (
    <>
      <Head>
        <title>BEnzMa - Edit profile</title>
        <meta name="description" content="BEnzMa - Edit profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px] backgroundAdmin">
      <Header />
      <br></br>
      <br></br>
      <h1 className="wt-title text-gray-300">Edit profile</h1>
      <div className="mx-auto sm:w-3/4 md:w-3/4 max-w-screen-lg inset-x-0 top-10 pb-40 px-10">
          <div className="mt-5 md:col-span-2 md:mt-0 sm:pt-0 pt-2">
            <form onSubmit={onSubmit}>
              <div className="border-gray-600 border shadow sm:overflow-hidden rounded-md">
                <div className="dark:bg-slate-800 bg-slate-300 space-y-6 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="firstname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        First name
                      </label>
                      <input
                        minlength="3"
                        maxlength="15"
                        type="text"
                        name="firstname"
                        id="firstname"
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="lastname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Last name
                      </label>
                      <input
                        minlength="2"
                        maxlength="20"
                        type="text"
                        name="lastname"
                        id="lastname"
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="birthdate" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Birthdate
                      </label>
                      <input
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="pseudo" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Pseudo
                      </label>
                      <input
                        minlength="7"
                        maxlength="20"
                        type="text"
                        name="pseudo"
                        id="pseudo"
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="dark:bg-slate-800 bg-slate-300 px-4 py-3 text-right sm:px-6 w-full">
                      <a
                        onClick={exitEditProfile}
                        className="select-none cursor-pointer inline-flex mr-0 justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Cancel
                      </a>
                      <button
                        type="submit"
                        className="ml-5 select-none cursor-pointer inline-flex mr-0 justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Update profile
                      </button>
                    </div>
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
}