import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.FooterContainer}>
      <h1 className={styles.Title}>
        Project made by:
        <span>
          <a
            href="https://www.linkedin.com/in/em%C3%ADdio-pedro/"
            target="_blank"
            className={styles.Name}
          >
            Emidio Pedro
          </a>
        </span>
      </h1>
    </div>
  );
};

export default Footer;
