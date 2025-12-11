import styles from "./Preloader.module.css";
import logo from "../assets/Large-Logo.png";

const Preloader = () => {
  return (
    <div className={styles.PreloaderContainer}>
      <div className={styles.Content}>
        <img src={logo} alt="Loading..." className={styles.Logo} />
        <div className={styles.Spinner}></div>
        <h3 className={styles.Text}>Initializing Market Data...</h3>
      </div>
    </div>
  );
};

export default Preloader;
