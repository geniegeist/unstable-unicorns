import styled from 'styled-components';
import { Card, CardType } from '../game/card';
import ImageLoader from '../assets/card/imageLoader';
import _ from 'underscore';
import { _typeToColor } from './util';
import BACK from '../assets/card/UU-Back-Main.png';

type Props = {
    count: number;
    active?: number;
}

const HiddenHand = (props: Props) => {
    const cards = Array.from(Array(props.count).keys());
    return (
        <Wrapper>
            {cards.map((card, idx) => {
                return (
                    <CardWrapper key={idx} transform={_transformForCard(idx, props.count)}>
                    </CardWrapper>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 1em;
    font-family: 'Open Sans Condensed', sans-serif;
    transform: translate(0%,-50%) scale(-0.6,-0.6);
    pointer-events:none;
`;

const CardWrapper = styled.div<{transform: {x: number, y: number, rotate: string}}>`
    background-image: url(${BACK});
    background-size: cover;
    border-radius: 16px;
    width: 175px;
    height: 250px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(${props => props.transform.x}px, ${props => props.transform.y}px) rotate(${props => props.transform.rotate});
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    border: 6px solid black;
`;

function _transformForCard(idx: number, countCards: number): {x: number, y: number, rotate: string} {
    const midIdx = (countCards / 2);
    let degStep = 0;
    let xStep = 0;
    let yStep = 0;
    if (countCards <= 6) {
        degStep = 5;
        xStep = -35;
        yStep = 7;
    } else if (countCards <= 8) {
        degStep = 6;
        xStep = 90;
        yStep = 5;
    } else {
        degStep = 4;
        xStep = 90;
        yStep = 3;
    }

    return { x: (idx - midIdx) * xStep, y: Math.abs(idx - midIdx) * Math.abs(idx - midIdx) * yStep, rotate: `${(idx - midIdx) * degStep}deg` };
}

export default HiddenHand;