import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import ImageLoader from '../assets/card/imageLoader';
import { Card, CardID } from '../game/card';
import { UnstableUnicornsGame } from '../game/game';
import { NeighDiscussion } from '../game/neigh';
import CardHover from './CardHover';
import { motion, AnimatePresence } from 'framer-motion';
import { _typeToColor } from './util';
import useSound from 'use-sound';
import { LanguageContext } from '../LanguageContextProvider';
import { cardDescription } from '../BoardUtil';
const MouseClickSound = require('../assets/sound/UI_MouseClick_01.ogg').default;
const HubMouseOverSound = require('../assets/sound/Hub_Mouseover.ogg').default;

type Props = {
    card: Card;
    role: NeighLabelRole;
    originalInitiatorName: string;
    newInitiatorName?: string;
    numberOfNeighedCards: number;
    didVote: boolean;
    showPlayNeighButton: boolean;
    onPlayNeighClick: () => void;
    onDontPlayNeighClick: () => void;
}

export type NeighLabelRole = "original_initiator" | "new_initiator" | "did_neigh" | "did_not_neigh" | "open" | "original_initiator_can_counterneigh";

const NeighLabel = (props: Props) => {
    const [showHover, setShowHover] = useState<undefined | CardID>(undefined);
    const [playMouseClick] = useSound(MouseClickSound, {
        volume: 0.4,
    });
    const [playHoverSound] = useSound(HubMouseOverSound, {
        volume: 0.3,
    });
    const context = useContext(LanguageContext)

    let text = "";
    if (props.role === "original_initiator") {
        text = "Other players may neigh your card. Wait for their decision..."
    } else if (props.role === "did_neigh") {
        text = "You played a neigh card.";
    } else if (props.role === "did_not_neigh") {
        text = "You did not play a neigh card. Wait for the other players..."
    } else if (props.role === "open") {
        if (props.newInitiatorName !== undefined) {
            text = `${props.newInitiatorName} played a neigh card. Do you want to neigh the neigh card of ${props.newInitiatorName}?`;
        } else {
            text = `${props.originalInitiatorName} played ${props.card.title}. Do you want to neigh the card?`
        }
    } else if (props.role === "new_initiator") {
        text = `You played a neigh card. Others may neigh your neigh card. Wait for their decision...`;
    } else if (props.role === "original_initiator_can_counterneigh") {
        text = `${props.newInitiatorName} played a neigh card. Do you want to neigh his neigh card?`;
    }

    return (
        <Wrapper exit={{ opacity: 0, y: 200 }} initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: 0 }} transition={{duration: 1}}>
            <div onMouseEnter={() => {
                setShowHover(props.card.id);
                playHoverSound();
            }}
                onMouseLeave={() => {
                    setShowHover(undefined);
                }}>
                <CardImage src={ImageLoader.load(props.card.image)} />
                {showHover === props.card.id &&
                    <CardHover title={props.card.title} position={"bottom"} offset={{ x: 80, y: -30 }} color={_typeToColor(props.card.type)} text={cardDescription(props.card, context!.language)} />
                }
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                    {text}
                </div>
                {props.numberOfNeighedCards % 2 === 1 &&
                    <div>
                        Neigh result: {props.originalInitiatorName} <span style={{ color: "red" }}>is stopped from playing </span> {props.card.title}.
                    </div>
                }
                {props.numberOfNeighedCards % 2 === 0 &&
                    <div>
                        Neigh result: {props.originalInitiatorName} <span style={{ color: "green" }}>can play </span> {props.card.title}.
                    </div>
                }

            </div>
            {props.didVote === false &&
                <div style={{ marginLeft: "1em" }}>
                    <DontNeighButton onClick={() => {props.onDontPlayNeighClick(); playMouseClick();}}>Don't neigh</DontNeighButton>
                </div>
            }
            {props.showPlayNeighButton && props.didVote === false &&
                <div style={{ marginLeft: "1em" }}>
                    <NeighButton onClick={() => {props.onPlayNeighClick(); playMouseClick()}}>Play Neigh</NeighButton>
                </div>
            }
        </Wrapper>
    );
}

const Wrapper = styled(motion.div)`
    background-color: rgba(0,0,0,0.6);
    font-family: Open Sans Condensed;
    color: white;
    padding: 1em;
    border-radius: 16px;
    margin-top: 1em;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const glow = keyframes`
    from {
        box-shadow: 0 0px 40px #f0f, 0 0px 10px red, 0 0px 20px #0ff;
    }
    to {
        box-shadow: 0 0px 40px #0ff, 0 0px 10px #f0f, 0 0px 20px #f0f;
    }
`;

const CardImage = styled(motion.img)`
    width: 64px;
    height: 64px;
    border-radius: 12px;
    margin-right: 1em;
    animation: ${glow} 1s infinite alternate;
`;

const DontNeighButton = styled.div`
    padding: 0.5em;
    border-radius: 12px;
    background-color: red;
    cursor: pointer;
`;

const NeighButton = styled.div`
padding: 0.5em;
border-radius: 12px;
background-color: green;
cursor: pointer;
`;

export default NeighLabel;