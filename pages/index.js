import HomeSectionOne from "../components/HomeSectionOne";
import HomeSectionTwo from "../components/HomeSectionTwo";
import Meta from "../components/Meta";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Meta />
      <HomeSectionOne />
      <HomeSectionTwo />
    </div>
  );
}
