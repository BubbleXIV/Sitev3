import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useEvents } from "../helpers/useEvents";
import { useEventMutations } from "../helpers/useEventMutations";
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
import { Popover, PopoverTrigger, PopoverContent } from "../components/Popover";
import { Calendar } from "../components/Calendar";
import { z } from "zod";
import { toast } from "sonner";
import {
  PlusCircle,
  Edit,
  Trash2,
  MoreVertical,
  AlertTriangle,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";
import { schema as eventSchema } from "../endpoints/events_POST.schema";
import { Selectable } from "kysely";
import { Events } from "../helpers/schema";
import styles from "./admin.events.module.css";

const EventForm: React.FC<{
  event?: Selectable<Events>;
  onClose: () => void;
}> = ({ event, onClose }) => {
  const { useCreateEvent, useUpdateEvent } = useEventMutations();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const { data: staffData } = useStaff();

  const isEditing = !!event;
  const mutation = isEditing ? updateMutation : createMutation;

  const form = useForm({
    schema: eventSchema,
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      eventDate: event?.eventDate ? new Date(event.eventDate) : new Date(),
      startTime: event?.startTime ?? "",
      endTime: event?.endTime ?? "",
      imageUrl: event?.imageUrl ?? "",
      eventType: event?.eventType ?? "",
      coverCharge: event?.coverCharge ?? 0,
      rsvpRequired: event?.rsvpRequired ?? false,
      maxAttendees: event?.maxAttendees ?? null,
      featuredStaffIds: event?.featuredStaffIds ?? [],
      specialRequirements: event?.specialRequirements ?? "",
      isActive: event?.isActive ?? true,
    },
  });

  const onSubmit = (values: z.infer<typeof eventSchema>) => {
    const payload = isEditing ? { ...values, id: event.id } : values;
    toast.promise(mutation.mutateAsync(payload), {
      loading: `${isEditing ? "Updating" : "Creating"} event...`,
      success: () => {
        onClose();
        return `Event ${isEditing ? "updated" : "created"} successfully.`;
      },
      error: (err) => {
        if (err instanceof Error) {
          return `Failed to ${isEditing ? "update" : "create"} event: ${err.message}`;
        }
        return `An unknown error occurred.`;
      },
    });
  };

  return (
    <DialogContent className={styles.dialogContent}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Event" : "Create New Event"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the details for this event."
            : "Fill out the form to add a new event."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="title">
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Summer Bash"
                value={form.values.title}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, title: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className={styles.formGrid}>
            <FormItem name="eventDate">
              <FormLabel>Event Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className={styles.datePickerButton}>
                      {form.values.eventDate
                        ? form.values.eventDate.toLocaleDateString()
                        : "Select a date"}
                      <CalendarIcon size={16} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent removeBackgroundAndPadding>
                  <Calendar
                    mode="single"
                    selected={form.values.eventDate}
                    onSelect={(date) =>
                      form.setValues((p) => ({ ...p, eventDate: date as Date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
            <FormItem name="eventType">
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Live Music"
                  value={form.values.eventType ?? ""}
                  onChange={(e) =>
                    form.setValues((p) => ({ ...p, eventType: e.target.value }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div className={styles.formGrid}>
            <FormItem name="startTime">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  value={form.values.startTime ?? ""}
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
                  value={form.values.endTime ?? ""}
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
                placeholder="Describe the event..."
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

          <FormItem name="imageUrl">
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://example.com/image.png"
                value={form.values.imageUrl ?? ""}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, imageUrl: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className={styles.formGrid}>
            <FormItem name="coverCharge">
              <FormLabel>Cover Charge (Gil)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.values.coverCharge ?? ""}
                  onChange={(e) =>
                    form.setValues((p) => ({
                      ...p,
                      coverCharge: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem name="maxAttendees">
              <FormLabel>Max Attendees</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={form.values.maxAttendees ?? ""}
                  onChange={(e) =>
                    form.setValues((p) => ({
                      ...p,
                      maxAttendees: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div className={styles.checkboxContainer}>
            <FormItem name="rsvpRequired" className={styles.checkboxFormItem}>
              <div className={styles.checkboxWrapper}>
                <FormControl>
                  <Checkbox
                    id="rsvpRequired"
                    checked={form.values.rsvpRequired}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      form.setValues((p) => ({
                        ...p,
                        rsvpRequired: e.target.checked,
                      }))
                    }
                  />
                </FormControl>
                <FormLabel htmlFor="rsvpRequired">RSVP Required</FormLabel>
              </div>
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
                  : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

const EventRow: React.FC<{ event: Selectable<Events> }> = ({ event }) => {
  const { useDeleteEvent } = useEventMutations();
  const deleteMutation = useDeleteEvent();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    toast.promise(deleteMutation.mutateAsync({ id: event.id }), {
      loading: "Deleting event...",
      success: "Event deleted successfully.",
      error: "Failed to delete event.",
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <tr className={styles.tableRow}>
      <td>
        <div className={styles.titleCell}>
          <span className={styles.eventTitle}>{event.title}</span>
          <span
            className={`${styles.statusIndicator} ${event.isActive ? styles.active : styles.inactive}`}
          ></span>
        </div>
      </td>
      <td>{new Date(event.eventDate).toLocaleDateString()}</td>
      <td>{event.eventType || "N/A"}</td>
      <td>
        {event.currentAttendees ?? 0} / {event.maxAttendees ?? "∞"}
      </td>
      <td className={styles.actionsCell}>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <span />
          </DialogTrigger>
          {isFormOpen && (
            <EventForm event={event} onClose={() => setIsFormOpen(false)} />
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
                This will permanently delete the event "{event.title}". This
                action cannot be undone.
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

export default function AdminEventsPage() {
  const { data, isLoading, error } = useEvents();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventType?.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <Skeleton style={{ height: "1.5rem", width: "50%" }} />
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
            <td colSpan={5} className={styles.stateMessage}>
              <AlertTriangle className={styles.errorIcon} />
              Error loading events: {error.message}
            </td>
          </tr>
        </tbody>
      );
    }

    if (!data || data.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className={styles.stateMessage}>
              No events found. Create one to get started.
            </td>
          </tr>
        </tbody>
      );
    }

    if (filteredData.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className={styles.stateMessage}>
              No events match your search for "{searchTerm}".
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {filteredData.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </tbody>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Events - Admin</title>
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Manage Events</h1>
          <div className={styles.headerActions}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <Input
                type="search"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle size={16} />
              New Event
            </Button>
          </div>
        </header>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Type</th>
                <th>Attendees</th>
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
        {isFormOpen && <EventForm onClose={() => setIsFormOpen(false)} />}
      </Dialog>
    </>
  );
}