import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Spinner } from "./Spinner";
import { Button } from "./Button";
import styles from "./MediaUploadDropzone.module.css";

interface MediaUploadDropzoneProps {
  onFilesUpload: (files: File[]) => void;
  isUploading: boolean;
}

export const MediaUploadDropzone: React.FC<MediaUploadDropzoneProps> = ({
  onFilesUpload,
  isUploading,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesUpload(acceptedFiles);
    },
    [onFilesUpload],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/webp": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`${styles.dropzone} ${isDragActive ? styles.dragActive : ""}`}
    >
      <input {...getInputProps()} />
      <div className={styles.content}>
        <UploadCloud size={32} className={styles.icon} />
        {isUploading ? (
          <>
            <Spinner />
            <p>Uploading...</p>
          </>
        ) : isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            <p>Drag & drop some files here, or click to select files</p>
            <Button type="button" onClick={open} disabled={isUploading}>
              Browse Files
            </Button>
          </>
        )}
      </div>
    </div>
  );
};