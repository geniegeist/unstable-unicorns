import type { CardID } from "./card";
import type { PlayerID } from "./player";

export interface NeighDiscussion {
    protagonist: PlayerID; 
    cardID: CardID;
    rounds: NeighRound[];
} 

type NeighRound = {
    state: "open" | "neigh" | "no_neigh";
    playerState: {[key: string]: {
        vote: "undecided" | "neigh" | "no_neigh";
    }};
}