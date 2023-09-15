import { StickyNote } from "./StickyNote";

export function StickyWall() {
  return (
    <div className="grid h-full place-content-start grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-6 rounded-lg border border-background-tertiary p-5">
      <StickyNote background="#fdf2b3" title="Social Media" content="- Plan social content - Build content calendar - Plan promotion and distribution" />
      <StickyNote background="#d1eaed" title="Content Strategy" content="Would need time to get insights (goals, personals, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling." />
      <StickyNote background="#ffdada" title="Email A/B Tests" content="- Subject lines - Sender - CTA - Sending times" />
      <StickyNote background="#ffd4a9" title="Banner Ads" content="Notes from the workshop: - Sizing matters - Choose distinctive imagery - The landing page must match the display ad" />
      <StickyNote background="#ebebeb" adder={true} />
    </div>
  );
}
