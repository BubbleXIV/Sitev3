import React, { useState, useCallback, useMemo } from "react";
import { useMedia } from "../helpers/useMedia";
import { useMediaMutations } from "../helpers/useMediaMutations";
import { Skeleton } from "../components/Skeleton";
import {
  UploadCloud,
  AlertTriangle,
  Trash2,
  Edit,
  Search,
} from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { MediaUploadDropzone } from "../components/MediaUploadDropzone";
import { EditMediaDialog } from "../components/EditMediaDialog";
import { DeleteMediaDialog } from "../components/DeleteMediaDialog";
import { Selectable } from "kysely";
import { MediaLibrary as MediaLibraryTable } from "../helpers/schema";
import styles from "./admin.media.module.css";

type MediaItem = Selectable<MediaLibraryTable>;

const AdminMediaPage: React.FC = () => {
  const { data, isLoading, error } = useMedia();
  const { useUploadMedia } = useMediaMutations();
  const uploadMediaMutation = useUploadMedia();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);

  const handleFilesUpload = useCallback(
    (files: File[]) => {
      files.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);
        // In a real app, you might add alt text from a dialog before upload
        formData.append("altText", "");
        uploadMediaMutation.mutate(formData);
      });
    },
    [uploadMediaMutation],
  );

  const filteredMedia = useMemo(() => {
    if (!data?.media) return [];
    return data.media.filter(
      (item) =>
        item.originalFilename
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.altText?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

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
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2>Error Loading Media</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    if (!data || data.media.length === 0) {
      return (
        <div className={styles.stateMessage}>
          <UploadCloud size={48} />
          <h2>Your Media Library is Empty</h2>
          <p>Drag and drop files here or use the upload area to start.</p>
        </div>
      );
    }

    if (filteredMedia.length === 0) {
      return (
        <div className={styles.stateMessage}>
          <Search size={48} />
          <h2>No Media Found</h2>
          <p>
            Your search for "{searchTerm}" did not match any media items.
          </p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {filteredMedia.map((item) => (
          <div key={item.id} className={styles.mediaItem}>
            <img
              src={item.fileUrl}
              alt={item.altText || item.originalFilename}
              className={styles.mediaImage}
              loading="lazy"
            />
            <div className={styles.mediaOverlay}>
              <p className={styles.mediaFilename} title={item.originalFilename}>
                {item.originalFilename}
              </p>
              <div className={styles.mediaActions}>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setEditingMedia(item)}
                  aria-label={`Edit ${item.originalFilename}`}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => setDeletingMedia(item)}
                  aria-label={`Delete ${item.originalFilename}`}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Media Library</h1>
        <div className={styles.headerActions}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={18} />
            <Input
              type="search"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <MediaUploadDropzone
          onFilesUpload={handleFilesUpload}
          isUploading={uploadMediaMutation.isPending}
        />
        <div className={styles.gallery}>{renderContent()}</div>
      </div>

      {editingMedia && (
        <EditMediaDialog
          mediaItem={editingMedia}
          onClose={() => setEditingMedia(null)}
        />
      )}

      {deletingMedia && (
        <DeleteMediaDialog
          mediaItem={deletingMedia}
          onClose={() => setDeletingMedia(null)}
        />
      )}
    </div>
  );
};

export default AdminMediaPage;