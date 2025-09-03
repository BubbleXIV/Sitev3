import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useStaff } from "../helpers/useStaff";
import { useMenu } from "../helpers/useMenu";
import { useHomePage } from "../helpers/useHomePage";
import { useAuth } from "../helpers/useAuth";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar";
import { ContentBlockRenderer } from "../components/ContentBlockRenderer";
import { ArrowRight, Utensils, Users, Info, Edit } from "lucide-react";
import styles from "./_index.module.css";

const StaffCardSkeleton: React.FC = () => (
  <div className={styles.staffCard}>
    <Skeleton style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
    <Skeleton style={{ height: "1.5rem", width: "80%", marginTop: "var(--spacing-4)" }} />
    <Skeleton style={{ height: "1rem", width: "50%" }} />
    <Skeleton style={{ height: "4rem", width: "100%", marginTop: "var(--spacing-2)" }} />
  </div>
);

const MenuItemCardSkeleton: React.FC = () => (
  <div className={styles.menuItem}>
    <Skeleton style={{ width: "100%", height: "200px", borderRadius: "var(--radius)" }} />
    <Skeleton style={{ height: "1.5rem", width: "70%", marginTop: "var(--spacing-3)" }} />
    <Skeleton style={{ height: "3rem", width: "100%", marginTop: "var(--spacing-2)" }} />
  </div>
);

const ContentSkeleton: React.FC = () => (
  <div className={styles.homePage}>
    <div className={styles.hero}>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <Skeleton style={{ width: "400px", height: "4rem", marginBottom: "var(--spacing-4)" }} />
        <Skeleton style={{ width: "300px", height: "1.5rem", marginBottom: "var(--spacing-8)" }} />
        <Skeleton style={{ width: "150px", height: "3rem" }} />
      </div>
    </div>
    
    <div className={styles.section}>
      <Skeleton style={{ width: "300px", height: "2.5rem", marginBottom: "var(--spacing-8)" }} />
      <Skeleton style={{ width: "100%", height: "6rem" }} />
    </div>

    <div className={styles.section}>
      <Skeleton style={{ width: "250px", height: "2.5rem", marginBottom: "var(--spacing-8)" }} />
      <div className={styles.staffGrid}>
        <StaffCardSkeleton />
        <StaffCardSkeleton />
        <StaffCardSkeleton />
      </div>
    </div>
  </div>
);

// Default fallback content component
const DefaultHomeContent: React.FC = () => {
  const { data: staff, isLoading: isLoadingStaff } = useStaff();
  const { data: menu, isLoading: isLoadingMenu } = useMenu();

  const featuredStaff = staff?.slice(0, 3) ?? [];
  const menuHighlights = menu?.slice(0, 3) ?? [];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Eorzea's Embrace</h1>
          <p className={styles.heroSubtitle}>
            Where fantasy comes to life after dark.
          </p>
          <Button size="lg" asChild>
            <Link to="/menu">View Our Menu</Link>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Info className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Discover the Ambiance</h2>
        </div>
        <p className={styles.aboutText}>
          Nestled in the heart of the city-state, Eorzea's Embrace is more than just a venue; it's an escape. We offer a luxurious, immersive roleplaying experience with a grand stage for performers, intimate bars for quiet conversation, and an atmosphere steeped in fantasy. Whether you seek thrilling entertainment or a quiet corner to forge new alliances, your night begins here.
        </p>
      </section>

      {/* Featured Staff Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Users className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
        </div>
        <div className={styles.staffGrid}>
          {isLoadingStaff ? (
            <>
              <StaffCardSkeleton />
              <StaffCardSkeleton />
              <StaffCardSkeleton />
            </>
          ) : (
            featuredStaff.map((member) => (
              <div key={member.id} className={styles.staffCard}>
                <Avatar className={styles.staffAvatar}>
                  <AvatarImage src={member.profilePictureUrl ?? undefined} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className={styles.staffName}>{member.name}</h3>
                <p className={styles.staffRole}>{member.role}</p>
                <p className={styles.staffBio}>{member.bio}</p>
              </div>
            ))
          )}
        </div>
        <div className={styles.viewAllContainer}>
          <Button variant="outline" asChild>
            <Link to="/staff">
              View All Staff <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Menu Highlights Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Utensils className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>A Taste of Fantasy</h2>
        </div>
        <div className={styles.menuGrid}>
          {isLoadingMenu ? (
            <>
              <MenuItemCardSkeleton />
              <MenuItemCardSkeleton />
              <MenuItemCardSkeleton />
            </>
          ) : (
            menuHighlights.map((item) => (
              <div key={item.id} className={styles.menuItem}>
                <img src={item.pictureUrl ?? 'https://via.placeholder.com/400x300'} alt={item.name} className={styles.menuItemImage} />
                <div className={styles.menuItemContent}>
                  <h3 className={styles.menuItemName}>{item.name}</h3>
                  <p className={styles.menuItemDescription}>{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.viewAllContainer}>
          <Button variant="outline" asChild>
            <Link to="/menu">
              Explore Full Menu <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { data: homePageData, isLoading: isLoadingPage, error } = useHomePage();
  const { authState } = useAuth();

  // Determine if user is admin
  const isAdmin = authState.type === "authenticated" && authState.user.role === "admin";

  // Show loading skeleton while fetching page data
  if (isLoadingPage) {
    return (
      <>
        <Helmet>
          <title>Eorzea's Embrace Nightclub</title>
          <meta name="description" content="Welcome to Eorzea's Embrace, the premier roleplay nightclub experience in Final Fantasy XIV. Join us for a night of music, drinks, and fantasy." />
        </Helmet>
        <ContentSkeleton />
      </>
    );
  }

  // Use database content if available, otherwise fallback to default
  const hasPageContent = homePageData?.page && homePageData.page.contentBlocks.length > 0;
  const pageTitle = hasPageContent ? homePageData.page.title : "Eorzea's Embrace Nightclub";
  const metaDescription = hasPageContent 
    ? homePageData.page.metaDescription || "Welcome to Eorzea's Embrace, the premier roleplay nightclub experience in Final Fantasy XIV."
    : "Welcome to Eorzea's Embrace, the premier roleplay nightclub experience in Final Fantasy XIV. Join us for a night of music, drinks, and fantasy.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        {homePageData?.page?.metaKeywords && (
          <meta name="keywords" content={homePageData.page.metaKeywords} />
        )}
        {homePageData?.page?.ogImageUrl && (
          <meta property="og:image" content={homePageData.page.ogImageUrl} />
        )}
      </Helmet>

      {/* Admin Edit Controls */}
      {isAdmin && (
        <div className={styles.adminControls}>
          <Button
            variant="secondary"
            size="sm"
            asChild
          >
            <Link to={`/admin/editor/${homePageData?.page?.id || 1}`}>
              <Edit size={16} />
              Edit Page
            </Link>
          </Button>
        </div>
      )}

      {/* Render dynamic content if available, otherwise show default */}
      {hasPageContent ? (
        <div className={styles.dynamicHomePage}>
          <ContentBlockRenderer 
            blocks={homePageData.page.contentBlocks} 
            className={styles.contentBlocks}
          />
        </div>
      ) : (
        <DefaultHomeContent />
      )}

      {/* Show a notice for admins if using fallback content */}
      {isAdmin && !hasPageContent && (
        <div className={styles.adminNotice}>
          <p>
            <strong>Admin Notice:</strong> This page is showing default content. 
            <Link to="/admin/editor/1" className={styles.editLink}>
              Create custom content
            </Link> to make it fully editable.
          </p>
        </div>
      )}
    </>
  );
};

export default HomePage;