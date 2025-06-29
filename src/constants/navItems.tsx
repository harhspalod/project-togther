import { MdOutlineDashboard } from "react-icons/md";
import { LuUsers2 } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCoupon2Line } from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import { TbTag } from "react-icons/tb";
import { TbBriefcase } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdCampaign } from "react-icons/md";
import { MdNotifications } from "react-icons/md";

export const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <MdOutlineDashboard />,
  },
  {
    title: "Products",
    url: "/products",
    icon: <MdOutlineShoppingCart />,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: <TbTag />,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: <LuUsers2 />,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: <TbTruckDelivery />,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: <MdCampaign />,
  },
  {
    title: "Triggered Discounts",
    url: "/triggered-discounts",
    icon: <MdNotifications />,
  },
  {
    title: "Coupons",
    url: "/coupons",
    icon: <RiCoupon2Line />,
  },
  {
    title: "Staff",
    url: "/staff",
    icon: <TbBriefcase />,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: <TbSettings />,
  },
];