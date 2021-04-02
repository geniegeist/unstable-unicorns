import styled, { css, keyframes } from 'styled-components';
import type { Card, CardID } from "../game/card";
import ImageLoader from '../assets/card/imageLoader';
import { _typeToColor } from './util';
import { useState, RefObject } from 'react';
import React from 'react';
import { useImperativeHandle } from 'react';
import useDynamicRefs from 'use-dynamic-refs';
import CardHover from './CardHover';

type Props = {
    cards: Card[];
    upgradeDowngradeCards: Card[];
    glowing: CardID[];
    highlightMode?: CardID[];
    renderAccessoryHoverItem: (cardID: CardID) => React.ReactElement | undefined;
    onStableItemMouseEnter: (cardID: CardID) => void;
    onStableItemMouseLeave: (cardID: CardID) => void;
    onStableItemClick: (evt: React.MouseEvent, cardID: CardID) => void;
    onPlaceHereClick: (evt: React.MouseEvent) => void;
}

export type StableHandle = {
    getStableItemRef: (cardID: CardID) => RefObject<HTMLDivElement>; 
}

const Stable = React.forwardRef<StableHandle, Props>((props, ref) => {

    const [getItemRefs, setItemRefs] = useDynamicRefs();
    const [showHover, setShowHover] = useState<undefined | CardID>(undefined);

    useImperativeHandle(ref, () => ({
        getStableItemRef: (cardID: CardID) => {
            return getItemRefs(`${cardID}`) as any;
        }
    }));

    return (
        <Wrapper>
            <UpgradeDowngradeStableWrapper>
                {props.upgradeDowngradeCards.map(card => {
                    return (
                        <StableItem 
                            key={card.id}
                            onClick={evt => props.onStableItemClick(evt, card.id)} 
                            ref={setItemRefs(`${card.id}`) as any} 
                            onMouseEnter={() => {
                                props.onStableItemMouseEnter(card.id);
                                setShowHover(card.id);
                            }} 
                            onMouseLeave={() => {
                                props.onStableItemMouseLeave(card.id)
                                setShowHover(undefined);
                            }}
                        >
                            <MiniCardImage 
                                src={ImageLoader.load(card.image)} 
                                color={_typeToColor(card.type)} 
                                isGlowing={props.glowing.includes(card.id)} 
                                isTranslucent={props.highlightMode ? !props.highlightMode.includes(card.id) : false}
                            />
                            {showHover === card.id &&
                                <CardHover position={"bottom"} offset={{x: 45, y: 10}} color={_typeToColor(card.type)} text={card.description}>
                                {props.renderAccessoryHoverItem(card.id)}
                                </CardHover>
                            }
                        </StableItem>
                    );
                })}
            </UpgradeDowngradeStableWrapper>
            <StableWrapper>
                {props.cards.map((card, idx) => {
                    return (
                        <StableItem 
                            key={card.id} 
                            ref={setItemRefs(`${card.id}`) as any} 
                            onClick={evt => props.onStableItemClick(evt, card.id)} 
                            onMouseEnter={() => {
                                props.onStableItemMouseEnter(card.id);
                                setShowHover(card.id);
                            }} 
                            onMouseLeave={() => {
                                props.onStableItemMouseLeave(card.id)
                                setShowHover(undefined);
                            }}
                        >
                            <CardImage 
                                src={ImageLoader.load(card.image)} 
                                color={_typeToColor(card.type)} 
                                isGlowing={props.glowing.includes(card.id)} 
                                isTranslucent={props.highlightMode ? !props.highlightMode.includes(card.id) : false}
                            />
                            {showHover === card.id &&
                                <CardHover position={"bottom"} offset={{x: 80, y: 0}} color={_typeToColor(card.type)} text={card.description}>
                                {props.renderAccessoryHoverItem(card.id)}
                                </CardHover>
                            }
                        </StableItem>
                    );
                })}
                <Placeholder onClick={evt => props.onPlaceHereClick(evt)}>
                    Place your cards here
                </Placeholder>
            </StableWrapper>
        </Wrapper>
    );
});

const Wrapper = styled.div`
    width: 700px;
`;

const StableWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #6D5031;
    padding: 0.5em;
    border-radius: 16px;
`;

const UpgradeDowngradeStableWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const StableItem = styled.div`
    padding: 0 0.5em;
    cursor: pointer;
    position: relative;
`;

const glow = keyframes`
    from {
        box-shadow: 0 0px 40px #f0f, 0 0px 10px red, 0 0px 20px #0ff;
    }
    to {
        box-shadow: 0 0px 40px #0ff, 0 0px 10px #f0f, 0 0px 20px #f0f;
    }
`;

const CardImage = styled.img<{color: string, isGlowing: boolean, isTranslucent: boolean}>`
    width: 64px;
    height: 64px;
    border-radius: 12px;
    border: 4px solid ${props => props.color};
    animation: ${props => props.isGlowing ? css`${glow} 1s infinite alternate` : 'null'};
    opacity: ${props => !props.isTranslucent ? 1 : 0.5};
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const MiniCardImage = styled.img<{color: string, isGlowing: boolean, isTranslucent: boolean}>`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 2px solid ${props => props.color};
    cursor: pointer;
    margin: 0 0.25em;
    animation: ${props => props.isGlowing ? css`${glow} 1s infinite alternate` : 'null'};
    opacity: ${props => !props.isTranslucent ? 1 : 0.5};
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const Placeholder = styled.div`
    background-color: rgba(0,0,0,0.2);
    width: 100%;
    margin-left: 1em;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Open Sans Condensed;
    color: rgba(0,0,0,0.6);
    font-size: 1.4em;
    cursor: pointer;
`;

// keyframes



export default Stable;