import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { useMenu } from "../helpers/useMenu";
import { Selectable } from "kysely";
import { MenuItems } from "../helpers/schema";
import { Skeleton } from "../components/Skeleton";
import { Utensils, AlertTriangle } from "lucide-react";
import styles from "./menu.module.css";

const CATEGORY_ORDER = ["Signature Cocktails", "Premium Spirits", "Light Bites", "Non-Alcoholic"];

const MenuItemCard: React.FC<{ item: Selectable<MenuItems> }> = ({ item }) => (
  <div className={styles.menuItem}>
    {item.pictureUrl && (
      <img src={item.pictureUrl} alt={item.name} className={styles.itemImage} />
    )}
    <div className={styles.itemDetails}>
      <div className={styles.itemHeader}>
        <h3 className={styles.itemName}>{item.name}</h3>
        {item.priceGil != null && <span className={styles.itemPrice}>{item.priceGil.toLocaleString()} Gil</span>}
      </div>
      {item.description && <p className={styles.itemDescription}>{item.description}</p>}
    </div>
  </div>
);

const MenuPageSkeleton = () => (
  <>
    {CATEGORY_ORDER.map((category) => (
      <section key={category} className={styles.categorySection}>
        <Skeleton style={{ height: '2.5rem', width: '250px', marginBottom: 'var(--spacing-8)' }} />
        <div className={styles.categoryGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.skeletonItem}>
              <Skeleton style={{ width: '100px', height: '100px', borderRadius: 'var(--radius)' }} />
              <div style={{ flex: 1, width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <Skeleton style={{ height: '1.25rem', width: '60%' }} />
                  <Skeleton style={{ height: '1.25rem', width: '25%' }} />
                </div>
                <Skeleton style={{ height: '0.875rem', width: '90%', marginTop: 'var(--spacing-2)' }} />
                <Skeleton style={{ height: '0.875rem', width: '80%', marginTop: 'var(--spacing-2)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}
  </>
);

const MenuPage = () => {
  const { data: menuItems, isFetching, error } = useMenu();

  const groupedMenu = useMemo(() => {
    if (!menuItems) return {};
    
    const groups = menuItems.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Selectable<MenuItems>[]>);

    // Sort items within each category if needed, e.g., by displayOrder
    for (const category in groups) {
      groups[category].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }

    return groups;
  }, [menuItems]);

  const orderedCategories = useMemo(() => {
    const presentCategories = Object.keys(groupedMenu);
    return CATEGORY_ORDER.filter(cat => presentCategories.includes(cat))
      .concat(presentCategories.filter(cat => !CATEGORY_ORDER.includes(cat)));
  }, [groupedMenu]);

  const renderContent = () => {
    if (isFetching) {
      return <MenuPageSkeleton />;
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Failed to Load Menu</h2>
          <p className={styles.errorMessage}>
            There was an issue retrieving the menu. Please try again later.
          </p>
        </div>
      );
    }

    if (orderedCategories.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Crafting Our Menu</h2>
          <p className={styles.emptyMessage}>
            Our exquisite menu is currently being prepared and will be unveiled soon.
          </p>
        </div>
      );
    }

    return orderedCategories.map((category) => (
      <section key={category} className={styles.categorySection}>
        <h2 className={styles.categoryTitle}>{category}</h2>
        <div className={styles.categoryGrid}>
          {groupedMenu[category].map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    ));
  };

  return (
    <>
      <Helmet>
        <title>Our Menu - Eorzea's Embrace</title>
        <meta
          name="description"
          content="Explore the exquisite menu of Eorzea's Embrace, featuring signature cocktails, premium spirits, and delectable bites."
        />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Our Menu</h1>
          <p className={styles.subtitle}>
            A curated selection of fine drinks and culinary delights to enhance your evening.
          </p>
        </header>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default MenuPage;