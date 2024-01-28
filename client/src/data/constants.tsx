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

export const measures = [
  'кг',
  'шт',
  'л'
]

export const notificationTitles = {
  customerRequest: "Запрос доступа",
  newOrder: "Новый заказ",
  newProduct: "Новый продукт",
  priceChange: "Изменение цены",
  statusChange: "Изменение статуса",
  orderStatusChange: "Изменение статуса заказа"
};