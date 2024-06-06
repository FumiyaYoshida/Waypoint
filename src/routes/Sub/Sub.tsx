import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom"


const Sub = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const changeIsOpenMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  return (
    <main className="mx-auto w-full h-screen">
      <header className="flex justify-between py-5 bg-slate-950 w-full">
      {/* <header className="flex justify-between py-5 bg-slate-100 w-full"> */}
        <h1 className="ml-20 text-3xl text-white">Sub</h1>
        <button
          className={`mr-10 text-white ${ isOpenMenu ? 'text-3xl' : 'text-2xl' }`}
          onClick={() => changeIsOpenMenu()}
        >
          { isOpenMenu ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
        </button>
      </header>
      <div className="w-full h-[calc(100vh-76px)] bg-orange-600 relative">
        <div>sub</div>
        <div className={`absolute top-0 right-0 bg-slate-300 h-[calc(100vh-76px)] bg-opacity-50 ${ isOpenMenu ? 'w-48' : 'w-0' }`}>
          <ul>
            <li>
              <Link className= '' to='/'>
                Main
              </Link>
            </li>
            <li>
              <Link className= '' to='/sub'>
                Sub
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default Sub
