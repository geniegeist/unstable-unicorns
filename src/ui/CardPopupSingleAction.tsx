import styled from 'styled-components';

type Props = {
    text: string;
    onClick: () => void;
};

const CardPopupSingleAction = (props: Props) => {
    return (
        <Wrapper>
            <Button onClick={() => props.onClick()}>
                {props.text}
            </Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    margin-top: 1em;
`;

const Button = styled.div`
    border: 1px solid white;
    border-radius: 8px;
    padding: 0.5em;
    cursor: pointer;
`;

export default CardPopupSingleAction;