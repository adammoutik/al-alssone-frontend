import React from 'react';
import { Link, useLocation } from 'react-router-dom';


interface MenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  submenu?: MenuItem[];
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
    },
    {
      title: 'Students',
      path: '/students',
    },
    {
      title: 'Families',
      path: '/families',
    },
    {
      title: 'Payments',
      path: '/payments',
    },
    {
      title: 'Fees',
      path: '/fees',
    },
    {
      title: 'Reports',
      path: '/reports',
    },
    {
      title: 'Settings',
      path: '/settings',
    },
  ];

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">School Management</h1>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
          <DotsHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-4">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                location.pathname === item.path ? 'bg-gray-100' : ''
              }`}
              onClick={() => item.submenu && toggleSubmenu(item.title)}
            >
              {item.icon}
              <span className="mx-4">{item.title}</span>
              {item.submenu && (
                <ChevronDownIcon
                  className={`h-5 w-5 ml-auto transform ${
                    openSubmenu === item.title ? 'rotate-180' : ''
                  }`}
                />
              )}
            </Link>
            {item.submenu && openSubmenu === item.title && (
              <div className="pl-12">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block py-2 text-gray-600 hover:text-gray-900 ${
                      location.pathname === subItem.path ? 'text-gray-900' : ''
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
