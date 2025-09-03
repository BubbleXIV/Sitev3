import React from "react";
import { Helmet } from "react-helmet";
import { useStaff } from "../helpers/useStaff";
import { StaffCard } from "../components/StaffCard";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle } from "lucide-react";
import styles from "./staff.module.css";

const StaffPageSkeleton = () => (
  <div className={styles.grid}>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className={styles.skeletonCard}>
        <Skeleton style={{ width: "120px", height: "120px", borderRadius: "var(--radius-full)", margin: "0 auto" }} />
        <Skeleton style={{ height: "1.75rem", width: "70%", marginTop: "var(--spacing-4)" }} />
        <Skeleton style={{ height: "1rem", width: "50%", marginTop: "var(--spacing-2)" }} />
        <Skeleton style={{ height: "0.875rem", width: "90%", marginTop: "var(--spacing-4)" }} />
        <Skeleton style={{ height: "0.875rem", width: "80%", marginTop: "var(--spacing-2)" }} />
        <Skeleton style={{ height: "0.875rem", width: "85%", marginTop: "var(--spacing-2)" }} />
      </div>
    ))}
  </div>
);

const StaffPage = () => {
  const { data: staff, isFetching, error } = useStaff();

  const renderContent = () => {
    if (isFetching) {
      return <StaffPageSkeleton />;
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Failed to Load Staff</h2>
          <p className={styles.errorMessage}>
            There was an issue retrieving the staff list. Please try again later.
          </p>
        </div>
      );
    }

    if (!staff || staff.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Our Team is Assembling</h2>
          <p className={styles.emptyMessage}>
            Information about our talented staff will be available here soon.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {staff.map((member) => (
          <StaffCard key={member.id} staffMember={member} />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Our Staff - Eorzea's Embrace</title>
        <meta
          name="description"
          content="Meet the talented team at Eorzea's Embrace. Our staff is dedicated to providing you with an unforgettable experience."
        />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Meet Our Staff</h1>
          <p className={styles.subtitle}>
            The dedicated individuals who bring the magic of Eorzea's Embrace to life.
          </p>
        </header>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default StaffPage;