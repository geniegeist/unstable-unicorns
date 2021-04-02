import type { CardType } from "../game/card";

export function _typeToColor(type: CardType): string {
    if (type === "baby") {
        return "#513D99";
    }

    if (type === "basic") {
        return "#BC6EAA"
    }

    if (type === "downgrade") {
        return "#BD417B";
    }

    if (type === "upgrade") {
        return "#91BD41";
    }

    if (type === "narwhal") {
        return "#32C5FF";
    }

    if (type === "neigh" || type === "super_neigh") {
        return "#E94343";
    }

    if (type === "magic") {
        return "#33CB7B";
    }

    if (type === "unicorn") {
        return "#32C5FF";
    }

    return "#000000";
}