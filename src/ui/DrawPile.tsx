import styled, { css, keyframes } from 'styled-components';
import type { Card } from "../game/card";
import ImageLoader from '../assets/card/imageLoader';
import { _typeToColor } from './util';
import BACK from '../assets/card/UU-Back-Main.png';
import useSound from 'use-sound';
const HubMouseOverSound = require('../assets/sound/Hub_Mouseover.ogg').default;

type Props = {
    count: number;
    isGlowing: boolean;
    onClick: () => void;
}

const DrawPile = (props: Props) => {
    const [playHubMouseOverSound] = useSound(HubMouseOverSound, {
        volume: 0.2,
    });

    return (
        <Wrapper onMouseEnter={() => playHubMouseOverSound()} isGlowing={props.isGlowing} onClick={() => props.onClick()}>

        </Wrapper>
    );
}

const Wrapper = styled.div<{isGlowing: boolean}>`
    width: 100px;
    height: 130px;
    background-image: url(${BACK});
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
    animation: ${props => props.isGlowing ? css`${glow} 1s infinite alternate` : 'null'};
    border-radius: 16px;
    border: 4px solid black;
    transform: rotate(4deg);
`;

const glow = keyframes`
    from {
        box-shadow: 0 0px 40px #f0f, 0 0px 10px red, 0 0px 20px #0ff;
    }
    to {
        box-shadow: 0 0px 40px #0ff, 0 0px 10px #f0f, 0 0px 20px #f0f;
    }
`;

export default DrawPile;