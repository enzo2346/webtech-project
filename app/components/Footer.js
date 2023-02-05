import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Footer() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);

    const getElementByIdAsync = id => new Promise(resolve => {
      const getElement = () => {
        const element = document.getElementById(id);
        if(element) {
          resolve(element);
        } else {
          requestAnimationFrame(getElement);
        }
      };
      getElement();
    });

    const componentDidMount = async () => {
      const divElement = await getElementByIdAsync('myToggle');
      const currentTheme = theme === 'system' ? systemTheme : theme;
      if (currentTheme === 'dark') {
        document.getElementById("myToggle").checked = false;
      } else {
        document.getElementById("myToggle").checked = true;
      }
    }

    componentDidMount();
  }, [systemTheme, theme]);

  
  const renderThemeChanger = () => {
    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    if (currentTheme === 'dark') {
      return (
        <label className="toggle" htmlFor="myToggle">
            <input name="" type="checkbox" id="myToggle" onClick={() => setTheme('light')}/>
            <div className="toggle__fill"></div>
        </label>
      )
    } else {
      return (
        <label className="toggle" htmlFor="myToggle">
            <input name="" type="checkbox" id="myToggle" onClick={() => setTheme('dark')}/>
            <div className="toggle__fill"></div>
        </label>
      )
    }
  };

  return (
    <footer className="w-full shadow px-6 py-8 dark:bg-slate-800 bg-slate-300 border-t border-gray-500">
      <div>
        <ul className="flex flex-wrap text-sm dark:text-gray-300 text-gray-900">
          <li className="hover:underline md:mr-6 mr-4">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:underline md:mr-6 mr-4">
            <Link href="/about">About us</Link>
          </li>
          <li className="hover:underline md:mr-6 mr-4">
            <Link href="/contact">Contact us</Link>
          </li>
          <li className="hover:underline md:mr-6 mr-4">
            <Link href="/articles">Articles</Link>
          </li>
          {renderThemeChanger()}
        </ul>
      </div>
      <hr className="my-6 dark:text-gray-300 text-gray-800 dark:border-gray-500 border-gray-900" />
      <span className="block text-sm text-center dark:text-gray-300 text-gray-900">
        © 2022{" "}
        <a href="" className="hover:underline">
          BEnzMa™
        </a>
        . All Rights Reserved.
      </span>
    </footer>
  );
};