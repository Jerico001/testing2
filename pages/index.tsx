
import { useState } from 'react';

export default function Home() {
  const [players, setPlayers] = useState<string[]>([]);
  const [inputName, setInputName] = useState('');
  const [round, setRound] = useState(1);
  const [matches, setMatches] = useState<any[]>([]);
  const [scores, setScores] = useState<number[][]>([]);
  const [leaderboard, setLeaderboard] = useState<any>({});

  const addPlayer = () => {
    if (inputName && !players.includes(inputName)) {
      setPlayers([...players, inputName]);
      setLeaderboard((prev: any) => ({ ...prev, [inputName]: { pts: 0, w: 0, d: 0, l: 0, p: 0 } }));
      setInputName('');
    }
  };

  const generateMatch = () => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const team1 = shuffled.slice(0, 2);
    const team2 = shuffled.slice(2, 4);
    setMatches([[...team1], [...team2]]);
  };

  const submitScore = (t1: number, t2: number) => {
    const [team1, team2] = matches[0];
    const update = { ...leaderboard };
    const updatePlayer = (name: string, won: boolean, draw: boolean) => {
      update[name].pts += draw ? 10 : (won ? 11 : 9);
      update[name].w += won ? 1 : 0;
      update[name].d += draw ? 1 : 0;
      update[name].l += !won && !draw ? 1 : 0;
      update[name].p += 1;
    };
    if (t1 === t2) {
      team1.forEach(p => updatePlayer(p, false, true));
      team2.forEach(p => updatePlayer(p, false, true));
    } else {
      const team1Won = t1 > t2;
      team1.forEach(p => updatePlayer(p, team1Won, false));
      team2.forEach(p => updatePlayer(p, !team1Won, false));
    }
    setLeaderboard(update);
    setScores([...scores, [t1, t2]]);
    setRound(round + 1);
  };

  return (
    <main>
      <h1>Mexicano Padel App v2</h1>
      <input value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Player name" />
      <button onClick={addPlayer}>Add Player</button>
      <p><b>Players:</b> {players.join(', ')}</p>
      <h2>Round {round}</h2>
      <button onClick={generateMatch}>Generate Match</button>
      {matches.length > 0 && (
        <div>
          <p>{matches[0][0]} & {matches[0][1]} vs {matches[0][2]} & {matches[0][3]}</p>
          <input placeholder="Team 1" id="t1" />
          <input placeholder="Team 2" id="t2" />
          <button onClick={() => {
            const t1 = parseInt((document.getElementById("t1") as HTMLInputElement).value);
            const t2 = parseInt((document.getElementById("t2") as HTMLInputElement).value);
            if (!isNaN(t1) && !isNaN(t2)) submitScore(t1, t2);
          }}>Submit Scores</button>
        </div>
      )}
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr><th>Player</th><th>Points</th><th>W-D-L</th><th>Played</th></tr>
        </thead>
        <tbody>
          {Object.entries(leaderboard).sort((a: any, b: any) => b[1].pts - a[1].pts).map(([name, stat]: any) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{stat.pts}</td>
              <td>{stat.w}-{stat.d}-{stat.l}</td>
              <td>{stat.p}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
