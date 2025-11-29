import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  PowerIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { Dashboard, Profile, Tables, Notifications } from "@/pages/admin";
import { Login, LogoutPage } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    title: "Public Pages",
    layout: "public",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/",
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Infografis",
        path: "/infografis",
      },
  
    ],
  },
  {
    title: "Admin Pages",
    layout: "admin",
    pages: [
      // ... admin routes (komen dulu kalau belum dipakai)
    ],
  },
  {
    title: "Auth Pages",
    layout: "auth",
    pages: [
      // ... auth routes (komen dulu kalau belum dipakai)
    ],
  },
];

export default routes;
