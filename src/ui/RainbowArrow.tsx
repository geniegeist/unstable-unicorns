type Props = {
    from: { x: number, y: number };
    to: { x: number, y: number };
};

const RainbowArrow = ({from, to}: Props) => {
    return (
        <svg style={{ position: "absolute", zIndex: 9000, pointerEvents: "none", height: "100%", width: "100%" }}>
            <defs>
                <linearGradient id="myGradient" gradientTransform="rotate(90)">
                    <stop offset="12.5%" stopColor="#E02020" />
                    <stop offset="25%" stopColor="#FA6400" />
                    <stop offset="37.5%" stopColor="#F7B500" />
                    <stop offset="50%" stopColor="#6DD400" />
                    <stop offset="62.5%" stopColor="#0091FF" />
                    <stop offset="75%" stopColor="#6236FF" />
                    <stop offset="87.5%" stopColor="#B620E0" />
                </linearGradient>
            </defs>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} style={{ strokeWidth: 25 }} strokeDasharray="20" stroke="url('#myGradient')" />
        </svg>
    );
}

export default RainbowArrow;