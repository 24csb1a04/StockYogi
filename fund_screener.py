import pulp
import pandas as pd

data = pd.read_excel("./data/stock_data4.xlsx").set_index("Fund")

funds = list(data.index)
num = {fund: i for i, fund in enumerate(funds)}

weights = [0.01 + i * 0.01618 for i in range(11)]


def calc(x):
    try:
        x = float(x)  # ✅ FIX 1: cast input

        prob = pulp.LpProblem("max_returns", pulp.LpMaximize)

        select = pulp.LpVariable.dicts("select", funds, 0, 1, cat="Binary")
        allocation = pulp.LpVariable.dicts("alloc", funds, 0, 1)

        # Constraints
        prob += pulp.lpSum(select[f] for f in funds) == 5
        prob += pulp.lpSum(allocation[f] for f in funds) == 1

        for f in funds:
            prob += allocation[f] >= 0.1 * select[f]
            prob += allocation[f] <= 0.35 * select[f]

        # Minimum return per year
        for i in range(11):
            prob += pulp.lpSum(
                allocation[f] * data.iloc[num[f], i] for f in funds
            ) >= x

        # ✅ FIX 2: FLATTENED objective (NO nested lpSum)
        objective_terms = []
        for i in range(11):
            for f in funds:
                objective_terms.append(
                    weights[i] * allocation[f] * data.iloc[num[f], i]
                )

        prob += pulp.lpSum(objective_terms)

        prob.solve(pulp.PULP_CBC_CMD(msg=False))

        if pulp.LpStatus[prob.status] != "Optimal":
            return {"funds": [], "allocations": [], "returns": [], "ans": []}

        selected_funds = [f for f in funds if pulp.value(select[f]) > 0.5]

        allocations = [
            round(pulp.value(allocation[f]) * 100, 2) for f in selected_funds
        ]

        yearly_returns = []
        for i in range(11):
            yearly_returns.append(
                round(
                    sum(
                        pulp.value(allocation[f]) * data.iloc[num[f], i]
                        for f in funds
                    ),
                    2,
                )
            )

        weighted_return = round(
            sum(yearly_returns[i] * weights[i] for i in range(11)), 2
        )

        return {
            "funds": selected_funds,
            "allocations": allocations,
            "returns": yearly_returns,
            "ans": weighted_return,
        }

    except Exception as e:
        print("Screener error:", e)
        return {"funds": [], "allocations": [], "returns": [], "ans": []}
