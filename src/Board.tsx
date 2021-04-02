import styled from 'styled-components';
import _ from 'underscore';
import Hand from './ui/Hand';
import HiddenHand from './ui/HiddenHand';
import Stable, { StableHandle } from './ui/Stable';
import PlayerField from './ui/PlayerField';
// game
import { UnstableUnicornsGame, Ctx, _findOpenScenesWithProtagonist, Instruction, Scene, canDraw, canPlayCard, _findInProgressScenesWithProtagonist, _findInstruction } from './game/game';
// assets
import BG from './assets/ui/board-background.jpg';
import UpgradeDowngradeStable from './ui/UpgradeDowngradeStable';
import DrawPile from './ui/DrawPile';
import Nursery from './ui/Nursery';
import DiscardPile from './ui/DiscardPile';
import { CardID } from './game/card';
import { useRef, useState } from 'react';
import { findUITargets, HoverTarget } from './BoardUtil';
import RainbowArrow from './ui/RainbowArrow';
import EndTurnButton from './ui/button/EndTurnButton';
import { PlayerID } from './game/player';
import { BoardState, getBoardState } from './BoardStateManager';
import GameLabel from './ui/GameLabel';
import NeighLabel, { NeighLabelRole } from './ui/NeighLabel';
import CardPopupSingleAction from './ui/CardPopupSingleAction';
import { AddFromDiscardPileToHandTarget, BringToStableTarget, DiscardTarget, DoDestroy, DoDiscard, findDestroyTargets, findDiscardTargets, ReviveTarget, SearchTarget } from './game/do';
import InfoLabel from './ui/InfoLabel';
import Finder from './ui/Finder';
import BoardGameBegin from './BoardGameBegin';

type Props = {
    G: UnstableUnicornsGame;
    ctx: Ctx;
    playerID: string;
    moves: any;
}

type CardInteraction = {
    key: "card_to_card",
    info: {
        sourceCardID: CardID,
        instructionID: string,
        currentMousePosition: { x: number, y: number },
        startingMousePosition: { x: number, y: number },
        targets: { cardID: CardID }[]
    }
} | {
    key: "card_to_player",
    info: {
        sourceCardID: CardID,
        instructionID: string,
        currentMousePosition: { x: number, y: number },
        startingMousePosition: { x: number, y: number },
        targets: { playerID: PlayerID }[]
    }
} | {
    key: "click_on_other_stable_card",
    info: {
        instructionID: string,
        targets: { cardID: CardID }[],
    }
} | {
    key: "play_upgradeDowngradeCardFromHand__choose_target",
    info: {
        instructionID: "____________",
        currentMousePosition: { x: number, y: number },
        startingMousePosition: { x: number, y: number },
        cardID: CardID,
    }
}

