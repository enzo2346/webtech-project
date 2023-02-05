import { useState } from "react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import UserContext from "../components/UserContext";
import Head from "next/head";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

export default function Contact() {
  const supabase = useSupabaseClient();
  const { user, loading } = useContext(UserContext);
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState('');
  const [contacts, setContacts] = useState([]);

  const exitContact = async function () {
    router.push("/");
  }
  
  const onSubmit = async function (e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const { error } = await supabase
      .from("contacts")
      .insert(Object.fromEntries(data), { returning: "minimal" });
    if (error) {
      setMessage("Sorry, an unexpected error occured.");
      window.setTimeout(function(){
        setMessage(null);
      }, 2000);
    } else {
      setMessage(
        <div>
          <h2 className="text-center mt-3">Confirmation</h2>
          <p>Thank you for contacting us. We will get back to you promptly.</p>
        </div>
      );

      window.setTimeout(function(){
        setMessage(null);
        router.push("/");
      }, 2000);

    }
  };

  const onSubmitAdmin = async function (id) {
    if (user) {
      if (profile.admin) {
        const { error } = await supabase
          .from("contacts")
          .delete()
          .eq('id', id)
        if (error) {
          setMessage("Sorry, an unexpected error occured.");
          window.setTimeout(function(){
            setMessage(null);
          }, 2000);
        } else {
          router.push(`/contact?scroll=${window.pageYOffset}`);
        }
      }
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('scroll')) {
      var scroll = urlParams.get('scroll');
      window.scrollTo(0, scroll);
    }

    const fetchProfile = async function () {
      if(user) {
        let { data, error } = await supabase
          .from('profiles')
          .select('firstname, lastname, admin')
          .eq('uid', user.id)
          .single()
        if (!error) {
          data.email = user.email
          setProfile(data);
          if (data.admin === true) {
            var element = document.getElementById("backgroundAdminId");
            element.classList.add("backgroundAdmin");
          } else {
            if (data) {
              if (!(data.firstname === null)) {
                document.getElementById("firstname").readOnly = true;
                document.getElementById("firstname").className = "mt-1 block w-full rounded-md border-gray-500 text-gray-500 dark:bg-slate-800 bg-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm";
                document.getElementById("firstnameLabel").className = "block text-sm font-medium text-gray-500";
              } else {
                document.getElementById("firstname").readOnly = false;
                document.getElementById("firstname").className = "mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
                document.getElementById("firstnameLabel").className = "block text-sm font-medium dark:text-gray-300 text-gray-800";
              }
              if (!(data.lastname === null)) {
                document.getElementById("lastname").readOnly = true;
                document.getElementById("lastname").className = "mt-1 block w-full rounded-md border-gray-500 text-gray-500 dark:bg-slate-800 bg-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm";
                document.getElementById("lastnameLabel").className = "block text-sm font-medium text-gray-500";
              } else {
                document.getElementById("lastname").readOnly = false;
                document.getElementById("lastname").className = "mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";
                document.getElementById("lastnameLabel").className = "block text-sm font-medium dark:text-gray-300 text-gray-800";
              }

              document.getElementById("email").readOnly = true;
              document.getElementById("email").className = "mt-1 block w-full rounded-md border-gray-500 text-gray-500 dark:bg-slate-800 bg-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm";
              document.getElementById("emailLabel").className = "block text-sm font-medium text-gray-500";
            }
          }
        }
      }
    }

    const fetchContactUs = async function () {
      let { data } = await supabase
        .from("contacts")
        .select(`id, created_at, firstname, lastname, email, country, message`)
        .order('created_at', { ascending: true })
      setContacts(data);
    }

    fetchProfile();
    fetchContactUs();
  }, [user, loading, router, supabase]);
  return (
    <>
      <Head>
        <title>BEnzMa - Contact us</title>
        <meta name="description" content="BEnzMa - Contact us" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]" id="backgroundAdminId">
      <Header />
      <br></br>
      <br></br>
      <h1 className="wt-title text-gray-300">Contact us</h1>
      {!profile.admin ? (
        <div className="mx-auto sm:w-3/4 md:w-3/4 max-w-screen-lg inset-x-0 top-10 pb-40 px-10">
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={onSubmit}>
              <div className="border-gray-600 border shadow sm:overflow-hidden rounded-md">
                <div className="dark:bg-slate-800 bg-slate-300 space-y-6 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label id="firstnameLabel" htmlFor="firstname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        First name
                      </label>
                      <input
                        minlength="3"
                        maxlength="15"
                        type="text"
                        name="firstname"
                        value={profile.firstname}
                        id="firstname"
                        autoComplete="given-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label id="lastnameLabel" htmlFor="lastname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Last name
                      </label>
                      <input
                        minlength="2"
                        maxlength="20"
                        type="text"
                        value={profile.lastname}
                        name="lastname"
                        id="lastname"
                        autoComplete="family-name"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label id="emailLabel" htmlFor="email" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profile.email}
                        autoComplete="email"
                        className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="country" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="mt-1 block w-full rounded-md border border-gray-500 dark:text-gray-300 text-gray-800 text-gray-300 dark:bg-slate-700 bg-gray-200 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      >
                        <option>France</option>
                        <option>Germany</option>
                        <option>United Kingdom</option>
                        <option>Spain</option>
                        <option>Italy</option>
                        <option>Switzerland</option>
                        <option>China</option>
                        <option>Hong Kong</option>
                        <option>Russia</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                        <option>Argentina</option>
                        <option>Bresil</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                      Message
                    </label>
                    <div className="mt-1">
                      <textarea
                        minlength="10"
                        id="message"
                        name="message"
                        rows={6}
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
                    onClick={exitContact}
                    className="select-none cursor-pointer inline-flex mr-0 justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </a>
                  <button
                    type="submit"
                    className="ml-5 cinline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
          ) : (
          <>
          {contacts.map((contact) => (
            <div key={contact.id} className="mx-auto sm:w-3/4 md:w-3/4 max-w-screen-lg inset-x-0 top-10 pb-40 px-10">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form>
                <div className="border-gray-600 border shadow sm:overflow-hidden rounded-md">
                  <div className="dark:bg-slate-800 bg-slate-300 space-y-6 px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label id="firstnameLabel" htmlFor="firstname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                          First name
                        </label>
                        <input
                          minlength="3"
                          maxlength="15"
                          type="text"
                          name="firstname"
                          value={contact.firstname}
                          id="firstname"
                          autoComplete="given-name"
                          className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          readOnly={true}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label id="lastnameLabel" htmlFor="lastname" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                          Last name
                        </label>
                        <input
                          minlength="2"
                          maxlength="20"
                          type="text"
                          value={contact.lastname}
                          name="lastname"
                          id="lastname"
                          autoComplete="family-name"
                          className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          readOnly={true}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label id="emailLabel" htmlFor="email" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                          Email address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={contact.email}
                          autoComplete="email"
                          className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          readOnly={true}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="country" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={contact.country}
                          autoComplete="country-name"
                          readOnly={true}
                          className="mt-1 block w-full rounded-md border border-gray-500 dark:text-gray-300 text-gray-800 text-gray-300 dark:bg-slate-700 bg-gray-200 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>France</option>
                          <option>Germany</option>
                          <option>United Kingdom</option>
                          <option>Spain</option>
                          <option>Italy</option>
                          <option>Switzerland</option>
                          <option>China</option>
                          <option>Hong Kong</option>
                          <option>Russia</option>
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                          <option>Argentina</option>
                          <option>Bresil</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium dark:text-gray-300 text-gray-800">
                        Message
                      </label>
                      <div className="mt-1">
                        <textarea
                          minlength="10"
                          id="message"
                          name="message"
                          rows={6}
                          className="mt-1 block w-full rounded-md border-gray-500 dark:text-gray-300 text-gray-800 dark:bg-slate-700 bg-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Write you message here!"
                          value={contact.message}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dark:bg-slate-800 bg-slate-300 px-4 py-3 text-right sm:px-6 relative pb-14">
                    <div
                      onClick={() => onSubmitAdmin(contact.id)}
                      className="w-fit absolute right-5 ml-5 cinline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          ))}
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
};