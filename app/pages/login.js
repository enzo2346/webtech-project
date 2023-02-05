import { useRouter } from "next/router";
import { useContext } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import UserContext from "../components/UserContext";
import { useTheme } from "next-themes";

export default function Login() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { theme } = useTheme();

  if (user) router.push("/articles");
  return (
    <>
      <Head>
        <title>BEnzMa - Sign in</title>
        <meta name="description" content="BEnzMa - Sign in" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="dark:bg-slate-900 bg-slate-200 min-h-screen mb-[-75px]">
      <Header />
      <br></br>
      <br></br>
      <h1 className="wt-title text-gray-300">Sign in</h1>
      <div className="pb-40"> 
      <div className="mx-auto w-3/4 max-w-md px-10 border-gray-600 border shadow sm:overflow-hidden rounded-md dark:bg-slate-800 bg-slate-300 space-y-6 px-6 py-5 p-6 label:color-red-200">
      {(theme === 'dark') ? (
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa,
          style: {
            button: { background: 'rgb(75, 77, 220)', color: 'white', border: 'none', width: 'fit-content', paddingTop: '7px', paddingBottom: '7px', fontSize: '1em', margin: 'auto', fontWeight: '400' },
            anchor: { color: 'rgb(209 213 219)' },
            input: { background: 'rgb(54, 65, 82)', borderWidth: '0.1em', borderColor: 'rgb(107 114 128)', margin: 'auto', color: 'rgb(209 213 219)', padding: '7px', paddingLeft: '12px', paddingRight: '12px' },
            label: { color: 'rgb(209 213 219)', className: 'color-red-300' },
          }}}
          providers={["github"]}
        />
      ) : (
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa,
          style: {
            button: { background: 'rgb(75, 77, 220)', color: 'white', border: 'none', width: 'fit-content', paddingTop: '7px', paddingBottom: '7px', fontSize: '1em', margin: 'auto', fontWeight: '400' },
            anchor: { color: 'rgb(33 41 54)' },
            input: { background: 'rgb(229, 231, 235)', borderWidth: '0.1em', borderColor: 'rgb(107 114 128)', margin: 'auto', color: 'rgb(33 41 54)', padding: '7px', paddingLeft: '12px', paddingRight: '12px' },
            label: { color: 'rgb(33 41 54)', className: 'color-red-300' },
          }}}
          providers={["github"]}
        />
      )}
      
      </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
