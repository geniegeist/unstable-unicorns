import { UnstableUnicornsGame, Ctx, _findOpenScenesWithProtagonist, _findInProgressScenesWithProtagonist, canDraw, Instruction, Scene } from "./game/game";
import type { PlayerID } from "./game/player";
import _ from 'underscore';
import { canBringToStableTargets, findAddFromDiscardPileToHand, findBackKickTargets, findBringToStableTargets, findDestroyTargets, findDiscardTargets, findMakeSomeoneDiscardTarget, findMoveTargets, findMoveTargets2, findPullRandomTargets, findReturnToHandTargets, findReviveTarget, findSacrificeTargets, findSearchTargets, findStealTargets, findSwapHandsTargets, findUnicornSwap1Targets, findUnicornSwap2Targets } from "./game/do";

export type BoardState = {
    type: BoardStateKey;
    info?: { [key: string]: any };
}

type BoardStateKey = "playCard" | "drawCard" | "steal__cardToCard" | "destroy__cardToCard" | "destroy__click_on_card_in_stable" | "sacrifice__cardToCard" | "sacrifice__clickOnCardInStable" | "draw__clickOnDrawPile" | "endTurn" | "neigh__playNeigh" | "neigh__wait" | "discard__popup__committed" | "discard__popup__ask" | "bring__popup__committed" | "bring__popup__ask" | "discard" | "swapHands__cardToPlayer" | "shakeUp" | "move__cardToCard" | "move2__cardToPlayer" | "unicornswap1" | "unicornswap2" | "reset" | "shuffleDiscardPileIntoDrawPile" | "wait_for_other_players" | "revive" | "reviveFromNursery" | "pullRandom__cardToPlayer" | "backKick__card_to_card" | "blatantThievery1" | "addFromDiscardPileToHand__single_action_popup" | "search__single_action_popup" | "returnToHand__cardToCard" | "makeSomeoneDiscard__cardToPlayer";

