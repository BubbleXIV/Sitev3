import React, { useEffect } from "react";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "./Form";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { toast } from "sonner";
import styles from "./EditMediaDialog.module.css";

interface EditMediaDialogProps {
  mediaItem: Selectable<MediaLibrary>;
  onClose: () => void;
}

const editMediaSchema = z.object({
  filename: z.string().min(1, "Filename cannot be empty."),
  altText: z.string().nullable(),
  description: z.string().nullable(),
});

export const EditMediaDialog: React.FC<EditMediaDialogProps> = ({
  mediaItem,
  onClose,
}) => {
  const { useUpdateMedia } = useMediaMutations();
  const updateMediaMutation = useUpdateMedia();

  const form = useForm({
    schema: editMediaSchema,
    defaultValues: {
      filename: "",
      altText: "",
      description: "",
    },
  });

  useEffect(() => {
    if (mediaItem) {
      form.setValues({
        filename: mediaItem.originalFilename,
        altText: mediaItem.altText || "",
        description: mediaItem.description || "",
      });
    }
  }, [mediaItem, form.setValues]);

  const onSubmit = (values: z.infer<typeof editMediaSchema>) => {
    updateMediaMutation.mutate(
      {
        id: mediaItem.id,
        filename: values.filename,
        altText: values.altText,
        description: values.description,
      },
      {
        onSuccess: () => {
          toast.success("Media details updated successfully!");
          onClose();
        },
        onError: (error) => {
          if (error instanceof Error) {
            toast.error(`Update failed: ${error.message}`);
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
          <DialogTitle>Edit Media</DialogTitle>
          <DialogDescription>
            Update the details for this media item.
          </DialogDescription>
        </DialogHeader>
        <div className={styles.content}>
          <img
            src={mediaItem.fileUrl}
            alt={mediaItem.altText || ""}
            className={styles.previewImage}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
              <FormItem name="filename">
                <FormLabel>Filename</FormLabel>
                <FormControl>
                  <Input
                    value={form.values.filename}
                    onChange={(e) =>
                      form.setValues((p) => ({ ...p, filename: e.target.value }))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem name="altText">
                <FormLabel>Alt Text</FormLabel>
                <FormControl>
                  <Input
                    value={form.values.altText ?? ""}
                    onChange={(e) =>
                      form.setValues((p) => ({ ...p, altText: e.target.value }))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem name="description">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    value={form.values.description ?? ""}
                    onChange={(e) =>
                      form.setValues((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateMediaMutation.isPending}
          >
            {updateMediaMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};