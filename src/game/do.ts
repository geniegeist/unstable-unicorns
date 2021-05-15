import { Card, CardID, isUnicorn, OnEnter, OnEnterAddEffect, OnEnterAddScene } from "./card";
import { UnstableUnicornsGame, Ctx, Scene, Instruction, Action, _addSceneFromDo } from "./game";
import type { PlayerID } from "./player";
import _ from 'underscore';
import { CONSTANTS } from "./constants";

type ParamLeave = {
    playerID: PlayerID;
    cardID: CardID;
}

function leave(G: UnstableUnicornsGame, ctx: Ctx, param: ParamLeave) {
    G.stable[param.playerID] = _.without(G.stable[param.playerID], param.cardID);
    G.upgradeDowngradeStable[param.playerID] = _.without(G.upgradeDowngradeStable[param.playerID], param.cardID);

    // remove player effect
    G.playerEffects[param.playerID] = _.filter(G.playerEffects[param.playerID], eff => eff.cardID !== param.cardID);

    // when another unicorn enters your stable
    // inject action after the current action
    const on = [...G.stable[param.playerID], ...G.upgradeDowngradeStable[param.playerID]].map(c => G.deck[c]).filter(s => s.on && s.on.filter(o => o.trigger === "unicorn_leaves_your_stable").length > 0);
    on.forEach(card => {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.playerID].find(s => s.effect.key === "my_unicorns_are_basic")) {
            if (G.playerEffects[param.playerID].find(s => s.effect.key === "pandamonium") === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }

        const on = card.on?.find(o => o.trigger === "unicorn_leaves_your_stable")!;
        if (on.do.type === "inject_action") {
            const newAction: Action = {
                type: "action",
                instructions: [{
                    id: _.uniqueId(),
                    protagonist: param.playerID,
                    state: "open",
                    do: on.do.info.instruction.do,
                    ui: { ...on.do.info.instruction.ui, info: { source: card.id, ...on.do.info.instruction.ui.info } },
                }]
            };

            if (_findInstructionInProgress(G) === null) {
                // no active scene
                // thus create a mandatory scene
                const newScene: Scene = {
                    id: _.uniqueId(),
                    mandatory: true,
                    endTurnImmediately: false,
                    actions: [newAction]
                };

                G.script.scenes = [...G.script.scenes, newScene];
            } else {
                // found active scene
                const [scene, action, instruction] = _findInstructionInProgress(G)!;
                const index = scene.actions.findIndex(ac => ac.instructions.find(ins => ins.id === instruction.id));

                scene.actions.splice(index, 0, newAction);
            }
        }
    });
}

type ParamEnter = {
    playerID: PlayerID;
    cardID: CardID;
}

export function enter(G: UnstableUnicornsGame, ctx: Ctx, param: ParamEnter) {
    const card = G.deck[param.cardID];

    if (card.type === "upgrade" || card.type === "downgrade") {
        G.upgradeDowngradeStable[param.playerID] = [...G.upgradeDowngradeStable[param.playerID], param.cardID];
    } else if (card.type === "magic") {
        G.temporaryStable[param.playerID] = [param.cardID];
    } else {
        G.stable[param.playerID] = [...G.stable[param.playerID], param.cardID];
    }

    const cardOnEnter = <OnEnter[] | undefined>card.on?.filter(c => c.trigger === "enter");

    if (cardOnEnter) {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.playerID].find(s => s.effect.key === "my_unicorns_are_basic")) {
            if (G.playerEffects[param.playerID].find(s => s.effect.key === "pandamonium") === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }

        _addSceneFromDo(G, ctx, param.cardID, param.playerID, "enter");

        cardOnEnter.filter(on => on.do.type === "auto").forEach(on => {
            if (on.do.type === "auto" && on.do.info.key === "sacrifice_all_downgrades") {
                const toBeRemoved = _.filter(G.upgradeDowngradeStable[param.playerID], c => {
                    const card = G.deck[c];
                    return card.type === "downgrade";
                });

                G.upgradeDowngradeStable[param.playerID] = _.difference(G.upgradeDowngradeStable[param.playerID], toBeRemoved);

                G.discardPile = [...G.discardPile, ...toBeRemoved];
            } 
        });

        cardOnEnter.filter(on => on.do.type === "add_effect").forEach(on => {
            const doAddEffect = <OnEnterAddEffect>on.do;
            // check if effect has already been added
            if (G.playerEffects[param.playerID].filter(o => o.cardID === param.cardID && o.effect.key === doAddEffect.info.key).length === 0) {
                G.playerEffects[param.playerID] = [...G.playerEffects[param.playerID], { cardID: param.cardID, effect: doAddEffect.info }];
            }
        });
    }

    // tiny stable
    if (G.playerEffects[param.playerID].find(s => s.effect.key === "tiny_stable")) {
        // pandamonium is not active
        if (G.playerEffects[param.playerID].find(s => s.effect.key === "pandamonium") === undefined) {
            if ((G.playerEffects[param.playerID].find(p => p.effect.key === "count_as_two") && G.stable[param.playerID].length > 4) || G.stable[param.playerID].length > 5) {
                const newAction: Action = {
                    type: "action",
                    instructions: [{
                        id: _.uniqueId(),
                        protagonist: param.playerID,
                        state: "open",
                        do: {
                            key: "sacrifice",
                            info: {type: "unicorn"}
                        },
                        ui: { type: "click_on_card_in_stable" } ,
                    }]
                };
    
                if (_findInstructionInProgress(G) === null) {
                    // no active scene
                    // thus create a mandatory scene
                    const newScene: Scene = {
                        id: _.uniqueId(),
                        mandatory: true,
                        endTurnImmediately: false,
                        actions: [newAction]
                    };
    
                    G.script.scenes = [...G.script.scenes, newScene];
                } else {
                    // found active scene
                    const [scene, action, instruction] = _findInstructionInProgress(G)!;
                    const index = scene.actions.findIndex(ac => ac.instructions.find(ins => ins.id === instruction.id));
    
                    scene.actions.splice(index, 0, newAction);
                } 
            }
        }
    }

    // when another unicorn enters your stable
    // inject action after the current action
    const on = [...G.stable[param.playerID], ...G.upgradeDowngradeStable[param.playerID]].map(c => G.deck[c]).filter(s => s.on && s.on.filter(o => o.trigger === "unicorn_enters_your_stable").length > 0);
    on.forEach(card => {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.playerID].find(s => s.effect.key === "my_unicorns_are_basic")) {
            if (G.playerEffects[param.playerID].find(s => s.effect.key === "pandamonium") === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }

        const on = card.on?.find(o => o.trigger === "unicorn_enters_your_stable")!;
        if (on.do.type === "inject_action") {
            const newAction: Action = {
                type: "action",
                instructions: [{
                    id: _.uniqueId(),
                    protagonist: param.playerID,
                    state: "open",
                    do: on.do.info.instruction.do,
                    ui: { ...on.do.info.instruction.ui, info: { source: card.id, ...on.do.info.instruction.ui.info } },
                }]
            };

            if (_findInstructionInProgress(G) === null) {
                // no active scene
                // thus create a mandatory scene
                const newScene: Scene = {
                    id: _.uniqueId(),
                    mandatory: true,
                    endTurnImmediately: false,
                    actions: [newAction]
                };

                G.script.scenes = [...G.script.scenes, newScene];
            } else {
                // found active scene
                const [scene, action, instruction] = _findInstructionInProgress(G)!;
                const index = scene.actions.findIndex(ac => ac.instructions.find(ins => ins.id === instruction.id));

                scene.actions.splice(index, 0, newAction);
            }
        }
    });
}

