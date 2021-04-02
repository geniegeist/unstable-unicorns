import type { Game, Ctx } from 'boardgame.io';
import type { Player, PlayerID } from './player';
import type { CardID, Card, CardUI, OnEnterAddEffect } from './card';
import { canEnter, Do, enter, _findInstructionWithID } from './do';
import { initializeDeck } from './card';
import { CONSTANTS } from './constants';
import { executeDo } from './do';
import { Effect } from './effect';
import _ from 'underscore';
import type { NeighDiscussion } from './neigh';

export type { Ctx };

export interface UnstableUnicornsGame extends Game {
    players: Player[];
    deck: Card[];
    drawPile: CardID[];
    discardPile: CardID[];
    nursery: CardID[];
    hand: { [key: string]: CardID[] };
    stable: { [key: string]: CardID[] };
    temporaryStable: { [key: string]: CardID[] }; // may contain magic cards which are immediately put on the discard pile after their effect is used
    upgradeDowngradeStable: { [key: string]: CardID[] };
    script: Script;
    playerEffects: { [key: string]: { cardID?: CardID, effect: Effect }[] };
    mustEndTurnImmediately: boolean;
    countPlayedCardsInActionPhase: number;
    neighDiscussion?: NeighDiscussion;
    clipboard: {[key: string]: any};
    endGame: boolean;
    babyStarter: { cardID: CardID, owner: PlayerID }[];
    ready: { [key: string]: boolean };
}

interface Script {
    scenes: Scene[];
}

type SceneID = string;

export interface Scene {
    id: SceneID;
    actions: Action[];
    mandatory: boolean;
    endTurnImmediately: boolean;
}

export interface Action {
    type: "action";
    instructions: Instruction[];
}

export interface Instruction {
    id: string;
    protagonist: PlayerID;
    state: "executed" | "open" | "in_progress";
    do: Do;
    ui: {
        type: "single_action_popup",
        info?: { source: CardID, singleActionText?: string },
    } | {
        type: "card_to_card" | "card_to_handcard" | "card_to_player" | "click_on_own_card_in_stable" | "click_on_own_card_in_hand" | "yes_no_popup" | "click_on_card_in_stable" | "yes_no_popup" | "click_on_drawPile" | "custom",
        info?: { source: CardID },
    }
}






