import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useGallery } from "../helpers/useGallery";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle, Camera, X } from "lucide-react";
import styles from "./gallery.module.css";

const GalleryPage = () => {
  const { data: galleryData, isFetching, error } = useGallery();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = galleryData ?? [];
  const photos = activeCategory
    ? categories.find(c => c.id === activeCategory)?.photos ?? []
    : categories.flatMap(c => c.photos);

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = '';
  };

  const renderContent = () => {
    if (isFetching) {
      return (
        <>
          <div className={styles.filters}>
            <Skeleton style={{ height: '38px', width: '80px' }} />
            <Skeleton style={{ height: '38px', width: '120px' }} />
            <Skeleton style={{ height: '38px', width: '100px' }} />
          </div>
          <div className={styles.photoGrid}>
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className={styles.photoSkeleton} />)}
          </div>
        </>
      );
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Failed to Load Gallery</h2>
          <p className={styles.errorMessage}>There was an issue retrieving photos. Please try again later.</p>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Camera size={48} />
          <h2 className={styles.emptyTitle}>Our Gallery Awaits</h2>
          <p className={styles.emptyMessage}>We are currently curating photos from our latest events. Check back soon to see the moments we've captured.</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.filters}>
          <button onClick={() => setActiveCategory(null)} className={activeCategory === null ? styles.activeFilter : ''}>All</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={activeCategory === cat.id ? styles.activeFilter : ''}>
              {cat.name}
            </button>
          ))}
        </div>
        <div className={styles.photoGrid}>
          {photos.map(photo => (
            <div key={photo.id} className={styles.photoWrapper} onClick={() => openLightbox(photo.imageUrl)}>
              <img src={photo.imageUrl} alt={photo.altText ?? photo.title ?? ''} loading="lazy" />
              <div className={styles.photoOverlay}>
                <p>{photo.title}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Gallery - Eorzea's Embrace</title>
        <meta name="description" content="Explore the photo gallery of Eorzea's Embrace. View moments from our past events, parties, and performances." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Gallery</h1>
          <p className={styles.subtitle}>A collection of moments captured within our walls. Relive the nights and see the spectacle.</p>
        </header>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
      {lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeButton}><X size={32} /></button>
          <img src={lightboxImage} alt="Lightbox view" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};

export default GalleryPage;