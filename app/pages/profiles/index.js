import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useContext, useEffect } from "react";
import Head from "next/head";
import Header from "../../components/Header.js";
import Footer from "../../components/Footer.js";
import UserContext from "../../components/UserContext";
import { useState } from "react";

export default function UserProfile() {
  const { user, loading } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);

  const updateProfileRedirection = async function (id) {
    router.push(`/profiles/edit?id=${id}`);
  };

  useEffect(() => {
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

    const fetchProfiles = async function () {
      let { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('admin', false)
      if (!error) {
        setProfiles(data);
      }
    }


    if (!(user || loading)) {
      router.push("/login");
    } else {
      fetchProfile();
      fetchProfiles();
    }
  }, [user, loading, router, supabase]);
  return (
    <>
      <Head>
        <title>BEnzMa - Profile</title>
        <meta name="description" content="BEnzMa - Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px] backgroundAdmin">
      <Header />
      <br></br>
      <br></br>
      <h1 className="absolute sm:static pl-10 sm:pl-0 wt-title text-gray-300">User profiles</h1>
      {profiles.map((profile) => (
      <div key={profile.id} className="mx-auto sm:w-3/4 md:w-3/4 max-w-screen-lg inset-x-0 top-10 pb-40 px-10">
          <div className="mt-5 md:col-span-2 md:mt-0 sm:pt-0 pt-16">
            <form>
              <div className="border-gray-600 border shadow sm:overflow-hidden rounded-md">
                <div className="dark:bg-slate-800 bg-slate-300 space-y-6 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
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
                  </div>
                  <div className="dark:bg-slate-800 bg-slate-300 px-4 py-3 text-right sm:px-6 w-full">
                      <a
                        onClick={() => updateProfileRedirection(profile.id)}
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
        ))}
      </div>
      <Footer />
    </>
  );
}
