import Icon from "@/components/Icon";

const tones = {
  ink:  "bg-ink text-on-ink",   // on lime / light pills
  lime: "bg-accent text-ink",   // on ink pills
};

/** Circular arrow badge that ends a pill button (rotates on hover via .btn). */
export default function BtnArrow({ tone = "ink" }: { tone?: keyof typeof tones }) {
  return (
    <span aria-hidden="true" className={`btn-arrow ${tones[tone]}`}>
      <Icon name="external" size={14} />
    </span>
  );
}