const UnstableUnicorns = {
    name: "unstable_unicorns",
    setup: (ctx: Ctx, setupData: any): UnstableUnicornsGame => {
        const players: Player[] = Array.from({ length: ctx.numPlayers }, (val, idx) => {
            return {
                id: `${idx}`,
                name: `Spieler ${idx}`,
            };
        });

        const deck = initializeDeck();
        const discardPile: CardID[] = [];
        let nursery: CardID[] = [];
        let drawPile = _.shuffle(deck).filter(c => c.type !== "baby").map(c => c.id);
        let hand: { [key: string]: CardID[] } = {};
        let stable: { [key: string]: CardID[] } = {};
        let temporaryStable: { [key: string]: CardID[] } = {};
        let upgradeDowngradeStable: { [key: string]: CardID[] } = {};
        let playerEffects: { [key: string]: { cardID: CardID, effect: Effect }[] } = {};
        let ready: {[key: string]: boolean} = {};

        players.forEach(pl => {
            ready[pl.id] = false;
            hand[pl.id] = _.first(drawPile, CONSTANTS.numberOfHandCardsAtStart);
            drawPile = _.rest(drawPile, CONSTANTS.numberOfHandCardsAtStart);
            stable[pl.id] = []; 
            temporaryStable[pl.id] = [];
            upgradeDowngradeStable[pl.id] = []; 
            playerEffects[pl.id] = [];
        });

        return {
            players,
            deck,
            drawPile,
            nursery,
            discardPile,
            hand,
            stable,
            temporaryStable,
            upgradeDowngradeStable,
            script: { scenes: [] },
            playerEffects,
            mustEndTurnImmediately: false,
            countPlayedCardsInActionPhase: 0,
            clipboard: {},
            endGame: false,
            babyStarter: [],
            ready
        };
    },
    phases: {
        pregame: {
            start: true,
            onBegin: (G: UnstableUnicornsGame, ctx: Ctx) => {
                ctx.events?.setActivePlayers!({all: "pregame"})
            }
        },
        main: {
            onBegin: (G: UnstableUnicornsGame, ctx: Ctx) => {

            }
        }
    },
    turn: {
        onBegin: (G: UnstableUnicornsGame, ctx: Ctx) => {
            if (ctx.phase === "pregame") {
                return;
            }

            // this is run whenever a new player starts its turn
            // perfect for placing players in a stage
            if (G.drawPile.length > 0) {
                G.script = { scenes: [] };
                G.countPlayedCardsInActionPhase = 0;
                G.mustEndTurnImmediately = false;

                // begin of turn: add scene
                [...G.stable[ctx.currentPlayer], ...G.upgradeDowngradeStable[ctx.currentPlayer]].forEach(c => _addSceneFromDo(G, ctx, c, ctx.currentPlayer, "begin_of_turn"));

                // begin of turn: add effect
                [...G.stable[ctx.currentPlayer], ...G.upgradeDowngradeStable[ctx.currentPlayer]].forEach(c => {
                    const card = G.deck[c];
                    const cardOnBegin = card.on?.filter(c => c.trigger === "begin_of_turn");
                    // all unicorns are basic
                    // trigger no effect
                    if (G.playerEffects[ctx.currentPlayer].find(s => s.effect.key === "my_unicorns_are_basic")) {
                        if (G.playerEffects[ctx.currentPlayer].find(s => s.effect.key === "pandamonium") === undefined) {
                            if (card.type === "narwhal" || card.type === "unicorn") {
                                return;
                            }
                        }
                    }

                    if (cardOnBegin) {
                        cardOnBegin.filter(on => on.do.type === "add_effect").forEach(on => {
                            const doAddEffect = <OnEnterAddEffect>on.do;
                            // check if effect has already been added
                            if (G.playerEffects[ctx.currentPlayer].filter(s => s.cardID === c).length === 0) {
                                G.playerEffects[ctx.currentPlayer] = [...G.playerEffects[ctx.currentPlayer], { cardID: c, effect: doAddEffect.info }];
                            }
                        });
                    }
                });


                ctx.events?.setActivePlayers!({ all: "beginning" });
            } else {
                // no cards to draw
                // need to end the game
                ctx.events?.setPhase!("end");
            }
        },
        stages: {
            pregame: {
                moves: { ready, selectBaby, changeName }
            },
            beginning: {
                moves: { drawAndAdvance, executeDo, end, commit, skipExecuteDo }
            },
            action_phase: {
                moves: {
                    commit, executeDo, end, drawAndEnd, playCard, playUpgradeDowngradeCard, playNeigh, playSuperNeigh, dontPlayNeigh, skipExecuteDo
                }
            }
        }
    }
}

function initializeGame(G: UnstableUnicornsGame, ctx: Ctx) {
    let a: number[] = [];
    for (let i=0; i<13; i++) {
        a.push(i);
    }

    G.babyStarter.forEach(({cardID, owner}) => {
        G.stable[owner].push(cardID);
        a = _.without(a, cardID);
    });

    a.forEach(cardId => {
        G.nursery.push(cardId);
    })
}

function changeName(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, name: string) {
    G.players[parseInt(protagonist)].name = name;
}

function ready(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    G.ready[protagonist] = true;

    if (_.every(_.values(G.ready), bo => bo)) {
        initializeGame(G, ctx);
        ctx.events?.setPhase!("main");
    }
}

function selectBaby(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, cardID: CardID) {
    G.babyStarter.push({
        cardID, owner: protagonist
    });
}

function drawAndAdvance(G: UnstableUnicornsGame, ctx: Ctx) {
    G.hand[ctx.currentPlayer].push(_.first(G.drawPile)!);
    G.drawPile = _.rest(G.drawPile, 1);
    ctx.events?.setActivePlayers!({ all: "action_phase" });

    G.script = { scenes: [] };
}

