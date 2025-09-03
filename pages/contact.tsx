import React from "react";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { useBookingMutations } from "../helpers/useBookingMutations";
import { schema as bookingInquirySchema } from "../endpoints/booking-inquiries_POST.schema";
import { 
  Form, 
  FormControl, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  useForm 
} from "../components/Form";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select";
import { toast } from "sonner";
import styles from "./contact.module.css";

type BookingInquiryForm = z.infer<typeof bookingInquirySchema>;

const ContactPage = () => {
  const { useSubmitBookingInquiry } = useBookingMutations();
  const submitInquiry = useSubmitBookingInquiry();

  const form = useForm({
    defaultValues: {
      contactName: "",
      contactEmail: "",
      characterName: "",
      server: "",
      inquiryType: "Private Event",
      eventDate: undefined,
      expectedGuests: undefined,
      budgetRange: "",
      message: "",
    },
    schema: bookingInquirySchema,
  });

  const handleSubmit = async (data: BookingInquiryForm) => {
    try {
      await submitInquiry.mutateAsync(data);
      toast.success("Your inquiry has been sent!", {
        description: "Our team will get back to you as soon as possible.",
      });
      form.setValues({
        contactName: "",
        contactEmail: "",
        characterName: "",
        server: "",
        inquiryType: "Private Event",
        eventDate: undefined,
        expectedGuests: undefined,
        budgetRange: "",
        message: "",
      });
    } catch (error) {
      // Error toast is handled by the mutation hook
      console.error("Submission failed", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact & Bookings - Eorzea's Embrace</title>
        <meta name="description" content="Contact us for inquiries or book a private event at Eorzea's Embrace. Let us host your perfect night." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Contact & Bookings</h1>
          <p className={styles.subtitle}>Reach out to our team for private events, special requests, or general inquiries.</p>
        </header>
        <div className={styles.contentGrid}>
          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Booking Information</h2>
            <p className={styles.infoText}>
              Eorzea's Embrace is available for private parties, corporate events, and special celebrations. Our venue offers multiple spaces, including the main stage, VIP lounge, and intimate bar areas to suit your needs.
            </p>
            <h3 className={styles.subheading}>Booking Policies</h3>
            <ul className={styles.policyList}>
              <li>A 50% deposit is required to secure your date.</li>
              <li>Cancellations must be made at least 72 hours in advance for a full refund.</li>
              <li>Custom menu and performance packages are available upon request.</li>
              <li>All guests must adhere to our venue's code of conduct.</li>
            </ul>
            <p className={styles.infoText}>
              For detailed pricing and availability, please fill out the form, and our event coordinator will be in touch.
            </p>
          </div>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Send an Inquiry</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
                <div className={styles.formRow}>
                  <FormItem name="contactName">
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name*"
                        value={form.values.contactName}
                        onChange={(e) =>
                          form.setValues((prev) => ({ ...prev, contactName: e.target.value }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem name="contactEmail">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email Address"
                        type="email"
                        value={form.values.contactEmail || ""}
                        onChange={(e) =>
                          form.setValues((prev) => ({ ...prev, contactEmail: e.target.value || null }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
                <div className={styles.formRow}>
                  <FormItem name="characterName">
                    <FormLabel>Character Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Character Name"
                        value={form.values.characterName || ""}
                        onChange={(e) =>
                          form.setValues((prev) => ({ ...prev, characterName: e.target.value || null }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem name="server">
                    <FormLabel>Server / Data Center</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Server / Data Center"
                        value={form.values.server || ""}
                        onChange={(e) =>
                          form.setValues((prev) => ({ ...prev, server: e.target.value || null }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
                <FormItem name="inquiryType">
                  <FormLabel>Inquiry Type</FormLabel>
                  <FormControl>
                    <Select
                      value={form.values.inquiryType}
                      onValueChange={(value) =>
                        form.setValues((prev) => ({ ...prev, inquiryType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Private Event">Private Event</SelectItem>
                        <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                        <SelectItem value="Wedding">Wedding</SelectItem>
                        <SelectItem value="Birthday Party">Birthday Party</SelectItem>
                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <div className={styles.formRow}>
                  <FormItem name="expectedGuests">
                    <FormLabel>Expected Guests</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Number of guests"
                        type="number"
                        value={form.values.expectedGuests?.toString() || ""}
                        onChange={(e) =>
                          form.setValues((prev) => ({ 
                            ...prev, 
                            expectedGuests: e.target.value ? parseInt(e.target.value) : null 
                          }))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem name="budgetRange">
                    <FormLabel>Budget Range</FormLabel>
                    <FormControl>
                      <Select
                        value={form.values.budgetRange || ""}
                        onValueChange={(value) =>
                          form.setValues((prev) => ({ ...prev, budgetRange: value === "__empty" ? null : value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__empty">Prefer not to say</SelectItem>
                          <SelectItem value="Under 100k Gil">Under 100k Gil</SelectItem>
                          <SelectItem value="100k - 500k Gil">100k - 500k Gil</SelectItem>
                          <SelectItem value="500k - 1M Gil">500k - 1M Gil</SelectItem>
                          <SelectItem value="1M+ Gil">1M+ Gil</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
                <FormItem name="message">
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your event, preferred dates, special requirements, or any questions you have..."
                      rows={6}
                      value={form.values.message}
                      onChange={(e) =>
                        form.setValues((prev) => ({ ...prev, message: e.target.value }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <Button type="submit" disabled={submitInquiry.isPending} className={styles.submitButton}>
                  {submitInquiry.isPending ? "Sending..." : "Submit Inquiry"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;