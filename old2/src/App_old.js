const Dial = ({ angle }) => (
    <g transform={`rotate(${angle})`}>
        <circle cx={0} cy={0} r={45} fill="grey" stroke="black" />
        <circle cx={-35} cy={0} r={5} fill="black" />
    </g>
);

export default function App() {
    return (
        <div className="App">
            <svg viewBox="-50 -50 100 100" style={{ width: 400, height: 400 }}>
                <Dial angle={15} />
            </svg>
        </div>
    );
}