const Board = (props: any) => {
    const { G, ctx, playerID, moves } = props as Props;

    const [showDeckFinder, setShowDeckFinder] = useState<SearchTarget[] | undefined>(undefined);
    const [showPlayerHand, setShowPlayerHand] = useState<PlayerID | undefined>(undefined);
    const [showBlatantThievery, setShowBlatantThievery] = useState<PlayerID | undefined>(undefined);
    const [showDiscardFinder, setShowDiscardFinder] = useState<{cardID: CardID}[] | undefined>(undefined);
    const [showNurseryFinder, setSHowNurseryFinder] = useState(false);
    const [isHoveringOverHandCard, setHoveringOverHandCard] = useState(false);
    const stableRef = useRef<StableHandle>(null);
    const [hoverTargets, setHoverTargets] = useState<{sourceCardID: CardID, targets: HoverTarget[]}>();
    const [cardInteraction, setCardInteraction] = useState<CardInteraction | undefined>(undefined);

    let openScenes: Array<[Instruction, Scene]> = _findInProgressScenesWithProtagonist(G, playerID);
    if (openScenes.length === 0) {
        openScenes = _findOpenScenesWithProtagonist(G, playerID);
    }
    const glowingCardIDs = openScenes.map(([instr, sce]) => instr.ui.info?.source).filter(c => c !== undefined) as number[];

    const wrapperOnMouseMove = (evt: React.MouseEvent<HTMLDivElement>) => {
        // track mouse movement for card to card interaction
        if (cardInteraction?.key === "card_to_card") {
            setCardInteraction({
                key: "card_to_card",
                info: {
                    ...cardInteraction.info, 
                    currentMousePosition: { x: evt.clientX, y: evt.clientY } 
                }
            });
        }

        if (cardInteraction?.key === "card_to_player") {
            setCardInteraction({
                key: "card_to_player",
                info: {
                    ...cardInteraction.info, 
                    currentMousePosition: { x: evt.clientX, y: evt.clientY } 
                }
            });
        }

        if (cardInteraction?.key === "play_upgradeDowngradeCardFromHand__choose_target") {
            setCardInteraction({
                key: "play_upgradeDowngradeCardFromHand__choose_target",
                info: {
                    ...cardInteraction.info, 
                    currentMousePosition: { x: evt.clientX, y: evt.clientY } 
                }
            });
        }
    };

    const stableHighlightMode = hoverTargets?.targets.filter(s => s.type === "stable_card").map(s => s.info.cardID).concat([hoverTargets.sourceCardID]);

    const boardStates = getBoardState(G, ctx, playerID);
    if (boardStates.find(s => s.type === "destroy__click_on_card_in_stable" || s.type === "sacrifice__clickOnCardInStable")) {
        const boardState = boardStates.find(s => s.type === "destroy__click_on_card_in_stable" || s.type === "sacrifice__clickOnCardInStable")!;
        // only update if the card interaction is different 
        // prevents the client from rendering indefinitely
        if (cardInteraction?.info?.instructionID !== boardState.info!.instructionID) {
            setCardInteraction({ key: "click_on_other_stable_card", info: {
                targets: boardState.info!.targets,
                instructionID: boardState.info!.instructionID,
            } });
        }
    } 

    if (ctx.phase === "pregame") {
        return (
            <BoardGameBegin G={G} babyCards={_.first(G.deck, 13)} playerID={playerID} moves={moves} />
        );
    }

    return (
        <Wrapper onMouseMove={wrapperOnMouseMove}>
            <div style={{position: "absolute", right: 0, color: "rgba(0,0,0,0)", height: "20px", width: "20px"}} onClick={() => {
                moves.end(playerID);
                /*
                console.log("Huhu")
                boardStates.forEach(b => {
                    if (b.info?.instructionID) {
                        const [instruction, action, scene] = _findInstruction(G, b?.info?.instructionID)!;
                        moves.commit(scene.id);
                    }
                })*/
            }}>
                A
            </div>
            <div style={{position: "absolute", top: 0, left: 0, color: "rgba(0,0,0,0)", height: "20px", width: "20px"}} onClick={() => {
                console.log("Huhu")
                boardStates.forEach(b => {
                    console.log(b);
                    if (b.info?.instructionID) {
                        console.log("DO")
                        moves.skipExecuteDo(playerID, b.info?.instructionID);
                    }
                })
            }}>
                A
            </div>

            {showDeckFinder && 
                <Finder 
                    cards={showDeckFinder.map(s => G.deck[s.cardID])} 
                    showBackButton={false}
                    onBackClick={() => 0} 
                    onCardClick={cardID => {
                        const boardState = boardStates.find(o => o.type === "search__single_action_popup")!;
                        const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                        moves.executeDo(instruction.id, {
                            protagonist: playerID,
                            cardID
                        });
                        setShowDeckFinder(undefined);
                        setCardInteraction(undefined);
                }} />
            }
            {showDiscardFinder && 
                <Finder 
                    cards={showDiscardFinder.map(c => G.deck[c.cardID])} 
                    onBackClick={() => setShowDiscardFinder(undefined)} 
                    onCardClick={cardID => {
                        let state = boardStates.find(s => s.type === "revive" || s.type === "addFromDiscardPileToHand__single_action_popup");
                        if (state) {
                            moves.executeDo(state.info?.instructionID, {
                                protagonist: playerID, cardID
                            });

                            setShowDiscardFinder(undefined);
                        }
                }} />
            }
            {showNurseryFinder && 
                <Finder cards={G.nursery.map(c => G.deck[c])} onBackClick={() => setSHowNurseryFinder(false)} onCardClick={cardID => {
                    let state = boardStates.find(s => s.type === "reviveFromNursery");
                    if (state) {
                        moves.executeDo(state.info?.instructionID, {
                            protagonist: playerID, cardID
                        });

                        setSHowNurseryFinder(false);
                    }
                }}/>
            }
            {showPlayerHand !== undefined && 
                <Finder cards={G.hand[playerID].map(c => G.deck[c])} onBackClick={() => setShowPlayerHand(undefined)} showBackButton={true} onCardClick={cardID => {
                    
                }} hide={G.playerEffects[showPlayerHand].find(o => o.effect.key === "your_hand_is_visible") === undefined} />
            }
            {showBlatantThievery !== undefined && 
                <Finder cards={G.hand[showBlatantThievery].map(c => G.deck[c])} onBackClick={() => undefined} showBackButton={false} onCardClick={cardID => {
                    const handIndex = G.hand[showBlatantThievery].findIndex(s => s === cardID);
                    moves.executeDo(cardInteraction?.info.instructionID, { protagonist: playerID, handIndex, from: showBlatantThievery});
                    setShowBlatantThievery(undefined);
                    setCardInteraction(undefined);
                }}
                title="Click on card to add it to your hand."/>
            }
            {(cardInteraction?.key === "card_to_card" || cardInteraction?.key === "card_to_player" || cardInteraction?.key === "play_upgradeDowngradeCardFromHand__choose_target") &&
                <RainbowArrow from={{ x: cardInteraction.info.startingMousePosition.x, y: cardInteraction.info.startingMousePosition.y }} to={{ x: cardInteraction.info.currentMousePosition.x, y: cardInteraction.info.currentMousePosition.y }} />
            }
            <Top>
                {renderTop(G, ctx, ctx.currentPlayer === playerID, boardStates)}
            </Top>
            <Main>
                <PlayerField
                    players={G.players.filter(pl => pl.id !== playerID)}
                    currentPlayer={ctx.currentPlayer}
                    stable={_.mapObject(G.stable, c => c.map(d => G.deck[d]))}
                    handCount={G.players.map(pl => G.hand[pl.id].length)}
                    upgradeDowngradeStable={_.mapObject(G.upgradeDowngradeStable, c => c.map(d => G.deck[d]))}
                    highlightMode={stableHighlightMode}
                    onHandClick={playerID => setShowPlayerHand(playerID)}
                    onStableCardClick={cardID => {
                        if (cardInteraction?.key === "click_on_other_stable_card" || cardInteraction?.key === "card_to_card") {
                            console.log("Detected click for cardInteraction with key <click_on_other_stable_card | card_to_card>");
                            // is clicked card a valid target?
                            if (cardInteraction.info.targets.find(s => s.cardID === cardID)) {
                                console.log(`Clicked card is a valid target. Execute instruction with id <${cardInteraction.info.instructionID}>`);
                                moves.executeDo(cardInteraction.info.instructionID, {
                                    protagonist: playerID, cardID
                                });
                                setCardInteraction(undefined);
                            }
                        }
                    }}
                    onPlayerClick={plid => {
                        if (cardInteraction?.key === "card_to_player") {
                            console.log("Detected click for cardInteraction with key <card_to_player>");

                            if (G.deck[cardInteraction.info.sourceCardID].title === "Blatant Thievery") {
                                setShowBlatantThievery(plid);
                                return;
                            }   

                            // is clicked card a valid target?
                            if (cardInteraction.info.targets.find(s => s.playerID === plid)) {
                                console.log(`Clicked player is a valid target. Execute instruction with id <${cardInteraction.info.instructionID}>`);
                                moves.executeDo(cardInteraction.info.instructionID, {
                                    protagonist: playerID, playerID: plid
                                });
                                setCardInteraction(undefined);
                            }
                        } else if (cardInteraction?.key === "play_upgradeDowngradeCardFromHand__choose_target") {
                            moves.playUpgradeDowngradeCard(playerID, plid, cardInteraction.info.cardID);
                            setCardInteraction(undefined);
                        }
                    }}
                />
            </Main>
            <Middle>
                <DrawPileWrapper zIndexFocus={isHoveringOverHandCard}>
                    {renderEndTurnButton(moves, playerID, boardStates)}
                    <MiddleLabel>Deck</MiddleLabel>
                    <DrawPile onClick={() => {
                        if (boardStates.find(s => s.type === "drawCard")) {
                            if (ctx.activePlayers![playerID] === "beginning") {
                                moves.drawAndAdvance();
                            } else if (ctx.activePlayers![playerID] === "action_phase") {
                                moves.drawAndEnd(playerID);
                            }
                        } else if (boardStates.find(s => s.type === "draw__clickOnDrawPile")) {
                            const boardState = boardStates.find(s => s.type === "draw__clickOnDrawPile")!;
                            moves.executeDo(boardState.info!.instructionID, {
                                protagonist: playerID, count: boardState.info!.count
                            });
                        }
                    }} isGlowing={boardStates.find(s => s.type === "drawCard" || s.type === "draw__clickOnDrawPile") !== undefined} count={G.drawPile.length} />
                </DrawPileWrapper>
                {renderNeighLabel(G, ctx, moves, playerID)}
                {renderInfoLabel(G, boardStates)}
                <MiddleLeftWrapper zIndexFocus={isHoveringOverHandCard}>
                    <div>
                        <MiddleLabel>Nursery</MiddleLabel>
                        <Nursery cards={G.nursery.map(c => G.deck[c])} onClick={()=> {
                            setSHowNurseryFinder(true);
                        }}/>
                    </div>
                    <div style={{ marginTop: "1em" }}>
                        <MiddleLabel>Discard pile</MiddleLabel>
                        <DiscardPile cards={G.discardPile.map(c => G.deck[c])} onClick={() => {
                            setShowDiscardFinder(G.discardPile.map(c => ({cardID: c})));
                        }} />
                    </div>
                </MiddleLeftWrapper>
            </Middle>
            <Bottom>
                <Stable
                    ref={stableRef}
                    cards={[...G.stable[playerID], ...G.temporaryStable[playerID]].map(c => G.deck[c])}
                    upgradeDowngradeCards={G.upgradeDowngradeStable[playerID].map(c => G.deck[c])}
                    glowing={glowingCardIDs}
                    highlightMode={stableHighlightMode}
                    onStableItemClick={(evt, cardID) => {
                        // initiate card to card interaction for destroy and steal actions
                        if (cardInteraction === undefined) {
                            // check if it is a destroy or steal action
                            // check if the card that is clicked is the source for the action
                            let boardState = _.first(boardStates.filter(s => s.info?.sourceCardID === cardID && (s.type === "destroy__cardToCard" || s.type === "steal__cardToCard" || s.type === "sacrifice__cardToCard" ||s.type === "move__cardToCard" || s.type === "returnToHand__cardToCard" || s.type === "backKick__card_to_card" || s.type === "unicornswap1")));

                            if (boardState) {
                                const cardRef = stableRef.current?.getStableItemRef(cardID)!;
                                const coord = cardRef.current!.getBoundingClientRect();
                                const from = {
                                    x: coord.left + coord.width / 2.0,
                                    y: coord.top + coord.height / 2.0,
                                };
                                setCardInteraction({
                                    key: "card_to_card",
                                    info: {
                                        sourceCardID: cardID,
                                        instructionID: boardState.info!.instructionID,
                                        targets: boardState.info!.targets,
                                        currentMousePosition: {x: evt.clientX, y: evt.clientY},
                                        startingMousePosition: {...from}
                                    }
                                });
                            }

                            boardState = _.first(boardStates.filter(s => (s.type === "swapHands__cardToPlayer" || s.type === "pullRandom__cardToPlayer" || s.type === "move2__cardToPlayer" || s.type === "makeSomeoneDiscard__cardToPlayer" || s.type === "unicornswap2" || s.type === "blatantThievery1") && s.info?.sourceCardID === cardID));
                            if (boardState) {
                                const cardRef = stableRef.current?.getStableItemRef(cardID)!;
                                const coord = cardRef.current!.getBoundingClientRect();
                                const from = {
                                    x: coord.left + coord.width / 2.0,
                                    y: coord.top + coord.height / 2.0,
                                };
                                setCardInteraction({
                                    key: "card_to_player",
                                    info: {
                                        sourceCardID: cardID,
                                        instructionID: boardState.info!.instructionID,
                                        targets: boardState.info!.targets,
                                        currentMousePosition: {x: evt.clientX, y: evt.clientY},
                                        startingMousePosition: {...from}
                                    }
                                });
                            }
                        } else {
                            // cancel card interaction 
                            if ((cardInteraction.key === "card_to_card" || cardInteraction.key === "card_to_player") && cardInteraction.info.sourceCardID === cardID) {
                                setCardInteraction(undefined);
                                return;
                            }      
                            
                            if (cardInteraction?.key === "click_on_other_stable_card" || cardInteraction?.key === "card_to_card") {
                                console.log("Detected click for cardInteraction with key <click_on_other_stable_card>");
                                // is clicked card a valid target?
                                if (cardInteraction.info.targets.find(s => s.cardID === cardID)) {
                                    console.log(`Clicked card is a valid target. Execute instruction with id <${cardInteraction.info.instructionID}>`);
                                    moves.executeDo(cardInteraction.info.instructionID, {
                                        protagonist: playerID, cardID
                                    });
                                    setCardInteraction(undefined);
                                }
                            }
                        }
                    }}
                    onStableItemMouseEnter={cardID => {
                        const o = openScenes.filter(([instr, scene]) => instr.ui.info?.source === cardID);
                        let targets: HoverTarget[] = [];
                        o.forEach(([instruction, scene]) => {
                            targets = [...targets, ...findUITargets(G, ctx, instruction)];
                        });

                        // show hover targets if the hovered card is a source card
                        if (o.length > 0) {
                            setHoverTargets({sourceCardID: cardID, targets});
                        }
                    }}
                    onStableItemMouseLeave={cardID => {
                        // if a card to card interaction is in progress we do not want to unhighlight the targets
                        // thus we unhighlight the targets when are not in a card to card interaction
                        // this if query checks this condition 
                        if (cardInteraction?.key !== "card_to_card") {
                            setHoverTargets(undefined);
                        }
                    }}
                    renderAccessoryHoverItem={cardID => {
                        let boardState = boardStates.find(s => s.type === "discard__popup__ask" && s.info?.sourceCardID === cardID);
                        if (boardState) {
                            const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                            // this if condition is just for typescript interference
                            if (instruction.do.key === "discard" && instruction.ui.type === "single_action_popup") {
                                return (
                                    <CardPopupSingleAction
                                        text={instruction.ui.info?.singleActionText!}
                                        onClick={() => {
                                            moves.commit(scene!.id);
                                        }}
                                    />
                                );
                            }
                        }

                        boardState = boardStates.find(s => s.type === "bring__popup__ask" && s.info?.sourceCardID === cardID);
                        if (boardState) {
                            const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                            // this if condition is just for typescript interference
                            if (instruction.do.key === "bringToStable" && instruction.ui.type === "single_action_popup") {
                                return (
                                    <CardPopupSingleAction
                                        text={instruction.ui.info?.singleActionText!}
                                        onClick={() => {
                                            moves.commit(scene!.id);
                                        }}
                                    />
                                );
                            }
                        }

                        boardState = boardStates.find(s => (s.type === "shakeUp" || s.type === "reset" || s.type === "shuffleDiscardPileIntoDrawPile") && s.info?.sourceCardID === cardID);
                        if (boardState) {
                            const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                            // this if condition is just for typescript interference
                            if ((instruction.do.key === "shakeUp" || instruction.do.key === "reset" || instruction.do.key === "shuffleDiscardPileIntoDrawPile") && instruction.ui.type === "single_action_popup") {
                                return (
                                    <CardPopupSingleAction
                                        text={instruction.ui.info?.singleActionText!}
                                        onClick={() => {
                                            moves.executeDo(instruction.id, {protagonist: playerID, sourceCardID: cardID});
                                        }}
                                    />
                                );
                            }
                        }

                        boardState = boardStates.find(s => (s.type === "revive") && s.info?.sourceCardID === cardID);
                        if (boardState) {
                            const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                            // this if condition is just for typescript interference
                            if ((instruction.do.key === "revive") && instruction.ui.type === "single_action_popup") {
                                return (
                                    <CardPopupSingleAction
                                        text={instruction.ui.info?.singleActionText!}
                                        onClick={() => {
                                            setShowDiscardFinder(boardState?.info?.targets.map((s: ReviveTarget) => ({ cardID: s.cardID})));
                                        }}
                                    />
                                );
                            }
                        }

                        boardState = boardStates.find(s => (s.type === "reviveFromNursery") && s.info?.sourceCardID === cardID);
                        if (boardState) {
                            const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                            // this if condition is just for typescript interference
                            if ((instruction.do.key === "reviveFromNursery") && instruction.ui.type === "single_action_popup") {
                                return (
                                    <CardPopupSingleAction
                                        text={instruction.ui.info?.singleActionText!}
                                        onClick={() => {
                                            setSHowNurseryFinder(true);
                                        }}
                                    />
                                );
                            }
                        }

                        boardState = boardStates.find(s => (s.type === "addFromDiscardPileToHand__single_action_popup") && s.info?.sourceCardID === cardID);
                        if (boardState) {
                            const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                            // this if condition is just for typescript interference
                            if ((instruction.do.key === "addFromDiscardPileToHand") && instruction.ui.type === "single_action_popup") {
                                return (
                                    <CardPopupSingleAction
                                        text={instruction.ui.info?.singleActionText!}
                                        onClick={() => {
                                            setShowDiscardFinder(boardState?.info?.targets.map((s: AddFromDiscardPileToHandTarget) => ({ cardID: s.cardID})));
                                        }}
                                    />
                                );
                            }
                        }

                        boardState = boardStates.find(s => (s.type === "search__single_action_popup") && s.info?.sourceCardID === cardID);
                        if (boardState) {
                            const [instruction, action, scene] = _findInstruction(G, boardState.info?.instructionID)!;
                            // this if condition is just for typescript interference
                            if ((instruction.do.key === "search") && instruction.ui.type === "single_action_popup") {
                                return (
                                    <CardPopupSingleAction
                                        text={instruction.ui.info?.singleActionText!}
                                        onClick={() => {
                                            setShowDeckFinder(boardState?.info?.targets);
                                        }}
                                    />
                                );
                            }
                        }



                        return undefined;
                    }}
                    onPlaceHereClick={() => {
                        if (cardInteraction?.key === "play_upgradeDowngradeCardFromHand__choose_target") {
                            moves.playUpgradeDowngradeCard(playerID, playerID, cardInteraction.info.cardID);
                            setCardInteraction(undefined);
                        }
                    }}
                />
                {renderHand(G, ctx, moves, playerID, boardStates, cardInteraction, setCardInteraction, () => setHoveringOverHandCard(true), () => setHoveringOverHandCard(false), () => setHoveringOverHandCard(false), openScenes)}
            </Bottom>
        </Wrapper>
    );
}

