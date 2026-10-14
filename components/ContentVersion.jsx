/**
 * Which CMS publication this page was rendered from.
 *
 * The publish worker reads this back after asking for regeneration: a page
 * serving v14 is proof that v14 reached customers, which a 200 from the
 * revalidation endpoint is not. React hoists the tag into <head>.
 */
export default function ContentVersion({ version }) {
  if (!version) return null;
  return <meta name="zewa-content-version" content={String(version)} />;
}
