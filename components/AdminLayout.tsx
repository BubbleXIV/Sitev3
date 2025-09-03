import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Image,
  Link as LinkIcon,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import { useAuth } from "../helpers/useAuth";
import styles from "./AdminLayout.module.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/navigation", label: "Navigation", icon: LinkIcon },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/menu", label: "Menu", icon: BookOpen },
  { href: "/admin/site-settings", label: "Settings", icon: Settings },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>FFXIV Venue</h1>
          <span className={styles.panelTitle}>Admin Panel</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`${styles.navLink} ${
                location.pathname === item.href ? styles.active : ""
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={() => logout()} className={styles.logoutButton}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};