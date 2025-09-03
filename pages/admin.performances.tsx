import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { usePerformances } from "../helpers/usePerformances";
import { usePerformanceMutations } from "../helpers/usePerformanceMutations";
import { useStaff } from "../helpers/useStaff";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { Checkbox } from "../components/Checkbox";
import { Textarea } from "../components/Textarea";
import { z } from "zod";
import { toast } from "sonner";
import {
  PlusCircle,
  Edit,
  Trash2,
  MoreVertical,
  AlertTriangle,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";
import { schema as performanceSchema } from "../endpoints/performances_POST.schema";
import { PerformanceWithStaff } from "../endpoints/performances_GET.schema";
import styles from "./admin.performances.module.css";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const PerformanceForm: React.FC<{
  performance?: PerformanceWithStaff;
  onClose: () => void;
}> = ({ performance, onClose }) => {
  const { useCreatePerformance, useUpdatePerformance } =
    usePerformanceMutations();
  const createMutation = useCreatePerformance();
  const updateMutation = useUpdatePerformance();
  const { data: staffData } = useStaff();

  const isEditing = !!performance;
  const mutation = isEditing ? updateMutation : createMutation;

  const form = useForm({
    schema: performanceSchema,
    defaultValues: {
      title: performance?.title ?? "",
      description: performance?.description ?? "",
      staffId: performance?.staffId ?? null,
      dayOfWeek: performance?.dayOfWeek ?? null,
      startTime: performance?.startTime ?? "",
      endTime: performance?.endTime ?? "",
      recurring: performance?.recurring ?? false,
      isActive: performance?.isActive ?? true,
      specialNotes: performance?.specialNotes ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof performanceSchema>) => {
    const payload = isEditing ? { ...values, id: performance.id } : values;
    toast.promise(mutation.mutateAsync(payload), {
      loading: `${isEditing ? "Updating" : "Creating"} performance...`,
      success: () => {
        onClose();
        return `Performance ${isEditing ? "updated" : "created"} successfully.`;
      },
      error: (err) => {
        if (err instanceof Error) {
          return `Failed to ${isEditing ? "update" : "create"} performance: ${err.message}`;
        }
        return `An unknown error occurred.`;
      },
    });
  };

  return (
    <DialogContent className={styles.dialogContent}>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Performance" : "Create New Performance"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the details for this performance."
            : "Fill out the form to add a new performance schedule."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="title">
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., DJ Night"
                value={form.values.title}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, title: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className={styles.formGrid}>
            <FormItem name="staffId">
              <FormLabel>Staff Member</FormLabel>
              <Select
                value={form.values.staffId?.toString() ?? ""}
                onValueChange={(value) =>
                  form.setValues((p) => ({
                    ...p,
                    staffId: value ? parseInt(value, 10) : null,
                  }))
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {staffData?.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id.toString()}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>

            <FormItem name="dayOfWeek">
              <FormLabel>Day of Week</FormLabel>
              <Select
                value={form.values.dayOfWeek?.toString() ?? ""}
                onValueChange={(value) =>
                  form.setValues((p) => ({
                    ...p,
                    dayOfWeek: value ? parseInt(value, 10) : null,
                  }))
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Not specified</SelectItem>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>

          <div className={styles.formGrid}>
            <FormItem name="startTime">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={form.values.startTime}
                  onChange={(e) =>
                    form.setValues((p) => ({ ...p, startTime: e.target.value }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem name="endTime">
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={form.values.endTime}
                  onChange={(e) =>
                    form.setValues((p) => ({ ...p, endTime: e.target.value }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <FormItem name="description">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe the performance..."
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

          <FormItem name="specialNotes">
            <FormLabel>Special Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., 18+ only"
                value={form.values.specialNotes ?? ""}
                onChange={(e) =>
                  form.setValues((p) => ({
                    ...p,
                    specialNotes: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className={styles.checkboxContainer}>
            <FormItem name="recurring" className={styles.checkboxFormItem}>
              <div className={styles.checkboxWrapper}>
                <FormControl>
                  <Checkbox
                    id="recurring"
                    checked={form.values.recurring}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      form.setValues((p) => ({
                        ...p,
                        recurring: e.target.checked,
                      }))
                    }
                  />
                </FormControl>
                <FormLabel htmlFor="recurring">Recurring</FormLabel>
              </div>
              <FormDescription>
                Does this performance happen every week?
              </FormDescription>
            </FormItem>
            <FormItem name="isActive" className={styles.checkboxFormItem}>
              <div className={styles.checkboxWrapper}>
                <FormControl>
                  <Checkbox
                    id="isActive"
                    checked={form.values.isActive}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      form.setValues((p) => ({ ...p, isActive: e.target.checked }))
                    }
                  />
                </FormControl>
                <FormLabel htmlFor="isActive">Active</FormLabel>
              </div>
              <FormDescription>
                Is this performance currently active?
              </FormDescription>
            </FormItem>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Performance"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

const PerformanceRow: React.FC<{ performance: PerformanceWithStaff }> = ({
  performance,
}) => {
  const { useDeletePerformance } = usePerformanceMutations();
  const deleteMutation = useDeletePerformance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    toast.promise(deleteMutation.mutateAsync({ id: performance.id }), {
      loading: "Deleting performance...",
      success: "Performance deleted successfully.",
      error: "Failed to delete performance.",
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <tr className={styles.tableRow}>
      <td>
        <div className={styles.titleCell}>
          <span className={styles.performanceTitle}>{performance.title}</span>
          <span
            className={`${styles.statusIndicator} ${performance.isActive ? styles.active : styles.inactive}`}
          ></span>
        </div>
      </td>
      <td>{performance.staffName || "N/A"}</td>
      <td>
        {performance.dayOfWeek !== null
          ? DAYS_OF_WEEK[performance.dayOfWeek]
          : "N/A"}
      </td>
      <td>
        {performance.startTime} - {performance.endTime}
      </td>
      <td>{performance.recurring ? "Yes" : "No"}</td>
      <td className={styles.actionsCell}>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <span />
          </DialogTrigger>
          {isFormOpen && (
            <PerformanceForm
              performance={performance}
              onClose={() => setIsFormOpen(false)}
            />
          )}
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsFormOpen(true)}>
                <Edit size={14} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)}>
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This will permanently delete the performance "{performance.title}
                ". This action cannot be undone.
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

export default function AdminPerformancesPage() {
  const { data, isLoading, error } = usePerformances();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.dayOfWeek !== null &&
          DAYS_OF_WEEK[p.dayOfWeek]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())),
    );
  }, [data, searchTerm]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className={styles.tableRow}>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "80%" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "70%" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "60%" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "90%" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "40%" }} />
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
            <td colSpan={6} className={styles.stateMessage}>
              <AlertTriangle className={styles.errorIcon} />
              Error loading performances: {error.message}
            </td>
          </tr>
        </tbody>
      );
    }

    if (!data || data.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={6} className={styles.stateMessage}>
              No performances found. Create one to get started.
            </td>
          </tr>
        </tbody>
      );
    }

    if (filteredData.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={6} className={styles.stateMessage}>
              No performances match your search for "{searchTerm}".
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {filteredData.map((performance) => (
          <PerformanceRow key={performance.id} performance={performance} />
        ))}
      </tbody>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Performances - Admin</title>
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Manage Performances</h1>
          <div className={styles.headerActions}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <Input
                type="search"
                placeholder="Search performances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle size={16} />
              New Performance
            </Button>
          </div>
        </header>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Staff</th>
                <th>Day</th>
                <th>Time</th>
                <th>Recurring</th>
                <th>Actions</th>
              </tr>
            </thead>
            {renderContent()}
          </table>
        </div>
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        {isFormOpen && <PerformanceForm onClose={() => setIsFormOpen(false)} />}
      </Dialog>
    </>
  );
}