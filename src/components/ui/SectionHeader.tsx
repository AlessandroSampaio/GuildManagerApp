import { JSX } from "solid-js";

type SectionHeaderProps = {
  label: string;
  title: string;
  action?: JSX.Element;
};

const SectionHeader = (props: SectionHeaderProps) => (
  <div class="flex items-start justify-between mb-6">
    <div>
      <p class="text-xs mb-1">{props.label}</p>
      <h2 class="font-display text-xl text-stone-100 tracking-wide">
        {props.title}
      </h2>
    </div>
    {props.action && <div class="mt-1">{props.action}</div>}
  </div>
);

export default SectionHeader;
