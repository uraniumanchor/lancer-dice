import React, { useCallback, useState, useMemo } from "react";
import combinatorics from "js-combinatorics";
import "./App.css";

interface Results {
  [k: number]: number;
}

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

    const combos = combinatorics.cartesianProduct(d20Values, ...accValueArrays);
    const totalCombos = combos.length;

    const results = combos.reduce((results, [base, ...mods]) => {
      const value =
        base +
        flat +
        (mods.length ? Math.max(...(mods as number[])) * sign : 0);
      results[value] = (results[value] || 0) + 1;
      return results;
    }, {} as Results);

    return d20Values.map((v) =>
      Object.keys(results).reduce(
        (total, key) =>
          +key >= v ? total + (results[+key] / totalCombos) * 100.0 : total,
        0
      )
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
