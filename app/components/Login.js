import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import OutlineUserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon.js";
import UserContext from "./UserContext";
import { useState } from "react";
import MD5 from "crypto-js/md5";

/* eslint-disable @next/next/no-img-element */

export default function LoggedIn() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [urlGravatar, setUrlGravatar] = useState('');
  const [profile, setProfile] = useState('');

  function onClick() {
    if (user) router.push("/profile");
    else router.push("/login");
  }

  useEffect(() => {
    const fetchProfile = async function () {
      let { data, error } = await supabase
        .from('profiles')
        .select('pseudo')
        .eq('uid', user.id)
        .single()
      if (!error) {
        if (data.pseudo === null) {
          data.pseudo = "profile";
        }
        setProfile(data);
      }
    }

    if (user) {
      fetchProfile();
      setUrlGravatar("https://www.gravatar.com/avatar/" + MD5(((user.email).trim()).toLowerCase()) + "?s=18&d=identicon&r=g");
    }
  }, [user, router, supabase]);
  return (
    <button className="flex gap-2 [&_svg]:h-6 [&_svg]:w-6" onClick={onClick}>
      {user ? (
        <>
          <img alt="" className="p-0.5 mx-auto rounded-md" src={urlGravatar} />
          <p className="sm:block line-clamp-1">{profile.pseudo}</p>
        </>
      ) : (
        <>
          <OutlineUserCircleIcon />
          <p className="hidden sm:block">Login</p>
        </>
      )}
    </button>
  );
}