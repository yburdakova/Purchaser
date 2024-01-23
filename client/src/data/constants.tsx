import { GrDocumentStore } from "react-icons/gr";
import { BsCardChecklist, BsClipboardData } from "react-icons/bs";
import { TbUsers } from "react-icons/tb";
import { MenuItemProps } from "./types";

export const menuLinks: MenuItemProps[] = [
  {
    title: "Рабочий стол",
    icon: <BsClipboardData />,
    path: "dashboard",
  },
  {
    title: "Заявки",
    icon: <BsCardChecklist /> ,
    path: "orders"
  },
  {
    title: "Клиенты",
    icon: <TbUsers />,
    path: "customers"
  },
  {
    title: "Продукты",
    icon: <GrDocumentStore />,
    path: "products"
  },
]