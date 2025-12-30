import pandas as pd
import random

symptoms = [
"fever","cough","headache","fatigue","nausea","vomiting","stomach_pain","diarrhea",
"sore_throat","runny_nose","body_pain","dizziness","chest_pain","breathing_problem",
"loss_of_taste","loss_of_smell","chills","rash","eye_pain","dehydration",
"joint_pain","back_pain","sweating","weight_loss","night_sweats","blurred_vision",
"frequent_urination","thirst","abdominal_swelling","bleeding"
]

diseases = [
"Flu","COVID-19","Food Poisoning","Typhoid","Migraine","Dengue","Common Cold",
"Stomach Infection","Malaria","Pneumonia","Bronchitis","Asthma","Tuberculosis",
"Diabetes","Hypertension","Anemia","Hepatitis","Kidney Infection",
"Urinary Tract Infection","Gastritis"
]

patterns = {
    "Flu": ["fever","cough","body_pain","chills","fatigue"],
    "COVID-19": ["fever","cough","loss_of_taste","loss_of_smell","breathing_problem"],
    "Food Poisoning": ["vomiting","diarrhea","stomach_pain","nausea","dehydration"],
    "Typhoid": ["fever","fatigue","headache","body_pain"],
    "Migraine": ["headache","nausea","dizziness","blurred_vision"],
    "Dengue": ["fever","body_pain","rash","eye_pain"],
    "Common Cold": ["cough","runny_nose","sore_throat"],
    "Stomach Infection": ["stomach_pain","nausea","diarrhea"],
    "Malaria": ["fever","chills","sweating"],
    "Pneumonia": ["cough","fever","breathing_problem"],
    "Bronchitis": ["cough","chest_pain"],
    "Asthma": ["breathing_problem","cough"],
    "Tuberculosis": ["cough","weight_loss","night_sweats"],
    "Diabetes": ["frequent_urination","thirst","weight_loss"],
    "Hypertension": ["headache","chest_pain"],
    "Anemia": ["fatigue","dizziness"],
    "Hepatitis": ["fever","abdominal_swelling"],
    "Kidney Infection": ["fever","back_pain"],
    "Urinary Tract Infection": ["frequent_urination","abdominal_swelling"],
    "Gastritis": ["stomach_pain","nausea"]
}

rows = []

for _ in range(2000):
    disease = random.choice(diseases)
    row = {s:0 for s in symptoms}

    for s in patterns[disease]:
        row[s] = 1

    for s in random.sample(symptoms, 3):
        row[s] = 1

    row["disease"] = disease
    rows.append(row)


pd.DataFrame(rows).to_csv("dataset.csv", index=False)
print("dataset.csv created successfully")