export function canEnter(G: UnstableUnicornsGame, ctx: Ctx, param: ParamEnter) {
    if (G.deck[param.cardID].type === "neigh" || G.deck[param.cardID].type === "super_neigh") {
        return false;
    }

    if (G.stable[param.playerID].length === CONSTANTS.stableSeats) {
        return false;
    }

    const card = G.deck[param.cardID];

    if (G.playerEffects[param.playerID].find(s => s.effect.key === "you_cannot_play_upgrades")) {
        if (card.type === "upgrade") {
            return false;
        }
    }

    if (card.type === "basic") {
        let basic_unicorns_cannot_enter_isActive = false;
        _.keys(G.playerEffects).forEach(key => {
            const effect = G.playerEffects[key].find(eff => eff.effect.key === "basic_unicorns_can_only_join_your_stable");
            if (effect && key !== param.playerID) {
                basic_unicorns_cannot_enter_isActive = true;
            }
        });

        return !basic_unicorns_cannot_enter_isActive;
    }

    return true;
}

/////////////////////////////////////////////////

export type Do = DoSteal | DoPull | DoPullRandom | DoDiscard | DoDestroy | DoSacrifice | DoSearch | DoRevive | DoDraw | DoAddFromDiscardPileToHand | DoReviveFromNursery | DoReturnToHand | DoBringToStable | /*DoPeekAddReorder |*/ DoMakeSomeoneDiscard | DoSwapHands | DoShakeUp | DoReset | DoMove | DoMove2 | DoBackKick | DoShuffleDiscardPileIntoDrawPile | DoUnicornSwap1 | DoUnicornSwap2 |DoBlatantThievery1 ;

