import Icon, { IconName } from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { learnTopics, learnTopicOrder } from "@/lib/site";

const ordered = learnTopicOrder.map(id => learnTopics.find(t => t.id === id)!);

/** The six learning topics as cards in a tray; each links to its section on /learn. */
export default function LearnTopicCards({ location }: { location: string }) {
  return (
    <ul className="tray stagger grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map(({ id, icon, title, desc }) => (
        <li key={id}>
          <TrackedLink
            href={`/learn#${id}`}
            event="learn_resource_click"
            params={{ topic: id, location }}
            className="tray-card group flex h-full min-h-[240px] flex-col transition-shadow duration-200
                       hover:shadow-[0_8px_30px_rgba(19,19,19,0.08)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-ink
                             transition-transform duration-200 group-hover:-rotate-6">
              <Icon name={icon as IconName} size={20} />
            </span>
            <h3 className="mt-10 text-[1.375rem] font-medium leading-snug tracking-[-0.04em] text-ink">{title}</h3>
            <p className="mt-2 text-base leading-relaxed text-muted">{desc}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-xs uppercase tracking-[0.1em] text-ink">
              Explore topic
              <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-surface transition-colors duration-200 group-hover:bg-accent">
                <Icon name="arrow" size={13} />
              </span>
            </span>
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}
