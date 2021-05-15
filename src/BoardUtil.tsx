import type { Card, CardID } from "./game/card";
import { findBackKickTargets, findDestroyTargets, findMoveTargets, findReturnToHandTargets, findSacrificeTargets, findStealTargets, findUnicornSwap1Targets } from "./game/do";
import type { Ctx, Instruction, UnstableUnicornsGame } from "./game/game";
import { PlayerID } from "./game/player";

export type HoverTarget = {
    type: "stable_card",
    info: { cardID: CardID }
};

export function findUITargets(G: UnstableUnicornsGame, ctx: Ctx, instruction: Instruction): HoverTarget[] {
    let targets: HoverTarget[] = [];

    if (instruction.do.key === "destroy") { 
        findDestroyTargets(G, ctx, instruction.protagonist, instruction.do.info, instruction.ui.info?.source).forEach(({playerID, cardID}) => {
            targets.push({ type: "stable_card", info: { cardID } })
        });
    } else if (instruction.do.key === "steal") {
        findStealTargets(G, ctx, instruction.protagonist, instruction.do.info).forEach(({playerID, cardID}) => {
            targets.push({ type: "stable_card", info: {cardID} });
        });
    } else if (instruction.do.key === "sacrifice") {
        findSacrificeTargets(G, ctx, instruction.protagonist, instruction.do.info).forEach(s => {
            targets.push({ type: "stable_card", info: {cardID: s.cardID}});
        });
    } else if (instruction.do.key === "move") {
        findMoveTargets(G, ctx, instruction.protagonist, instruction.do.info).forEach(s => {
            targets.push({ type: "stable_card", info: {cardID: s.cardID}});
        });
    } else if (instruction.do.key === "backKick") {
        findBackKickTargets(G, ctx, instruction.protagonist).forEach(s => {
            targets.push({ type: "stable_card", info: {cardID: s.cardID}});
        });
    } else if (instruction.do.key === "unicornSwap1") {
        findUnicornSwap1Targets(G, ctx, instruction.protagonist).forEach(s => {
            targets.push({ type: "stable_card", info: {cardID: s.cardID}});
        })
    } else if (instruction.do.key === "returnToHand") {
        findReturnToHandTargets(G, ctx, instruction.protagonist, instruction.do.info).forEach(s => {
            targets.push({ type: "stable_card", info: {cardID: s.cardID}});
        })
    }

    return targets;
}

export function cardDescription(card: Card, language: "en" | "de"): string {
    return card.description[language];
}