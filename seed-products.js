// This script seeds the products table with initial data
// Run this in Supabase SQL editor or as a migration

const products = [
  {
    name: "California Care License Bundle",
    product_slug: "california-care-license-bundle",
    description: "Complete guide and resources for obtaining a California childcare license",
    price: 97.0,
    type: "bundle",
    stripe_product_id: null, // Will be created by Stripe
    stripe_price_id: null, // Will be created by Stripe
    skool_group_id: "california-license-group",
    skool_course_id: "skool-course-california",
    ghl_tag: "paid-california-care-bundle",
    features: [
      "Step-by-step licensing guide",
      "Required forms and templates",
      "State-specific requirements",
      "Compliance checklists",
      "Video training modules",
      "Private community access"
    ],
    is_active: true
  },
  {
    name: "Texas Care License Bundle",
    product_slug: "texas-care-license-bundle",
    description: "Complete guide and resources for obtaining a Texas childcare license",
    price: 97.0,
    type: "bundle",
    stripe_product_id: null,
    stripe_price_id: null,
    skool_group_id: "texas-license-group",
    skool_course_id: "skool-course-texas",
    ghl_tag: "paid-texas-care-bundle",
    features: [
      "Step-by-step licensing guide",
      "Required forms and templates",
      "State-specific requirements",
      "Compliance checklists",
      "Video training modules",
      "Private community access"
    ],
    is_active: true
  },
  {
    name: "Video Training Course",
    product_slug: "video-training-course",
    description: "Comprehensive video training for childcare business setup and operations",
    price: 197.0,
    type: "course",
    stripe_product_id: null,
    stripe_price_id: null,
    skool_group_id: null,
    skool_course_id: "skool-course-video-training",
    ghl_tag: "paid-video-training-course",
    features: [
      "20+ training videos",
      "Business setup guide",
      "Operations manual",
      "Marketing strategies",
      "Financial planning",
      "Lifetime access"
    ],
    is_active: true
  }
];

// SQL to insert products
const sql = `
INSERT INTO products (name, product_slug, description, price, type, stripe_product_id, stripe_price_id, skool_group_id, skool_course_id, ghl_tag, features, is_active) VALUES
${products.map(product => `(
  '${product.name}',
  ${product.product_slug ? `'${product.product_slug}'` : 'NULL'},
  '${product.description}',
  ${product.price},
  '${product.type}',
  ${product.stripe_product_id ? `'${product.stripe_product_id}'` : 'NULL'},
  ${product.stripe_price_id ? `'${product.stripe_price_id}'` : 'NULL'},
  ${product.skool_group_id ? `'${product.skool_group_id}'` : 'NULL'},
  ${product.skool_course_id ? `'${product.skool_course_id}'` : 'NULL'},
  ${product.ghl_tag ? `'${product.ghl_tag}'` : 'NULL'},
  '${JSON.stringify(product.features)}',
  ${product.is_active}
)`).join(',\n')};
`;

console.log(sql);

// Export for use in scripts
export { products };