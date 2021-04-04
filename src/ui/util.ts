import type { CardType } from "../game/card";

export function _typeToColor(type: CardType): string {
    if (type === "baby") {
        return "#6C6D70";
    }

    if (type === "basic") {
        return "#6C6D70"
    }

    if (type === "downgrade") {
        return "#FCB820";
    }

    if (type === "upgrade") {
        return "#F57F22";
    }

    if (type === "narwhal") {
        return "#6C6D70";
    }

    if (type === "neigh" || type === "super_neigh") {
        return "#E94343";
    }

    if (type === "magic") {
        return "#88C652";
    }

    if (type === "unicorn") {
        return "#6C6D70";
    }

    return "#000000";
}