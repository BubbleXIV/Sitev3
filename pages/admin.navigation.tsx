import React, { useState, useEffect } from "react";
import { useNavigation } from "../helpers/useNavigation";
import { useNavigationMutations } from "../helpers/useNavigationMutations";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useForm,
} from "../components/Form";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import {
  AlertTriangle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import { z } from "zod";
import { Selectable } from "kysely";
import { NavigationItems } from "../helpers/schema";
import styles from "./admin.navigation.module.css";
import { toast } from "sonner";

type NavItem = {
  label: string;
  url: string;
  isExternal: boolean;
  isActive: boolean;
  target: string | null;
};

const navItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  url: z.string().min(1, "URL is required"),
  isExternal: z.boolean(),
  isActive: z.boolean(),
  target: z.string().nullable(),
});

const formSchema = z.object({
  items: z.array(navItemSchema),
});

const AdminNavigationPage: React.FC = () => {
  const { data, isLoading, error } = useNavigation();
  const { useUpdateNavigation } = useNavigationMutations();
  const updateNavigationMutation = useUpdateNavigation();

  const form = useForm({
    schema: formSchema,
    defaultValues: { items: [] },
  });

  useEffect(() => {
    if (data?.navigation) {
      const sortedNav = [...data.navigation].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
      );
      // Convert database types to form types with proper null handling
      const formItems: NavItem[] = sortedNav.map((item) => ({
        label: item.label,
        url: item.url,
        isExternal: item.isExternal ?? false,
        isActive: item.isActive ?? true,
        target: item.target,
      }));
      form.setValues({ items: formItems });
    }
  }, [data, form.setValues]);

  const { items } = form.values;

  const handleAddItem = () => {
    form.setValues((prev) => ({
      items: [
        ...prev.items,
        {
          label: "",
          url: "",
          isExternal: false,
          isActive: true,
          target: null,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    form.setValues((prev) => ({
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    ) {
      return;
    }
    const newItems = [...items];
    const item = newItems.splice(index, 1)[0];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    newItems.splice(newIndex, 0, item);
    form.setValues({ items: newItems });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateNavigationMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Navigation updated successfully!");
      },
      onError: (err) => {
        if (err instanceof Error) {
          toast.error(`Failed to update navigation: ${err.message}`);
        } else {
          toast.error("An unknown error occurred.");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Navigation Management</h1>
        <div className={styles.skeletonContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className={styles.skeletonItem} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateMessage}>
        <AlertTriangle size={48} className={styles.errorIcon} />
        <h2>Error Loading Navigation</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <header className={styles.header}>
            <h1 className={styles.title}>Navigation Management</h1>
            <div className={styles.actions}>
              <Button type="button" variant="outline" onClick={handleAddItem}>
                <Plus size={16} /> Add Link
              </Button>
              <Button type="submit" disabled={updateNavigationMutation.isPending}>
                {updateNavigationMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </header>

          <div className={styles.itemsContainer}>
            {items.length === 0 ? (
              <div className={styles.stateMessage}>
                <p>No navigation items yet. Add one to get started.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className={styles.navItem}>
                  <div className={styles.dragHandle}>
                    <GripVertical size={20} />
                  </div>
                  <div className={styles.itemFields}>
                    <FormItem name={`items.${index}.label`} className={styles.formItem}>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input
                          value={item.label}
                          onChange={(e) =>
                            form.setValues((prev) => {
                              const newItems = [...prev.items];
                              newItems[index].label = e.target.value;
                              return { items: newItems };
                            })
                          }
                          placeholder="Home"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <FormItem name={`items.${index}.url`} className={styles.formItem}>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          value={item.url}
                          onChange={(e) =>
                            form.setValues((prev) => {
                              const newItems = [...prev.items];
                              newItems[index].url = e.target.value;
                              return { items: newItems };
                            })
                          }
                          placeholder="/home"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <div className={styles.itemActions}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveItem(index, "up")}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      <ArrowUp size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveItem(index, "down")}
                      disabled={index === items.length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDown size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminNavigationPage;