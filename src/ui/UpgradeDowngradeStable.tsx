import styled from 'styled-components';
import type { Card } from "../game/card";
import ImageLoader from '../assets/card/imageLoader';
import { _typeToColor } from './util';

type Props = {
    cards: Card[];
}

const UpgradeDowngradeStable = (props: Props) => {
    return (
        <Wrapper>
            {props.cards.map(card => {
                return (
                    <div key={card.id}>
                        <CardImage src={ImageLoader.load(card.image)} color={_typeToColor(card.type)} />
                    </div>
                );
            })}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    width: 700px;
    align-items: center;
    justify-content: center;
`;

const CardImage = styled.img<{color: string}>`
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 2px solid ${props => props.color};
    cursor: pointer;
    margin: 0 0.25em;
`;

export default UpgradeDowngradeStable;