/**
 * Registered entity details.
 *
 * India's Consumer Protection (E-Commerce) Rules 2020 require a seller's legal
 * name, registered address, and a grievance contact to be displayed — not
 * buried on an About page. The Legal Metrology (Packaged Commodities) Rules add
 * country of origin and consumer-care details to product listings.
 *
 * Kept in one place so the footer, the policy pages and the PDP disclosure
 * block cannot drift apart.
 *
 * These are the REGISTERED details as they appear on the GST certificate.
 * Change them here and nowhere else — the one-line form below is derived, and
 * the About page's Organization schema reads from this same object.
 */
export const COMPANY = {
  legalName: "Zewa Ecosystems Pvt. Ltd",
  brand: "Zewa Feeds",
  address: {
    line1: "17/31A, TR Nair Rd, Elamthuruthy-Kalady",
    line2: "Kuttanellur PO",
    city: "Thrissur",
    state: "Kerala",
    /** GST state code for Kerala. Printed alongside the state on invoices. */
    stateCode: "32",
    postalCode: "680014",
    country: "India",
  },
  /** As issued on the GST registration certificate. */
  gstin: "32AABCZ8255E1ZC",
  countryOfOrigin: "India",
  email: "info@zewafeeds.com",
  ordersEmail: "orders@zewafeeds.com",
  phone: "+91 94966 42259",
  phoneHref: "tel:+919496642259",
  /**
   * Grievance Officer — mandatory under Rule 4(5) of the E-Commerce Rules.
   * The Rules require a name, designation and contact, with acknowledgement
   * within 48 hours and resolution within one month.
   */
  grievanceOfficer: {
    name: "Grievance Officer",
    email: "grievance@zewafeeds.com",
    responseWindow: "48 hours",
    resolutionWindow: "30 days",
  },
};

/** One-line address, for footers and compact disclosure blocks. */
export const COMPANY_ADDRESS_LINE = [
  COMPANY.address.line1,
  COMPANY.address.line2,
  COMPANY.address.city,
  COMPANY.address.state,
  COMPANY.address.postalCode,
  COMPANY.address.country,
].join(", ");
