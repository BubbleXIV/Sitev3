import React, { useState } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { StaffMember, AltProfile } from "../endpoints/staff_GET.schema";
import { Avatar, AvatarImage, AvatarFallback } from "./Avatar";
import { Button } from "./Button";
import styles from "./StaffCard.module.css";

type Profile = Omit<StaffMember, "alts"> | AltProfile;

export const StaffCard: React.FC<{ staffMember: StaffMember }> = ({ staffMember }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const profiles: Profile[] = [
    {
      id: staffMember.id,
      name: staffMember.name,
      role: staffMember.role,
      bio: staffMember.bio,
      profilePictureUrl: staffMember.profilePictureUrl,
    },
    ...staffMember.alts,
  ];

  const currentProfile = profiles[currentProfileIndex];
  const hasAlts = profiles.length > 1;

  const handlePrev = () => {
    setCurrentProfileIndex((prev) => (prev === 0 ? profiles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentProfileIndex((prev) => (prev === profiles.length - 1 ? 0 : prev + 1));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Avatar className={styles.avatar}>
          <AvatarImage src={currentProfile.profilePictureUrl ?? undefined} alt={currentProfile.name} />
          <AvatarFallback>{getInitials(currentProfile.name)}</AvatarFallback>
        </Avatar>
        {hasAlts && (
          <div className={styles.altIcon}>
            <Users size={16} />
          </div>
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.name}>{currentProfile.name}</h3>
        <p className={styles.role}>{currentProfile.role}</p>
        <p className={styles.bio}>{currentProfile.bio || "No bio available."}</p>
      </div>
      {hasAlts && (
        <div className={styles.cardFooter}>
          <Button variant="ghost" size="icon-sm" onClick={handlePrev} aria-label="Previous Profile">
            <ChevronLeft size={16} />
          </Button>
          <span className={styles.altCounter}>
            {currentProfileIndex + 1} / {profiles.length}
          </span>
          <Button variant="ghost" size="icon-sm" onClick={handleNext} aria-label="Next Profile">
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};