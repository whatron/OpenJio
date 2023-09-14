import { FunctionComponent } from "react";
import Header2 from "../components/HomeScreen/Header2";
import Header3 from "../components/HomeScreen/Header3";
import NavBar from "../components/HomeScreen/NavBar";

const HomeScreen: FunctionComponent = () => {
  return (
    <div>
      <NavBar />
      <div className="h-20 w-full b-10"></div>
      <div>
        <p className="overflow-hidden text-left text-11xl text-black font-ibm-plex-mono m-0">
          OpenJio is a powerful and user-friendly events website tailored for
          university students, designed to enhance the way you discover, create,
          and participate in events on your campus. We are constantly innovating
          and in search of ways to improve our application and to provide our
          users the most seamless experience. We welcome constructive feedback
          and your suggestions to improve our application and user-experience
          are greatly appreciated. Do stay tuned for more updates!
        </p>
        <Header2 />

        <Header3 />
      </div>
    </div>
  );
};

export default HomeScreen;