export function executeDo(G: UnstableUnicornsGame, ctx: Ctx, instructionID: string, param: { protagonist: PlayerID }) {
    const [scene, action, instruction] = _findInstructionWithID(G, instructionID)!;

    if (scene.endTurnImmediately) {
        G.mustEndTurnImmediately = true;
    }

    instruction.state = "in_progress";

    // ui sound
    G.uiExecuteDo = { id: _.uniqueId(), cardID: instruction.ui.info?.source, do: instruction.do };

    // execute instruction
    if (instruction.do.key === "destroy") {
        // intervention
        const paramDestroy = <ParamDestroy>param;
        const targetPlayer = findOwnerOfCard(G, paramDestroy.cardID)!;

        // check if it contains the save_mate_by_sacrifice effect
        if (G.playerEffects[targetPlayer].find(eff => eff.effect.key === "save_mate_by_sacrifice")) {
            /*
            const idx = action.instructions.findIndex(ac => ac.id === instruction.id);
            scene.actions.splice(idx + 1, 0, {
                type: "action",
                instructions: [{
                    id: _.uniqueId(),
                    protagonist: targetPlayer,
                    state: "open",
                    do: {
                        key: "interveneDestroyBySacrifice",
                        info: {
                            cardToSave: paramDestroy.cardID,
                            paramDestroy
                        }
                    },
                    ui: {
                        type: "single_action_popup",
                    }
                }]
            });*/
        } else {
            KeyToFunc[instruction.do.key](G, ctx, param);
        }

        if (instruction.do.info.count !== undefined) {
            if (instruction.do.info.count === 1) {
                action.instructions.filter(ins => ins.protagonist === param.protagonist).forEach(ins => ins.state = "executed");
            }
            instruction.do.info.count = instruction.do.info.count - 1;
        } else {
            action.instructions.filter(ins => ins.protagonist === param.protagonist).forEach(ins => ins.state = "executed");
        }
    } else if (instruction.do.key === "discard") {
        discard(G, ctx, param as ParamDiscard);
        if (instruction.do.info.count === 1) {
            action.instructions.filter(ins => ins.protagonist === param.protagonist).forEach(ins => ins.state = "executed");

            if (instruction.do.info.changeOfLuck === true) {
                G.playerEffects[param.protagonist] = [...G.playerEffects[param.protagonist], {effect: {key: "change_of_luck"}}]
            }
        }
        instruction.do.info.count = instruction.do.info.count - 1;
    } else {
        KeyToFunc[instruction.do.key](G, ctx, param);
        action.instructions.filter(ins => ins.protagonist === param.protagonist).forEach(ins => ins.state = "executed");
    }

    const actionIndex = scene.actions.findIndex(ac => ac.instructions.find(ins => ins.id === instructionID));
    if (actionIndex === scene.actions.length - 1) {
        // all instructions were executed
        if (action.instructions.filter(ins => ins.state === "executed").length === action.instructions.length) {
            // handle magic cards
            // if it is the last action of a magic card and it is executed
            // remove from temporary stable and move it to discard pile
            const tempCard = _.first(G.temporaryStable[param.protagonist]);
            G.temporaryStable[param.protagonist] = [];
            if (tempCard) {
                if (instruction.do.key === "shakeUp") {
                    // do nothing
                    // shake up card is not placed in the discard pile
                } else {
                    G.discardPile = [...G.discardPile, tempCard];
                }
            }
        }
    }
}

/////////////////////////////////////////////////

interface DoSteal {
    key: "steal";
    info: DoStealInfo;
}

type DoStealInfo = { type: "unicorn" | "upgrade"; unicornSwap?: boolean }

type ParamSteal = {
    protagonist: PlayerID;
    cardID: CardID;
}

function steal(G: UnstableUnicornsGame, ctx: Ctx, param: ParamSteal) {
    leave(G, ctx, { playerID: findOwnerOfCard(G, param.cardID)!, cardID: param.cardID });
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
}

type StealTarget = {
    playerID: PlayerID;
    cardID: CardID;
}

export function findStealTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoStealInfo): StealTarget[] {
    let targets: StealTarget[] = [];

    switch (info.type) {
        case "unicorn": {
            G.players.forEach(pl => {
                if (pl.id === protagonist) { return };
                G.stable[pl.id].forEach(c => {
                    if (info.unicornSwap === true) {
                        if (pl.id !== G.clipboard.unicornSwap?.targetPlayer) {
                            return;
                        }
                    }
                    if (canEnter(G, ctx, { playerID: protagonist, cardID: c })) {
                        targets.push({ playerID: pl.id, cardID: c });
                    }
                });
            });
            break;
        }
        case "upgrade": {
            G.players.forEach(pl => {
                if (pl.id === protagonist) { return };
                G.upgradeDowngradeStable[pl.id].forEach(c => {
                    if (canEnter(G, ctx, { playerID: protagonist, cardID: c })) {
                        targets.push({ playerID: pl.id, cardID: c });
                    }
                });
            });
            break;
        }
    }

    return targets;
}

function canSteal(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoStealInfo) {
    if (info.type === "unicorn") {
        if (G.stable[protagonist].length === CONSTANTS.stableSeats) {
            return false;
        }
    }

    return findStealTargets(G, ctx, protagonist, info).length > 0;
}

/////////////////////////////////////////////////

interface DoPullRandom {
    key: "pullRandom"
}

function pullRandom(G: UnstableUnicornsGame, ctx: Ctx, param: {protagonist: PlayerID, playerID: PlayerID}) {
    pull(G, ctx, {
        protagonist: param.protagonist,
        from: param.playerID,
        handIndex: _.random(0, G.hand[param.playerID].length - 1)
    });
}

export function findPullRandomTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID): PullTarget[] {
    return findPullTargets(G, ctx, protagonist);
}

interface DoPull {
    key: "pull";
}

type ParamPull = {
    protagonist: PlayerID;
    handIndex: number;
    from: PlayerID;
}

export function pull(G: UnstableUnicornsGame, ctx: Ctx, param: ParamPull) {
    const cardToPull = G.hand[param.from][param.handIndex]
    G.hand[param.from] = _.without(G.hand[param.from], cardToPull);
    G.hand[param.protagonist] = [...G.hand[param.protagonist], cardToPull];
}

function canPull(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    return findPullTargets(G, ctx, protagonist).length > 0;
}

type PullTarget = {
    playerID: PlayerID;
}

function findPullTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID): PullTarget[] {
    let targets: PullTarget[] = [];

    G.players.forEach(pl => {
        if (G.hand[pl.id].length > 0 && pl.id !== protagonist) {
            targets.push({ playerID: pl.id });
        }
    });

    return targets;
}

/////////////////////////////////////////////////

