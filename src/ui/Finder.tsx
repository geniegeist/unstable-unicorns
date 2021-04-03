import React, { useState } from 'react';
import styled from 'styled-components';
import ImageLoader from '../assets/card/imageLoader';
import BG from '../assets/ui/board-background.jpg';
import { Card, CardID } from '../game/card';
import CardHover from './CardHover';
import { _typeToColor } from './util';

type Props = {
    cards: Card[];
    showBackButton?: boolean;
    onBackClick: () => void;
    onCardClick: (cardID: CardID) => void;
    title?: string;
    hide?: boolean;
}

const Finder = (props: Props) => {
    const [showHover, setShowHover] = useState<CardID | undefined>(undefined);
    return (
        <Wrapper>
            {(props.showBackButton === undefined || props.showBackButton === true) &&
                <Button onClick={() => props.onBackClick()}>
                    Go back
                </Button>
            }

            {props.title && <p style={{padding: "1em", backgroundColor: "#F8B500", borderRadius: "12px", color: "white"}}>{props.title}</p>}
            
            <List>
                {props.cards.map((card, idx) => {
                    return (
                        <Item key={card.id} onMouseEnter={() => setShowHover(card.id)} onMouseLeave={() => setShowHover(undefined)}>
                            <div onClick={() => props.onCardClick(card.id)}>
                                <CardImage image={props.hide ? ImageLoader.load("back") : ImageLoader.load(card.image)} color={props.hide ? "black"  : _typeToColor(card.type)} />
                            </div>
                            {(!props.hide) && showHover === card.id && idx % 5 <= 2 && 
                                <CardHover title={card.title} position={"top"} offset={{x: 150, y: 20}} color=       {_typeToColor(card.type)} text={card.description} />
                            }
                            {(!props.hide) && showHover === card.id && idx % 5 > 2 && 
                                <CardHover title={card.title} position={"top"} offset={{x: -300, y: 20}} color=       {_typeToColor(card.type)} text={card.description} />
                            }
                        </Item>
                        
                    );
                })}
            </List>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    background-image: url(${BG});
    background-size: cover;
    position: absolute;
    height: 100vh;
    width: 100%;
    z-index: 100000;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
`;

const Button = styled.div`
    background-color: black;
    color: white;
    border-radius: 12px;
    padding: 1em;
    cursor: pointer;
    width: 200px;
`;

const List = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 800px;
    overflow: visible;
`;

const Item = styled.div`
    position: relative;
`;

const CardImage = styled.div<{image: string; color: string}>`
    width: 120px;
    height: 150px;
    background-image: url(${props => props.image});
    background-size: cover;
    border-radius: 12px;
    cursor: pointer;
    margin: 1em;
    border: 4px solid ${props => props.color};
`;

export default Finder;