////////////////////////////////

const renderNeighLabel = (G: UnstableUnicornsGame, ctx: Ctx, moves: any, playerID: PlayerID) => {
    if (!G.neighDiscussion) {
        return null;
    }

    const currentRound = _.last(G.neighDiscussion.rounds)!;
    let role: NeighLabelRole = "original_initiator";
    let newInitiatorName: string | undefined = undefined;
    const originalInitiatorName = G.players[parseInt(G.neighDiscussion.protagonist)].name;

    if (G.neighDiscussion.rounds.length > 1) {
        const beforeRound = _.last(G.neighDiscussion.rounds, 2)[0];
        newInitiatorName = G.players[parseInt(_.findKey(beforeRound.playerState, val => val.vote === "neigh")!)].name;
    }

    if (G.neighDiscussion.protagonist === playerID) {
        if (G.neighDiscussion.rounds.length > 1) {
            const beforeRound = _.last(G.neighDiscussion.rounds, 2)[0];
            if (beforeRound.playerState[playerID].vote === "neigh") {
                role = "original_initiator";
            } else {
                role = "original_initiator_can_counterneigh";
            }
        } else {
            role = "original_initiator";
        }
    } else if (currentRound.playerState[playerID].vote === "undecided") {
        role = "open";
    } else if (currentRound.playerState[playerID].vote === "neigh") {
        role = "did_neigh";
    } else if (currentRound.playerState[playerID].vote === "no_neigh") {
        if (G.neighDiscussion.rounds.length > 1) {
            const beforeRound = _.last(G.neighDiscussion.rounds, 2)[0];
            if (beforeRound.playerState[playerID].vote === "neigh") {
                role = "new_initiator";
            } else {
                role = "did_not_neigh";
            }
        } else {
            role = "did_not_neigh";
        }
    }

    const onPlayNeighClick = () => {
        const neighCardOnHand = G.hand[playerID].map(c => G.deck[c]).find(c => c.type === "neigh");
        if (neighCardOnHand) {
            moves.playNeigh(neighCardOnHand.id, playerID, G.neighDiscussion!.rounds.length - 1)
        } else {
            const superNeigh = G.hand[playerID].map(c => G.deck[c]).find(c => c.type === "super_neigh");
            moves.playSuperNeigh(superNeigh!.id, playerID, G.neighDiscussion!.rounds.length - 1)
        }
    }

    const onDontPlayNeighClick = () => {
        moves.dontPlayNeigh(playerID, G.neighDiscussion!.rounds.length - 1);
    }

    const didVote = currentRound.playerState[playerID].vote !== "undecided";

    return (
        <NeighLabelWrapper>
            <NeighLabel card={G.deck[G.neighDiscussion.cardID]} originalInitiatorName={originalInitiatorName} newInitiatorName={newInitiatorName} role={role} didVote={didVote} numberOfNeighedCards={G.neighDiscussion.rounds.filter(s => s.state === "neigh").length} showPlayNeighButton={G.hand[playerID].map(c => G.deck[c]).filter(c => c.type === "neigh" || c.type === "super_neigh").length > 0 && G.playerEffects[playerID].find(s => s.effect.key === "you_cannot_play_neigh") === undefined} onPlayNeighClick={onPlayNeighClick} onDontPlayNeighClick={onDontPlayNeighClick} />
        </NeighLabelWrapper>
    );
}

