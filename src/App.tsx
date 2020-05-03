import React, { useCallback, useState, useMemo } from "react";
import combinatorics from "js-combinatorics";
import "./App.css";

interface Results {
  [k: number]: number;
}

const d20Values = Array.from(Array(20).keys()).map((i) => i + 1);
const d6Values = Array.from(Array(6).keys()).map((i) => i + 1);

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

  const bonuses = useMemo(() => {
    const accMod = accuracy - difficulty;
    const sign = accuracy > difficulty ? 1 : -1;
    const accValueArrays = Array.from(Array(Math.abs(accMod)).keys()).map(
      () => d6Values
    );

    if (!accValueArrays.length) {
      return { 0: 1 } as Results;
    }

    const combos = combinatorics.cartesianProduct(...accValueArrays);

    return combos.reduce((bonuses, [...mods]) => {
      const value = Math.max(...(mods as number[])) * sign;
      bonuses[value] = (bonuses[value] || 0) + 1;
      return bonuses;
    }, {} as Results);
  }, [accuracy, difficulty]);

  const bonusProbability = useMemo(() => {
    const totals = Object.values(bonuses).reduce(
      (sum, count) => sum + count,
      0
    );
    return d6Values.reduce((bonusProbability, value) => {
      bonusProbability[value] = ((bonuses[value] || 0) / totals) * 100.0;
      return bonusProbability;
    }, {} as Results);
  }, [bonuses]);

  const probability = useMemo(() => {
    const combosWithBonuses = combinatorics.cartesianProduct(
      d20Values,
      Object.keys(bonuses).map((b) => +b)
    );
    const results = combosWithBonuses.reduce(
      (combosWithBonuses, [base, bonus]) => {
        const value = base + flat + bonus;
        combosWithBonuses[value] =
          (combosWithBonuses[value] || 0) + bonuses[bonus];
        return combosWithBonuses;
      },
      {} as Results
    );
    const totals = Object.values(results).reduce(
      (sum, count) => sum + count,
      0
    );

    return Object.fromEntries(
      d20Values.map((v) => [
        v,
        Object.keys(results).reduce(
          (total, key) =>
            +key >= v ? total + (results[+key] / totals) * 100.0 : total,
          0
        ),
      ])
    );
  }, [flat, bonuses]);

  // more than 6 dice in either direction makes the calculations fall over, yay for o(6^n)
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
            max={6}
          />
        </label>
        <label>
          Difficulty
          <input
            type="number"
            onChange={setDifficultyFromEvent}
            value={difficulty}
            min={0}
            max={6}
          />
        </label>
      </div>
      <div className="Tables">
        <table>
          <thead>
            <tr>
              <th>Target</th>
              <th>Probability</th>
            </tr>
          </thead>
          <tbody>
            {d20Values.map((i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{probability[i].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Bonus</th>
              <th>Probability</th>
            </tr>
          </thead>
          <tbody>
            {d6Values.map((i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{bonusProbability[i].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
