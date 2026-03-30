import type {TrainerAvailabilityDTO} from "../../services/enhancedServiceRegistrationService.ts";
import type {TrainerSpecialtyItem} from "../../services/newBookingService.ts";


export const mapTrainerAvailabilityToItem = (
    t: TrainerAvailabilityDTO
): TrainerSpecialtyItem => {
    return {
        id: t.trainer.id,
        fullName: t.trainer.fullName,
        email: t.trainer.email,
        avatar: t.trainer.avatar ?? undefined,
        bio: t.trainer.bio ?? undefined,
        totalExperienceYears: t.totalExperience ?? 0,
        specialties: (t.specialties ?? []).map((s) => ({
            id: s.id,
            specialty: {
                id: s.specialty.id,
                name: s.specialty.name,
                displayName: s.specialty.displayName,
            },
            experienceYears: s.experienceYears,
            level: s.level,
        })),
        isActive: t.isAvailable,
    };
};