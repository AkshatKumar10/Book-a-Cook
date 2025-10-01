export const getTime = (dateString) => {
  const created = new Date(dateString);
  const now = new Date();
  const diffMs = now - created;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Joined today';
  if (diffDays === 1) return 'Joined 1 day ago';
  if (diffDays < 30) return `Joined ${diffDays} days ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return 'Joined 1 month ago';
  if (diffMonths < 12) return `Joined ${diffMonths} months ago`;

  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1
    ? 'Joined 1 year ago'
    : `Joined ${diffYears} years ago`;
};