export interface DoDiscard {
    key: "discard";
    info: DoDiscardInfo;
}

type DoDiscardInfo = {
    count: number;
    type: "any" | "unicorn";
    changeOfLuck?: boolean;
}

export type ParamDiscard = {
    protagonist: PlayerID;
    cardID: CardID;
}

export function discard(G: UnstableUnicornsGame, ctx: Ctx, param: ParamDiscard) {
    G.hand[param.protagonist] = _.without(G.hand[param.protagonist], param.cardID);
    G.discardPile = [...G.discardPile, param.cardID];
}

export function canDiscard(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoDiscardInfo) {
    return findDiscardTargets(G, ctx, protagonist, info).length >= info.count;
}

export type DiscardTarget = {
    handIndex: number;
}

export function findDiscardTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoDiscardInfo): DiscardTarget[] {
    let targets: DiscardTarget[] = [];

    G.hand[protagonist].forEach((cid, index) => {
        if (info.type === "any") {
            targets.push({ handIndex: index });
        } else if (info.type === "unicorn") {
            const card = G.deck[cid];
            if (isUnicorn(card)) {
                targets.push({ handIndex: index });
            }
        }
    })

    return targets;
}

/////////////////////////////////////////////////

export interface DoDestroy {
    key: "destroy";
    info: DoDestroyInfo;
}

type DoDestroyInfo = {
    type: "unicorn" | "upgrade" | "any" | "my_downgrade_other_upgrade";
    count?: number;
}

type ParamDestroy = {
    protagonist: PlayerID;
    cardID: CardID;
}

export function destroy(G: UnstableUnicornsGame, ctx: Ctx, param: ParamDestroy) {
    const card = G.deck[param.cardID];

    const targetPlayer = findOwnerOfCard(G, param.cardID)!;
    leave(G, ctx, { playerID: targetPlayer, cardID: param.cardID });

    if (card.type === "baby") {
        G.nursery.push(param.cardID);
    } else {
        G.discardPile.push(param.cardID);
    }

    const ons = card.on?.filter(on => on.trigger === "this_destroyed_or_sacrificed");
    ons?.forEach(on => {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[targetPlayer].find(s => s.effect.key === "my_unicorns_are_basic")) {
            if (G.playerEffects[targetPlayer].find(s => s.effect.key === "pandamonium") === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }

        if (on.do.type === "return_to_hand") {
            G.discardPile = _.without(G.discardPile, param.cardID);
            G.hand[targetPlayer] = [...G.hand[targetPlayer], param.cardID];
        } else if (on.do.type === "add_scene") {
            _addSceneFromDo(G, ctx, card.id, targetPlayer, "any");
        }
    });
}

// source: card which caused the destroy action
function canDestroy(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoDestroyInfo, source: CardID | undefined) {
    return findDestroyTargets(G, ctx, protagonist, info, source).length > 0;
}

type DestroyTarget = {
    playerID: PlayerID;
    cardID: CardID;
}

