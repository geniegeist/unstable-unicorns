import _ from 'underscore';
import styled from 'styled-components';
import type { Card, CardID } from "../game/card";
import ImageLoader from '../assets/card/imageLoader';
import { _typeToColor } from './util';
import  { useState } from 'react';
import CardHover from './CardHover';
import useSound from 'use-sound';
const HubMouseOverSound = require('../assets/sound/Hub_Mouseover.ogg').default;

type Props = {
    cards: Card[];
    onClick: () => void;
}

const DiscardPile = (props: Props) => {
    const [playHubMouseOverSound] = useSound(HubMouseOverSound, {
        volume: 0.2,
    });

    const [hover, setHover] = useState<boolean>(false);
    return (
        <Wrapper onClick={props.onClick} onMouseEnter={() => {setHover(true);playHubMouseOverSound();}} onMouseLeave={() => setHover(false)}>
            {props.cards.length > 0 &&
                <CardImage image={ImageLoader.load(_.last(props.cards)!.image)}>
                </CardImage>
            }
            {_.last(props.cards) && hover &&
                <CardHover title={_.last(props.cards)!.title} position={"top"} offset={{x: 120, y: -10}} color={_typeToColor(_.last(props.cards)!.type)} text={_.last(props.cards)!.description} />
            }
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100px;
    height: 130px;
    cursor: pointer;
    border: 4px solid rgba(0,0,0,0.5);
    border-radius: 16px;
    transform: rotate(3deg);
    cursor: pointer;
    position: relative;
`;

const CardImage = styled.div<{image: string}>`
    width: 100%;
    height: 100%;
    background-image: url(${props => props.image});
    background-size: cover;
    border-radius: 12px;
    cursor: pointer;
`;

export default DiscardPile;