export function canPlayCard(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, cardID: CardID) {
    if (ctx.currentPlayer === protagonist && ctx.activePlayers![protagonist] === "action_phase" && (G.countPlayedCardsInActionPhase === 0 || (G.countPlayedCardsInActionPhase === 1 && G.playerEffects[protagonist].find(c => c.effect.key === "double_dutch")))) {
        return canEnter(G, ctx, { playerID: protagonist, cardID });
    }

    return false;
}

function playCard(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, cardID: CardID) {
    G.countPlayedCardsInActionPhase = G.countPlayedCardsInActionPhase + 1;
    G.hand[protagonist] = _.without(G.hand[protagonist], cardID);

    if (G.playerEffects[protagonist].findIndex(f => f.effect.key === "your_cards_cannot_be_neighed") > -1) {
        enter(G, ctx, { playerID: protagonist, cardID });
    } else {
        // resolve neigh
        G.neighDiscussion = {
            cardID, protagonist, rounds: [{
                state: "open",
                playerState: Object.fromEntries(G.players.map(pl => ([pl.id, { vote: pl.id === protagonist ? "no_neigh" : "undecided" }])))
            }],
            target: protagonist,
        };
    }
}

function playUpgradeDowngradeCard(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, targetPlayer: PlayerID, cardID: CardID) {
    G.countPlayedCardsInActionPhase = G.countPlayedCardsInActionPhase + 1;
    G.hand[protagonist] = _.without(G.hand[protagonist], cardID);

    if (G.playerEffects[protagonist].findIndex(f => f.effect.key === "your_cards_cannot_be_neighed") > -1) {
        enter(G, ctx, { playerID: targetPlayer, cardID });
    } else {
        // resolve neigh
        G.neighDiscussion = {
            cardID, protagonist, rounds: [{
                state: "open",
                playerState: Object.fromEntries(G.players.map(pl => ([pl.id, { vote: pl.id === protagonist ? "no_neigh" : "undecided" }]))),
            }],
            target: targetPlayer
        };
    }
}

function playNeigh(G: UnstableUnicornsGame, ctx: Ctx, cardID: CardID, protagonist: PlayerID, roundIndex: number) {
    if (G.neighDiscussion) {
        G.hand[protagonist] = _.without(G.hand[protagonist], cardID);
        G.discardPile = [...G.discardPile, cardID];

        const round = G.neighDiscussion.rounds[roundIndex];
        // check if there was already a neigh vote during this round
        // if yes do nothing
        if (round.state !== "open") {
            return;
        }
        // there was no neigh round yet
        // hence neigh the round and add a next round
        round.playerState[protagonist] = { vote: "neigh" };
        round.state = "neigh";
        G.neighDiscussion.rounds.push({
            state: "open",
            playerState: Object.fromEntries(G.players.map(pl => ([pl.id, { vote: pl.id === protagonist ? "no_neigh" : "undecided" }])))
        });
    }
}

function playSuperNeigh(G: UnstableUnicornsGame, ctx: Ctx, cardID: CardID, protagonist: PlayerID, roundIndex: number) {
    if (G.neighDiscussion) {
        G.hand[protagonist] = _.without(G.hand[protagonist], cardID);
        G.discardPile = [...G.discardPile, cardID];

        const round = G.neighDiscussion.rounds[roundIndex];
        // check if there was already a neigh vote during this round
        // if yes do nothing
        if (round.state !== "open") {
            return;
        }
        // there was no neigh round yet
        // hence neigh the round and add a next round
        round.playerState[protagonist] = { vote: "neigh" };
        round.state = "neigh";

        const cardWasNeighed = G.neighDiscussion.rounds.length % 2 === 0;
        if (cardWasNeighed) {
            G.discardPile.push(G.neighDiscussion.cardID);
        } else {
            enter(G, ctx, { playerID: G.neighDiscussion.protagonist, cardID: G.neighDiscussion.cardID })
        }
        G.neighDiscussion = undefined;
    }
}

function dontPlayNeigh(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, roundIndex: number) {
    // end
    if (G.neighDiscussion) {
        const round = G.neighDiscussion.rounds[roundIndex];
        round.playerState[protagonist] = { vote: "no_neigh" };

        if (_.findKey(round.playerState, val => val.vote === "undecided") === undefined) {
            // everyone has voted => advance the game
            const cardWasNeighed = G.neighDiscussion.rounds.length % 2 === 0;
            if (cardWasNeighed) {
                G.discardPile.push(G.neighDiscussion.cardID);
            } else {
                enter(G, ctx, { playerID: G.neighDiscussion.target, cardID: G.neighDiscussion.cardID })
            }
            G.neighDiscussion = undefined;
        }
    }
}

