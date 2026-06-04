import pandas as pd


# -----------------------------
# Recommendation Table
# -----------------------------
recommendations = pd.DataFrame({

"Insight":[

"Education Level",
"Prior Experience",
"Prevailing Wage",
"Region",
"Company Size",
"Employee Continent",
"Machine Learning"

],

"Finding":[

"Higher education tends to improve approval likelihood",

"Experienced employees show stronger approval outcomes",

"Higher wages correlate with certification",

"Approval rates vary by region",

"Larger employers tend to have stronger outcomes",

"Approval varies across continents",

"Predictive models improve planning"

],

"Recommendation":[

"Prioritize highly qualified applicants",

"Emphasize experience in applications",

"Offer competitive compensation",

"Optimize regional hiring strategy",

"Improve documentation and compliance",

"Standardize sponsorship processes",

"Use prediction model to support decisions"

]

})


print(
"\nActionable Insights\n"
)

print(
recommendations.to_string(index=False)
)


# -----------------------------
# Summary Card
# -----------------------------
print("\nBusiness Recommendations")
print("-" * 40)
print("1. Prioritize highly educated applicants")
print("2. Emphasize experienced candidates")
print("3. Offer competitive prevailing wages")
print("4. Optimize hiring strategies by region")
print("5. Improve sponsorship documentation")
print("6. Standardize international recruiting")
print("7. Use ML predictions for decision support")
print("-" * 40)

# -----------------------------
# Final Selected Model
# -----------------------------
if 'results' in dir() and isinstance(results, pd.DataFrame) and 'F1' in results.columns:
    final_model = results["F1"].idxmax()
    final_score = results["F1"].max()

    model_summary = pd.DataFrame({
        "Selected Model": [final_model],
        "F1 Score": [round(final_score, 4)],
        "Business Goal": ["Maximize approval prediction quality"]
    })

    print("\nFinal Selected Model\n")
    print(model_summary.to_string(index=False))

    # -----------------------------
    # Conclusion
    # -----------------------------
    print(f"\nConclusion")
    print("-" * 40)
    print(f"The model {final_model} achieved the strongest performance.")
    print(f"Final F1 Score: {final_score:.4f}")
    print("This model can improve visa approval prediction")
    print("and support better business decisions.")
    print("-" * 40)
