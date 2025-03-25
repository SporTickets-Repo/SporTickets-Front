import { EventType } from "@/interface/event";
import { IconType } from "react-icons";
import { BiTennisBall } from "react-icons/bi";
import { FaFutbol, FaVolleyballBall } from "react-icons/fa";
import { GiBeachBall } from "react-icons/gi";
import { MdSportsHandball, MdSportsSoccer } from "react-icons/md";

export const getEventIcon = (type: EventType): IconType => {
  const icons: Record<EventType, IconType> = {
    [EventType.FUTVOLEI]: FaVolleyballBall,
    [EventType.BEACH_TENIS]: BiTennisBall,
    [EventType.ALTINHA]: GiBeachBall,
    [EventType.FUTEBOL]: FaFutbol,
    [EventType.FUTEBOL_ARREIA]: MdSportsSoccer,
    [EventType.FUTSAL]: MdSportsSoccer,
    [EventType.VOLEI]: MdSportsHandball,
    [EventType.GENERAL]: FaFutbol,
  };

  return icons[type] || FaFutbol;
};
