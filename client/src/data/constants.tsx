import { GrDocumentStore } from "react-icons/gr";
import { BsCardChecklist, BsClipboardData, BsQuestionSquare } from "react-icons/bs";
import { TbLockAccess, TbPigMoney, TbUsers } from "react-icons/tb";
import { MenuItemProps, NotificationTitleMap } from "./types";
import { LiaClipboardListSolid } from "react-icons/lia";
import { GiPowderBag } from "react-icons/gi";
import { PiShieldWarningBold } from "react-icons/pi";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdOutlineAccountBox } from "react-icons/md";

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
  {
    title: "Запросы",
    icon: <BsQuestionSquare />   ,
    path: "requests"
  }
]
export const userMenuLinks: MenuItemProps[] = [
  {
    title: "Рабочий стол",
    icon: <BsClipboardData />,
    path: "dashboard",
  },
  {
    title: "Профиль",
    icon: <MdOutlineAccountBox /> ,
    path: "account"
  },
    {
    title: "Продукты",
    icon: <GrDocumentStore />,
    path: "products"
  },
  {
    title: "Заявки",
    icon: <BsCardChecklist /> ,
    path: "orders"
  },


]
export const measures = [
  'кг',
  'шт',
  'л'
]

export const notificationTitles: NotificationTitleMap = {
  customerRequest: {
    title: "Запрос доступа",
    icon: <TbLockAccess />
  },
  newOrder: {
    title: "Новый заказ",
    icon: <LiaClipboardListSolid />
  },
  newProduct:{ 
    title: "Новый продукт",
    icon: <GiPowderBag />
  },
  
  priceChange: {
    title: "Изменение цены",
    icon:<TbPigMoney />
  },
  statusChange: {
    title:"Изменение статуса",
    icon: <PiShieldWarningBold />
  },
  orderStatusChange: {
    title:"Изменение статуса заказа",
    icon: <VscGitPullRequestGoToChanges />
  }
};