import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useGallery } from "../helpers/useGallery";
import { useGalleryMutations } from "../helpers/useGalleryMutations";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { Input } from "../components/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "../components/Dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "../components/Form";
import { Textarea } from "../components/Textarea";
import { z } from "zod";
import { toast } from "sonner";
import {
  PlusCircle,
  Edit,
  Trash2,
  ImagePlus,
  AlertTriangle,
  Folder,
} from "lucide-react";
import {
  schema as categorySchema,
} from "../endpoints/gallery/categories_POST.schema";
import {
  schema as photoSchema,
} from "../endpoints/gallery/photos_POST.schema";
import { GalleryCategoryWithPhotos } from "../endpoints/gallery_GET.schema";
import styles from "./admin.gallery.module.css";
import { Selectable } from "kysely";
import { GalleryPhotos } from "../helpers/schema";

const CategoryForm: React.FC<{
  category?: GalleryCategoryWithPhotos;
  onClose: () => void;
}> = ({ category, onClose }) => {
  const { useCreateGalleryCategory } = useGalleryMutations();
  const mutation = useCreateGalleryCategory(); // Note: No update mutation available, using create for both
  const isEditing = !!category;

  const form = useForm({
    schema: categorySchema,
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof categorySchema>) => {
    const payload = isEditing ? { ...values, id: category.id } : values;
    toast.promise(mutation.mutateAsync(payload), {
      loading: `${isEditing ? "Updating" : "Creating"} category...`,
      success: () => {
        onClose();
        return `Category ${isEditing ? "updated" : "created"} successfully.`;
      },
      error: (err) =>
        err instanceof Error ? err.message : "Failed to save category.",
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Category" : "New Category"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="name">
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                value={form.values.name}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, name: e.target.value }))
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

const PhotoForm: React.FC<{
  photo?: Selectable<GalleryPhotos>;
  categoryId: number;
  onClose: () => void;
}> = ({ photo, categoryId, onClose }) => {
  const { useCreateGalleryPhoto } = useGalleryMutations();
  const mutation = useCreateGalleryPhoto();
  const isEditing = !!photo;

  const form = useForm({
    schema: photoSchema,
    defaultValues: {
      imageUrl: photo?.imageUrl ?? "",
      title: photo?.title ?? "",
      altText: photo?.altText ?? "",
      description: photo?.description ?? "",
      photographerCredit: photo?.photographerCredit ?? "",
      categoryId: categoryId,
    },
  });

  const onSubmit = (values: z.infer<typeof photoSchema>) => {
    const payload = isEditing ? { ...values, id: photo.id } : values;
    toast.promise(mutation.mutateAsync(payload), {
      loading: `${isEditing ? "Updating" : "Adding"} photo...`,
      success: () => {
        onClose();
        return `Photo ${isEditing ? "updated" : "added"} successfully.`;
      },
      error: (err) =>
        err instanceof Error ? err.message : "Failed to save photo.",
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Photo" : "Add Photo"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="imageUrl">
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input
                value={form.values.imageUrl}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, imageUrl: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="title">
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                value={form.values.title ?? ""}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, title: e.target.value }))
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
            <FormDescription>
              For accessibility and SEO.
            </FormDescription>
            <FormMessage />
          </FormItem>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default function AdminGalleryPage() {
  const { data, isLoading, error } = useGallery();
  const { useDeleteGalleryCategory, useDeleteGalleryPhoto } =
    useGalleryMutations();
  const deleteCategoryMutation = useDeleteGalleryCategory();
  const deletePhotoMutation = useDeleteGalleryPhoto();

  const [editingCategory, setEditingCategory] =
    useState<GalleryCategoryWithPhotos | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<GalleryCategoryWithPhotos | null>(null);
  const [addingPhotoTo, setAddingPhotoTo] = useState<number | null>(null);
  const [deletingPhoto, setDeletingPhoto] =
    useState<Selectable<GalleryPhotos> | null>(null);

  const handleDeleteCategory = () => {
    if (!deletingCategory) return;
    toast.promise(
      deleteCategoryMutation.mutateAsync({ id: deletingCategory.id }),
      {
        loading: "Deleting category...",
        success: "Category deleted.",
        error: "Failed to delete category.",
      },
    );
    setDeletingCategory(null);
  };

  const handleDeletePhoto = () => {
    if (!deletingPhoto) return;
    toast.promise(deletePhotoMutation.mutateAsync({ id: deletingPhoto.id }), {
      loading: "Deleting photo...",
      success: "Photo deleted.",
      error: "Failed to delete photo.",
    });
    setDeletingPhoto(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.categoriesContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.categoryCard}>
              <Skeleton style={{ height: "2rem", width: "60%" }} />
              <Skeleton
                style={{ height: "1rem", width: "80%", marginTop: "0.5rem" }}
              />
              <div className={styles.photoGrid}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className={styles.photoSkeleton} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.stateMessage}>
          <AlertTriangle className={styles.errorIcon} />
          <h2>Error Loading Gallery</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className={styles.stateMessage}>
          <Folder size={48} />
          <h2>Gallery is Empty</h2>
          <p>Create a category to start adding photos.</p>
        </div>
      );
    }

    return (
      <div className={styles.categoriesContainer}>
        {data.map((category) => (
          <div key={category.id} className={styles.categoryCard}>
            <div className={styles.categoryHeader}>
              <div>
                <h2 className={styles.categoryTitle}>{category.name}</h2>
                <p className={styles.categoryDescription}>
                  {category.description}
                </p>
              </div>
              <div className={styles.categoryActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingPhotoTo(category.id)}
                >
                  <ImagePlus size={14} /> Add Photo
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditingCategory(category)}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => setDeletingCategory(category)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            <div className={styles.photoGrid}>
              {category.photos.map((photo) => (
                <div key={photo.id} className={styles.photoItem}>
                  <img
                    src={photo.imageUrl}
                    alt={photo.altText || ""}
                    className={styles.photoImg}
                  />
                  <div className={styles.photoOverlay}>
                    <p className={styles.photoTitle}>{photo.title}</p>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => setDeletingPhoto(photo)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Gallery - Admin</title>
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Manage Gallery</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle size={16} /> New Category
              </Button>
            </DialogTrigger>
            <CategoryForm onClose={() => {}} />
          </Dialog>
        </header>
        {renderContent()}
      </div>

      {/* Edit Category Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )}
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? All
              photos within will also be deleted. This is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Photo Dialog */}
      <Dialog
        open={!!addingPhotoTo}
        onOpenChange={(open) => !open && setAddingPhotoTo(null)}
      >
        {addingPhotoTo && (
          <PhotoForm
            categoryId={addingPhotoTo}
            onClose={() => setAddingPhotoTo(null)}
          />
        )}
      </Dialog>

      {/* Delete Photo Dialog */}
      <Dialog
        open={!!deletingPhoto}
        onOpenChange={(open) => !open && setDeletingPhoto(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this photo? This is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingPhoto(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePhoto}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}