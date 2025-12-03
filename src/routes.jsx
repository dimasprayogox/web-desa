import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  PowerIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";


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
  
  
];

export default routes;
