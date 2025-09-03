import React from "react";
import { useMedia } from "../helpers/useMedia";
import { Skeleton } from "./Skeleton";
import { UploadCloud, AlertTriangle } from "lucide-react";
import styles from "./MediaLibrary.module.css";

// This is a placeholder for the full media library implementation.
// It demonstrates fetching and displaying media items, along with loading
// and error states, but does not include upload or selection functionality.

export const MediaLibrary: React.FC = () => {
  const { data, isLoading, error } = useMedia();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.grid}>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className={styles.mediaItemSkeleton} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.stateMessage}>
          <AlertTriangle size={32} />
          <p>Error loading media: {error.message}</p>
        </div>
      );
    }

    if (!data || data.media.length === 0) {
      return (
        <div className={styles.stateMessage}>
          <UploadCloud size={32} />
          <p>Your media library is empty.</p>
          <p>Upload your first image to get started.</p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {data.media.map((item) => (
          <div key={item.id} className={styles.mediaItem}>
            <img src={item.fileUrl} alt={item.altText || item.originalFilename} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>Media Library</h3>
        {/* Placeholder for upload button */}
        <button className={styles.uploadButton}>Upload</button>
      </header>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};