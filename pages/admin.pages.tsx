import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { usePages } from "../helpers/usePages";
import { usePageMutations } from "../helpers/usePageMutations";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { Badge } from "../components/Badge";
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
import { Input } from "../components/Input";
import { z } from "zod";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, Eye, EyeOff, MoreVertical } from "lucide-react";
import { Selectable } from "kysely";
import { Pages } from "../helpers/schema";
import styles from "./admin.pages.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";

const newPageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  route: z
    .string()
    .min(1, "Route is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Route can only contain lowercase letters, numbers, and hyphens"
    )
    .transform((val) => val.toLowerCase().replace(/\s+/g, "-")),
});

const PageRow: React.FC<{ page: Selectable<Pages> }> = ({ page }) => {
  const { usePublishPage, useDeletePage } = usePageMutations();
  const publishPageMutation = usePublishPage();
  const deletePageMutation = useDeletePage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleTogglePublish = () => {
    const isPublished = page.status === "published";
    toast.promise(
      publishPageMutation.mutateAsync({ id: page.id, publish: !isPublished }),
      {
        loading: `${isPublished ? "Unpublishing" : "Publishing"} page...`,
        success: `Page successfully ${isPublished ? "unpublished" : "published"}.`,
        error: `Failed to ${isPublished ? "unpublish" : "publish"} page.`,
      }
    );
  };

  const handleDelete = () => {
    toast.promise(deletePageMutation.mutateAsync({ id: page.id }), {
      loading: "Deleting page...",
      success: "Page successfully deleted.",
      error: "Failed to delete page.",
    });
    setIsDeleteDialogOpen(false);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "published":
        return <Badge variant="success">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <tr className={styles.pageRow}>
      <td>
        <Link to={`/admin/editor/${page.id}`} className={styles.pageTitleLink}>
          {page.title}
        </Link>
        <div className={styles.pageRoute}>/{page.route}</div>
      </td>
      <td>{getStatusBadge(page.status)}</td>
      <td>{new Date(page.createdAt!).toLocaleDateString()}</td>
      <td>{new Date(page.updatedAt!).toLocaleDateString()}</td>
      <td className={styles.actionsCell}>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/admin/editor/${page.id}`}>
                  <Edit size={14} /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePublish}>
                {page.status === "published" ? (
                  <>
                    <EyeOff size={14} /> Unpublish
                  </>
                ) : (
                  <>
                    <Eye size={14} /> Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                page "{page.title}".
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
};

const NewPageDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { useCreatePage } = usePageMutations();
  const createPageMutation = useCreatePage();

  const form = useForm({
    schema: newPageSchema,
    defaultValues: { title: "", route: "" },
  });

  const onSubmit = (values: z.infer<typeof newPageSchema>) => {
    toast.promise(createPageMutation.mutateAsync(values), {
      loading: "Creating page...",
      success: (data) => {
        onOpenChange(false);
        form.setValues({ title: "", route: "" });
        return `Page "${data.page.title}" created.`;
      },
      error: "Failed to create page.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Give your new page a title and a URL route to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
            <FormItem name="title">
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., About Us"
                  value={form.values.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const newRoute = newTitle
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .trim()
                      .replace(/\s+/g, "-");
                    form.setValues((prev) => ({
                      ...prev,
                      title: newTitle,
                      route: newRoute,
                    }));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem name="route">
              <FormLabel>Page Route</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., about-us"
                  value={form.values.route}
                  onChange={(e) =>
                    form.setValues((prev) => ({
                      ...prev,
                      route: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormDescription>
                This will be the URL path for your page.
              </FormDescription>
              <FormMessage />
            </FormItem>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createPageMutation.isPending}>
                {createPageMutation.isPending ? "Creating..." : "Create Page"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default function AdminPages() {
  const { data, isLoading, error } = usePages();
  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);

  const renderContent = () => {
    if (isLoading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className={styles.pageRow}>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "60%" }} />
                <Skeleton
                  style={{ height: "1rem", width: "40%", marginTop: "0.5rem" }}
                />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "80px" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "90px" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "90px" }} />
              </td>
              <td className={styles.actionsCell}>
                <Skeleton style={{ height: "24px", width: "24px" }} />
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    if (error) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className={styles.errorState}>
              Error loading pages: {error.message}
            </td>
          </tr>
        </tbody>
      );
    }

    if (!data || data.pages.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className={styles.emptyState}>
              No pages found. Create your first page to get started.
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {data.pages.map((page) => (
          <PageRow key={page.id} page={page} />
        ))}
      </tbody>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Pages - Admin</title>
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Manage Pages</h1>
          <Button onClick={() => setIsNewPageDialogOpen(true)}>
            <PlusCircle size={16} />
            Create New Page
          </Button>
        </header>

        <div className={styles.tableContainer}>
          <table className={styles.pagesTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            {renderContent()}
          </table>
        </div>
      </div>
      <NewPageDialog
        open={isNewPageDialogOpen}
        onOpenChange={setIsNewPageDialogOpen}
      />
    </>
  );
}