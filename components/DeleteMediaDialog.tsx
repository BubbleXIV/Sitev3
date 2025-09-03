import React from "react";
import { Selectable } from "kysely";
import { MediaLibrary } from "../helpers/schema";
import { useMediaMutations } from "../helpers/useMediaMutations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./Dialog";
import { Button } from "./Button";
import { toast } from "sonner";
import styles from "./DeleteMediaDialog.module.css";

interface DeleteMediaDialogProps {
  mediaItem: Selectable<MediaLibrary>;
  onClose: () => void;
}

export const DeleteMediaDialog: React.FC<DeleteMediaDialogProps> = ({
  mediaItem,
  onClose,
}) => {
  const { useDeleteMedia } = useMediaMutations();
  const deleteMediaMutation = useDeleteMedia();

  const handleDelete = () => {
    deleteMediaMutation.mutate(
      { id: mediaItem.id },
      {
        onSuccess: () => {
          toast.success("Media item deleted successfully!");
          onClose();
        },
        onError: (error) => {
          if (error instanceof Error) {
            toast.error(`Deletion failed: ${error.message}`);
          } else {
            toast.error("An unknown error occurred.");
          }
        },
      },
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Media Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.content}>
          <img
            src={mediaItem.fileUrl}
            alt={mediaItem.altText || ""}
            className={styles.previewImage}
          />
          <p className={styles.filename} title={mediaItem.originalFilename}>
            {mediaItem.originalFilename}
          </p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMediaMutation.isPending}
          >
            {deleteMediaMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};