import styled, { css, keyframes } from 'styled-components';
import { Card, CardID, CardType } from '../game/card';
import ImageLoader from '../assets/card/imageLoader';
import _ from 'underscore';
import { _typeToColor } from './util';
import CardHover from './CardHover';
import { useContext, useState } from 'react';

import useSound from 'use-sound';
import { LanguageContext } from '../LanguageContextProvider';
import { cardDescription } from '../BoardUtil';
const HandOverSound = require('../assets/sound/collection_manager_card_mouse_over.ogg').default;

type Props = {
    cards: Card[];
    glowingCards: CardID[];
    onClick: (evt: React.MouseEvent, cardID: CardID) => void;
    onMouseEnterHandCard: (index: number) => void;
    onMouseLeaveHandCard: (index: number) => void;
}

const Hand = (props: Props) => {

    const [hoverCardID, setHoverCardID] = useState<CardID | undefined>(undefined);
    const [playHandOverCardSound] = useSound(HandOverSound, {
        volume: 0.3,
    });
    const context = useContext(LanguageContext)


    return (
        <Wrapper>
            {props.cards.map((card, idx) => {
                const onMouseEnter = () => {
                    playHandOverCardSound();
                    props.onMouseEnterHandCard(idx);
                    setHoverCardID(card.id);
                }

                const onMouseLeave = () => {
                    props.onMouseLeaveHandCard(idx);
                    setHoverCardID(undefined);
                };

                let typeText: string | undefined = undefined;
                switch (card.type) {
                    case "upgrade": {
                        typeText = "An upgrade card can be placed in any stable and grants the stable owner a positive effect.";
                        break;
                    }
                    case "downgrade": {
                        typeText = "A downgrade card can be placed in any stable and grants the stable owner a negative effect.";
                        break;
                    }
                    case "neigh":
                    case "super_neigh": {
                        typeText = "This card can be played at any time any other players plays a card.";
                        break;
                    }
                }

                return (
                    <CardWrapper key={card.id} borderColor={_typeToColor(card.type)} isGlowing={props.glowingCards.includes(card.id)} transform={_transformForCard(idx, props.cards.length)} onClick={(evt) => props.onClick(evt, card.id)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} bringToForeground={hoverCardID === card.id}>
                        <Top>
                            <Type fontColor={_typeToColor(card.type)}>
                                <img src={ImageLoader.icon(card.type)} width={"20px"}/>
                                {_typeToString(card.type)}
                            </Type>
                            <Title>
                                {card.title}
                            </Title>
                        </Top>
                        <CardImage image={ImageLoader.load(card.image)} />
                        {hoverCardID === card.id &&
                            <>
                                <CardHover title={card.title} scale={0.75} position="top" offset={{ x: idx < 3 ? 210 : -220, y: -40 }} text={cardDescription(card, context!.language)} color={_typeToColor(card.type)} text2={typeText} />
                            </>
                        }
                    </CardWrapper>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    padding: 1em;
    font-family: 'Open Sans Condensed', sans-serif;
`;

const CardWrapper = styled.div<{ bringToForeground: boolean, borderColor: string, transform: { x: number, y: number, rotate: string }, isGlowing: boolean }>`
    border-radius: 16px;
    width: 175px;
    height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border: 8px solid ${props => props.borderColor};
    transform: translate(${props => props.transform.x}px, ${props => props.transform.y}px) rotate(${props => props.transform.rotate});
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    animation: ${props => props.isGlowing ? css`${glow} 1s infinite alternate` : 'null'};
    :hover {
        transform: translate(${props => props.transform.x}px, -90%) scale(1.5);
    }
    cursor: pointer;
    z-index: ${props => props.bringToForeground ? 4 : 0 };
`;

const Top = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0.5em;
    margin-left: 1em;
`;

const Type = styled.div<{ fontColor: string }>`
    display: flex;
    align-content: center;
    font-weight: bold;
    font-size: 0.9em;
    color: ${props => props.fontColor};
`;

const Title = styled.div`
    font-weight: bold;
    font-size: 1.1em;
`;

const CardImage = styled.div<{ image: string }>`
    background-image: url(${props => props.image});
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
`;

const glow = keyframes`
    from {
        box-shadow: 0 0px 40px #f0f, 0 0px 10px red, 0 0px 20px #0ff;
    }
    to {
        box-shadow: 0 0px 40px #0ff, 0 0px 10px #f0f, 0 0px 20px #f0f;
    }
`;

function _typeToString(type: CardType): string {
    if (type === "baby") {
        return "Baby";
    }

    if (type === "basic") {
        return "Basic"
    }

    if (type === "downgrade") {
        return "Downgrade";
    }

    if (type === "upgrade") {
        return "Upgrade";
    }

    if (type === "narwhal") {
        return "Narwhal";
    }

    if (type === "neigh") {
        return "Neigh";
    }

    if (type === "super_neigh") {
        return "Super Neigh";
    }

    if (type === "magic") {
        return "Magic";
    }

    if (type === "unicorn") {
        return "Unicorn";
    }

    return "Undefined";
}

function _transformForCard(idx: number, countCards: number): { x: number, y: number, rotate: string } {
    const midIdx = (countCards / 2);
    let degStep = 0;
    let xStep = 0;
    let yStep = 0;
    if (countCards <= 6) {
        degStep = 5;
        xStep = -35;
        yStep = 7;
    } else if (countCards <= 8) {
        degStep = 5.5;
        xStep = -90;
        yStep = 3;
    } else {
        degStep = 4;
        xStep = -100;
        yStep = 1;
    }

    return { x: (idx - midIdx) * xStep, y: Math.abs(idx - midIdx) * Math.abs(idx - midIdx) * yStep, rotate: `${(idx - midIdx) * degStep}deg` };
}

export default Hand;