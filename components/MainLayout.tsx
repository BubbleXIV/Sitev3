import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../helpers/useAuth";
import { useSiteSettings } from "../helpers/useSiteSettings";
import { useNavigation } from "../helpers/useNavigation";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { Swords, LogOut, Settings, Menu as MenuIcon } from "lucide-react";
import styles from "./MainLayout.module.css";

// Using a generic SVG for social icons to avoid adding new dependencies
const SocialIcon: React.FC<{ platform: string }> = ({ platform }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={styles.socialIcon}>
    <title>{platform}</title>
    {platform === 'Twitter' && <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.35 0 11.37-6.08 11.37-11.37 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08z"/>}
    {platform === 'Bluesky' && <path d="M12 21.62c-5.32 0-9.62-4.3-9.62-9.62S6.68 2.38 12 2.38c5.32 0 9.62 4.3 9.62 9.62s-4.3 9.62-9.62 9.62zm0-1.81c4.32 0 7.81-3.49 7.81-7.81s-3.49-7.81-7.81-7.81-7.81 3.49-7.81 7.81 3.49 7.81 7.81 7.81zm-2.1-11.34c.93-1.05 2.4-1.48 4.2-1.2.9.14 1.5.98 1.36 1.88-.14.9-.98 1.5-1.88 1.36-1.08-.12-2-.03-2.68.56-.68.59-.8 1.48-.56 2.68.24 1.2.06 2.21-.53 2.77-.59.56-1.57.74-2.77.53-1.2-.21-2.1-.03-2.77.56-.67.59-1.1 2.06-1.2 4.2-.14.9-.98 1.5-1.88 1.36-.9-.14-1.5-.98-1.36-1.88.12-1.8.55-3.27 1.2-4.2.65-.93 1.48-1.5 2.68-1.5.9 0 1.5-.6 1.5-1.5s-.6-1.5-1.5-1.5c-1.2 0-2.03.57-2.68 1.2-.75.86-1.63.68-2.26.06-.63-.63-.8-1.51.06-2.26z"/>}
    {platform === 'Discord' && <path d="M20.32 4.55c-1.15-.44-2.35-.77-3.58-.98.3-.38.56-.8.74-1.28a.45.45 0 0 0-.1-.52.48.48 0 0 0-.55-.08C15.54 2.4 14.2 3.04 12.9 3.73c-.3.16-.6.33-.9.5-1.3-.69-2.64-1.33-3.94-2.02a.48.48 0 0 0-.55.08.45.45 0 0 0-.1.52c.18.48.45.9.74 1.28-1.23.2-2.43.54-3.58.98a.49.49 0 0 0-.36.46c-.04.42.16.8.48 1.03 2.2 1.58 3.9 3.84 4.9 6.4-.42.2-.83.4-1.24.62a.5.5 0 0 0-.22.67c.16.3.5.43.82.33 1.4-.44 2.6-1.22 3.4-2.2.8 1 2 1.75 3.4 2.2.32.1.66-.03.82-.33a.5.5 0 0 0-.22-.67c-.4-.22-.82-.42-1.24-.62 1-2.56 2.7-4.82 4.9-6.4.32-.23.52-.6.48-1.03a.49.49 0 0 0-.36-.46ZM8.6 13.4c-.94 0-1.7-1-1.7-2.2s.76-2.2 1.7-2.2c.95 0 1.72 1 1.7 2.2s-.75 2.2-1.7 2.2Zm6.8 0c-.94 0-1.7-1-1.7-2.2s.76-2.2 1.7-2.2c.95 0 1.72 1 1.7 2.2s-.75 2.2-1.7 2.2Z"/>}
  </svg>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, logout } = useAuth();
  const { data: settings, isFetching: isLoadingSettings } = useSiteSettings();
  const { data: navigation, isFetching: isLoadingNavigation } = useNavigation();

  const isAdmin = authState.type === 'authenticated' && authState.user.role === 'admin';

  // Filter active navigation items and sort by display order
  const activeNavItems = navigation?.navigation
    ?.filter(item => item.isActive && !item.parentId) // Only root level, active items
    ?.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [];

  const renderNavLink = (item: typeof activeNavItems[0]) => {
    const linkProps = {
      key: item.id,
      className: ({ isActive }: { isActive: boolean }) => 
        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
    };

    if (item.isExternal) {
      return (
        <a 
          key={item.id}
          href={item.url}
          target={item.target || "_blank"}
          rel="noopener noreferrer"
          className={styles.navLink}
        >
          {item.label}
        </a>
      );
    }

    return (
      <NavLink {...linkProps} to={item.url}>
        {item.label}
      </NavLink>
    );
  };

  return (
    <div className={styles.layout}>
      <div className={styles.background} />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <Swords className={styles.logoIcon} />
            <span>Eorzea's Embrace</span>
          </Link>
          <nav className={styles.nav}>
            {isLoadingNavigation ? (
              <>
                <Skeleton style={{ width: '60px', height: '24px' }} />
                <Skeleton style={{ width: '50px', height: '24px' }} />
                <Skeleton style={{ width: '55px', height: '24px' }} />
              </>
            ) : (
              <>
                {activeNavItems.map(renderNavLink)}
                {isAdmin && (
                  <NavLink 
                    to="/admin" 
                    className={({ isActive }) => 
                      isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    }
                  >
                    Admin
                  </NavLink>
                )}
              </>
            )}
          </nav>
          <div className={styles.authActions}>
            {authState.type === 'authenticated' ? (
              <div className={styles.userControls}>
                {isAdmin && (
                  <div className={styles.adminControls}>
                    <Button variant="ghost" size="icon-sm" asChild title="Manage Navigation">
                      <Link to="/admin/navigation">
                        <MenuIcon size={16} />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon-sm" asChild title="Site Settings">
                      <Link to="/admin/settings">
                        <Settings size={16} />
                      </Link>
                    </Button>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" asChild>
                <Link to="/login">Admin Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Eorzea's Embrace. All rights reserved.</p>
          <div className={styles.socialLinks}>
            {isLoadingSettings ? (
              <>
                <Skeleton style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <Skeleton style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <Skeleton style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              </>
            ) : (
              <>
                {settings?.socialTwitter && <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer"><SocialIcon platform="Twitter" /></a>}
                {settings?.socialBluesky && <a href={settings.socialBluesky} target="_blank" rel="noopener noreferrer"><SocialIcon platform="Bluesky" /></a>}
                {settings?.socialDiscord && <a href={settings.socialDiscord} target="_blank" rel="noopener noreferrer"><SocialIcon platform="Discord" /></a>}
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};