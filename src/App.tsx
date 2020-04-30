import React, { useCallback, useState, useMemo } from "react";
import combinatorics from "js-combinatorics";
import "./App.css";

function App() {
  const [flat, setFlat] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const setFlatFromEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFlat(+e.target.value),
    []
  );
  const setAccuracyFromEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setAccuracy(+e.target.value),
    []
  );
  const setDifficultyFromEvent = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setDifficulty(+e.target.value),
    []
  );
  const probability = useMemo(() => {
    const d20Values = Array.from(Array(20).keys()).map((i) => i + 1);
    const accMod = accuracy - difficulty;
    const sign = accuracy > difficulty ? 1 : -1;
    const accValueArrays = Array.from(Array(Math.abs(accMod)).keys()).map((i) =>
      Array.from(Array(6).keys()).map((i) => i + 1)
    );

    const results = combinatorics
      .cartesianProduct(d20Values, ...accValueArrays)
      .map(([base, ...mods]) => {
        return (
          base +
          flat +
          (mods.length ? Math.max(...(mods as number[])) * sign : 0)
        );
      });

    return d20Values.map(
      (v) =>
        (results.filter((r: number) => r >= v).length / results.length) * 100.0
    );
  }, [flat, accuracy, difficulty]);
  return (
    <div className="App">
      <div>
        <label>
          Flat Bonus
          <input type="number" onChange={setFlatFromEvent} value={flat} />
        </label>
        <label>
          Accuracy
          <input
            type="number"
            onChange={setAccuracyFromEvent}
            value={accuracy}
            min={0}
          />
        </label>
        <label>
          Difficulty
          <input
            type="number"
            onChange={setDifficultyFromEvent}
            value={difficulty}
            min={0}
          />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Target</th>
            <th>Probability</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(Array(20).keys()).map((i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{probability[i].toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
