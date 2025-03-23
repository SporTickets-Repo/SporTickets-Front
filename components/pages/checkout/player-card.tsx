import { Player } from "@/interface/tickets";
import { FaRegCircle } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  completed?: boolean;
}

export function PlayerCard({ player, onClick, completed }: PlayerCardProps) {
  return (
    <div
      className="w-full flex flex-row items-center justify-between p-4 rounded-lg cursor-pointer  bg-zinc-50 hover:bg-zinc-100 transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-row items-center space-x-4">
        <img
          src={player.photoUrl || "/assets/icons/default-profile.png"}
          alt={player.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="text-lg font-bold">{player.name}</h3>
          <p className="text-sm text-muted-foreground">{player.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {onClick && (
          <>
            {completed ? (
              <IoIosCheckmarkCircle className="h-6 w-6 text-sporticket-green-700" />
            ) : (
              <FaRegCircle className="h-6 w-6 text-zinc-500" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
