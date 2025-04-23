import { Player } from "@/interface/tickets";
import Image from "next/image";
import { FaRegCircle } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  completed?: boolean;
}

export function PlayerCard({
  player,
  onClick,
  completed = true,
}: PlayerCardProps) {
  console.log(player);
  return (
    <div
      className={`w-full flex flex-row items-center justify-between p-4 rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 shadow-sm transition-colors`}
      onClick={onClick}
    >
      <div className="flex flex-row items-center space-x-2 md:space-x-4">
        <Image
          src={player.profileImageUrl || "/assets/icons/default-profile.png"}
          alt={player.name}
          width={12}
          height={12}
          className="md:w-12 md:h-12 h-10 w-10 rounded-full object-cover "
          unoptimized
        />
        <div className="flex flex-col overflow-hidden whitespace-normal break-words">
          <h3 className="text-lg font-bold truncate">{player.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {player.email}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        {onClick && (
          <>
            {completed ? (
              <IoIosCheckmarkCircle className="h-6 w-6 text-sporticket-green-700" />
            ) : (
              <FaRegCircle className="h-6 w-6 text-yellow-600" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
