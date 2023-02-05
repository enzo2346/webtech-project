import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import UserContext from "./UserContext";
import { useState } from "react";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

export default function Profiles() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async function () {
      let { data, error } = await supabase
        .from('profiles')
        .select('admin')
        .eq('uid', user.id)
        .single()
      if (!error) {
        setAdmin(data.admin);
      } else {
        setAdmin(false);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user, router, supabase]);
  return (
    <>
    {admin === false ? (
      <p className="hidden"></p>
    ) : (
      <li className="dark:text-gray-300 text-gray-900 text-center text-sm m-2 font-mono dark:hover:text-white hover:text-gray-700 pt-1 line-clamp-1">
        <Link href="/profiles">Profiles</Link>
      </li>
    )}
    </>
  );
}