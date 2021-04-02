import { FunctionComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import ImageLoader from '../assets/card/imageLoader';
import { Card } from '../game/card';
import { UnstableUnicornsGame } from '../game/game';
import { NeighDiscussion } from '../game/neigh';

type Props = {
}


const InfoLabel: FunctionComponent<Props> = (props) => {
    return (
        <Wrapper>
            {props.children}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 800px;
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


export default InfoLabel;