// categoryNames - maps category slugs stored in the DB (e.g. "fitness-gym")
// to nice display names for the frontend (e.g. "Fitness & Gym").
// Unknown slugs fall back to simple Title Case.

const CATEGORY_NAMES = {
  cricket: "Cricket",
  football: "Football",
  badminton: "Badminton",
  "fitness-gym": "Fitness & Gym",
  "running-footwear": "Running & Footwear",
  sportswear: "Sportswear",
};

// "some-slug" -> "Some Slug"
const toTitleCase = (slug) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const categoryName = (slug) => CATEGORY_NAMES[slug] || toTitleCase(slug);

export default categoryName;
