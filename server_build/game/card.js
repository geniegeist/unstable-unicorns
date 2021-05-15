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
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby1",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby2",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby3",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby4",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby5",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby6",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby7",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby8",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby9",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby10",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Unicorn",
        type: "baby",
        image: "baby11",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
    }, {
        title: "Baby Narwhal",
        type: "baby",
        image: "baby12",
        count: 1,
        on: [],
        description: {
            en: "If this card would be sacrificed, destroyed, or returned to your hand, return it to the Nursery instead.",
            de: "Wenn diese Karte geopfert, zerstört oder zurück auf die Hand gelegt wird, lege sie in die Kita stattdessen."
        }
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
        description: {
            en: "When this card enters your Stable, you may STEAL an Upgrade card.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine Upgradekarte stehlen."
        }
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
        description: {
            en: "When this card enters your Stable, you may pull a card at random from another player's hand.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine zufällige Karte aus der Hand eines Mitspieler stehlen."
        }
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
        description: {
            en: "When this card enters your Stable, you may force another player to DISCARD a card. 👼 If this card is sacrificed or destroyed, return it to your hand.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du einen Mitspieler auswählen. Dieser Mitspieler muss eine Karte abwerfen. 👼 Wenn diese Karte geopfert oder zerstört wird, kommt sie stattdessen auf deine Hand zurück."
        }
    },
    {
        title: "Chainsaw Unicorn",
        type: "unicorn",
        image: "chainsaw_unicorn",
        count: 2,
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
        description: {
            en: "When this card enters your Stable, you may DESTROY an Upgrade card or SACRIFICE a Downgrade card.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine Upgradekarte oder eine Downgradekarte opfern."
        }
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
        description: {
            en: "When this card enters your Stable, you may search the deck for an Upgrade card and add it to your hand, then shuffle the deck.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du im Deck nach einer Upgradekarte suchen und sie deiner Hand hinzufügen."
        }
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
        description: {
            en: "When this card enters your Stable, you may SACRIFICE a Unicorn card, then bring a Unicorn card from the discard pile into your Stable.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine Einhornkarte 🦄 opfern. Du darfst dann ein Einhorn aus dem Friedhof in deinen Stall legen."
        }
    } /*, {
        title: "Extremely Destructive Unicorn",
        type: "unicorn",
        image: "extremely_destructive_unicorn",
        count: 1,
        on: [{
            trigger: "enter",
            do: {
                type: "add_scene",
                info: {
                    actions: [{
                        instructions: [{
                            protagonist: "all",
                            do: {
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
        description: {
            en: "When this card enters your Stable, each player (including you) must SACRIFICE a Unicorn card.",
            de: "Wenn diese Karte deinen Stall betritt, muss jeder Spieler (auch du) ein Einhorn opfern."
        }
    }*/,
    {
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
        description: {
            en: "This card counts for 2 Unicorns. You cannot play any Neigh cards.",
            de: "Diese Karte zählt als zwei Einhörner. Du kannst keine Neigh Karten spielen, solange diese Karte in deinem Stall ist."
        }
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
        description: {
            en: "When this card enters your Stable, DRAW a card. If this card is sacrificed or destroyed, return it to your hand.",
            de: "Wenn diese Karte deinen Stall betritt, ziehe eine Karte. 👼 Wenn diese Karte geopfert oder zerstört wird, kommt sie stattdessen auf deine Hand zurück."
        }
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
        description: {
            en: "When this card enters your Stable, each player (including you) must DISCARD a card.",
            de: "Wenn diese Karte deinen Stall betritt, muss jeder Spieler (auch du) eine Karte abwerfen"
        }
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
        description: {
            en: "When this card enters your Stable, you may add a Magic card from the discard pile to your hand.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine Magiekarte aus dem Friedhof deiner Hand hinzufügen."
        }
    }, {
        title: "Magical Kittencorn",
        type: "unicorn",
        image: "magical_kittencorn",
        count: 1,
        passive: ["cannot_be_destroyed_by_magic"],
        description: {
            en: "This card cannot be destroyed by Magic cards.",
            de: "Diese Karte kann nicht von Magiekarten zerstört werden"
        }
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
        description: {
            en: "When this card enters your Stable, you may add a Unicorn card from the discard pile to your hand. If this card is sacrificed or destroyed, return it to your hand.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du ein Einhorn aus dem Friedhof deiner Hand hinzufügen. 👼 Wenn diese Karte geopfert oder zerstört wird, kommt sie stattdessen auf deine Hand zurück."
        }
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
        description: {
            en: "When this card enters your Stable, you may bring a Baby Unicorn card from the Nursery into your Stable.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du ein Babyeinhorn aus der Kita adoptieren und es deinem Stall hinzufügen."
        }
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
        description: {
            en: "When this card enters your Stable, return a card in another player's Stable to their hand.",
            de: "Wenn diese Karte deinen Stall betritt, wähle eine Karte aus. Diese Karte wird zurück auf die Hand geschickt."
        }
    }, {
        title: "Narwhal Torpedo",
        type: "unicorn",
        image: "narwhal_torpedo",
        count: 2,
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
        description: {
            en: "When this card enters your Stable, SACRIFICE all Downgrade cards in your Stable.",
            de: "Wenn diese Karte deinen Stall betritt, opfere alle Downgradekarten in deinem Stall."
        }
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
        description: {
            en: "When this card enters your Stable, you may DISCARD 2 Unicorn cards, then bring a Unicorn card from the discard pile into your Stable.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du zwei Einhörner aus deiner Hand abwerfen. Belebe ein Einhorn aus dem Friedhof wieder und füge das Einhorn deinem Stall hinzu."
        }
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
        description: {
            en: "Basic Unicorn cards cannot enter any player's Stable except yours.",
            de: "Basic Einhörner können keinen Stall mehr betreten außer dein Stall."
        }
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
        description: {
            en: "When this card enters your Stable, you may bring a Basic Unicorn card from your hand into your Stable.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du ein Basic Einhorn von deiner Hand in dein Stall bringen."
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may DESTROY a Unicorn card. If you do, immediately end your turn.",
            de: "Ist diese Karte am Anfang deiner Runde in deinem Stall, darfst du ein Einhorn zerstören. Du musst danach dein Zug sofort beenden."
        }
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
        description: {
            en: "When this card enters your Stable, you may DISCARD a card, then STEAL a Unicorn card.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine Karte von deiner Hand abwerfen, um ein Einhorn zu stehlen."
        }
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
        description: {
            en: "When this card enters your Stable, you may search the deck for a Downgrade card and add it to your hand, then shuffle the deck.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du nach einer Downgradekarte im Deck suchen und sie deiner Hand hinzufügen."
        }
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
        description: {
            en: "If this is in your Stable at the beginning of your turn, you may DISCARD a card, then pull a card at random from another player's hand.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du eine Karte abwerfen, um eine zufällige Handkarte eines Spielers stehlen."
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may DISCARD a card, then SACRIFICE a Downgrade card.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du eine Karte von deiner Hand abwerfen, um eine Downgradekarte zu opfern."
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may DISCARD a Unicorn card. If you do, choose a Unicorn card from the discard pile and bring it directly into your Stable.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du ein Einhorn von deiner Hand abwerfen. Belebe ein Einhorn vom Friedhof wieder und lege es in deinem Stall."
        }
    },
    {
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
        description: {
            en: "When this card enters your Stable, you may add a Neigh card from the discard pile to your hand. If this card is sacrificed or destroyed, return it to your hand.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine Neighkarte aus dem Friedhof deiner Hand hinzufügen. 👼 Wenn diese Karte geopfert oder zerstört wird, kommt sie stattdessen auf deine Hand zurück."
        }
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
        description: {
            en: "When this card enters your Stable, you may search the deck for a card with Narwhal in its name and add it to your hand, then shuffle the deck.",
            de: "Wenn diese Karte deinen Stall betritt, darfst du eine Narwhalkarte aus dem Deck deiner Hand hinzufügen."
        }
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
        description: {
            en: "When this card enters your Stable, DRAW 2 cards and DISCARD a card.",
            de: "Wenn diese Karte deinen Stall betritt, ziehe zwei Karten und werfe eine Karte von deiner Hand ab."
        }
    },
    {
        title: "Neigh",
        type: "neigh",
        image: "neigh",
        count: 14,
        description: {
            en: "Play this card when another player tries to play a card. Stop their card from being played and send it to the discard pile.",
            de: "Neigh die Karte eines Spielers. Die Karte hat dann keinen Effekt mehr und wird auf den Friedhof gelegt."
        }
    }, {
        title: "Super Neigh",
        type: "super_neigh",
        image: "super_neigh",
        count: 1,
        description: {
            en: "Play this card when another player tries to play a card. Stop their card from being played and send it to the discard pile. This card cannot be Neigh'd.",
            de: "Neigh die Karte eines Spielers. Die Karte hat dann keinen Effekt mehr und wird auf den Friedhof gelegt. Diese Karte kann nicht geneight werden."
        }
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
        description: {
            en: "Cards you play cannot be Neigh'd.",
            de: "Deine Karten können nicht geneight werden."
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may DISCARD 2 cards, then DESTROY a Unicorn card.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du zwei Karten von deiner Hand abwerfen, um ein Einhorn zu zerstören."
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may DISCARD 3 cards, then STEAL a Unicorn card.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du drei Karten von deiner Hand abwerfen, um ein Einhorn zu stehlen."
        }
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
        description: {
            en: "Your Unicorn cards cannot be destroyed.",
            de: "Deine Einhörner können nicht zerstört werden"
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may SACRIFICE a card, then DESTROY a card.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du eine Karte opfern. Zerstöre dann eine Karte."
        }
    } /*{
        title: "Nanny Cam",
        type: "downgrade",
        image: "nanny_cam",
        count: 1,
        on: [{
            trigger: "enter",
            do: {
                type: "add_effect",
                info: { key: "your_hand_is_visible" },
                ui: { type: "none" }
            }
        }],
        description: {
            en: "Your hand must be visible to all players."
    }*/,
    {
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may play 2 cards during your Action phase.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du zwei Karten während deiner Aktionsphase spielen."
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may DISCARD a card, then DRAW a card.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du eine Karte abwerfen. Du darfst dann eine Karte ziehen."
        }
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
        description: {
            en: "If this card is in your Stable at the beginning of your turn, you may SACRIFICE a card, then DRAW 2 cards.",
            de: "Wenn diese Karte am Anfang deiner Runde in deinem Stall ist, darfst du eine Karte opfern, um zwei Karten zu ziehen."
        }
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
        description: {
            en: "Each time a Unicorn card enters or leaves your Stable, DISCARD a card.",
            de: "Immer wenn ein Einhorn dein Stall betritt oder verlässt, musst du eine Karte abwerfen."
        }
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
        description: {
            en: "All of your Unicorn cards are considered Basic Unicorns with no effects.",
            de: "Alle deiner Einhörner haben keinen Effekt und gelten als Basiceinhörner."
        }
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
        description: {
            en: "You cannot play Upgrade cards.",
            de: "Du kannst keine Upgradekarten spielen"
        }
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
        description: {
            en: "All of your Unicorns are considered Pandas. Cards that affect Unicorn cards do not affect your Pandas.",
            de: "All deine Einhörner gelten als Pandas. Karten, die Einhörner betreffen, betreffen nicht deine Pandas."
        }
    },
    {
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
        description: {
            en: "You cannot play Neigh cards.",
            de: "Du kannst keine Neighkarten spielen"
        }
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
        description: {
            en: "If at any time you have more than 5 Unicorns in your Stable, SACRIFICE a Unicorn card.",
            de: "Wenn dein Stall mehr als 5 Einhörner umfasst, opfere ein Einhorn."
        }
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
        description: {
            en: "DESTROY a Unicorn card.",
            de: "Zerstöre ein Einhorn"
        }
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
        description: {
            en: "DISCARD 2 cards, then STEAL a Unicorn card.",
            de: "Werfe zwei Handkarten ab, und zerstöre ein Einhorn"
        }
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
        description: {
            en: "Trade hands with any other player.",
            de: "Tausche deine Handkarte mit jemandem."
        }
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
        description: {
            en: "SACRIFICE a card, then DESTROY 2 cards.",
            de: "Opfere eine Karte und zerstöre zwei Karten."
        }
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
        description: {
            en: "DESTROY an Upgrade card or SACRIFICE a Downgrade card.",
            de: "Zerstöre eine Upgradekarte oder opfere eine Downgradekarte."
        }
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
        description: {
            en: "Shuffle this card, your hand, and the discard pile into the deck. DRAW 5 cards.",
            de: "Lege deine Hand und diese Karte und den Friedhof in das Deck. Mische das Deck. Zeihe 5 Karten."
        }
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
        description: {
            en: "Each player (including you) must SACRIFICE all Upgrade and Downgrade cards in their Stable. Shuffle the discard pile into the deck.",
            de: "Jeder Spieler (auch du) muss alle Upgrade und Downgradekarten opfern. Mische den Friedhof in das Deck."
        }
    },
    {
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
        description: {
            en: "Each player (including you) must DISCARD a card. Shuffle the discard pile into the deck.",
            de: "Jeder Spieler (auch du) muss eine Handkarte abwerfen. Mische den Friedhof in das Deck"
        }
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
        description: {
            en: "Bring a Unicorn card from the discard pile into your Stable.",
            de: "Belebe ein Einhorn von dem Friedhof wieder und lege das Einhorn in deinen Stall."
        }
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
        description: {
            en: "DRAW 3 cards and DISCARD a card.",
            de: "Ziehe 3 Karten und werfe eine Handkarte ab."
        }
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
        description: {
            en: "DRAW 2 cards and DISCARD 3 cards, then take another turn.",
            de: "Ziehe zwei Karten und werfe 3 Handkarten ab. Du kannst dann einen erneuten Zug machen."
        }
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
        description: {
            en: "Return a card in another player's Stable to their hand. That player must DISCARD a card.",
            de: "Schicke eine Karte zurück auf die Hand des Besitzers. Der Besitzer muss eine Karte abwerfen."
        }
    },
    {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic0",
        count: 3,
        on: [],
        description: {
            en: "Beards are like, so hot.",
            de: "Bärte sind soooo heiß."
        }
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic1",
        count: 3,
        on: [],
        description: {
            en: "Pumpkin spice is the pumpkin spice of life.",
            de: "Kürbisse sind lecker"
        }
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic2",
        count: 3,
        on: [],
        description: {
            en: "Dance like nobody's watching.",
            de: "Tanze als würde niemand zuschauen."
        }
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic3",
        count: 3,
        on: [],
        description: {
            en: "Vinyl records and mixtapes only.",
            de: "Oldschoooool musik"
        }
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic4",
        count: 3,
        on: [],
        description: {
            en: "Popped collars are for date nights only.",
            de: "Kragen trägt man nur auf Dates"
        }
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic5",
        count: 3,
        on: [],
        description: {
            en: "💖🙌💅🙌💖💁💁😂😂😂",
            de: "💖🙌💅🙌💖💁💁😂😂😂"
        }
    }, {
        title: "Basic Unicorn",
        type: "basic",
        image: "basic6",
        count: 3,
        on: [],
        description: {
            en: "#nomakeup #nofilter #sunnies #shameless #selfie #basic #TGIF # unicornhairdontcare",
            de: "#nomakeup #nofilter #sonne #schamlos #selfie #basic #TGIF # unicornhairdontcare"
        }
    }, {
        title: "Narwhal",
        type: "basic",
        image: "basic7",
        count: 3,
        on: [],
        description: {
            en: "This card has no special powers, but it sure is cute!",
            de: "Diese Karte hat keine Kräft, aber süß ist sie!"
        }
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
