import { markets } from "../content";
export function MarketLinks() {
  return (
    <section className="container detail-section">
      <span className="eyebrow">REMOTE ADVERTISING SUPPORT</span>
      <h2>Paid ads for your market.</h2>
      <p>
        Meta, TikTok and Google Ads planning for businesses in the USA, Saudi
        Arabia, Kuwait and Qatar. Agree the audience, language approvals, media
        budget and sales handoff before launch.
      </p>
      <div className="related-links">
        {markets.map((m) => (
          <a key={m.slug} href={`/markets/${m.slug}`}>
            {m.label} →
          </a>
        ))}
      </div>
    </section>
  );
}