export function findDestroyTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoDestroyInfo, sourceCard: CardID | undefined): DestroyTarget[] {
    let targets: DestroyTarget[] = [];

    G.players.forEach(pl => {
        // special case
        // this is actually a combination of sacrifice and destroy
        if (info.type === "my_downgrade_other_upgrade") {
            G.upgradeDowngradeStable[pl.id].forEach(cid => {
                const card = G.deck[cid];
                if (pl.id === protagonist && card.type === "downgrade") {
                    targets.push({ playerID: pl.id, cardID: cid });
                } else if (pl.id !== protagonist && card.type === "upgrade") {
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
        }

        if (pl.id === protagonist) {
            return;
        }

        if (info.type === "unicorn") {
            G.stable[pl.id].forEach(cid => {
                const card = G.deck[cid];
                if (isUnicorn(card)) {
                    if (sourceCard && G.deck[sourceCard].type === "magic" && card.passive?.includes("cannot_be_destroyed_by_magic")) {
                        return;
                    }
                    if (G.playerEffects[pl.id].find(s => s.effect.key === "your_unicorns_cannot_be_destroyed")) {
                        return;
                    }
                    if (G.playerEffects[pl.id].find(s => s.effect.key === "pandamonium")) {
                        return;
                    }
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
        } else if (info.type === "upgrade") {
            G.upgradeDowngradeStable[pl.id].forEach(cid => {
                const card = G.deck[cid];
                if (card.type === "upgrade") {
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
        } else if (info.type === "any") {
            G.stable[pl.id].forEach(cid => {
                const card = G.deck[cid];
                if (isUnicorn(card)) {
                    if (sourceCard && G.deck[sourceCard].type === "magic" && card.passive?.includes("cannot_be_destroyed_by_magic")) {
                        return;
                    }
                    if (G.playerEffects[pl.id].find(s => s.effect.key === "your_unicorns_cannot_be_destroyed")) {
                        return;
                    }
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
            G.upgradeDowngradeStable[pl.id].forEach(cid => {
                targets.push({ playerID: pl.id, cardID: cid });
            });
        }
    })

    return targets;
}

/////////////////////////////////////////////////

interface DoSacrifice {
    key: "sacrifice";
    info: DoSacrificeInfo;
}

type DoSacrificeInfo = {
    type: "unicorn" | "downgrade" | "this" | "any";
}

type ParamSacrifice = {
    protagonist: PlayerID;
    cardID: CardID;
}

function sacrifice(G: UnstableUnicornsGame, ctx: Ctx, param: ParamSacrifice) {
    const card = G.deck[param.cardID];

    leave(G, ctx, { playerID: param.protagonist, cardID: param.cardID });

    if (card.type === "baby") {
        G.nursery.push(param.cardID);
    } else {
        G.discardPile.push(param.cardID);
    }

    const ons = card.on?.filter(on => on.trigger === "this_destroyed_or_sacrificed");
    ons?.forEach(on => {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.protagonist].find(s => s.effect.key === "my_unicorns_are_basic")) {
            if (G.playerEffects[param.protagonist].find(s => s.effect.key === "pandamonium") === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }

        if (on.do.type === "return_to_hand") {
            G.discardPile = _.without(G.discardPile, param.cardID);
            G.hand[param.protagonist] = [...G.hand[param.protagonist], param.cardID];
        } else if (on.do.type === "add_scene") {
            _addSceneFromDo(G, ctx, card.id, param.protagonist, "any");
        }
    });
}

function canSacrifice(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoSacrificeInfo, source?: CardID) {
    return findSacrificeTargets(G, ctx, protagonist, info).length > 0;
}

type SacrificeTarget = {
    cardID: CardID;
}

export function findSacrificeTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoSacrificeInfo): SacrificeTarget[] {
    let targets: SacrificeTarget[] = [];

    if (info.type === "downgrade") {
        G.upgradeDowngradeStable[protagonist].forEach(c => {
            const card = G.deck[c];
            if (card.type === "downgrade") {
                targets.push({ cardID: c });
            }
        })
    }

    if (info.type === "unicorn") {
        G.stable[protagonist].forEach(c => {
            const card = G.deck[c];
            if (isUnicorn(card)) {
                if (G.playerEffects[protagonist].find(s => s.effect.key === "pandamonium") === undefined) {
                    targets.push({ cardID: c });
                }
            }
        })
    }

    if (info.type === "any") {
        targets = G.stable[protagonist].map(c => ({ cardID: c }));
    }

    return targets;
}

/////////////////////////////////////////////////

interface DoSearch {
    key: "search";
    info: {
        type: "any" | "unicorn" | "upgrade" | "downgrade" | "narwhal";
    }
}

type DoSearchInfo = {
    type: "any" | "unicorn" | "upgrade" | "downgrade" | "narwhal";
}

type ParamSearch = {
    protagonist: PlayerID;
    cardID: CardID;
}

function search(G: UnstableUnicornsGame, ctx: Ctx, param: ParamSearch) {
    G.drawPile = _.shuffle(_.without(G.drawPile, param.cardID));
    G.hand[param.protagonist] = [...G.hand[param.protagonist], param.cardID];
}

function canSearch(G: UnstableUnicornsGame, ctx: Ctx, protagonist: string, info: DoSearchInfo) {
    return findSearchTargets(G, ctx, protagonist, info).length > 0;
}

export type SearchTarget = {
    cardID: CardID;
}

export function findSearchTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoSearchInfo): SearchTarget[] {
    let targets: SearchTarget[] = [];

    if (info.type === "any") {
        targets = G.drawPile.map(c => ({ cardID: c }));
    }

    if (info.type === "downgrade") {
        targets = G.drawPile.map(c => G.deck[c]).filter(c => c.type === "downgrade").map(c => ({ cardID: c.id }));
    }

    if (info.type === "narwhal") {
        targets = G.drawPile.map(c => G.deck[c]).filter(c => c.type === "narwhal").map(c => ({ cardID: c.id }));
    }

    if (info.type === "unicorn") {
        targets = G.drawPile.map(c => G.deck[c]).filter(c => isUnicorn(c)).map(c => ({ cardID: c.id }));
    }

    if (info.type === "upgrade") {
        targets = G.drawPile.map(c => G.deck[c]).filter(c => c.type === "upgrade").map(c => ({ cardID: c.id }));
    }

    return targets;
}

/////////////////////////////////////////////////

interface DoRevive {
    key: "revive";
    info: DoReviveInfo;
}

type DoReviveInfo = {
    type: "unicorn" | "basic_unicorn";
}

type ParamRevive = {
    protagonist: PlayerID;
    cardID: CardID;
}

function revive(G: UnstableUnicornsGame, ctx: Ctx, param: ParamRevive) {
    G.discardPile = _.without(G.discardPile, param.cardID);
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
}

function canRevive(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoReviveInfo) {
    return findReviveTarget(G, ctx, protagonist, info).length > 0;
}

export type ReviveTarget = {
    cardID: CardID;
}

export function findReviveTarget(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoReviveInfo): ReviveTarget[] {
    let targets: ReviveTarget[] = [];

    if (info.type === "unicorn") {
        targets = G.discardPile.filter(c => {
            const card = G.deck[c];
            return isUnicorn(card) && canEnter(G, ctx, { playerID: protagonist, cardID: c });
        }).map(c => ({ cardID: c }));
    }

    if (info.type === "basic_unicorn") {
        targets = G.discardPile.filter(c => {
            const card = G.deck[c];
            return canEnter(G, ctx, { playerID: protagonist, cardID: c }) && card.type === "basic";
        }).map(c => ({ cardID: c }));
    }

    return targets;
}

/////////////////////////////////////////////////

interface DoDraw {
    key: "draw";
    info: {
        count: number;
    }
}


function draw(G: UnstableUnicornsGame, ctx: Ctx, param: { protagonist: PlayerID, count: number }) {
    const toDraw = _.first(G.drawPile, param.count);
    G.drawPile = _.rest(G.drawPile, param.count);
    G.hand[param.protagonist] = [...G.hand[param.protagonist], ...toDraw];
}

function canDraw(G: UnstableUnicornsGame, ctx: Ctx, param: { count: number }) {
    return G.drawPile.length >= param.count;
}

/////////////////////////////////////////////////

interface DoAddFromDiscardPileToHand {
    key: "addFromDiscardPileToHand";
    info: DoAddFromDiscardPileToHandInfo;
}

type DoAddFromDiscardPileToHandInfo = {
    type: "magic" | "unicorn" | "neigh";
}

export type AddFromDiscardPileToHandParam = {
    protagonist: PlayerID;
    cardID: CardID;
}

function addFromDiscardPileToHand(G: UnstableUnicornsGame, ctx: Ctx, param: AddFromDiscardPileToHandParam) {
    G.discardPile = _.without(G.discardPile, param.cardID);
    G.hand[param.protagonist].push(param.cardID);
}

function canAddFromDiscardPileToHand(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoAddFromDiscardPileToHandInfo) {
    return findAddFromDiscardPileToHand(G, ctx, protagonist, info).length > 0;
}

export type AddFromDiscardPileToHandTarget = {
    cardID: CardID
}

export function findAddFromDiscardPileToHand(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoAddFromDiscardPileToHandInfo): AddFromDiscardPileToHandTarget[] {
    let targets: AddFromDiscardPileToHandTarget[] = [];

    if (info.type === "magic" || info.type === "neigh") {
        targets = G.discardPile.map(c => G.deck[c]).filter(c => c.type === info.type).map(c => ({ cardID: c.id }));
    }

    if (info.type === "unicorn") {
        targets = G.discardPile.map(c => G.deck[c]).filter(c => isUnicorn(c)).map(c => ({ cardID: c.id }));
    }

    return targets;
}

/////////////////////////////////////////////////

interface DoReviveFromNursery {
    key: "reviveFromNursery";
}

type ParamReviveFromNursery = {
    protagonist: PlayerID;
    cardID: CardID;
}

function reviveFromNursery(G: UnstableUnicornsGame, ctx: Ctx, param: ParamReviveFromNursery) {
    G.nursery = _.without(G.nursery, param.cardID);
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
}

function canReviveFromNursery(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    return G.stable[protagonist].length < CONSTANTS.stableSeats;
}

/////////////////////////////////////////////////

interface DoReturnToHand {
    key: "returnToHand";
    info: ReturnToHandInfo;
}

type ReturnToHandInfo = {
    who: "another"
}

type ParamReturnToHand = {
    protagonist: PlayerID;
    cardID: CardID;
}

function returnToHand(G: UnstableUnicornsGame, ctx: Ctx, param: ParamReturnToHand) {
    const card = G.deck[param.cardID];
    const playerID = findOwnerOfCard(G, param.cardID)!;
    leave(G, ctx, { playerID: playerID, cardID: param.cardID });

    if (card.type === "baby") {
        G.nursery.push(param.cardID);
    } else {
        G.hand[playerID].push(param.cardID);
    }
}

type ReturnToHandTarget = {
    playerID: PlayerID;
    cardID: CardID;
}

export function findReturnToHandTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: ReturnToHandInfo): ReturnToHandTarget[] {
    let targets: ReturnToHandTarget[] = [];

    if (info.who === "another") {
        G.players.filter(pl => pl.id !== protagonist).forEach(pl => {
            targets = [...targets, ...G.stable[pl.id].map(c => ({ playerID: pl.id, cardID: c }))];
            targets = [...targets, ...G.upgradeDowngradeStable[pl.id].map(c => ({ playerID: pl.id, cardID: c }))];
        });
    }

    return targets;
}

function canReturnToHand(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: ReturnToHandInfo) {
    return findReturnToHandTargets(G, ctx, protagonist, info).length > 0;
}

/////////////////////////////////////////////////

// player may bring a card from their hand directly to their stable
interface DoBringToStable {
    key: "bringToStable";
    info: BringToStableInfo;
}

type BringToStableInfo = {
    type: "basic_unicorn"
}

type ParamBringToStable = {
    protagonist: PlayerID;
    cardID: CardID;
}

function bringToStable(G: UnstableUnicornsGame, ctx: Ctx, param: ParamBringToStable) {
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
    G.hand[param.protagonist] = _.without(G.hand[param.protagonist], param.cardID);
}

export type BringToStableTarget = {
    cardID: CardID;
}

export function findBringToStableTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: BringToStableInfo): BringToStableTarget[] {
    let targets: BringToStableTarget[] = [];

    if (info.type === "basic_unicorn") {
        targets = G.hand[protagonist].map(c => G.deck[c]).filter(c => c.type === "basic" && canEnter(G, ctx, { cardID: c.id, playerID: protagonist })).map(c => ({ cardID: c.id }));
    }

    return targets;
}

export function canBringToStableTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: BringToStableInfo) {
    return findBringToStableTargets(G, ctx, protagonist, info).length > 0;
}

/////////////////////////////////////////////////

type DoSwapHands = {
    key: "swapHands"
};

type SwapHandsTargets = {
    playerID: PlayerID
};

function swapHands(G: UnstableUnicornsGame, ctx: Ctx, param: {protagonist: PlayerID, playerID: PlayerID}) {
    const myHand = G.hand[param.protagonist];
    G.hand[param.protagonist] = G.hand[param.playerID];
    G.hand[param.playerID] = myHand;
}

export function findSwapHandsTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID): SwapHandsTargets[] {
    let targets: SwapHandsTargets[] = [];
    targets = G.players.map(pl => pl.id).filter(plid => plid !== protagonist).map(d => ({playerID: d}));
    return targets;
}

/////////////////////////////////////////////////

type DoShakeUp = {
    key: "shakeUp";
}

function shakeUp(G: UnstableUnicornsGame, ctx: Ctx, param: {protagonist: PlayerID, sourceCardID: CardID}) {
    G.drawPile = _.shuffle([...G.drawPile, param.sourceCardID, ...G.hand[param.protagonist], ...G.discardPile]);
    G.discardPile = [];
    G.hand[param.protagonist] = _.first(G.drawPile, 5);
    G.drawPile = _.rest(G.drawPile, 5);
}

/////////////////////////////////////////////////

type DoReset = {
    key: "reset";
}

function reset(G: UnstableUnicornsGame, ctx: Ctx, param: {protagonist: PlayerID}) {
    G.players.forEach(pl => {
        G.upgradeDowngradeStable[pl.id].forEach(cardID => {
            sacrifice(G, ctx, { protagonist: pl.id, cardID });
        });
    });

    G.drawPile = _.shuffle([...G.drawPile, ...G.discardPile]);
}

/////////////////////////////////////////////////

type DoMove = {
    key: "move";
    info: DoMoveInfo;
}

type DoMoveInfo = {
    type: "upgradeAndDowngrade";
}

function move(G: UnstableUnicornsGame, ctx: Ctx, param: {cardID: CardID, protagonist: PlayerID}) {
    const from = findOwnerOfCard(G, param.cardID)!;
    leave(G, ctx, { playerID: from, cardID: param.cardID });
    G.clipboard["move"] = { cardID: param.cardID, from: from };
}

type MoveTarget = {
    cardID: CardID;
    playerID: PlayerID;
}

export function findMoveTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, info: DoMoveInfo): MoveTarget[] {
    let targets: MoveTarget[] = [];

    G.players.forEach(pl => {
        targets = [...targets, ...G.upgradeDowngradeStable[pl.id].map(c => ({ cardID: c, playerID: pl.id}))];
    })

    return targets;
}

type DoMove2 = {
    key: "move2";
}


function move2(G: UnstableUnicornsGame, ctx: Ctx, param: {playerID: PlayerID}) {
    enter(G, ctx, { playerID: param.playerID, cardID: G.clipboard.move.cardID });
}

type MoveTarget2 = {
    playerID: PlayerID;
}

// to fix
// a protagonist cannot move a card into his own stable
export function findMoveTargets2(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID): MoveTarget2[] {
    let targets: MoveTarget2[] = [];

    G.players.forEach(pl => {
        if (pl.id !== G.clipboard.move.from && pl.id !== protagonist) {
            targets.push({playerID: pl.id})
        }
    })

    return targets;
}

/////////////////////////////////////////////////

type DoShuffleDiscardPileIntoDrawPile = {
    key: "shuffleDiscardPileIntoDrawPile"
}

function shuffleDiscardPileIntoDrawPile(G: UnstableUnicornsGame, ctx: Ctx, param: any) {
    G.drawPile = _.shuffle([...G.drawPile, ...G.discardPile]); 
    G.discardPile = [];
}

/////////////////////////////////////////////////

type DoBackKick = {
    key: "backKick"
}

function backKick(G: UnstableUnicornsGame, ctx: Ctx, param: {protagonist: PlayerID, cardID: CardID}) {
    const owner = findOwnerOfCard(G, param.cardID)!;
    returnToHand(G, ctx, {cardID: param.cardID, protagonist: param.protagonist});
    makeSomeoneDiscard(G, ctx, {protagonist: param.protagonist, playerID: owner});
}

type BackKickTarget = {
    cardID: CardID;
}

export function findBackKickTargets(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    let targets: BackKickTarget[] = [];

    G.players.forEach(pl => {
        if (pl.id === protagonist) {
            return;
        }

        [...G.stable[pl.id], ...G.upgradeDowngradeStable[pl.id]].forEach(c => {
            targets.push({ cardID: c});
        })
    })

    return targets;
}

/////////////////////////////////////////////////

type DoUnicornSwap1 = {
    key: "unicornSwap1"
}

function unicornSwap1(G: UnstableUnicornsGame, ctx:Ctx, param: {protagonist: PlayerID, cardID: CardID}) {
    leave(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
    G.clipboard.unicornSwap = { cardIDToMove: param.cardID };
}

export function findUnicornSwap1Targets(G:UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    let targets: {cardID: CardID}[] = [];

    G.stable[protagonist].forEach(c => {
        const card = G.deck[c];
        if (isUnicorn(card)) {
            if (G.playerEffects[protagonist].find(s => s.effect.key === "pandamonium") === undefined) {
                targets.push({ cardID: c });
            }
        }
    });

    return targets;
}

type DoUnicornSwap2 = {
    key: "unicornSwap2"
}

function unicornSwap2(G: UnstableUnicornsGame, ctx:Ctx, param: {protagonist: PlayerID, playerID: PlayerID}) {
    enter(G, ctx, { playerID: param.playerID, cardID: G.clipboard.unicornSwap.cardIDToMove });
    G.clipboard.unicornSwap = {targetPlayer: param.playerID}
}

export function findUnicornSwap2Targets(G:UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    let targets: {playerID: PlayerID}[] = [];

    G.players.forEach(p => {
        if (p.id === protagonist) {
            return;
        }
        targets.push({ playerID: p.id });
    });

    return targets;
}

/////////////////////////////////////////////////

type DoBlatantThievery1 = {
    key: "blatantThievery1"
}

function blatantThievery1(G: UnstableUnicornsGame, ctx:Ctx, param: {protagonist: PlayerID, handIndex: number, from: PlayerID}) {
    pull(G, ctx, {protagonist: param.protagonist, handIndex: param.handIndex, from: param.from})
}

/////////////////////////////////////////////////

/*
interface DoPeekAddReorder {
    key: "peek_add_reorder";
}
*/

/////////////////////////////////////////////////

interface DoMakeSomeoneDiscard {
    key: "makeSomeoneDiscard";
}

type ParamMakeSomeoneDiscard = {
    playerID: PlayerID;
    protagonist: PlayerID;
}

function makeSomeoneDiscard(G: UnstableUnicornsGame, ctx: Ctx, param: ParamMakeSomeoneDiscard) {
    G.script.scenes.push({
        id: _.uniqueId(),
        mandatory: true,
        actions: [{
            type: "action",
            instructions: [{
                id: _.uniqueId(),
                protagonist: param.playerID,
                state: "open",
                ui: {
                    type: "click_on_own_card_in_hand"
                },
                do: {
                    key: "discard",
                    info: { count: 1, type: "any" }
                }
            }]
        }],
        endTurnImmediately: false,
    });
}

type MakeSomeoneDiscardTarget = {
    playerID: PlayerID;
}

export function findMakeSomeoneDiscardTarget(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID): MakeSomeoneDiscardTarget[] {
    return G.players.filter(pl => pl.id !== protagonist && canDiscard(G, ctx, pl.id, { count: 1, type: "any" })).map(pl => ({ playerID: pl.id }));
}

function canMakeSomeoneDiscard(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    return findMakeSomeoneDiscardTarget(G, ctx, protagonist).length > 0;
}

/////////////////////////////////////////////////

/*
interface InterventionDestroyBySacrifice {
    key: "interveneDestroyBySacrifice";
    info: {
        cardToSave: CardID;
        paramDestroy: ParamDestroy;
    }
}

type ParamInterventionDestroyBySacrifice = {
    success: false;
    paramDestroy: ParamDestroy;
} | {
    success: true;
    paramSacrifice: ParamSacrifice;
}

function interveneDestroyBySacrifice(G: UnstableUnicornsGame, ctx: Ctx, param: ParamInterventionDestroyBySacrifice) {
    if (param.success) {
        sacrifice(G, ctx, param.paramSacrifice);
    } else {
        destroy(G, ctx, param.paramDestroy);
    }
}
*/

/////////////////////////////////////////////////

const KeyToFunc: { [key: string]: (G: UnstableUnicornsGame, ctx: Ctx, param: any) => void } = {
    steal, pull, pullRandom, discard, destroy, sacrifice, search, revive, draw, addFromDiscardPileToHand, reviveFromNursery, returnToHand, bringToStable, makeSomeoneDiscard, swapHands, shakeUp, move, move2, reset, shuffleDiscardPileIntoDrawPile, backKick, unicornSwap1, unicornSwap2, blatantThievery1,
}

/////////////////////////////////////////////////

//
// Helper
//

export const _findInstructionWithID = (G: UnstableUnicornsGame, instructionID: string): [Scene, Action, Instruction] | null => {
    let scene: Scene | null = null;
    let action: Action | null = null;
    let instruction: Instruction | null = null;

    G.script.scenes.forEach(sc => {
        sc.actions.forEach(ac => {
            ac.instructions.forEach(ins => {
                if (ins.id === instructionID) {
                    instruction = ins;
                    action = ac;
                    scene = sc;
                }
            });
        });
    });

    if (scene && action && instruction) {
        return [scene, action, instruction];
    }

    return null;
}

const _findInstructionInProgress = (G: UnstableUnicornsGame): [Scene, Action, Instruction] | null => {
    let scene: Scene | null = null;
    let action: Action | null = null;
    let instruction: Instruction | null = null;

    G.script.scenes.forEach(sc => {
        sc.actions.forEach(ac => {
            ac.instructions.forEach(ins => {
                if (ins.state === "in_progress") {
                    instruction = ins;
                    action = ac;
                    scene = sc;
                }
            });
        });
    });

    if (scene && action && instruction) {
        return [scene, action, instruction];
    }

    return null;
}


function findOwnerOfCard(G: UnstableUnicornsGame, cardID: CardID): PlayerID | null {
    let playerID: PlayerID | null = null;

    G.players.forEach(pl => {
        if ([...G.stable[pl.id],...G.upgradeDowngradeStable[pl.id]].findIndex(c => c === cardID) > -1) {
            playerID = pl.id;
        }
    });

    return playerID;
}