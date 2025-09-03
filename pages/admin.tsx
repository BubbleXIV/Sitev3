import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useStaff } from "../helpers/useStaff";
import { useMenu } from "../helpers/useMenu";
import { useMedia } from "../helpers/useMedia";
import { useNavigation } from "../helpers/useNavigation";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { Users, Utensils, BarChart2, FileText, Image, Menu as MenuIcon, Settings } from "lucide-react";
import styles from "./admin.module.css";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, isLoading }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statContent}>
      <h3 className={styles.statTitle}>{title}</h3>
      {isLoading ? (
        <Skeleton style={{ height: '2rem', width: '50px' }} />
      ) : (
        <p className={styles.statValue}>{value}</p>
      )}
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const { data: staff, isLoading: isLoadingStaff } = useStaff();
  const { data: menu, isLoading: isLoadingMenu } = useMenu();
  const { data: mediaData, isLoading: isLoadingMedia } = useMedia();
  const { data: navigationData, isLoading: isLoadingNavigation } = useNavigation();

  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for website management." />
      </Helmet>
      <div className={styles.dashboard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, Administrator.</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Site Statistics</h2>
          <div className={styles.statsGrid}>
            <StatCard
              icon={<BarChart2 />}
              title="Total Page Visits"
              value="1,234" // Mocked data
              isLoading={false}
            />
            <StatCard
              icon={<Users />}
              title="Staff Members"
              value={staff?.length ?? 0}
              isLoading={isLoadingStaff}
            />
            <StatCard
              icon={<Utensils />}
              title="Menu Items"
              value={menu?.length ?? 0}
              isLoading={isLoadingMenu}
            />
            <StatCard
              icon={<Image />}
              title="Media Items"
              value={mediaData?.media?.length ?? 0}
              isLoading={isLoadingMedia}
            />
            <StatCard
              icon={<MenuIcon />}
              title="Navigation Items"
              value={navigationData?.navigation?.length ?? 0}
              isLoading={isLoadingNavigation}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Content Management</h2>
          <p className={styles.sectionDescription}>Create, edit, and manage your website's content and structure.</p>
          <div className={styles.actionsGrid}>
            <Link to="/admin/pages" className={styles.actionCard}>
              <FileText className={styles.actionIcon} />
              <h3 className={styles.actionTitle}>Pages</h3>
              <p className={styles.actionDescription}>Create, edit, and publish website pages using the visual page editor. Build custom layouts and content.</p>
            </Link>
            <Link to="/admin/staff" className={styles.actionCard}>
              <Users className={styles.actionIcon} />
              <h3 className={styles.actionTitle}>Staff Management</h3>
              <p className={styles.actionDescription}>Add and manage staff members, their roles, bios, and alternate character profiles.</p>
            </Link>
            <Link to="/admin/menu" className={styles.actionCard}>
              <Utensils className={styles.actionIcon} />
              <h3 className={styles.actionTitle}>Menu Management</h3>
              <p className={styles.actionDescription}>Update your venue's menu with drinks, food items, descriptions, and pricing information.</p>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Media & Assets</h2>
          <p className={styles.sectionDescription}>Manage your website's media library and visual assets.</p>
          <div className={styles.actionsGrid}>
            <Link to="/admin/media" className={styles.actionCard}>
              <Image className={styles.actionIcon} />
              <h3 className={styles.actionTitle}>Media Library</h3>
              <p className={styles.actionDescription}>Upload, organize, and manage images, videos, and other media files for use across your website.</p>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Site Configuration</h2>
          <p className={styles.sectionDescription}>Configure global site settings and navigation structure.</p>
          <div className={styles.actionsGrid}>
            <Link to="/admin/navigation" className={styles.actionCard}>
              <MenuIcon className={styles.actionIcon} />
              <h3 className={styles.actionTitle}>Navigation Menu</h3>
              <p className={styles.actionDescription}>Configure your site's main navigation menu, add new links, and arrange their display order.</p>
            </Link>
            <Link to="/admin/site-settings" className={styles.actionCard}>
              <Settings className={styles.actionIcon} />
              <h3 className={styles.actionTitle}>Site Settings</h3>
              <p className={styles.actionDescription}>Manage site-wide settings including social media links, footer content, and general configurations.</p>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;