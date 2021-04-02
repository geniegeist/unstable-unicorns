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
exports.__esModule = true;
exports.isUnicorn = exports.initializeDeck = void 0;
var Cards = [{
        title: "Baby Unicorn",
        type: "baby",
        image: "baby0",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby1",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby2",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby3",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby4",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby5",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby6",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby7",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby8",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby9",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby10",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby11",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Baby Narwhal",
        type: "baby",
        image: "baby12",
        count: 1,
        on: [],
        description: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead."
    }, {
        title: "Alluring Narwhal",
        type: "narwhal",
        image: "alluring_narwhal",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "steal",
                                            info: { type: "upgrade" }
                                        },
                                        ui: {
                                            type: "card_to_card"
                                        }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may STEAL an Upgrade card."
    }, {
        title: "Americorn",
        type: "unicorn",
        image: "americorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "pullRandom"
                                        },
                                        ui: { type: "card_to_player" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may pull a card at random from another player's hand."
    }, {
        title: "Annoying Flying Unicorn",
        type: "unicorn",
        image: "annoying_flying_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "makeSomeoneDiscard"
                                        },
                                        ui: { type: "card_to_player" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }, {
                trigger: "this_destroyed_or_sacrificed",
                "do": {
                    type: "return_to_hand"
                }
            }],
        description: "When this card enters your Stable, you may force another player to DISCARD a card. If this card is sacrificed or destroyed, return it to your hand."
    },
    {
        title: "Chainsaw Unicorn",
        type: "unicorn",
        image: "chainsaw_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                // when there are two instructions for the same protagonist, the protagonist must execute exactly one instruction before the game may advance
                                // in this case the protagonist may destroy an upgrade card or sacrifice a downgrade card
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "destroy",
                                            info: { type: "my_downgrade_other_upgrade" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may DESTROY an Upgrade card or SACRIFICE a Downgrade card."
    }, {
        title: "Classy Narwhal",
        type: "narwhal",
        image: "classy_narwhal",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "search",
                                            info: { type: "upgrade" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "search" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may search the deck for an Upgrade card and add it to your hand, then shuffle the deck."
    }, {
        title: "Dark Angel Unicorn",
        type: "unicorn",
        image: "dark_angel_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        // typical action chain: sacrifice to revive
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "sacrifice",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "revive",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Revive" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may SACRIFICE a Unicorn card, then bring a Unicorn card from the discard pile into your Stable."
    }, {
        title: "Extremely Destructive Unicorn",
        type: "unicorn",
        image: "extremely_destructive_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "all",
                                        "do": {
                                            key: "sacrifice",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "click_on_card_in_stable" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, each player (including you) must SACRIFICE a Unicorn card."
    }, {
        title: "Ginormous Unicorn",
        type: "unicorn",
        image: "ginormous_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "you_cannot_play_neigh" },
                    ui: { type: "none" }
                }
            }, {
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "count_as_two" },
                    ui: { type: "none" }
                }
            }],
        description: "This card counts for 2 Unicorns. You cannot play any Neigh cards."
    }, {
        title: "Greedy Flying Unicorn",
        type: "unicorn",
        image: "greedy_flying_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "draw",
                                            info: {
                                                count: 1
                                            }
                                        },
                                        ui: { type: "click_on_drawPile" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }, {
                trigger: "this_destroyed_or_sacrificed",
                "do": {
                    type: "return_to_hand"
                }
            }],
        description: "When this card enters your Stable, DRAW a card. If this card is sacrificed or destroyed, return it to your hand."
    }, {
        title: "Llamacorn",
        type: "unicorn",
        image: "llamacorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "all",
                                        "do": {
                                            key: "discard",
                                            info: { count: 1, type: "any" }
                                        },
                                        ui: {
                                            type: "click_on_own_card_in_hand"
                                        }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, each player (including you) must DISCARD a card."
    }, {
        title: "Magical Flying Unicorn",
        type: "unicorn",
        image: "magical_flying_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "addFromDiscardPileToHand",
                                            info: { type: "magic" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Add magic card" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may add a Magic card from the discard pile to your hand."
    }, {
        title: "Magical Kittencorn",
        type: "unicorn",
        image: "magical_kittencorn",
        count: 1,
        passive: ["cannot_be_destroyed_by_magic"],
        description: "This card cannot be destroyed by Magic cards."
    }, {
        title: "Majestic Flying Unicorn",
        type: "unicorn",
        image: "majestic_flying_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "addFromDiscardPileToHand",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Add card from discard pile" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }, {
                trigger: "this_destroyed_or_sacrificed",
                "do": {
                    type: "return_to_hand"
                }
            }],
        description: "When this card enters your Stable, you may add a Unicorn card from the discard pile to your hand. If this card is sacrificed or destroyed, return it to your hand."
    }, {
        title: "Mother Goose Unicorn",
        type: "unicorn",
        image: "mother_goose_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "reviveFromNursery"
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Revive Baby Unicorn" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may bring a Baby Unicorn card from the Nursery into your Stable."
    }, {
        title: "Mermaid Unicorn",
        type: "unicorn",
        image: "mermaid_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "returnToHand",
                                            info: { who: "another" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, return a card in another player's Stable to their hand."
    }, {
        title: "Narwhal Torpedo",
        type: "unicorn",
        image: "narwhal_torpedo",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "auto",
                    info: {
                        key: "sacrifice_all_downgrades"
                    },
                    ui: { type: "none" }
                }
            }],
        description: "When this card enters your Stable, SACRIFICE all Downgrade cards in your Stable."
    }, {
        title: "Necromancer Unicorn",
        type: "unicorn",
        image: "necromancer_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { count: 2, type: "unicorn" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Discard 2 cards" } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "revive",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Revive" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may DISCARD 2 Unicorn cards, then bring a Unicorn card from the discard pile into your Stable."
    }, {
        title: "Queen Bee Unicorn",
        type: "unicorn",
        image: "queen_bee_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "basic_unicorns_can_only_join_your_stable" },
                    ui: { type: "none" }
                }
            }],
        description: "Basic Unicorn cards cannot enter any player's Stable except yours."
    }, {
        title: "Rainbow Unicorn",
        type: "unicorn",
        image: "rainbow_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "bringToStable",
                                            info: { type: "basic_unicorn" }
                                        },
                                        ui: {
                                            type: "single_action_popup", info: { singleActionText: "Bring basic unicorn to stable" }
                                        }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may bring a Basic Unicorn card from your hand into your Stable."
    }, {
        title: "Rhinocorn",
        type: "unicorn",
        image: "rhinocorn",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "destroy",
                                            info: { type: "unicorn" }
                                        },
                                        ui: {
                                            type: "card_to_card"
                                        }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: true
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may DESTROY a Unicorn card. If you do, immediately end your turn."
    }, {
        title: "Seductive Unicorn",
        type: "unicorn",
        image: "seductive_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { count: 1, type: "any" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Discard to steal" } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "steal",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may DISCARD a card, then STEAL a Unicorn card."
    }, {
        title: "Shabby the Narwhal",
        type: "narwhal",
        image: "shabby_the_narwhal",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "search",
                                            info: { type: "downgrade" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Search" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may search the deck for a Downgrade card and add it to your hand, then shuffle the deck."
    }, {
        title: "Vagabond Unicorn",
        type: "unicorn",
        image: "vagabond_unicorn",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { type: "any", count: 1 }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Discard to pull" } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "pullRandom"
                                        },
                                        ui: { type: "card_to_player" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this is in your Stable at the beginning of your turn, you may DISCARD a card, then pull a card at random from another player's hand."
    }, {
        title: "Survivalist Unicorn",
        type: "unicorn",
        image: "survivalist_unicorn",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { type: "any", count: 1 }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Discard to pull" } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "sacrifice", info: { type: "downgrade" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may DISCARD a card, then SACRIFICE a Downgrade card."
    }, {
        title: "Zombie Unicorn",
        type: "unicorn",
        image: "zombie",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { type: "any", count: 1 }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Discard to revive" } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "revive", info: { type: "unicorn" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Revive" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: true
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may DISCARD a Unicorn card. If you do, choose a Unicorn card from the discard pile and bring it directly into your Stable, then immediately skip to your End of Turn Phase."
    },
    {
        title: "Stabby the Unicorn",
        type: "unicorn",
        image: "stabby_the_unicorn",
        count: 1,
        on: [{
                trigger: "this_destroyed_or_sacrificed",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "destroy",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "click_on_card_in_stable" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is sacrificed or destroyed, you may DESTROY a Unicorn card."
    }, {
        title: "Swift Flying Unicorn",
        type: "unicorn",
        image: "swift_flying_unicorn",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "addFromDiscardPileToHand",
                                            info: { type: "neigh" }
                                        },
                                        ui: {
                                            type: "single_action_popup",
                                            info: { singleActionText: "Add Neigh card" }
                                        }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }, {
                trigger: "this_destroyed_or_sacrificed",
                "do": {
                    type: "return_to_hand"
                }
            }],
        description: "When this card enters your Stable, you may add a Neigh card from the discard pile to your hand. If this card is sacrificed or destroyed, return it to your hand."
    }, {
        title: "The Great Narwhal",
        type: "narwhal",
        image: "the_great_narwhal",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "search",
                                            info: { type: "narwhal" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Search" } }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, you may search the deck for a card with Narwhal in its name and add it to your hand, then shuffle the deck."
    }, {
        title: "Unicorn on the Cob",
        type: "unicorn",
        image: "unicorn_on_the_cob",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "draw",
                                            info: { count: 2 }
                                        },
                                        ui: { type: "click_on_drawPile" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { count: 1, type: "any" }
                                        },
                                        ui: { type: "click_on_own_card_in_hand" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "When this card enters your Stable, DRAW 2 cards and DISCARD a card."
    },
    {
        title: "Neigh",
        type: "neigh",
        image: "neigh",
        count: 14,
        description: "Play this card when another player tries to play a card. Stop their card from being played and send it to the discard pile."
    }, {
        title: "Super Neigh",
        type: "super_neigh",
        image: "super_neigh",
        count: 1,
        description: "Play this card when another player tries to play a card. Stop their card from being played and send it to the discard pile. This card cannot be Neigh'd."
    }, {
        title: "Yay",
        type: "upgrade",
        image: "yay",
        count: 2,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "your_cards_cannot_be_neighed" },
                    ui: { type: "none" }
                }
            }],
        description: "Cards you play cannot be Neigh'd."
    }, {
        title: "Stable Artillery",
        type: "upgrade",
        image: "stable_artillery",
        count: 3,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { count: 2, type: "any" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Discard 2 cards" } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "destroy",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "click_on_card_in_stable" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may DISCARD 2 cards, then DESTROY a Unicorn card."
    }, {
        title: "Rainbow Lasso",
        type: "upgrade",
        image: "rainbow_lasso",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { count: 3, type: "any" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Discard 3 cards to steal" } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "steal",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may DISCARD 3 cards, then STEAL a Unicorn card."
    }, {
        title: "Rainbow Aura",
        type: "upgrade",
        image: "rainbow_aura",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "your_unicorns_cannot_be_destroyed" },
                    ui: { type: "none" }
                }
            }],
        description: "Your Unicorn cards cannot be destroyed."
    }, {
        title: "Glitter Bomb",
        type: "upgrade",
        image: "glitter_bomb",
        count: 2,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "sacrifice",
                                            info: { type: "any" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "destroy",
                                            info: { type: "any" }
                                        },
                                        ui: { type: "click_on_card_in_stable" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may SACRIFICE a card, then DESTROY a card."
    }, {
        title: "Nanny Cam",
        type: "downgrade",
        image: "nanny_cam",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "your_hand_is_visible" },
                    ui: { type: "none" }
                }
            }],
        description: "Your hand must be visible to all players."
    }, {
        title: "Double Dutch",
        type: "upgrade",
        image: "double_dutch",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_effect",
                    info: { key: "double_dutch" },
                    ui: { type: "none" }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may play 2 cards during your Action phase."
    }, {
        title: "Claw Machine",
        type: "upgrade",
        image: "claw_machine",
        count: 3,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { type: "any", count: 1 }
                                        },
                                        ui: { type: "single_action_popup", info: {
                                                singleActionText: "Discard to draw"
                                            } }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "draw",
                                            info: { count: 1 }
                                        },
                                        ui: { type: "click_on_drawPile" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may DISCARD a card, then DRAW a card."
    }, {
        title: "Caffeine Overload",
        type: "upgrade",
        image: "caffeine_overload",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "sacrifice",
                                            info: { type: "any" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "draw",
                                            info: { count: 2 }
                                        },
                                        ui: { type: "click_on_drawPile" }
                                    }]
                            }],
                        mandatory: false,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, you may SACRIFICE a card, then DRAW 2 cards."
    }, {
        title: "Barbed Wire",
        type: "downgrade",
        image: "barbed_wire",
        count: 1,
        on: [{
                trigger: "unicorn_enters_your_stable",
                "do": {
                    type: "inject_action",
                    info: {
                        instruction: {
                            "do": {
                                key: "discard",
                                info: { count: 1, type: "any" }
                            },
                            ui: { type: "click_on_own_card_in_hand" }
                        }
                    }
                }
            }, {
                trigger: "unicorn_leaves_your_stable",
                "do": {
                    type: "inject_action",
                    info: {
                        instruction: {
                            "do": {
                                key: "discard",
                                info: { count: 1, type: "any" }
                            },
                            ui: { type: "click_on_own_card_in_hand" }
                        }
                    }
                }
            }],
        description: "Each time a Unicorn card enters or leaves your Stable, DISCARD a card."
    }, {
        title: "Blinding Light",
        type: "downgrade",
        image: "blinding_light",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "my_unicorns_are_basic" },
                    ui: { type: "none" }
                }
            }],
        description: "All of your Unicorn cards are considered Basic Unicorns with no effects."
    }, {
        title: "Broken Stable",
        type: "downgrade",
        image: "broken_stable",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "you_cannot_play_upgrades" },
                    ui: { type: "none" }
                }
            }],
        description: "You cannot play Upgrade cards."
    }, {
        title: "Pandamonium",
        type: "downgrade",
        image: "pandamonium",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "pandamonium" },
                    ui: { type: "none" }
                }
            }],
        description: "All of your Unicorns are considered Pandas. Cards that affect Unicorn cards do not affect your Pandas."
    }, {
        title: "Sadistic Ritual",
        type: "downgrade",
        image: "sadistic_ritual",
        count: 1,
        on: [{
                trigger: "begin_of_turn",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "sacrifice",
                                            info: { type: "any" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "draw",
                                            info: { count: 1 }
                                        },
                                        ui: { type: "click_on_drawPile" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "If this card is in your Stable at the beginning of your turn, SACRIFICE a Unicorn card, then DRAW a card."
    }, {
        title: "Slowdown",
        type: "downgrade",
        image: "slowdown",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "you_cannot_play_neigh" },
                    ui: { type: "none" }
                }
            }],
        description: "You cannot play Neigh cards."
    }, {
        title: "Tiny Stable",
        type: "downgrade",
        image: "tiny_stable",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_effect",
                    info: { key: "tiny_stable" },
                    ui: { type: "none" }
                }
            }],
        description: "If at any time you have more than 5 Unicorns in your Stable, SACRIFICE a Unicorn card."
    }, {
        title: "Unicorn Poison",
        type: "magic",
        image: "unicorn_poison",
        count: 3,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": { key: "destroy", info: { type: "unicorn" } },
                                        ui: {
                                            type: "card_to_card"
                                        }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "DESTROY a Unicorn card."
    }, {
        title: "Alignment Change",
        type: "magic",
        image: "alignment_change",
        count: 2,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": { key: "discard", info: { type: "any", count: 2 } },
                                        ui: {
                                            type: "single_action_popup", info: { singleActionText: "Discard to steal" }
                                        }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": { key: "steal", info: { type: "unicorn" } },
                                        ui: {
                                            type: "card_to_card"
                                        }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "DISCARD 2 cards, then STEAL a Unicorn card."
    }, {
        title: "Unfair Bargain",
        type: "magic",
        image: "unfair_bargain",
        count: 2,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": { key: "swapHands" },
                                        ui: {
                                            type: "card_to_player"
                                        }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Trade hands with any other player."
    }, {
        title: "Two-For-One",
        type: "magic",
        image: "two-for-one",
        count: 2,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "sacrifice",
                                            info: { type: "any" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "destroy",
                                            info: { type: "any", count: 2 }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "SACRIFICE a card, then DESTROY 2 cards."
    }, {
        title: "Targeted Destruction",
        type: "magic",
        image: "targeted_destruction",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "destroy",
                                            info: { type: "my_downgrade_other_upgrade" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "DESTROY an Upgrade card or SACRIFICE a Downgrade card."
    }, {
        title: "Shake Up",
        type: "magic",
        image: "shake_up",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "shakeUp"
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "SHAKE IT UUUUP" } }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Shuffle this card, your hand, and the discard pile into the deck. DRAW 5 cards."
    }, {
        title: "Reset Button",
        type: "magic",
        image: "reset_button",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "reset"
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Let's reset the game! Yay!" } }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Each player (including you) must SACRIFICE all Upgrade and Downgrade cards in their Stable. Shuffle the discard pile into the deck."
    }, {
        title: "Re-Target",
        type: "magic",
        image: "re-target",
        count: 2,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "move",
                                            info: { type: "upgradeAndDowngrade" }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "move2"
                                        },
                                        ui: { type: "card_to_player" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Move an Upgrade or Downgrade card from any player's Stable to any other player's Stable."
    }, {
        title: "Mystical Vortex",
        type: "magic",
        image: "mystical_vortex",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "all",
                                        "do": {
                                            key: "discard",
                                            info: { type: "any", count: 1 }
                                        },
                                        ui: { type: "click_on_own_card_in_hand" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "shuffleDiscardPileIntoDrawPile"
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Shuffle" } }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Each player (including you) must DISCARD a card. Shuffle the discard pile into the deck."
    }, {
        title: "Kiss of Life",
        type: "magic",
        image: "kiss_of_life",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "revive",
                                            info: { type: "unicorn" }
                                        },
                                        ui: { type: "single_action_popup", info: { singleActionText: "Revive" } }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Bring a Unicorn card from the discard pile into your Stable."
    }, {
        title: "Good Deal",
        type: "magic",
        image: "good_deal",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "draw",
                                            info: { count: 3 }
                                        },
                                        ui: { type: "click_on_drawPile" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { count: 1, type: "any" }
                                        },
                                        ui: { type: "click_on_own_card_in_hand" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "DRAW 3 cards and DISCARD a card."
    }, {
        title: "Change of Luck",
        type: "magic",
        image: "change_of_luck",
        count: 2,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "draw",
                                            info: { count: 2 }
                                        },
                                        ui: { type: "click_on_drawPile" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "discard",
                                            info: { count: 3, type: "any", changeOfLuck: true }
                                        },
                                        ui: { type: "click_on_own_card_in_hand" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "DRAW 2 cards and DISCARD 3 cards, then take another turn."
    }, {
        title: "Back Kick",
        type: "magic",
        image: "back_kick",
        count: 3,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "backKick"
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Return a card in another player's Stable to their hand. That player must DISCARD a card."
    }, {
        title: "Unicorn Swap",
        type: "magic",
        image: "unicorn_swap",
        count: 2,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "unicornSwap1"
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "unicornSwap2"
                                        },
                                        ui: { type: "card_to_player" }
                                    }]
                            }, {
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "steal",
                                            info: { type: "unicorn", unicornSwap: true }
                                        },
                                        ui: { type: "card_to_card" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Move a Unicorn card in your Stable to any other player's Stable, then STEAL a Unicorn card from that player's Stable."
    }, {
        title: "Blatant Thievery",
        type: "magic",
        image: "blatant_thievery",
        count: 1,
        on: [{
                trigger: "enter",
                "do": {
                    type: "add_scene",
                    info: {
                        actions: [{
                                instructions: [{
                                        protagonist: "owner",
                                        "do": {
                                            key: "blatantThievery1"
                                        },
                                        ui: { type: "card_to_player" }
                                    }]
                            }],
                        mandatory: true,
                        endTurnImmediately: false
                    }
                }
            }],
        description: "Move a Unicorn card in your Stable to any other player's Stable, then STEAL a Unicorn card from that player's Stable."
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic0",
        count: 3,
        on: [],
        description: "Beards are like, so hot."
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic1",
        count: 3,
        on: [],
        description: "Pumpkin spice is the pumpkin spice of life."
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic2",
        count: 3,
        on: [],
        description: "Dance like nobody's watching."
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic3",
        count: 3,
        on: [],
        description: "Vinyl records and mixtapes only."
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic4",
        count: 3,
        on: [],
        description: "Popped collars are for date nights only."
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic5",
        count: 3,
        on: [],
        description: "💖🙌💅🙌💖💁💁😂😂😂"
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic6",
        count: 3,
        on: [],
        description: "#nomakeup #nofilter #sunnies #shameless #selfie #basic #TGIF # unicornhairdontcare"
    }, {
        title: "Narwhal",
        type: "basic",
        image: "basic7",
        count: 3,
        on: [],
        description: "This card has no special powers, but it sure is cute!"
    }];
function initializeDeck() {
    var deck = [];
    Cards.forEach(function (c) {
        for (var i = 0; i < c.count; i++) {
            deck.push({
                id: 0,
                title: c.title,
                on: c.on,
                passive: c.passive,
                type: c.type,
                image: c.image,
                description: c.description
            });
        }
    });
    return deck.map(function (c, idx) { return (__assign(__assign({}, c), { id: idx })); });
}
exports.initializeDeck = initializeDeck;
// Helper
function isUnicorn(card) {
    return card.type === "baby" || card.type === "basic" || card.type === "unicorn" || card.type === "narwhal";
}
exports.isUnicorn = isUnicorn;
