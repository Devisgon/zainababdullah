import { Header, Footer } from "@/components/layout/site-chrome";
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container not-found">
        <span className="eyebrow">404 / A SMALL DETOUR</span>
        <h1>
          Let’s find a<br />
          <span className="serif">better direction.</span>
        </h1>
        <p>That page isn’t here. Your next step still can be.</p>
        <a className="button" href="/">
          Back to the good stuff ↗
        </a>
      </main>
      <Footer />
    </>
  );
}
