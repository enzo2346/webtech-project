import Link from "next/link";
import Login from "./Login";
import Profiles from "./ProfilesHeader";

export default function Header() {
  return (
    <header className="overflow-hidden">
      <ul className="flex md:gap-5 gap-0 place-content-center dark:bg-slate-800 bg-slate-300 border-b border-gray-500 pt-1 pb-1 h-fit">
        <li className="dark:text-gray-300 text-gray-900 text-center text-sm m-2 font-mono dark:hover:text-white hover:text-gray-700 pt-1 line-clamp-1">
          <Link href="/">Home</Link>
        </li>
        <li className="dark:text-gray-300 text-gray-900 text-center text-sm m-2 font-mono dark:hover:text-white hover:text-gray-700 pt-1 line-clamp-1">
          <Link href="/about">About us</Link>
        </li>
        <li className="dark:text-gray-300 text-gray-900 text-center text-sm m-2 font-mono dark:hover:text-white hover:text-gray-700 pt-1 line-clamp-1">
          <Link href="/contact">Contact us</Link>
        </li>
        <Profiles />
        <li className="dark:text-gray-300 text-gray-900 text-center text-sm m-2 font-mono dark:hover:text-white hover:text-gray-700 pt-1 line-clamp-1">
          <Link href="/articles">Articles</Link>
        </li>
        <li className="rounded text-white text-sm m-2 border dark:border-white border-black dark:text-gray-300 text-gray-900 font-mono dark:hover:text-black hover:bg-white md:pr-1 pr-0.5 pb-0">
          <Login />
        </li>
      </ul>
    </header>
  );
};