export function canDraw(G: UnstableUnicornsGame, ctx: Ctx) {
    if (G.mustEndTurnImmediately === true) {
        return false;
    }

    if (ctx.activePlayers![ctx.currentPlayer] === "beginning") {
        // if there is a mandatory scene => one cannot draw
        if (_findOpenScenesWithProtagonist(G, ctx.currentPlayer!).find(([instr, sc]) => sc.mandatory === true)) {
            return false;
        }

        // if there is an ongoing scene => one cannot draw
        if (_findInProgressScenesWithProtagonist(G, ctx.currentPlayer).length > 0) {
            return false;
        }

        return true;
    }

    if (ctx.activePlayers![ctx.currentPlayer] === "action_phase") {
        return G.countPlayedCardsInActionPhase === 0;
    }

    return false;
}

function drawAndEnd(G: UnstableUnicornsGame, ctx: Ctx) {
    G.script = { scenes: [] };
    G.hand[ctx.currentPlayer].push(_.first(G.drawPile)!);
    G.drawPile = _.rest(G.drawPile, 1);
    G.countPlayedCardsInActionPhase = G.countPlayedCardsInActionPhase + 1;
}

function end(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID) {
    if (G.playerEffects[protagonist].find(o => o.effect.key === "change_of_luck")) {
        G.playerEffects[protagonist] = G.playerEffects[protagonist].filter(o => o.effect.key !== "change_of_luck");

        if (G.hand[protagonist].length > 7) {
            const newScene: Scene = {
                id: _.uniqueId(),
                mandatory: true,
                endTurnImmediately: false,
                actions: [{
                    type: "action",
                    instructions: [{
                        id: _.uniqueId(),
                            protagonist,
                            state: "open",
                            do: {
                                key: "discard",
                                info: {count: G.hand[protagonist].length - 7, type: "any"}
                            },
                            ui: { type: "click_on_own_card_in_hand" }
                    }]
                }]
            };

            G.script.scenes = [...G.script.scenes, newScene];
        } else {
            ctx.events?.endTurn!({next: protagonist});
        }

    } else {
        if (G.hand[protagonist].length > 7) {
            const newScene: Scene = {
                id: _.uniqueId(),
                mandatory: true,
                endTurnImmediately: false,
                actions: [{
                    type: "action",
                    instructions: [{
                        id: _.uniqueId(),
                            protagonist,
                            state: "open",
                            do: {
                                key: "discard",
                                info: {count: G.hand[protagonist].length - 7, type: "any"}
                            },
                            ui: { type: "click_on_own_card_in_hand" }
                    }]
                }]
            };

            G.script.scenes = [...G.script.scenes, newScene];
        } else {
            ctx.events?.endTurn!({next: protagonist});
        }

    }
}

function commit(G: UnstableUnicornsGame, ctx: Ctx, sceneID: string) {
    G.script.scenes.find(sc => sc.id === sceneID)!.mandatory = true;
}

function skipExecuteDo(G: UnstableUnicornsGame, ctx: Ctx, protagonist: PlayerID, instructionID: string) {
    if (_findInstructionWithID(G, instructionID) !== null) {
        const [scene, action, instruction] = _findInstructionWithID(G, instructionID)!;
        console.log("cc")
        action.instructions.filter((ins) => ins.protagonist === protagonist).forEach((ins) => ins.state = "executed");
    }
}

export default UnstableUnicorns;


// Helper


