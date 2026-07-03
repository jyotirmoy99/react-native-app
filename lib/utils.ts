export const formatPrice = (value: number): string => {
  if (value >= 10000000) {
    const cr = (value / 10000000).toFixed(1).replace(/\.0$/, "");
    return `₹${cr}Cr`;
  }

  if (value >= 100000) {
    const l = (value / 100000).toFixed(1).replace(/\.0$/, "");
    return `₹${l}L`;
  }

  return `₹${value.toLocaleString()}`;
};

/**
 * Escapes special characters in search strings for safe PostgREST ILIKE queries.
 * Escapes % and _ which are SQL LIKE wildcards to prevent injection attacks.
 */
export const escapePostgRESTSearch = (value: string): string => {
  if (!value) return value;
  // Escape backslashes first, then %, _ which are SQL LIKE wildcards
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
};

/**
 * Escapes a search term for safe interpolation inside a PostgREST .or() clause.
 * The value is wrapped in quotes and escaped so reserved characters such as commas
 * and parentheses cannot alter the filter syntax.
 */
export const escapePostgRESTOrSearch = (value: string): string => {
  if (!value) return value;

  const escapedValue = escapePostgRESTSearch(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/,/g, "\\,")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

  return `"%${escapedValue}%"`;
};

export type Greeting =
  "Good Morning" | "Good Afternoon" | "Good Evening" | "Good Night";

export const getGreeting = (date: Date = new Date()): Greeting => {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  }

  if (hour >= 17 && hour < 21) {
    return "Good Evening";
  }

  return "Good Night";
};
