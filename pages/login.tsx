import React from "react";
import { Helmet } from "react-helmet";
import { PasswordLoginForm } from "../components/PasswordLoginForm";
import styles from "./login.module.css";

const LoginPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Login</title>
        <meta name="description" content="Admin login page for the website." />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Admin Access</h1>
          <p className={styles.subtitle}>
            Please log in to manage the website content.
          </p>
          <div className={styles.credentials}>
            <p><strong>Test Email:</strong> bubble.xiv@gmail.com</p>
            <p><strong>Test Password:</strong> Shirt-Sound-4-Sugar-Dance</p>
          </div>
          <PasswordLoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;