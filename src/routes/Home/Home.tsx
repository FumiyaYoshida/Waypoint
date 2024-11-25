import { Link } from "react-router-dom"


const Home = () => {
  return (
    <main className="mx-auto w-full h-screen">
      <header className="flex justify-between py-5 bg-slate-950 w-full">
      {/* <header className="flex justify-between py-5 bg-slate-100 w-full"> */}
        <h1 className="ml-10 text-3xl text-white">Waypoint</h1>
      </header>
      <div className="h-20 bg-gradient-to-t from-slate-950 to-slate-300"></div>
      <div className="flex place-content-center w-full h-[calc(100vh-156px)] text-white text-2xl bg-slate-950">
        <div className="m-10">
          <ul>
            <li className="mb-4">
              <Link to='/tsukuba'>
                つくば
              </Link>
            </li>
            <li className="my-4">
              <Link to='/asagiri'>
                朝霧
              </Link>
            </li>
            <li className="my-4">
              <Link to='/asagiri_major'>
                朝霧（主要PT）
              </Link>
            </li>
            <li className="my-4">
              <Link to='/shirataka'>
                白鷹
              </Link>
            </li>
            <li className="my-4">
              <Link to='/tonamino'>
                となみ野
              </Link>
            </li>
            <li className="my-4">
              <Link to='/dateh'>
                Vietnam Dateh
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default Home
