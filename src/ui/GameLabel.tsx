import styled from 'styled-components';

type Props = {
    text: string;
}

const GameLabel = (props: Props) => {
    return (
        <Wrapper>
            {props.text}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    background-color: #F8B500;
    font-family: Open Sans Condensed;
    color: white;
    padding: 1em;
    border-radius: 16px;
    margin-top: 1em;
`;

export default GameLabel;