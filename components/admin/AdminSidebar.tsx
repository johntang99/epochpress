import { getSession } from '@/lib/admin/auth';
import { isSuperAdmin } from '@/lib/admin/permissions';
import { AdminSidebarNav } from './AdminSidebarNav';
import type { IconKey } from './AdminSidebarNav';

const navigation: Array<{
  name: string;
  href: string;
  iconKey: IconKey;
  group: 'site' | 'system';
  preserveContext?: boolean;
}> = [
  { name: 'Site Settings', href: '/admin/site-settings', iconKey: 'slidersHorizontal', group: 'site' },
  { name: 'Content', href: '/admin/content', iconKey: 'fileText', group: 'site' },
  { name: 'Blog Posts', href: '/admin/blog-posts', iconKey: 'bookOpen', group: 'site' },
  { name: 'Portfolio', href: '/admin/portfolio', iconKey: 'layoutGrid', group: 'site' },
  { name: 'Case Studies', href: '/admin/case-studies', iconKey: 'fileText', group: 'site' },
  { name: 'Bookings', href: '/admin/bookings', iconKey: 'calendar', group: 'site' },
  { name: 'Quotes', href: '/admin/quotes', iconKey: 'fileText', group: 'site' },
  { name: 'Booking Settings', href: '/admin/booking-settings', iconKey: 'slidersHorizontal', group: 'site' },
  { name: 'Media', href: '/admin/media', iconKey: 'image', group: 'site' },
  { name: 'Keyword Map', href: '/admin/keyword-map', iconKey: 'search', group: 'site' },
  { name: 'SEO Plan', href: '/admin/seo-plan', iconKey: 'barChart', group: 'site' },
  { name: 'SEO Status', href: '/admin/seo-status', iconKey: 'fileText', group: 'site' },

  { name: 'Sites', href: '/admin/sites', iconKey: 'building2', group: 'system', preserveContext: false },
  { name: 'Components', href: '/admin/components', iconKey: 'layoutGrid', group: 'system', preserveContext: false },
  { name: 'Variants', href: '/admin/variants', iconKey: 'layers', group: 'system', preserveContext: false },
  { name: 'Users', href: '/admin/users', iconKey: 'users', group: 'system', preserveContext: false },
  { name: 'Settings', href: '/admin/settings', iconKey: 'settings', group: 'system', preserveContext: false },
];

export async function AdminSidebar() {
  const session = await getSession();
  const isAdmin = session?.user ? isSuperAdmin(session.user) : false;
  const items = isAdmin ? navigation : navigation.filter((item) => item.name !== 'Users');
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-lg font-semibold">Admin Dashboard</span>
      </div>
      <AdminSidebarNav items={items} />
    </aside>
  );
}
