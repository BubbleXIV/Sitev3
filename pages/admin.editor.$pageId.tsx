import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { usePage } from '../helpers/usePage';
import { PageEditor } from '../components/PageEditor';
import { Skeleton } from '../components/Skeleton';
import styles from "./admin.editor.$pageId.module.css";
import { AlertTriangle } from "lucide-react";

export default function PageEditorPage() {
  const { pageId } = useParams();
  const id = pageId ? parseInt(pageId, 10) : undefined;

  const { data, isLoading, error, isError } = usePage(id);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <Skeleton style={{ height: "60px" }} />
          <div className={styles.editorSkeleton}>
            <Skeleton style={{ width: "250px", height: "100%" }} />
            <Skeleton style={{ flex: 1, height: "100%" }} />
            <Skeleton style={{ width: "300px", height: "100%" }} />
          </div>
        </div>);

    }

    if (isError) {
      return (
        <div className={styles.errorContainer}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Failed to load page</h2>
          <p className={styles.errorMessage}>{error.message}</p>
        </div>);

    }

    if (!data?.page) {
      return (
        <div className={styles.errorContainer}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Page not found</h2>
          <p className={styles.errorMessage}>
            The requested page could not be found.
          </p>
        </div>);

    }

    return <PageEditor pageData={data.page} />;
  };

  return (
    <>
      <Helmet>
        <title>
          {isLoading ?
          "Loading Editor..." :
          data?.page ?
          `Editing: ${data.page.title}` :
          "Page Editor"}
        </title>
      </Helmet>
      <div className={styles.pageContainer}>{renderContent()}</div>
    </>);

}