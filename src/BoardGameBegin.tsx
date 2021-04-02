import { useState } from 'react';
import styled from 'styled-components';
import ImageLoader from './assets/card/imageLoader';
import BG from './assets/ui/board-background.jpg';
import { Card, CardID } from './game/card';
import { UnstableUnicornsGame } from './game/game';
import { PlayerID } from './game/player';

type Props = {
    G: UnstableUnicornsGame,
    babyCards: Card[],
    playerID: PlayerID,
    moves: any,
};

const BoardGameBegin = (props: Props) => {

    const [playerName, setPlayerName] = useState<string>("Spieler");

    return (
        <Wrapper>
            <div style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "16pt",
                height: "500px",
                color: "white"
            }}>
                <div style={{
                    backgroundColor: `#BC4747`,
                    width: "70%",
                    padding: "2em",
                    borderRadius: "16px"
                }}>
                    <h1>My name:</h1>
                    <input type="text" name="name" value={playerName} onChange={(evt) => {
                        setPlayerName(evt.target.value)
                    }} style={{
                        padding: "1em",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        border: "none",
                        marginBottom: "2em",
                        fontSize: "16pt",
                        color: "white"
                    }} />
                    <button onClick={() => {
                        props.moves.changeName(props.playerID, playerName);
                    }}>Change name</button>
                    <h1>Choose your baby unicorn</h1>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "1em"
                    }}>
                        {props.babyCards.map(card => {
                            let style = {}
                            const t = props.G.babyStarter.find(f => f.cardID === card.id);

                            if (t) {
                                if (t.owner === props.playerID) {
                                    style = {
                                        border: "4px solid white",
                                    }
                                } else {
                                    style = {
                                        border: "4px solid white",
                                        opacity: 0.3,
                                        cursor: "not-allowed"
                                    }
                                }  
                            } 

                            return (<div style={{ margin: "0.5em" }} key={card.id}>
                                <img style={{ cursor: "pointer", ...style, borderRadius: "16px" }} src={ImageLoader.load(card.image)} width="100%" onClick={() => {
                                    if (props.G.babyStarter.find(s => s.owner === props.playerID)) {
                                        return;
                                    }
                                    props.moves.selectBaby(props.playerID, card.id);
                                }} />
                            </div>)
                        })}
                    </div>
                    {props.G.babyStarter.find(s => s.owner === props.playerID) && (
                    <div style={{
                        cursor: "pointer",
                        padding: "1em",
                        border: "1px solid white",
                        width: "280px",
                        textAlign: "center",
                        borderRadius: "16px",
                        fontWeight: 600,
                        fontSize: "16pt"
                    }}
                        onClick={() => props.moves.ready(props.playerID)}>
                        {props.G.ready[props.playerID] === true ? "Waiting for others..." : "Click here if you are ready"}
                    </div>)
                    }
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    background-image: url(${BG});
    background-size: cover;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default BoardGameBegin;