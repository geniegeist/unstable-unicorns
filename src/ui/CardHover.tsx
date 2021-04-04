import styled from 'styled-components';

type Props = {
    color: string;
    text: string;
    text2?: string;
    offset: {x: number, y: number};
    position: "top" | "bottom";
    scale?: number;
    children?: React.ReactElement;
    title?: string;
}

const CardHover = (props: Props) => {
    return (
        <Wrapper scale={props.scale} offset={props.offset} position={props.position}>
            <InnerWrapper color={props.color}>
                {props.title && 
                    <div style={{marginTop: "0", fontSize: "1.4em"}}>
                        {props.title}
                    </div>
                }
                <div>
                    {props.text}
                </div>
                <div>{props.children}</div>
            </InnerWrapper>
            {props.text2 &&
                <InnerWrapper color={"#FFFFFF"} style={{marginTop: "1em"}}>
                    <div>
                        {props.text2}
                    </div>
                </InnerWrapper>
            }
        </Wrapper>
    );
}

const Wrapper = styled.div<{offset: {x: number, y: number}, position: "top" | "bottom", scale?: number}>`
    width: 280px;
    position: absolute;
    z-index: 100000;
    top: ${props => props.position === "top" ? "0" : undefined};
    bottom: ${props => props.position === "bottom" ? "0" : undefined};
    transform: translate(${props => `${props.offset.x}px, ${props.offset.y}px`}) scale(${props => props.scale ? props.scale : 1});
`;

const InnerWrapper = styled.div<{color: string}>`
    background-color: ${props => props.color};
    border-radius: 16px;
    padding: 20px;
    color: ${props => props.color === "#FFFFFF" ? "black" : "white"};
    box-shadow: 4px 4px 0 4px #00213A;
    cursor: default;
`;

export default CardHover;