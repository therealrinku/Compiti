import homeNavStyles from "../styles/HomeNav.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BiMoon } from "react-icons/bi";
import { RiHome2Line } from "react-icons/ri";
import { AiFillCalendar, AiOutlinePoweroff } from "react-icons/ai";
import { RiLightbulbFlashLine } from "react-icons/ri";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

export default function HomeNav({ onLogout, setDatePlus, darkMode, setDarkMode, currentDate, setCurrentDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  return (
    <div className={homeNavStyles.homeNav}>
      <button onClick={() => setDatePlus((prev) => prev - 1)}>
        <IoIosArrowBack />
      </button>
      <button onClick={() => setDatePlus((prev) => prev + 1)}>
        <IoIosArrowForward />
      </button>
      <button
        style={showDatePicker ? { background: "rgb(200, 200, 200)" } : {}}
        onClick={() => setShowDatePicker((prev) => !prev)}
      >
        <AiFillCalendar />
      </button>
      {showDatePicker && (
        <div className={homeNavStyles.datepicker}>
          <input value={currentDate} type="date" onChange={(e) => setCurrentDate(e.target.value)} />
        </div>
      )}
      <button
        onClick={() => {
          setDatePlus(0);
          setCurrentDate(new Date());
        }}
      >
        <RiHome2Line />
      </button>
      <button onClick={() => setDarkMode((prev) => !prev)}>{darkMode ? <RiLightbulbFlashLine /> : <BiMoon />}</button>
      <button onClick={onLogout}>
        <AiOutlinePoweroff />
      </button>
    </div>
  );
}