export function _addSceneFromDo(G: UnstableUnicornsGame, ctx: Ctx, cardID: CardID, owner: PlayerID, trigger: "enter" | "begin_of_turn" | "any") {
    const card = G.deck[cardID];

    if (!card.on) {
        return;
    }

    // all unicorns are basic
    // trigger no effect
    if (G.playerEffects[owner].find(s => s.effect.key === "my_unicorns_are_basic")) {
        if (G.playerEffects[owner].find(s => s.effect.key === "pandamonium") === undefined) {
            if (card.type === "narwhal" || card.type === "unicorn") {
                return;
            }
        }
    }

    card.on.forEach(on => {
        if (on.do.type === "add_scene" && (on.trigger === trigger || trigger === "any")) {
            const newScene: Scene = {
                id: _.uniqueId(),
                mandatory: on.do.info.mandatory,
                endTurnImmediately: on.do.info.endTurnImmediately,
                actions: on.do.info.actions.map(ac => {
                    let instructions: Instruction[] = [];
                    ac.instructions.forEach(c => {
                        let protagonists: PlayerID[] = [];
                        if (c.protagonist === "owner") {
                            protagonists.push(owner);
                        } else if (c.protagonist === "all") {
                            protagonists = G.players.map(pl => pl.id);
                        }

                        protagonists.forEach(pid => {
                            instructions.push({
                                id: _.uniqueId(),
                                protagonist: pid,
                                state: "open",
                                do: c.do,
                                ui: { ...c.ui, info: { source: card.id, ...c.ui.info } },
                            });
                        });
                    });

                    const action: Action = {
                        type: "action",
                        instructions: instructions
                    };

                    return action;
                })
            };

            G.script.scenes = [...G.script.scenes, newScene];
        }
    });
}


// find all scenes that have already started and are not finished
// or all scenes that have not started yet
export function _findOpenScenesWithProtagonist(G: UnstableUnicornsGame, protagonist: PlayerID): Array<[Instruction, Scene]> {
    let scenes: Array<[Instruction, Scene]> = [];
    let stop = false;

    G.script.scenes.forEach(scene => {
        scene.actions.forEach(action => {
            if (stop) {
                return;
            }

            // find most recent action
            if (action.instructions.filter(ins => ins.state === "open" || ins.state === "in_progress").length > 0) {
                stop = true;
                const inst = action.instructions.filter(ins => ins.protagonist === protagonist && (ins.state === "open" || ins.state === "in_progress"));
                inst.forEach(i => scenes.push([i, scene]))
            }
        });
        stop = false;
    });

    return scenes;
}

// a scene is in progress if its first action is finished
export function _findInProgressScenesWithProtagonist(G: UnstableUnicornsGame, protagonist: PlayerID): Array<[Instruction, Scene]> {
    let scenes: Array<[Instruction, Scene]> = [];
    let stop = false;

    G.script.scenes.forEach(scene => {
        if (scene.mandatory) {
            const action = _.first(scene.actions)!;
            if (action.instructions.filter(ins => ins.state === "open" || ins.state === "in_progress").length > 0) {
                stop = true;
                const inst = action.instructions.filter(ins => ins.protagonist === protagonist && (ins.state === "open" || ins.state === "in_progress"));
                inst.forEach(i => scenes.push([i, scene]))
            }
        }

        scene.actions.forEach((action, idx) => {
            if (stop || idx === 0) {
                return;
            }

            // find most recent open action excluding the first action
            if (action.instructions.filter(ins => ins.state === "open" || ins.state === "in_progress").length > 0) {
                // check if the prior action was completed
                if (scene.actions[idx - 1].instructions.filter(ins => ins.state === "executed").length === scene.actions[idx - 1].instructions.length) {
                    stop = true;
                    const inst = action.instructions.filter(ins => ins.protagonist === protagonist && (ins.state === "open" || ins.state === "in_progress"));
                    inst.forEach(i => scenes.push([i, scene]))
                }
            }
        });
        stop = false;
    });

    return scenes;
}

export function _findInstruction(G: UnstableUnicornsGame, instructionID: string): [Instruction, Action, Scene] | undefined {
    let instruction, action, scene = undefined;

    G.script.scenes.forEach(sc => {
        sc.actions.forEach(ac => {
            ac.instructions.forEach(ic => {
                if (ic.id === instructionID) {
                    instruction = ic;
                    action = ac;
                    scene = sc;
                }
            })
        })
    });

    if (instruction === undefined || action === undefined || scene === undefined) {
        return undefined;
    }

    return [instruction, action, scene];
}