const renderTop = (G: UnstableUnicornsGame, ctx: Ctx, isCurrentPlayer: boolean, boardStates: BoardState[]) => {
    if (isCurrentPlayer) {
        let text: string = "It's your turn";
        if (boardStates.find(s => s.type === "neigh__wait")) {
            text = "It's neigh time! Other players may neigh your card. Waiting for others..."
        }
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <GameLabel text={text} />
            </div>
        );
    } else {
        return (
            <HiddenHand
                count={G.hand[ctx.currentPlayer].length}
            />
        );
    }
};

const renderEndTurnButton = (moves: any, playerID: PlayerID, boardStates: BoardState[]) => {
    if (boardStates.find(s => s.type === "endTurn")) {
        return (
            <EndTurnButtonWrapper>
                <EndTurnButton onClick={() => { moves.end(playerID); }}>End turn</EndTurnButton>
            </EndTurnButtonWrapper>
        );
    }

    return undefined;
}

const renderHand = (G: UnstableUnicornsGame, ctx: Ctx, moves: any, playerID: PlayerID, boardStates: BoardState[], cardInteraction: CardInteraction | undefined, setCardInteraction: (interaction: CardInteraction) => void, onMouseEnterHandCard: () => void, onMouseLeaveHandCard: () => void, onHandCardClick: () => void, openScenes: Array<[Instruction, Scene]>) => {
    let glowingCards: CardID[] = [];

    if (boardStates.find(s => s.type === "playCard")) {
        // current player may play cards from its hand
        if (cardInteraction?.key === "play_upgradeDowngradeCardFromHand__choose_target") {
            // no glowing cards
        } else {
            glowingCards = G.hand[playerID].map(c => [canPlayCard(G, ctx, playerID, c), c]).filter(s => s[0]).map(s => s[1]) as CardID[];
        }
    } else if (boardStates.find(s => s.type === "neigh__playNeigh")) {
        if (G.playerEffects[playerID].find(s => s.effect.key === "you_cannot_play_neigh") === undefined) {
            glowingCards = G.hand[playerID].map(c => G.deck[c]).filter(c => c.type === "neigh" || c.type === "super_neigh").map(c => c.id);
        }
    } else if (boardStates.find(s => s.type === "discard" || s.type === "discard__popup__committed")) {
        const discardState = boardStates.find(s => s.type === "discard" || s.type === "discard__popup__committed")!;
        glowingCards = discardState.info!.targets.map((c: DiscardTarget) => c.handIndex).map((c: number) => G.hand[playerID][c])
    } else if (boardStates.find(s => s.type === "bring__popup__committed")) {
        const discardState = boardStates.find(s => s.type === "discard" || s.type === "bring__popup__committed")!;
        glowingCards = discardState.info!.targets.map((c: BringToStableTarget) => c.cardID);
    }

    const onClick = (evt: React.MouseEvent, cardID: CardID) => {

        if (boardStates.find(s => s.type === "playCard")) {
            const cardsOnHandThatCanBePlayed = G.hand[playerID].map(c => [canPlayCard(G, ctx, playerID, c), c]).filter(s => s[0]).map(s => s[1]) as CardID[];
            if (cardsOnHandThatCanBePlayed.includes(cardID)) {
                const card = G.deck[cardID];
                if (card.type === "upgrade" || card.type === "downgrade") {
                    setCardInteraction({ 
                        key: "play_upgradeDowngradeCardFromHand__choose_target",
                        info: {
                            instructionID: "____________",
                            currentMousePosition: { x: evt.clientX, y: evt.clientY },
                            startingMousePosition: { x: evt.clientX, y: evt.clientY },
                            cardID
                        },
                    });
                } else {
                    moves.playCard(playerID, cardID);
                }
            }
            onHandCardClick();
        } else if (boardStates.find(s => s.type === "neigh__playNeigh")) {
            if (G.deck[cardID].type === "neigh" || G.deck[cardID].type === "super_neigh") {
                if (G.playerEffects[playerID].find(s => s.effect.key === "you_cannot_play_neigh") === undefined) {
                    moves.playNeigh(cardID, playerID, G.neighDiscussion!.rounds.length - 1);
                }
            }
            onHandCardClick();
        } else if (boardStates.find(s => s.type === "discard" || s.type === "discard__popup__committed")) {
            const discardState = boardStates.find(s => s.type === "discard" || s.type === "discard__popup__committed")!;
            if (discardState.info!.targets.find((s: DiscardTarget) => G.deck[G.hand[playerID][s.handIndex]].id === cardID)) {
                // if click on hand card that is discardable
                moves.executeDo(discardState.info!.instructionID, { protagonist: playerID, cardID });
                onHandCardClick();
            }
        } else if (boardStates.find(s => s.type === "bring__popup__committed")) {
            const discardState = boardStates.find(s => s.type === "bring__popup__committed")!;
            if (discardState.info!.targets.find((s: BringToStableTarget) => s.cardID === cardID)) {
                // if click on hand card that is discardable
                moves.executeDo(discardState.info!.instructionID, { protagonist: playerID, cardID });
                onHandCardClick();
            }
        }
    }

    return (
        <Hand cards={G.hand[playerID].map(c => G.deck[c])} glowingCards={glowingCards} onClick={onClick} onMouseEnterHandCard={() => onMouseEnterHandCard()} onMouseLeaveHandCard={() => onMouseLeaveHandCard()} />
    );
}