export function getBoardState(G: UnstableUnicornsGame, ctx: Ctx, playerID: PlayerID): BoardState[] {
    const openScenes = _findOpenScenesWithProtagonist(G, playerID);
    const inProgressScenes = _findInProgressScenesWithProtagonist(G, playerID);

    if (ctx.activePlayers![playerID] === "beginning") {
        if (ctx.currentPlayer === playerID) {
            // player must end a mandatory scene before it may draw
            if (inProgressScenes.length > 0) {
                return [...getExecutionDoState(G, ctx, playerID, inProgressScenes)];
            }

            if (openScenes.length > 0) {
                if (G.mustEndTurnImmediately) {
                    // is there any scene in progress?
                    if (G.players.filter(pl => pl.id !== playerID).map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(ar => ar.length > 0)) {
                        // if yes: cant end the turn
                        return [{ type: "wait_for_other_players" }];
                    } else {
                        // if no: may end the turn
                        return [{ type: "endTurn" }, ...getExecutionDoState(G, ctx, playerID, openScenes)];
                    }
                }

                // is there any scene in progress?
                if (G.players.filter(pl => pl.id !== playerID).map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(ar => ar.length > 0)) {
                    // if yes: cant end the turn
                    return [{ type: "wait_for_other_players" }];
                }

                return [{ type: "drawCard" }, ...getExecutionDoState(G, ctx, playerID, openScenes)].filter(s => s.type !== "drawCard" || canDraw(G, ctx)) as BoardState[];
            }

            // is there any scene in progress?
            if (G.players.filter(pl => pl.id !== playerID).map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(ar => ar.length > 0)) {
                // if yes: cant end the turn
                return [{ type: "wait_for_other_players" }];
            }

            return G.mustEndTurnImmediately ? [{ type: "endTurn" }] : [{ type: "drawCard" }].filter(s => s.type !== "drawCard" || canDraw(G, ctx)) as BoardState[];
        }

        if (inProgressScenes.length > 0) {
            return [...getExecutionDoState(G, ctx, playerID, inProgressScenes)];
        }

        if (openScenes.length > 0) {
            // is there any scene in progress?
            if (G.players.filter(pl => pl.id !== playerID).map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(ar => ar.length > 0)) {
                // if yes: cant end the turn
                return [{ type: "wait_for_other_players" }];
            }

            return [...getExecutionDoState(G, ctx, playerID, openScenes)];
        }
    }

    if (playerID === ctx.currentPlayer) {
        if (G.countPlayedCardsInActionPhase === 0 && G.neighDiscussion === undefined && ctx.activePlayers![playerID] === "action_phase") {
            // action phase and no card has been played or drawn
            // player may draw a card or play a card
            return [{ type: "drawCard" }, { type: "playCard" }].filter(s => s.type !== "drawCard" || canDraw(G, ctx)) as BoardState[];
        }
    }

    if (G.neighDiscussion) {
        const currentRound = _.last(G.neighDiscussion.rounds)!;
        if (currentRound.state === "open") {
            if (currentRound.playerState[playerID].vote === "undecided") {
                return [{ type: "neigh__playNeigh" }];
            } else {
                return [{ type: "neigh__wait" }];
            }
        }
    }

    if (ctx.activePlayers![playerID] === "action_phase") {
        // player must end a scene in progress before it may end the turn
        // player must start and end a mandatory scene before it may end the turn
        if (inProgressScenes.length > 0) {
            return [...getExecutionDoState(G, ctx, playerID, inProgressScenes)];
        }


        if (openScenes.length > 0) {
            if (ctx.currentPlayer === playerID) {
                // double dutch effect if there is no scene in progress
                if (G.playerEffects[playerID].find(s => s.effect.key === "double_dutch") && G.countPlayedCardsInActionPhase === 1) {

                    // is there any scene in progress?
                    if (G.players.filter(pl => pl.id !== playerID).map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(ar => ar.length > 0)) {
                        // if yes: wait
                        return [{ type: "wait_for_other_players" }];
                    }

                    return [...getExecutionDoState(G, ctx, playerID, openScenes), { type: "endTurn" }, { type: "playCard" }];
                }

                // is there any scene in progress?
                if (G.players.filter(pl => pl.id !== playerID).map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(ar => ar.length > 0)) {
                    // if yes: wait
                    return [{ type: "wait_for_other_players" }];
                }

                return [...getExecutionDoState(G, ctx, playerID, openScenes), { type: "endTurn" }];
            }

            // is there any scene in progress?
            if (G.players.filter(pl => pl.id !== playerID).map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(ar => ar.length > 0)) {
                // if yes: wait
                return [{ type: "wait_for_other_players" }];
            }

            return [...getExecutionDoState(G, ctx, playerID, openScenes)];
        }

        // there are no open scenes
        if (ctx.currentPlayer === playerID) {

            // other players may need to complete an action
            if (G.players.map(pl => _findInProgressScenesWithProtagonist(G, pl.id)).find(arr => arr.length > 0)) {
                // we found a player that has a in progress scene 
                // wait for them
                return [{ type: "wait_for_other_players" }];
            } else {
                if (G.playerEffects[playerID].find(s => s.effect.key === "double_dutch") && G.countPlayedCardsInActionPhase === 1) {
                    return [{ type: "endTurn" }, { type: "playCard" }];
                }
                return [{ type: "endTurn" }];
            }

        }
    }

    return [];
}

