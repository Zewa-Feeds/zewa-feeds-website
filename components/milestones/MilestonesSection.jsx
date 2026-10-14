import MilestoneExperienceHorizontal from "./MilestoneExperienceHorizontal";

/** Milestone cards come from the published CMS content (Website → About). */
export default function MilestonesSection({ milestones = [], heading }) {
  if (!milestones.length) return null;
  return (
    <section className="relative w-full bg-[#06080f] text-white border-y border-white/5 overflow-hidden">
      <MilestoneExperienceHorizontal milestones={milestones} heading={heading} />
    </section>
  );
}
