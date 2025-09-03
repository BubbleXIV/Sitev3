import React, { useEffect } from "react";
import { useSiteSettings } from "../helpers/useSiteSettings";
import { useSiteSettingsMutations } from "../helpers/useSiteSettingsMutations";
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
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle } from "lucide-react";
import { z } from "zod";
import styles from "./admin.site-settings.module.css";

const settingsSchema = z.object({
  socialTwitter: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable(),
  socialBluesky: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable(),
  socialDiscord: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .nullable(),
});

const AdminSiteSettingsPage: React.FC = () => {
  const { data, isLoading, error } = useSiteSettings();
  const { useUpdateSiteSettings } = useSiteSettingsMutations();
  const updateSettingsMutation = useUpdateSiteSettings();

  const form = useForm({
    schema: settingsSchema,
    defaultValues: {
      socialTwitter: "",
      socialBluesky: "",
      socialDiscord: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.setValues({
        socialTwitter: data.socialTwitter || "",
        socialBluesky: data.socialBluesky || "",
        socialDiscord: data.socialDiscord || "",
      });
    }
  }, [data, form.setValues]);

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    updateSettingsMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Site Settings</h1>
        <div className={styles.formContainer}>
          <Skeleton className={styles.skeletonLabel} />
          <Skeleton className={styles.skeletonInput} />
          <Skeleton className={styles.skeletonLabel} />
          <Skeleton className={styles.skeletonInput} />
          <Skeleton className={styles.skeletonLabel} />
          <Skeleton className={styles.skeletonInput} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateMessage}>
        <AlertTriangle size={48} className={styles.errorIcon} />
        <h2>Error Loading Settings</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <header className={styles.header}>
            <h1 className={styles.title}>Site Settings</h1>
            <Button type="submit" disabled={updateSettingsMutation.isPending}>
              {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </header>

          <div className={styles.formContainer}>
            <h2 className={styles.sectionTitle}>Social Media Links</h2>
            <p className={styles.sectionDescription}>
              These links will appear in the website footer.
            </p>

            <FormItem name="socialTwitter">
              <FormLabel>Twitter URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://twitter.com/yourprofile"
                  value={form.values.socialTwitter ?? ""}
                  onChange={(e) =>
                    form.setValues((prev) => ({
                      ...prev,
                      socialTwitter: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="socialBluesky">
              <FormLabel>Bluesky URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://bsky.app/profile/yourhandle.bsky.social"
                  value={form.values.socialBluesky ?? ""}
                  onChange={(e) =>
                    form.setValues((prev) => ({
                      ...prev,
                      socialBluesky: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="socialDiscord">
              <FormLabel>Discord URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://discord.gg/yourserver"
                  value={form.values.socialDiscord ?? ""}
                  onChange={(e) =>
                    form.setValues((prev) => ({
                      ...prev,
                      socialDiscord: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminSiteSettingsPage;