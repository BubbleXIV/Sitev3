import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { usePerformances } from "../helpers/usePerformances";
import { PerformanceWithStaff } from "../endpoints/performances_GET.schema";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle, Calendar, Mic, User, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar";
import styles from "./performances.module.css";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const PerformanceCard: React.FC<{ performance: PerformanceWithStaff }> = ({ performance }) => (
  <div className={styles.performanceCard}>
    <div className={styles.cardHeader}>
      {performance.staffProfilePictureUrl ? (
        <Avatar className={styles.performerAvatar}>
          <AvatarImage src={performance.staffProfilePictureUrl} alt={performance.staffName ?? 'Performer'} />
          <AvatarFallback>{performance.staffName?.charAt(0) ?? 'P'}</AvatarFallback>
        </Avatar>
      ) : <Mic className={styles.cardIcon} />}
      <div className={styles.headerText}>
        <h3 className={styles.performanceTitle}>{performance.title}</h3>
        {performance.staffName && <p className={styles.performerName}><User size={14} /> {performance.staffName}</p>}
      </div>
    </div>
    <div className={styles.cardBody}>
      <p className={styles.performanceTime}><Clock size={14} /> {performance.startTime} - {performance.endTime}</p>
      {performance.description && <p className={styles.performanceDescription}>{performance.description}</p>}
    </div>
    {performance.specialNotes && <div className={styles.specialNotes}>{performance.specialNotes}</div>}
  </div>
);

const PerformancesPageSkeleton = () => (
  <div className={styles.scheduleGrid}>
    {DAY_NAMES.slice(1).concat(DAY_NAMES[0]).map(day => (
      <div key={day} className={styles.dayColumn}>
        <Skeleton style={{ height: '2rem', width: '120px', marginBottom: 'var(--spacing-6)' }} />
        <div className={styles.skeletonCard}>
          <div className={styles.cardHeader}>
            <Skeleton style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)' }} />
            <div style={{ flex: 1 }}>
              <Skeleton style={{ height: '1.25rem', width: '80%' }} />
              <Skeleton style={{ height: '1rem', width: '50%', marginTop: 'var(--spacing-2)' }} />
            </div>
          </div>
          <Skeleton style={{ height: '1rem', width: '70%', marginTop: 'var(--spacing-4)' }} />
          <Skeleton style={{ height: '3rem', width: '100%', marginTop: 'var(--spacing-2)' }} />
        </div>
      </div>
    ))}
  </div>
);

const PerformancesPage = () => {
  const { data: performances, isFetching, error } = usePerformances();
  const [dayFilter, setDayFilter] = useState<number | null>(null);

  const weeklySchedule = useMemo(() => {
    const schedule: Record<number, PerformanceWithStaff[]> = {};
    if (!performances) return schedule;

    performances
      .filter(p => p.recurring && p.dayOfWeek !== null)
      .forEach(p => {
        const day = p.dayOfWeek!;
        if (!schedule[day]) {
          schedule[day] = [];
        }
        schedule[day].push(p);
        schedule[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      });
    return schedule;
  }, [performances]);

  const specialPerformances = useMemo(() => {
    return performances?.filter(p => !p.recurring) ?? [];
  }, [performances]);

  const orderedDays = useMemo(() => {
    const days = Object.keys(weeklySchedule).map(Number).sort((a, b) => a - b);
    // Standard week order (Mon-Sun)
    return days.sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
  }, [weeklySchedule]);

  const filteredDays = useMemo(() => {
    if (dayFilter === null) return orderedDays;
    return orderedDays.filter(day => day === dayFilter);
  }, [dayFilter, orderedDays]);

  const renderContent = () => {
    if (isFetching) {
      return <PerformancesPageSkeleton />;
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Failed to Load Schedule</h2>
          <p className={styles.errorMessage}>There was an issue retrieving the performance schedule. Please try again later.</p>
        </div>
      );
    }

    if (!performances || performances.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>The Stage is Quiet</h2>
          <p className={styles.emptyMessage}>Our performance schedule is currently being updated. Check back soon for showtimes!</p>
        </div>
      );
    }

    return (
      <>
        {specialPerformances.length > 0 && (
          <section className={styles.specialSection}>
            <h2 className={styles.sectionTitle}>Special Performances</h2>
            <div className={styles.specialGrid}>
              {specialPerformances.map(p => <PerformanceCard key={p.id} performance={p} />)}
            </div>
          </section>
        )}

        <section>
          <h2 className={styles.sectionTitle}>Weekly Schedule</h2>
          <div className={styles.filters}>
            <button onClick={() => setDayFilter(null)} className={dayFilter === null ? styles.activeFilter : ''}>All Week</button>
            {orderedDays.map(day => (
              <button key={day} onClick={() => setDayFilter(day)} className={dayFilter === day ? styles.activeFilter : ''}>
                {DAY_NAMES[day]}
              </button>
            ))}
          </div>
          <div className={styles.scheduleGrid}>
            {filteredDays.length > 0 ? filteredDays.map(day => (
              <div key={day} className={styles.dayColumn}>
                <h3 className={styles.dayTitle}>{DAY_NAMES[day]}</h3>
                <div className={styles.performancesList}>
                  {weeklySchedule[day].map(p => <PerformanceCard key={p.id} performance={p} />)}
                </div>
              </div>
            )) : (
              <div className={styles.emptyState}>
                <p>No performances scheduled for {DAY_NAMES[dayFilter!]}.</p>
              </div>
            )}
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Performances - Eorzea's Embrace</title>
        <meta name="description" content="View the weekly performance schedule and special shows at Eorzea's Embrace. Don't miss our talented entertainers." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Stage & Spectacle</h1>
          <p className={styles.subtitle}>The heart of our nightlife. Discover our resident performers and special guest acts.</p>
        </header>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default PerformancesPage;