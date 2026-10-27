import Icon, { IconName } from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { learnTopics, learnTopicOrder } from "@/lib/site";

const ordered = learnTopicOrder.map(id => learnTopics.find(t => t.id === id)!);

/** The six learning topics as cards; each links to its section on /learn. */
export default function LearnTopicCards({ location }: { location: string }) {
  return (
    <ul className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map(({ id, icon, title, desc }) => (
        <li key={id}>
          <TrackedLink
            href={`/learn#${id}`}
            event="learn_resource_click"
            params={{ topic: id, location }}
            className="card group flex h-full flex-col transition-[transform,border-color] duration-200
                       hover:-translate-y-1 hover:border-[#3A4047]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(57,245,106,0.10)] text-accent-light
                             transition-[transform,background-color] duration-200 group-hover:scale-110 group-hover:bg-[rgba(57,245,106,0.18)]">
              <Icon name={icon as IconName} size={20} />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
            <p className="mt-2 flex-1 text-base leading-relaxed text-muted">{desc}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-light">
              Explore topic <Icon name="arrow" size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}
