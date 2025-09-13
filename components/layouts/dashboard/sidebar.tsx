"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  ImageIcon, 
  UserPlus,
  MessageSquare,
  BarChart3,
  Settings,
  X,
  LogOut,
  Crown,
  ChevronDown,
  BookOpen,
  Flame,
  Gem,
  CircleDot,
  Brain,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const serviceCategories = [
  {
    name: 'Books',
    href: '/dashboard/services/books',
    icon: BookOpen,
  },
  {
    name: 'Pujas',
    href: '/dashboard/services/pujas',
    icon: Flame,
  },
  {
    name: 'Ratna',
    href: '/dashboard/services/ratna',
    icon: Gem,
  },
  {
    name: 'Rudraksha',
    href: '/dashboard/services/rudraksha',
    icon: CircleDot,
  },
  {
    name: 'Sadhana',
    href: '/dashboard/services/sadhana',
    icon: Brain,
  },
  {
    name: 'Yantra',
    href: '/dashboard/services/yantra',
    icon: Star,
  },
];

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  // {
  //   name: 'Agami Karyakram',
  //   href: '/dashboard/agami-karyakram',
  //   icon: Calendar,
  // },
  // {
  //   name: 'Chunavi Railayan',
  //   href: '/dashboard/chunavi-railayan',
  //   icon: BarChart3,
  // },
  {
    name: 'Gallery',
    href: '/dashboard/gallery',
    icon: ImageIcon,
  },
  // {
  //   name: 'Janta Darbar',
  //   href: '/dashboard/janta-darbar',
  //   icon: MessageSquare,
  // },
  {
    name: ' Contact Leads',
    href: '/dashboard/leads',
    icon: UserPlus,
  },
  {
    name: 'Kundli Leads',
    href: '/dashboard/kundli-lead',
    icon: Crown,
  },
  {
    name: 'Blog',
    href: '/dashboard/blog',
    icon: FileText,
  },
  // {
  //   name: 'Sampark Adhikari',
  //   href: '/dashboard/sampark-adhikari',
  //   icon: Users,
  // },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const isServiceActive = serviceCategories.some(category => pathname === category.href);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-orange-500"></div>
                <div className="text-red-600 font-bold text-xs">☀</div>
              </div>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">
              Lok
            </span>
          </div>
          
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-orange-100 text-orange-900 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          {/* Services Dropdown */}
          <Collapsible open={isServicesOpen} onOpenChange={setIsServicesOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isServiceActive
                    ? "bg-orange-100 text-orange-900 border border-orange-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <div className="flex items-center">
                  <Settings className="mr-3 h-5 w-5" />
                  Services
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isServicesOpen ? "rotate-180" : ""
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 ml-4 mt-2">
              {serviceCategories.map((category) => {
                const isActive = pathname === category.href;
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-orange-100 text-orange-900 border border-orange-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <category.icon className="mr-3 h-4 w-4" />
                    {category.name}
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/logout"
            className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Link>
        </div>
      </div>
    </>
  );
}