const renderInfoLabel = (G: UnstableUnicornsGame, boardStates: BoardState[]) => {
    let text: string | undefined = undefined;

    if (boardStates.find(o => o.type === "discard" || o.type === "discard__popup__committed")) {
        text = "Click on a card in your hand to discard that card."
    } 

    if (boardStates.find(o => o.type === "destroy__click_on_card_in_stable")) {
        text = "Click on a card in a player's stable to destroy that card."
    }

    if (boardStates.find(o => o.type === "sacrifice__clickOnCardInStable")) {
        text = "Click on a card in your stable to sacrifice that card."
    }

    if (boardStates.find(o => o.type === "steal__cardToCard")) {
        const boardState = boardStates.find(o => o.type === "steal__cardToCard")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then click on another player's card which you'd like to steal.`
    }

    if (boardStates.find(o => o.type === "draw__clickOnDrawPile")) {
        const boardState = boardStates.find(o => o.type === "draw__clickOnDrawPile");
        text = `Click on the draw pile on the right to draw ${boardState?.info?.count} card.`
    }

    if (boardStates.find(o => o.type === "swapHands__cardToPlayer")) {
        const boardState = boardStates.find(o => o.type === "swapHands__cardToPlayer")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then on a player's name to trade hands with them.`
    }

    if (boardStates.find(o => o.type === "move__cardToCard")) {
        const boardState = boardStates.find(o => o.type === "move__cardToCard")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then on another card to move that card.`
    }

    if (boardStates.find(o => o.type === "move2__cardToPlayer")) {
        const boardState = boardStates.find(o => o.type === "move2__cardToPlayer")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then on any player's name to move the previously selected card into that player's stable.`
    }

    if (boardStates.find(o => o.type === "wait_for_other_players")) {
        text = "Wait for other players...";
    }

    if (boardStates.find(o => o.type === "unicornswap1")) {
        const boardState = boardStates.find(o => o.type === "unicornswap1")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then on one of your cards which should be moved.`
    }

    if (boardStates.find(o => o.type === "unicornswap2")) {
        const boardState = boardStates.find(o => o.type === "unicornswap2")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then click on another player from whom you like to steal a card.`
    }

    if (boardStates.find(o => o.type === "blatantThievery1")) {
        const boardState = boardStates.find(o => o.type === "blatantThievery1")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then click on a player to take a look at the player's hand.`
    }

    if (boardStates.find(o => o.type === "pullRandom__cardToPlayer")) {
        const boardState = boardStates.find(o => o.type === "pullRandom__cardToPlayer")!;
        const card = G.deck[boardState.info!.sourceCardID];
        text = `Click on ${card.title} and then click on a player to pull a random card from that player.`
    }

    if (!text) {
        return undefined;
    }

    return (
        <InfoLabelWrapper>
            <InfoLabel>
                {text}
            </InfoLabel>
        </InfoLabelWrapper>
    );
}

