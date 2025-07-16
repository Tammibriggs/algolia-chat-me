import Link from 'next/link';

interface DocCardProps {
  title: string;
  description: string;
  href: string;
}

export default function DocCard({ title, description, href }: DocCardProps) {
  return (
    <Link
      href={href}
      className="block p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{description}</p>
    </Link>
  );
}