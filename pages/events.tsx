import React from "react";
import { Helmet } from "react-helmet";
import { useEvents } from "../helpers/useEvents";
import { Selectable } from "kysely";
import { Events } from "../helpers/schema";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle, Calendar, Clock, Users, Tag, Ticket } from "lucide-react";
import { format } from "date-fns";
import styles from "./events.module.css";

const EventCard: React.FC<{ event: Selectable<Events> }> = ({ event }) => {
  const eventDate = new Date(event.eventDate);
  return (
    <div className={styles.eventCard}>
      {event.imageUrl && <img src={event.imageUrl} alt={event.title} className={styles.eventImage} />}
      <div className={styles.eventContent}>
        <div className={styles.eventDate}>
          <span className={styles.eventMonth}>{format(eventDate, "MMM")}</span>
          <span className={styles.eventDay}>{format(eventDate, "dd")}</span>
        </div>
        <div className={styles.eventDetails}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          <div className={styles.eventMeta}>
            <span><Clock size={14} /> {event.startTime} - {event.endTime}</span>
            {event.eventType && <span><Tag size={14} /> {event.eventType}</span>}
            {event.coverCharge != null && <span><Ticket size={14} /> {event.coverCharge > 0 ? `${event.coverCharge.toLocaleString()} Gil` : 'Free Entry'}</span>}
          </div>
          {event.description && <p className={styles.eventDescription}>{event.description}</p>}
        </div>
      </div>
    </div>
  );
};

const EventsPageSkeleton = () => (
  <div className={styles.eventsGrid}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className={styles.skeletonCard}>
        <Skeleton style={{ width: '100%', height: '200px' }} />
        <div className={styles.eventContent}>
          <div className={styles.eventDate}>
            <Skeleton style={{ width: '40px', height: '1.2rem' }} />
            <Skeleton style={{ width: '30px', height: '1.8rem', marginTop: 'var(--spacing-1)' }} />
          </div>
          <div className={styles.eventDetails}>
            <Skeleton style={{ height: '1.5rem', width: '80%', marginBottom: 'var(--spacing-4)' }} />
            <Skeleton style={{ height: '1rem', width: '90%', marginBottom: 'var(--spacing-2)' }} />
            <Skeleton style={{ height: '4rem', width: '100%', marginTop: 'var(--spacing-4)' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EventsPage = () => {
  const { data: events, isFetching, error } = useEvents();

  const renderContent = () => {
    if (isFetching) {
      return <EventsPageSkeleton />;
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <AlertTriangle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Failed to Load Events</h2>
          <p className={styles.errorMessage}>There was an issue retrieving the event calendar. Please try again later.</p>
        </div>
      );
    }

    if (!events || events.length === 0) {
      return (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Planning the Next Big Night</h2>
          <p className={styles.emptyMessage}>Our calendar is currently empty, but new and exciting events are always on the horizon. Stay tuned!</p>
        </div>
      );
    }

    return (
      <div className={styles.eventsGrid}>
        {events.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Events Calendar - Eorzea's Embrace</title>
        <meta name="description" content="Discover upcoming special events, themed nights, and parties at Eorzea's Embrace. View our full event calendar." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Event Calendar</h1>
          <p className={styles.subtitle}>Join us for special occasions, themed parties, and unforgettable nights.</p>
        </header>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default EventsPage;