////////////////////////////////

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url(${BG});
    background-size: cover;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Top = styled.div`
    position: absolute; 
    top: 0;
    z-index: 0;
`;

const Main = styled.div`
    display: flex;
    justify-content: center;
    width: 1000px;
    margin-top: 80px;
    z-index: 1;
`;

const Middle = styled.div`
    width: 1200px;
    position: relative;
`;

const MiddleLabel = styled.div`
    color: white; 
    margin-bottom: 0.4em;
`;

const MiddleLeftWrapper = styled.div<{ zIndexFocus: boolean }>`
    position: absolute;
    left: 0;
    transform: translate(0, -80px);
    z-index: ${props => props.zIndexFocus ? 10 : 3000};
`;

const DrawPileWrapper = styled.div<{ zIndexFocus: boolean }>`
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: ${props => props.zIndexFocus ? 10 : 3000};
`;



const Bottom = styled.div`
    position: absolute;
    bottom: 140px;
    width: 100%;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2000;
`;

const EndTurnButtonWrapper = styled.div`
    position: absolute; 
    top: 110%; 
    z-index: 3000; 
    width: 200px;
`;

const NeighLabelWrapper = styled.div`
    width: 100%; 
    display: flex;
    justify-content: center;
    position: absolute; 
    top: -16px;
`;

const InfoLabelWrapper = styled.div`
    width: 100%; 
    display: flex;
    justify-content: center;
    position: absolute; 
    top: -16px;
`;

export default Board;