function getExecutionDoState(G: UnstableUnicornsGame, ctx: Ctx, playerID: PlayerID, openScenes: Array<[Instruction, Scene]>): BoardState[] {
    let states: BoardState[] = [];
    openScenes.forEach(([instruction, scene]) => {

        if (instruction.do.key === "draw") {
            if (instruction.ui.type === "click_on_drawPile") {
                states.push({
                    type: "draw__clickOnDrawPile",
                    info: { instructionID: instruction.id, count: instruction.do.info.count },
                });
            }
        }

        if (instruction.do.key === "steal") {
            if (instruction.ui.type === "card_to_card") {
                states.push({
                    type: "steal__cardToCard",
                    info: {
                        targets: findStealTargets(G, ctx, playerID, instruction.do.info),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "destroy") {
            if (instruction.ui.type === "card_to_card") {
                states.push({
                    type: "destroy__cardToCard",
                    info: {
                        targets: findDestroyTargets(G, ctx, playerID, instruction.do.info, instruction.ui.info?.source),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            } else if (instruction.ui.type === "click_on_card_in_stable") {
                states.push({
                    type: "destroy__click_on_card_in_stable", info: {
                        targets: findDestroyTargets(G, ctx, playerID, instruction.do.info, instruction.ui.info?.source),
                        instructionID: instruction.id
                    }
                })
            }
        }

        if (instruction.do.key === "sacrifice") {
            if (instruction.ui.type === "card_to_card") {
                states.push({
                    type: "sacrifice__cardToCard",
                    info: {
                        targets: findSacrificeTargets(G, ctx, playerID, instruction.do.info),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            } else if (instruction.ui.type === "click_on_card_in_stable") {
                states.push({
                    type: "sacrifice__clickOnCardInStable",
                    info: {
                        targets: findSacrificeTargets(G, ctx, playerID, instruction.do.info),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "returnToHand") {
            if (instruction.ui.type === "card_to_card") {
                states.push({
                    type: "returnToHand__cardToCard",
                    info: {
                        targets: findReturnToHandTargets(G, ctx, playerID, instruction.do.info),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "discard") {
            if (instruction.ui.type === "single_action_popup") {
                // if a single action popup is not mandatory, the user may decide to discard a card or not 
                // if a user decides to discard a card, this scene becomes mandatory
                // and the user must discard a card.
                // this is called comitting
                if (scene.mandatory === false) {
                    states.push({
                        type: "discard__popup__ask", info: {
                            targets: findDiscardTargets(G, ctx, playerID, instruction.do.info),
                            instructionID: instruction.id,
                            sourceCardID: instruction.ui.info?.source,
                            singleActionText: instruction.ui.info?.singleActionText
                        }
                    });
                } else {
                    states.push({
                        type: "discard__popup__committed", info: {
                            targets: findDiscardTargets(G, ctx, playerID, instruction.do.info),
                            instructionID: instruction.id,
                            sourceCardID: instruction.ui.info?.source,
                            singleActionText: instruction.ui.info?.singleActionText
                        }
                    });
                }
            }

            if (instruction.ui.type === "click_on_own_card_in_hand") {
                states.push({
                    type: "discard", info: {
                        targets: findDiscardTargets(G, ctx, playerID, instruction.do.info),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "bringToStable") {
            if (instruction.ui.type === "single_action_popup") {
                // if a single action popup is not mandatory, the user may decide to discard a card or not 
                // if a user decides to discard a card, this scene becomes mandatory
                // and the user must discard a card.
                // this is called comitting
                if (scene.mandatory === false) {
                    if (canBringToStableTargets(G, ctx, playerID, instruction.do.info)) {
                        states.push({
                            type: "bring__popup__ask", info: {
                                targets: findBringToStableTargets(G, ctx, playerID, instruction.do.info),
                                instructionID: instruction.id,
                                sourceCardID: instruction.ui.info?.source,
                                singleActionText: instruction.ui.info?.singleActionText
                            }
                        });
                    }
                } else {
                    if (canBringToStableTargets(G, ctx, playerID, instruction.do.info)) {
                        states.push({
                            type: "bring__popup__committed", info: {
                                targets: findBringToStableTargets(G, ctx, playerID, instruction.do.info),
                                instructionID: instruction.id,
                                sourceCardID: instruction.ui.info?.source,
                                singleActionText: instruction.ui.info?.singleActionText
                            }
                        });
                    }
                }
            }
        }

        if (instruction.do.key === "swapHands") {
            if (instruction.ui.type === "card_to_player") {
                states.push({
                    type: "swapHands__cardToPlayer",
                    info: {
                        targets: findSwapHandsTargets(G, ctx, playerID),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "shakeUp") {
            if (instruction.ui.type === "single_action_popup") {
                states.push({
                    type: "shakeUp",
                    info: {
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "shuffleDiscardPileIntoDrawPile") {
            if (instruction.ui.type === "single_action_popup") {
                states.push({
                    type: "shuffleDiscardPileIntoDrawPile",
                    info: {
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "reset") {
            if (instruction.ui.type === "single_action_popup") {
                states.push({
                    type: "reset",
                    info: {
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "move") {
            states.push({
                type: "move__cardToCard",
                info: {
                    targets: findMoveTargets(G, ctx, playerID, instruction.do.info),
                    instructionID: instruction.id,
                    sourceCardID: instruction.ui.info?.source,
                }
            });
        }

        if (instruction.do.key === "move2") {
            states.push({
                type: "move2__cardToPlayer",
                info: {
                    targets: findMoveTargets2(G, ctx, playerID),
                    instructionID: instruction.id,
                    sourceCardID: instruction.ui.info?.source,
                }
            });
        }

        if (instruction.do.key === "revive") {
            states.push({
                type: "revive",
                info: {
                    targets: findReviveTarget(G, ctx, playerID, instruction.do.info),
                    instructionID: instruction.id,
                    sourceCardID: instruction.ui.info?.source,
                }
            });
        }

        if (instruction.do.key === "reviveFromNursery") {
            states.push({
                type: "reviveFromNursery",
                info: {
                    targets: G.nursery.map(c => ({ cardID: c })),
                    instructionID: instruction.id,
                    sourceCardID: instruction.ui.info?.source,
                }
            });
        }

        if (instruction.do.key === "backKick") {
            if (instruction.ui.type === "card_to_card") {
                states.push({
                    type: "backKick__card_to_card",
                    info: {
                        targets: findBackKickTargets(G, ctx, playerID),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "unicornSwap1") {
            states.push({
                type: "unicornswap1",
                info: {
                    targets: findUnicornSwap1Targets(G, ctx, playerID),
                    instructionID: instruction.id,
                    sourceCardID: instruction.ui.info?.source,
                }
            });
        }

        if (instruction.do.key === "unicornSwap2") {
            states.push({
                type: "unicornswap2",
                info: {
                    targets: findUnicornSwap2Targets(G, ctx, playerID),
                    instructionID: instruction.id,
                    sourceCardID: instruction.ui.info?.source,
                }
            });
        }

        if (instruction.do.key === "blatantThievery1") {
            if (instruction.ui.type === "card_to_player") {
                states.push({
                    type: "blatantThievery1",
                    info: {
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "pullRandom") {
            if (instruction.ui.type === "card_to_player") {
                states.push({
                    type: "pullRandom__cardToPlayer",
                    info: {
                        targets: findPullRandomTargets(G, ctx, playerID),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "makeSomeoneDiscard") {
            if (instruction.ui.type === "card_to_player") {
                states.push({
                    type: "makeSomeoneDiscard__cardToPlayer",
                    info: {
                        targets: findMakeSomeoneDiscardTarget(G, ctx, playerID),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "search") {
            if (instruction.ui.type === "single_action_popup") {
                states.push({
                    type: "search__single_action_popup",
                    info: {
                        targets: findSearchTargets(G, ctx, playerID, instruction.do.info),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }

        if (instruction.do.key === "addFromDiscardPileToHand") {
            if (instruction.ui.type === "single_action_popup") {
                states.push({
                    type: "addFromDiscardPileToHand__single_action_popup",
                    info: {
                        targets: findAddFromDiscardPileToHand(G, ctx, playerID, instruction.do.info),
                        instructionID: instruction.id,
                        sourceCardID: instruction.ui.info?.source,
                    }
                });
            }
        }
    })


    return states;
}