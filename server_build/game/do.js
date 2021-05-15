"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports._findInstructionWithID = exports.findMakeSomeoneDiscardTarget = exports.findUnicornSwap2Targets = exports.findUnicornSwap1Targets = exports.findBackKickTargets = exports.findMoveTargets2 = exports.findMoveTargets = exports.findSwapHandsTargets = exports.canBringToStableTargets = exports.findBringToStableTargets = exports.findReturnToHandTargets = exports.findAddFromDiscardPileToHand = exports.findReviveTarget = exports.findSearchTargets = exports.findSacrificeTargets = exports.findDestroyTargets = exports.destroy = exports.findDiscardTargets = exports.canDiscard = exports.discard = exports.pull = exports.findPullRandomTargets = exports.findStealTargets = exports.executeDo = exports.canEnter = exports.enter = void 0;
var card_1 = require("./card");
var game_1 = require("./game");
var underscore_1 = require("underscore");
var constants_1 = require("./constants");
function leave(G, ctx, param) {
    G.stable[param.playerID] = underscore_1["default"].without(G.stable[param.playerID], param.cardID);
    G.upgradeDowngradeStable[param.playerID] = underscore_1["default"].without(G.upgradeDowngradeStable[param.playerID], param.cardID);
    // remove player effect
    G.playerEffects[param.playerID] = underscore_1["default"].filter(G.playerEffects[param.playerID], function (eff) { return eff.cardID !== param.cardID; });
    // when another unicorn enters your stable
    // inject action after the current action
    var on = __spreadArrays(G.stable[param.playerID], G.upgradeDowngradeStable[param.playerID]).map(function (c) { return G.deck[c]; }).filter(function (s) { return s.on && s.on.filter(function (o) { return o.trigger === "unicorn_leaves_your_stable"; }).length > 0; });
    on.forEach(function (card) {
        var _a;
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "my_unicorns_are_basic"; })) {
            if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }
        var on = (_a = card.on) === null || _a === void 0 ? void 0 : _a.find(function (o) { return o.trigger === "unicorn_leaves_your_stable"; });
        if (on["do"].type === "inject_action") {
            var newAction = {
                type: "action",
                instructions: [{
                        id: underscore_1["default"].uniqueId(),
                        protagonist: param.playerID,
                        state: "open",
                        "do": on["do"].info.instruction["do"],
                        ui: __assign(__assign({}, on["do"].info.instruction.ui), { info: __assign({ source: card.id }, on["do"].info.instruction.ui.info) })
                    }]
            };
            if (_findInstructionInProgress(G) === null) {
                // no active scene
                // thus create a mandatory scene
                var newScene = {
                    id: underscore_1["default"].uniqueId(),
                    mandatory: true,
                    endTurnImmediately: false,
                    actions: [newAction]
                };
                G.script.scenes = __spreadArrays(G.script.scenes, [newScene]);
            }
            else {
                // found active scene
                var _b = _findInstructionInProgress(G), scene = _b[0], action = _b[1], instruction_1 = _b[2];
                var index = scene.actions.findIndex(function (ac) { return ac.instructions.find(function (ins) { return ins.id === instruction_1.id; }); });
                scene.actions.splice(index, 0, newAction);
            }
        }
    });
}
function enter(G, ctx, param) {
    var _a;
    var card = G.deck[param.cardID];
    if (card.type === "upgrade" || card.type === "downgrade") {
        G.upgradeDowngradeStable[param.playerID] = __spreadArrays(G.upgradeDowngradeStable[param.playerID], [param.cardID]);
    }
    else if (card.type === "magic") {
        G.temporaryStable[param.playerID] = [param.cardID];
    }
    else {
        G.stable[param.playerID] = __spreadArrays(G.stable[param.playerID], [param.cardID]);
    }
    var cardOnEnter = (_a = card.on) === null || _a === void 0 ? void 0 : _a.filter(function (c) { return c.trigger === "enter"; });
    if (cardOnEnter) {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "my_unicorns_are_basic"; })) {
            if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }
        game_1._addSceneFromDo(G, ctx, param.cardID, param.playerID, "enter");
        cardOnEnter.filter(function (on) { return on["do"].type === "auto"; }).forEach(function (on) {
            if (on["do"].type === "auto" && on["do"].info.key === "sacrifice_all_downgrades") {
                var toBeRemoved = underscore_1["default"].filter(G.upgradeDowngradeStable[param.playerID], function (c) {
                    var card = G.deck[c];
                    return card.type === "downgrade";
                });
                G.upgradeDowngradeStable[param.playerID] = underscore_1["default"].difference(G.upgradeDowngradeStable[param.playerID], toBeRemoved);
                G.discardPile = __spreadArrays(G.discardPile, toBeRemoved);
            }
        });
        cardOnEnter.filter(function (on) { return on["do"].type === "add_effect"; }).forEach(function (on) {
            var doAddEffect = on["do"];
            // check if effect has already been added
            if (G.playerEffects[param.playerID].filter(function (o) { return o.cardID === param.cardID && o.effect.key === doAddEffect.info.key; }).length === 0) {
                G.playerEffects[param.playerID] = __spreadArrays(G.playerEffects[param.playerID], [{ cardID: param.cardID, effect: doAddEffect.info }]);
            }
        });
    }
    // tiny stable
    if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "tiny_stable"; })) {
        // pandamonium is not active
        if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
            if ((G.playerEffects[param.playerID].find(function (p) { return p.effect.key === "count_as_two"; }) && G.stable[param.playerID].length > 4) || G.stable[param.playerID].length > 5) {
                var newAction = {
                    type: "action",
                    instructions: [{
                            id: underscore_1["default"].uniqueId(),
                            protagonist: param.playerID,
                            state: "open",
                            "do": {
                                key: "sacrifice",
                                info: { type: "unicorn" }
                            },
                            ui: { type: "click_on_card_in_stable" }
                        }]
                };
                if (_findInstructionInProgress(G) === null) {
                    // no active scene
                    // thus create a mandatory scene
                    var newScene = {
                        id: underscore_1["default"].uniqueId(),
                        mandatory: true,
                        endTurnImmediately: false,
                        actions: [newAction]
                    };
                    G.script.scenes = __spreadArrays(G.script.scenes, [newScene]);
                }
                else {
                    // found active scene
                    var _b = _findInstructionInProgress(G), scene = _b[0], action = _b[1], instruction_2 = _b[2];
                    var index = scene.actions.findIndex(function (ac) { return ac.instructions.find(function (ins) { return ins.id === instruction_2.id; }); });
                    scene.actions.splice(index, 0, newAction);
                }
            }
        }
    }
    // when another unicorn enters your stable
    // inject action after the current action
    var on = __spreadArrays(G.stable[param.playerID], G.upgradeDowngradeStable[param.playerID]).map(function (c) { return G.deck[c]; }).filter(function (s) { return s.on && s.on.filter(function (o) { return o.trigger === "unicorn_enters_your_stable"; }).length > 0; });
    on.forEach(function (card) {
        var _a;
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "my_unicorns_are_basic"; })) {
            if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }
        var on = (_a = card.on) === null || _a === void 0 ? void 0 : _a.find(function (o) { return o.trigger === "unicorn_enters_your_stable"; });
        if (on["do"].type === "inject_action") {
            var newAction = {
                type: "action",
                instructions: [{
                        id: underscore_1["default"].uniqueId(),
                        protagonist: param.playerID,
                        state: "open",
                        "do": on["do"].info.instruction["do"],
                        ui: __assign(__assign({}, on["do"].info.instruction.ui), { info: __assign({ source: card.id }, on["do"].info.instruction.ui.info) })
                    }]
            };
            if (_findInstructionInProgress(G) === null) {
                // no active scene
                // thus create a mandatory scene
                var newScene = {
                    id: underscore_1["default"].uniqueId(),
                    mandatory: true,
                    endTurnImmediately: false,
                    actions: [newAction]
                };
                G.script.scenes = __spreadArrays(G.script.scenes, [newScene]);
            }
            else {
                // found active scene
                var _b = _findInstructionInProgress(G), scene = _b[0], action = _b[1], instruction_3 = _b[2];
                var index = scene.actions.findIndex(function (ac) { return ac.instructions.find(function (ins) { return ins.id === instruction_3.id; }); });
                scene.actions.splice(index, 0, newAction);
            }
        }
    });
}
exports.enter = enter;
function canEnter(G, ctx, param) {
    if (G.deck[param.cardID].type === "neigh" || G.deck[param.cardID].type === "super_neigh") {
        return false;
    }
    if (G.stable[param.playerID].length === constants_1.CONSTANTS.stableSeats) {
        return false;
    }
    var card = G.deck[param.cardID];
    if (G.playerEffects[param.playerID].find(function (s) { return s.effect.key === "you_cannot_play_upgrades"; })) {
        if (card.type === "upgrade") {
            return false;
        }
    }
    if (card.type === "basic") {
        var basic_unicorns_cannot_enter_isActive_1 = false;
        underscore_1["default"].keys(G.playerEffects).forEach(function (key) {
            var effect = G.playerEffects[key].find(function (eff) { return eff.effect.key === "basic_unicorns_can_only_join_your_stable"; });
            if (effect && key !== param.playerID) {
                basic_unicorns_cannot_enter_isActive_1 = true;
            }
        });
        return !basic_unicorns_cannot_enter_isActive_1;
    }
    return true;
}
exports.canEnter = canEnter;
function executeDo(G, ctx, instructionID, param) {
    var _a;
    var _b = exports._findInstructionWithID(G, instructionID), scene = _b[0], action = _b[1], instruction = _b[2];
    if (scene.endTurnImmediately) {
        G.mustEndTurnImmediately = true;
    }
    instruction.state = "in_progress";
    // ui sound
    G.uiExecuteDo = { id: underscore_1["default"].uniqueId(), cardID: (_a = instruction.ui.info) === null || _a === void 0 ? void 0 : _a.source, "do": instruction["do"] };
    // execute instruction
    if (instruction["do"].key === "destroy") {
        // intervention
        var paramDestroy = param;
        var targetPlayer = findOwnerOfCard(G, paramDestroy.cardID);
        // check if it contains the save_mate_by_sacrifice effect
        if (G.playerEffects[targetPlayer].find(function (eff) { return eff.effect.key === "save_mate_by_sacrifice"; })) {
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
        }
        else {
            KeyToFunc[instruction["do"].key](G, ctx, param);
        }
        if (instruction["do"].info.count !== undefined) {
            if (instruction["do"].info.count === 1) {
                action.instructions.filter(function (ins) { return ins.protagonist === param.protagonist; }).forEach(function (ins) { return ins.state = "executed"; });
            }
            instruction["do"].info.count = instruction["do"].info.count - 1;
        }
        else {
            action.instructions.filter(function (ins) { return ins.protagonist === param.protagonist; }).forEach(function (ins) { return ins.state = "executed"; });
        }
    }
    else if (instruction["do"].key === "discard") {
        discard(G, ctx, param);
        if (instruction["do"].info.count === 1) {
            action.instructions.filter(function (ins) { return ins.protagonist === param.protagonist; }).forEach(function (ins) { return ins.state = "executed"; });
            if (instruction["do"].info.changeOfLuck === true) {
                G.playerEffects[param.protagonist] = __spreadArrays(G.playerEffects[param.protagonist], [{ effect: { key: "change_of_luck" } }]);
            }
        }
        instruction["do"].info.count = instruction["do"].info.count - 1;
    }
    else {
        KeyToFunc[instruction["do"].key](G, ctx, param);
        action.instructions.filter(function (ins) { return ins.protagonist === param.protagonist; }).forEach(function (ins) { return ins.state = "executed"; });
    }
    var actionIndex = scene.actions.findIndex(function (ac) { return ac.instructions.find(function (ins) { return ins.id === instructionID; }); });
    if (actionIndex === scene.actions.length - 1) {
        // all instructions were executed
        if (action.instructions.filter(function (ins) { return ins.state === "executed"; }).length === action.instructions.length) {
            // handle magic cards
            // if it is the last action of a magic card and it is executed
            // remove from temporary stable and move it to discard pile
            var tempCard = underscore_1["default"].first(G.temporaryStable[param.protagonist]);
            G.temporaryStable[param.protagonist] = [];
            if (tempCard) {
                if (instruction["do"].key === "shakeUp") {
                    // do nothing
                    // shake up card is not placed in the discard pile
                }
                else {
                    G.discardPile = __spreadArrays(G.discardPile, [tempCard]);
                }
            }
        }
    }
}
exports.executeDo = executeDo;
function steal(G, ctx, param) {
    leave(G, ctx, { playerID: findOwnerOfCard(G, param.cardID), cardID: param.cardID });
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
}
function findStealTargets(G, ctx, protagonist, info) {
    var targets = [];
    switch (info.type) {
        case "unicorn": {
            G.players.forEach(function (pl) {
                if (pl.id === protagonist) {
                    return;
                }
                ;
                G.stable[pl.id].forEach(function (c) {
                    var _a;
                    if (info.unicornSwap === true) {
                        if (pl.id !== ((_a = G.clipboard.unicornSwap) === null || _a === void 0 ? void 0 : _a.targetPlayer)) {
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
            G.players.forEach(function (pl) {
                if (pl.id === protagonist) {
                    return;
                }
                ;
                G.upgradeDowngradeStable[pl.id].forEach(function (c) {
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
exports.findStealTargets = findStealTargets;
function canSteal(G, ctx, protagonist, info) {
    if (info.type === "unicorn") {
        if (G.stable[protagonist].length === constants_1.CONSTANTS.stableSeats) {
            return false;
        }
    }
    return findStealTargets(G, ctx, protagonist, info).length > 0;
}
function pullRandom(G, ctx, param) {
    pull(G, ctx, {
        protagonist: param.protagonist,
        from: param.playerID,
        handIndex: underscore_1["default"].random(0, G.hand[param.playerID].length - 1)
    });
}
function findPullRandomTargets(G, ctx, protagonist) {
    return findPullTargets(G, ctx, protagonist);
}
exports.findPullRandomTargets = findPullRandomTargets;
function pull(G, ctx, param) {
    var cardToPull = G.hand[param.from][param.handIndex];
    G.hand[param.from] = underscore_1["default"].without(G.hand[param.from], cardToPull);
    G.hand[param.protagonist] = __spreadArrays(G.hand[param.protagonist], [cardToPull]);
}
exports.pull = pull;
function canPull(G, ctx, protagonist) {
    return findPullTargets(G, ctx, protagonist).length > 0;
}
function findPullTargets(G, ctx, protagonist) {
    var targets = [];
    G.players.forEach(function (pl) {
        if (G.hand[pl.id].length > 0 && pl.id !== protagonist) {
            targets.push({ playerID: pl.id });
        }
    });
    return targets;
}
function discard(G, ctx, param) {
    G.hand[param.protagonist] = underscore_1["default"].without(G.hand[param.protagonist], param.cardID);
    G.discardPile = __spreadArrays(G.discardPile, [param.cardID]);
}
exports.discard = discard;
function canDiscard(G, ctx, protagonist, info) {
    return findDiscardTargets(G, ctx, protagonist, info).length >= info.count;
}
exports.canDiscard = canDiscard;
function findDiscardTargets(G, ctx, protagonist, info) {
    var targets = [];
    G.hand[protagonist].forEach(function (cid, index) {
        if (info.type === "any") {
            targets.push({ handIndex: index });
        }
        else if (info.type === "unicorn") {
            var card = G.deck[cid];
            if (card_1.isUnicorn(card)) {
                targets.push({ handIndex: index });
            }
        }
    });
    return targets;
}
exports.findDiscardTargets = findDiscardTargets;
function destroy(G, ctx, param) {
    var _a;
    var card = G.deck[param.cardID];
    var targetPlayer = findOwnerOfCard(G, param.cardID);
    leave(G, ctx, { playerID: targetPlayer, cardID: param.cardID });
    if (card.type === "baby") {
        G.nursery.push(param.cardID);
    }
    else {
        G.discardPile.push(param.cardID);
    }
    var ons = (_a = card.on) === null || _a === void 0 ? void 0 : _a.filter(function (on) { return on.trigger === "this_destroyed_or_sacrificed"; });
    ons === null || ons === void 0 ? void 0 : ons.forEach(function (on) {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[targetPlayer].find(function (s) { return s.effect.key === "my_unicorns_are_basic"; })) {
            if (G.playerEffects[targetPlayer].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }
        if (on["do"].type === "return_to_hand") {
            G.discardPile = underscore_1["default"].without(G.discardPile, param.cardID);
            G.hand[targetPlayer] = __spreadArrays(G.hand[targetPlayer], [param.cardID]);
        }
        else if (on["do"].type === "add_scene") {
            game_1._addSceneFromDo(G, ctx, card.id, targetPlayer, "any");
        }
    });
}
exports.destroy = destroy;
// source: card which caused the destroy action
function canDestroy(G, ctx, protagonist, info, source) {
    return findDestroyTargets(G, ctx, protagonist, info, source).length > 0;
}
function findDestroyTargets(G, ctx, protagonist, info, sourceCard) {
    var targets = [];
    G.players.forEach(function (pl) {
        // special case
        // this is actually a combination of sacrifice and destroy
        if (info.type === "my_downgrade_other_upgrade") {
            G.upgradeDowngradeStable[pl.id].forEach(function (cid) {
                var card = G.deck[cid];
                if (pl.id === protagonist && card.type === "downgrade") {
                    targets.push({ playerID: pl.id, cardID: cid });
                }
                else if (pl.id !== protagonist && card.type === "upgrade") {
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
        }
        if (pl.id === protagonist) {
            return;
        }
        if (info.type === "unicorn") {
            G.stable[pl.id].forEach(function (cid) {
                var _a;
                var card = G.deck[cid];
                if (card_1.isUnicorn(card)) {
                    if (sourceCard && G.deck[sourceCard].type === "magic" && ((_a = card.passive) === null || _a === void 0 ? void 0 : _a.includes("cannot_be_destroyed_by_magic"))) {
                        return;
                    }
                    if (G.playerEffects[pl.id].find(function (s) { return s.effect.key === "your_unicorns_cannot_be_destroyed"; })) {
                        return;
                    }
                    if (G.playerEffects[pl.id].find(function (s) { return s.effect.key === "pandamonium"; })) {
                        return;
                    }
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
        }
        else if (info.type === "upgrade") {
            G.upgradeDowngradeStable[pl.id].forEach(function (cid) {
                var card = G.deck[cid];
                if (card.type === "upgrade") {
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
        }
        else if (info.type === "any") {
            G.stable[pl.id].forEach(function (cid) {
                var _a;
                var card = G.deck[cid];
                if (card_1.isUnicorn(card)) {
                    if (sourceCard && G.deck[sourceCard].type === "magic" && ((_a = card.passive) === null || _a === void 0 ? void 0 : _a.includes("cannot_be_destroyed_by_magic"))) {
                        return;
                    }
                    if (G.playerEffects[pl.id].find(function (s) { return s.effect.key === "your_unicorns_cannot_be_destroyed"; })) {
                        return;
                    }
                    targets.push({ playerID: pl.id, cardID: cid });
                }
            });
            G.upgradeDowngradeStable[pl.id].forEach(function (cid) {
                targets.push({ playerID: pl.id, cardID: cid });
            });
        }
    });
    return targets;
}
exports.findDestroyTargets = findDestroyTargets;
function sacrifice(G, ctx, param) {
    var _a;
    var card = G.deck[param.cardID];
    leave(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
    if (card.type === "baby") {
        G.nursery.push(param.cardID);
    }
    else {
        G.discardPile.push(param.cardID);
    }
    var ons = (_a = card.on) === null || _a === void 0 ? void 0 : _a.filter(function (on) { return on.trigger === "this_destroyed_or_sacrificed"; });
    ons === null || ons === void 0 ? void 0 : ons.forEach(function (on) {
        // all unicorns are basic
        // trigger no effect
        if (G.playerEffects[param.protagonist].find(function (s) { return s.effect.key === "my_unicorns_are_basic"; })) {
            if (G.playerEffects[param.protagonist].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
                if (card.type === "narwhal" || card.type === "unicorn") {
                    return;
                }
            }
        }
        if (on["do"].type === "return_to_hand") {
            G.discardPile = underscore_1["default"].without(G.discardPile, param.cardID);
            G.hand[param.protagonist] = __spreadArrays(G.hand[param.protagonist], [param.cardID]);
        }
        else if (on["do"].type === "add_scene") {
            game_1._addSceneFromDo(G, ctx, card.id, param.protagonist, "any");
        }
    });
}
function canSacrifice(G, ctx, protagonist, info, source) {
    return findSacrificeTargets(G, ctx, protagonist, info).length > 0;
}
function findSacrificeTargets(G, ctx, protagonist, info) {
    var targets = [];
    if (info.type === "downgrade") {
        G.upgradeDowngradeStable[protagonist].forEach(function (c) {
            var card = G.deck[c];
            if (card.type === "downgrade") {
                targets.push({ cardID: c });
            }
        });
    }
    if (info.type === "unicorn") {
        G.stable[protagonist].forEach(function (c) {
            var card = G.deck[c];
            if (card_1.isUnicorn(card)) {
                if (G.playerEffects[protagonist].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
                    targets.push({ cardID: c });
                }
            }
        });
    }
    if (info.type === "any") {
        targets = G.stable[protagonist].map(function (c) { return ({ cardID: c }); });
    }
    return targets;
}
exports.findSacrificeTargets = findSacrificeTargets;
function search(G, ctx, param) {
    G.drawPile = underscore_1["default"].shuffle(underscore_1["default"].without(G.drawPile, param.cardID));
    G.hand[param.protagonist] = __spreadArrays(G.hand[param.protagonist], [param.cardID]);
}
function canSearch(G, ctx, protagonist, info) {
    return findSearchTargets(G, ctx, protagonist, info).length > 0;
}
function findSearchTargets(G, ctx, protagonist, info) {
    var targets = [];
    if (info.type === "any") {
        targets = G.drawPile.map(function (c) { return ({ cardID: c }); });
    }
    if (info.type === "downgrade") {
        targets = G.drawPile.map(function (c) { return G.deck[c]; }).filter(function (c) { return c.type === "downgrade"; }).map(function (c) { return ({ cardID: c.id }); });
    }
    if (info.type === "narwhal") {
        targets = G.drawPile.map(function (c) { return G.deck[c]; }).filter(function (c) { return c.type === "narwhal"; }).map(function (c) { return ({ cardID: c.id }); });
    }
    if (info.type === "unicorn") {
        targets = G.drawPile.map(function (c) { return G.deck[c]; }).filter(function (c) { return card_1.isUnicorn(c); }).map(function (c) { return ({ cardID: c.id }); });
    }
    if (info.type === "upgrade") {
        targets = G.drawPile.map(function (c) { return G.deck[c]; }).filter(function (c) { return c.type === "upgrade"; }).map(function (c) { return ({ cardID: c.id }); });
    }
    return targets;
}
exports.findSearchTargets = findSearchTargets;
function revive(G, ctx, param) {
    G.discardPile = underscore_1["default"].without(G.discardPile, param.cardID);
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
}
function canRevive(G, ctx, protagonist, info) {
    return findReviveTarget(G, ctx, protagonist, info).length > 0;
}
function findReviveTarget(G, ctx, protagonist, info) {
    var targets = [];
    if (info.type === "unicorn") {
        targets = G.discardPile.filter(function (c) {
            var card = G.deck[c];
            return card_1.isUnicorn(card) && canEnter(G, ctx, { playerID: protagonist, cardID: c });
        }).map(function (c) { return ({ cardID: c }); });
    }
    if (info.type === "basic_unicorn") {
        targets = G.discardPile.filter(function (c) {
            var card = G.deck[c];
            return canEnter(G, ctx, { playerID: protagonist, cardID: c }) && card.type === "basic";
        }).map(function (c) { return ({ cardID: c }); });
    }
    return targets;
}
exports.findReviveTarget = findReviveTarget;
function draw(G, ctx, param) {
    var toDraw = underscore_1["default"].first(G.drawPile, param.count);
    G.drawPile = underscore_1["default"].rest(G.drawPile, param.count);
    G.hand[param.protagonist] = __spreadArrays(G.hand[param.protagonist], toDraw);
}
function canDraw(G, ctx, param) {
    return G.drawPile.length >= param.count;
}
function addFromDiscardPileToHand(G, ctx, param) {
    G.discardPile = underscore_1["default"].without(G.discardPile, param.cardID);
    G.hand[param.protagonist].push(param.cardID);
}
function canAddFromDiscardPileToHand(G, ctx, protagonist, info) {
    return findAddFromDiscardPileToHand(G, ctx, protagonist, info).length > 0;
}
function findAddFromDiscardPileToHand(G, ctx, protagonist, info) {
    var targets = [];
    if (info.type === "magic" || info.type === "neigh") {
        targets = G.discardPile.map(function (c) { return G.deck[c]; }).filter(function (c) { return c.type === info.type; }).map(function (c) { return ({ cardID: c.id }); });
    }
    if (info.type === "unicorn") {
        targets = G.discardPile.map(function (c) { return G.deck[c]; }).filter(function (c) { return card_1.isUnicorn(c); }).map(function (c) { return ({ cardID: c.id }); });
    }
    return targets;
}
exports.findAddFromDiscardPileToHand = findAddFromDiscardPileToHand;
function reviveFromNursery(G, ctx, param) {
    G.nursery = underscore_1["default"].without(G.nursery, param.cardID);
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
}
function canReviveFromNursery(G, ctx, protagonist) {
    return G.stable[protagonist].length < constants_1.CONSTANTS.stableSeats;
}
function returnToHand(G, ctx, param) {
    var card = G.deck[param.cardID];
    var playerID = findOwnerOfCard(G, param.cardID);
    leave(G, ctx, { playerID: playerID, cardID: param.cardID });
    if (card.type === "baby") {
        G.nursery.push(param.cardID);
    }
    else {
        G.hand[playerID].push(param.cardID);
    }
}
function findReturnToHandTargets(G, ctx, protagonist, info) {
    var targets = [];
    if (info.who === "another") {
        G.players.filter(function (pl) { return pl.id !== protagonist; }).forEach(function (pl) {
            targets = __spreadArrays(targets, G.stable[pl.id].map(function (c) { return ({ playerID: pl.id, cardID: c }); }));
            targets = __spreadArrays(targets, G.upgradeDowngradeStable[pl.id].map(function (c) { return ({ playerID: pl.id, cardID: c }); }));
        });
    }
    return targets;
}
exports.findReturnToHandTargets = findReturnToHandTargets;
function canReturnToHand(G, ctx, protagonist, info) {
    return findReturnToHandTargets(G, ctx, protagonist, info).length > 0;
}
function bringToStable(G, ctx, param) {
    enter(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
    G.hand[param.protagonist] = underscore_1["default"].without(G.hand[param.protagonist], param.cardID);
}
function findBringToStableTargets(G, ctx, protagonist, info) {
    var targets = [];
    if (info.type === "basic_unicorn") {
        targets = G.hand[protagonist].map(function (c) { return G.deck[c]; }).filter(function (c) { return c.type === "basic" && canEnter(G, ctx, { cardID: c.id, playerID: protagonist }); }).map(function (c) { return ({ cardID: c.id }); });
    }
    return targets;
}
exports.findBringToStableTargets = findBringToStableTargets;
function canBringToStableTargets(G, ctx, protagonist, info) {
    return findBringToStableTargets(G, ctx, protagonist, info).length > 0;
}
exports.canBringToStableTargets = canBringToStableTargets;
function swapHands(G, ctx, param) {
    var myHand = G.hand[param.protagonist];
    G.hand[param.protagonist] = G.hand[param.playerID];
    G.hand[param.playerID] = myHand;
}
function findSwapHandsTargets(G, ctx, protagonist) {
    var targets = [];
    targets = G.players.map(function (pl) { return pl.id; }).filter(function (plid) { return plid !== protagonist; }).map(function (d) { return ({ playerID: d }); });
    return targets;
}
exports.findSwapHandsTargets = findSwapHandsTargets;
function shakeUp(G, ctx, param) {
    G.drawPile = underscore_1["default"].shuffle(__spreadArrays(G.drawPile, [param.sourceCardID], G.hand[param.protagonist], G.discardPile));
    G.discardPile = [];
    G.hand[param.protagonist] = underscore_1["default"].first(G.drawPile, 5);
    G.drawPile = underscore_1["default"].rest(G.drawPile, 5);
}
function reset(G, ctx, param) {
    G.players.forEach(function (pl) {
        G.upgradeDowngradeStable[pl.id].forEach(function (cardID) {
            sacrifice(G, ctx, { protagonist: pl.id, cardID: cardID });
        });
    });
    G.drawPile = underscore_1["default"].shuffle(__spreadArrays(G.drawPile, G.discardPile));
}
function move(G, ctx, param) {
    var from = findOwnerOfCard(G, param.cardID);
    leave(G, ctx, { playerID: from, cardID: param.cardID });
    G.clipboard["move"] = { cardID: param.cardID, from: from };
}
function findMoveTargets(G, ctx, protagonist, info) {
    var targets = [];
    G.players.forEach(function (pl) {
        targets = __spreadArrays(targets, G.upgradeDowngradeStable[pl.id].map(function (c) { return ({ cardID: c, playerID: pl.id }); }));
    });
    return targets;
}
exports.findMoveTargets = findMoveTargets;
function move2(G, ctx, param) {
    enter(G, ctx, { playerID: param.playerID, cardID: G.clipboard.move.cardID });
}
// to fix
// a protagonist cannot move a card into his own stable
function findMoveTargets2(G, ctx, protagonist) {
    var targets = [];
    G.players.forEach(function (pl) {
        if (pl.id !== G.clipboard.move.from && pl.id !== protagonist) {
            targets.push({ playerID: pl.id });
        }
    });
    return targets;
}
exports.findMoveTargets2 = findMoveTargets2;
function shuffleDiscardPileIntoDrawPile(G, ctx, param) {
    G.drawPile = underscore_1["default"].shuffle(__spreadArrays(G.drawPile, G.discardPile));
    G.discardPile = [];
}
function backKick(G, ctx, param) {
    var owner = findOwnerOfCard(G, param.cardID);
    returnToHand(G, ctx, { cardID: param.cardID, protagonist: param.protagonist });
    makeSomeoneDiscard(G, ctx, { protagonist: param.protagonist, playerID: owner });
}
function findBackKickTargets(G, ctx, protagonist) {
    var targets = [];
    G.players.forEach(function (pl) {
        if (pl.id === protagonist) {
            return;
        }
        __spreadArrays(G.stable[pl.id], G.upgradeDowngradeStable[pl.id]).forEach(function (c) {
            targets.push({ cardID: c });
        });
    });
    return targets;
}
exports.findBackKickTargets = findBackKickTargets;
function unicornSwap1(G, ctx, param) {
    leave(G, ctx, { playerID: param.protagonist, cardID: param.cardID });
    G.clipboard.unicornSwap = { cardIDToMove: param.cardID };
}
function findUnicornSwap1Targets(G, ctx, protagonist) {
    var targets = [];
    G.stable[protagonist].forEach(function (c) {
        var card = G.deck[c];
        if (card_1.isUnicorn(card)) {
            if (G.playerEffects[protagonist].find(function (s) { return s.effect.key === "pandamonium"; }) === undefined) {
                targets.push({ cardID: c });
            }
        }
    });
    return targets;
}
exports.findUnicornSwap1Targets = findUnicornSwap1Targets;
function unicornSwap2(G, ctx, param) {
    enter(G, ctx, { playerID: param.playerID, cardID: G.clipboard.unicornSwap.cardIDToMove });
    G.clipboard.unicornSwap = { targetPlayer: param.playerID };
}
function findUnicornSwap2Targets(G, ctx, protagonist) {
    var targets = [];
    G.players.forEach(function (p) {
        if (p.id === protagonist) {
            return;
        }
        targets.push({ playerID: p.id });
    });
    return targets;
}
exports.findUnicornSwap2Targets = findUnicornSwap2Targets;
function blatantThievery1(G, ctx, param) {
    pull(G, ctx, { protagonist: param.protagonist, handIndex: param.handIndex, from: param.from });
}
function makeSomeoneDiscard(G, ctx, param) {
    G.script.scenes.push({
        id: underscore_1["default"].uniqueId(),
        mandatory: true,
        actions: [{
                type: "action",
                instructions: [{
                        id: underscore_1["default"].uniqueId(),
                        protagonist: param.playerID,
                        state: "open",
                        ui: {
                            type: "click_on_own_card_in_hand"
                        },
                        "do": {
                            key: "discard",
                            info: { count: 1, type: "any" }
                        }
                    }]
            }],
        endTurnImmediately: false
    });
}
function findMakeSomeoneDiscardTarget(G, ctx, protagonist) {
    return G.players.filter(function (pl) { return pl.id !== protagonist && canDiscard(G, ctx, pl.id, { count: 1, type: "any" }); }).map(function (pl) { return ({ playerID: pl.id }); });
}
exports.findMakeSomeoneDiscardTarget = findMakeSomeoneDiscardTarget;
function canMakeSomeoneDiscard(G, ctx, protagonist) {
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
var KeyToFunc = {
    steal: steal, pull: pull, pullRandom: pullRandom, discard: discard, destroy: destroy, sacrifice: sacrifice, search: search, revive: revive, draw: draw, addFromDiscardPileToHand: addFromDiscardPileToHand, reviveFromNursery: reviveFromNursery, returnToHand: returnToHand, bringToStable: bringToStable, makeSomeoneDiscard: makeSomeoneDiscard, swapHands: swapHands, shakeUp: shakeUp, move: move, move2: move2, reset: reset, shuffleDiscardPileIntoDrawPile: shuffleDiscardPileIntoDrawPile, backKick: backKick, unicornSwap1: unicornSwap1, unicornSwap2: unicornSwap2, blatantThievery1: blatantThievery1
};
/////////////////////////////////////////////////
//
// Helper
//
exports._findInstructionWithID = function (G, instructionID) {
    var scene = null;
    var action = null;
    var instruction = null;
    G.script.scenes.forEach(function (sc) {
        sc.actions.forEach(function (ac) {
            ac.instructions.forEach(function (ins) {
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
};
var _findInstructionInProgress = function (G) {
    var scene = null;
    var action = null;
    var instruction = null;
    G.script.scenes.forEach(function (sc) {
        sc.actions.forEach(function (ac) {
            ac.instructions.forEach(function (ins) {
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
};
function findOwnerOfCard(G, cardID) {
    var playerID = null;
    G.players.forEach(function (pl) {
        if (__spreadArrays(G.stable[pl.id], G.upgradeDowngradeStable[pl.id]).findIndex(function (c) { return c === cardID; }) > -1) {
            playerID = pl.id;
        }
    });
    return playerID;
}
