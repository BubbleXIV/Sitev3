import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useBookingInquiries } from "../helpers/useBookingInquiries";
import { useBookingMutations } from "../helpers/useBookingMutations";
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
import { Textarea } from "../components/Textarea";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  Edit,
  AlertTriangle,
  Search,
  Inbox,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";
import { Selectable } from "kysely";
import { BookingInquiries } from "../helpers/schema";
import styles from "./admin.bookings.module.css";

const inquiryStatusSchema = z.object({
  status: z.string().min(1, "Status is required"),
  staffNotes: z.string().nullable(),
});

const INQUIRY_STATUSES = [
  "new",
  "in_progress",
  "follow_up_needed",
  "resolved",
  "closed",
];

const STATUS_CLASS_MAP: Record<string, string> = {
  new: "new",
  in_progress: "in_progress", 
  follow_up_needed: "follow_up_needed",
  resolved: "resolved",
  closed: "closed",
};

const ViewInquiryDialog: React.FC<{
  inquiry: Selectable<BookingInquiries>;
  onClose: () => void;
}> = ({ inquiry, onClose }) => {
  const { useUpdateBookingInquiry } = useBookingMutations();
  const updateMutation = useUpdateBookingInquiry();

  const form = useForm({
    schema: inquiryStatusSchema,
    defaultValues: {
      status: inquiry.status ?? "new",
      staffNotes: inquiry.staffNotes ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof inquiryStatusSchema>) => {
    toast.promise(
      updateMutation.mutateAsync({ id: inquiry.id, ...values }),
      {
        loading: "Updating inquiry...",
        success: "Inquiry updated successfully.",
        error: "Failed to update inquiry.",
      },
    );
  };

  return (
    <DialogContent className={styles.dialogContent}>
      <DialogHeader>
        <DialogTitle>Booking Inquiry from {inquiry.contactName}</DialogTitle>
        <DialogDescription>
          Received on {new Date(inquiry.createdAt!).toLocaleString()}
        </DialogDescription>
      </DialogHeader>
      <div className={styles.inquiryDetails}>
        <div className={styles.detailItem}>
          <strong>Contact:</strong> {inquiry.contactName} (
          {inquiry.contactEmail || "No email"})
        </div>
        <div className={styles.detailItem}>
          <strong>Character:</strong> {inquiry.characterName || "N/A"} on{" "}
          {inquiry.server || "N/A"}
        </div>
        <div className={styles.detailItem}>
          <strong>Inquiry Type:</strong> {inquiry.inquiryType}
        </div>
        <div className={styles.detailItem}>
          <strong>Requested Date:</strong>{" "}
          {inquiry.eventDate
            ? new Date(inquiry.eventDate).toLocaleDateString()
            : "N/A"}
        </div>
        <div className={styles.detailItem}>
          <strong>Guests:</strong> {inquiry.expectedGuests || "N/A"}
        </div>
        <div className={styles.detailItem}>
          <strong>Budget:</strong> {inquiry.budgetRange || "N/A"}
        </div>
        <div className={styles.messageBlock}>
          <strong>Message:</strong>
          <p>{inquiry.message}</p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            <FormItem name="status">
              <FormLabel>Status</FormLabel>
              <Select
                value={form.values.status}
                onValueChange={(value) =>
                  form.setValues((p) => ({ ...p, status: value }))
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INQUIRY_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>
          <FormItem name="staffNotes">
            <FormLabel>Staff Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add internal notes here..."
                value={form.values.staffNotes ?? ""}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, staffNotes: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

const InquiryRow: React.FC<{ inquiry: Selectable<BookingInquiries> }> = ({
  inquiry,
}) => {
  const [isViewOpen, setIsViewOpen] = useState(false);

  return (
    <tr className={styles.tableRow}>
      <td>{inquiry.contactName}</td>
      <td>{inquiry.inquiryType}</td>
      <td>{new Date(inquiry.createdAt!).toLocaleDateString()}</td>
      <td>
        <span className={`${styles.statusBadge} ${styles[STATUS_CLASS_MAP[inquiry.status ?? "new"]]}`}>
          {inquiry.status?.replace(/_/g, " ") ?? "new"}
        </span>
      </td>
      <td className={styles.actionsCell}>
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye size={14} /> View
            </Button>
          </DialogTrigger>
          {isViewOpen && (
            <ViewInquiryDialog
              inquiry={inquiry}
              onClose={() => setIsViewOpen(false)}
            />
          )}
        </Dialog>
      </td>
    </tr>
  );
};

export default function AdminBookingsPage() {
  const { data, isLoading, error } = useBookingInquiries();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data
      .filter((i) => statusFilter === "all" || i.status === statusFilter)
      .filter(
        (i) =>
          i.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.inquiryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }, [data, searchTerm, statusFilter]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className={styles.tableRow}>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "70%" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "60%" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "80%" }} />
              </td>
              <td>
                <Skeleton style={{ height: "1.5rem", width: "50%" }} />
              </td>
              <td className={styles.actionsCell}>
                <Skeleton style={{ height: "32px", width: "80px" }} />
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
              Error loading booking inquiries: {error.message}
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
              <Inbox />
              No booking inquiries found.
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
              No inquiries match your filters.
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {filteredData.map((inquiry) => (
          <InquiryRow key={inquiry.id} inquiry={inquiry} />
        ))}
      </tbody>
    );
  };

  return (
    <>
      <Helmet>
        <title>Manage Bookings - Admin</title>
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Manage Bookings</h1>
          <div className={styles.headerActions}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <Input
                type="search"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={styles.filterSelect}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {INQUIRY_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>From</th>
                <th>Type</th>
                <th>Received</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            {renderContent()}
          </table>
        </div>
      </div>
    </>
  );
}