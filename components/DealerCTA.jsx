import Reveal from "./Reveal";

export default function DealerCTA() {
  return (
    <Reveal id="dealer" className="py-section-padding px-margin-mobile">
      <div className="max-w-container-max mx-auto bg-primary py-24 px-gutter flex flex-col items-center text-center">
        <span className="font-label-caps text-label-caps text-on-primary mb-6">
          RETAIL NETWORK
        </span>
        <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-primary mb-10">
          Available at elite retailers.
        </h2>
        <button className="bg-on-primary text-primary px-10 py-5 font-button text-button rounded-none hover:bg-surface-container hover:text-white transition-all uppercase">
          FIND A LOCAL DEALER
        </button>
      </div>
    </Reveal>
  );
}
