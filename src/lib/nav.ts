import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  Tags,
  Warehouse,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produk", icon: Package },
  { href: "/movements", label: "Stok Masuk & Keluar", icon: ArrowLeftRight },
  { href: "/categories", label: "Kategori", icon: Tags },
  { href: "/locations", label: "Lokasi", icon: Warehouse },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];
