exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const {
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal, // 'cut', 'maintain', 'bulk'
      discipline,
      trainingDays
    } = body;

    // validación de datos requeridos
    if (!weight || !height || !age || !gender) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Missing required fields: weight, height, age, gender'
        })
      };
    }

    // calcular necesidades nutricionales
    const nutrition = calculateNutrition({
      weight,
      height,
      age,
      gender,
      activityLevel: activityLevel || 'moderate',
      goal: goal || 'maintain',
      discipline,
      trainingDays: trainingDays || 4
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nutrition)
    };

  } catch (error) {
    console.error('Nutrition calculation error:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};

function calculateNutrition({ weight, height, age, gender, activityLevel, goal, discipline, trainingDays }) {
  // TMB usando ecuación Mifflin-St Jeor
  const bmr = calculateBMR(weight, height, age, gender);

  // calcular gasto energético total
  const tdee = calculateTDEE(bmr, activityLevel, trainingDays);

  // ajustar calorías según objetivo
  const targetCalories = adjustCaloriesForGoal(tdee, goal);

  // distribuir macronutrientes
  const macros = calculateMacros(weight, targetCalories, goal, discipline);

  // horarios de comida
  const mealTiming = generateMealTiming(trainingDays, discipline);

  // necesidades de hidratación
  const hydration = calculateHydrationNeeds(weight, trainingDays);

  // suplementos recomendados
  const supplements = getSupplementRecommendations(goal, discipline);

  return {
    calories: {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(targetCalories),
      goal: goal
    },
    macronutrients: {
      protein: {
        grams: Math.round(macros.protein),
        calories: Math.round(macros.protein * 4),
        percentage: Math.round((macros.protein * 4 / targetCalories) * 100)
      },
      carbohydrates: {
        grams: Math.round(macros.carbs),
        calories: Math.round(macros.carbs * 4),
        percentage: Math.round((macros.carbs * 4 / targetCalories) * 100)
      },
      fats: {
        grams: Math.round(macros.fats),
        calories: Math.round(macros.fats * 9),
        percentage: Math.round((macros.fats * 9 / targetCalories) * 100)
      }
    },
    mealTiming,
    hydration,
    supplements,
    fightSpecific: getFightSpecificNutrition(discipline, goal)
  };
}

function calculateBMR(weight, height, age, gender) {
  if (gender.toLowerCase() === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

function calculateTDEE(bmr, activityLevel, trainingDays) {
  const activityMultipliers = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'extreme': 1.9
  };

  let baseMultiplier = activityMultipliers[activityLevel] || 1.55;

  const trainingAdjustment = (trainingDays - 3) * 0.05;
  baseMultiplier += trainingAdjustment;

  return bmr * baseMultiplier;
}

function adjustCaloriesForGoal(tdee, goal) {
  switch (goal) {
    case 'cut':
      return tdee * 0.8;
    case 'maintain':
      return tdee;
    case 'bulk':
      return tdee * 1.1;
    default:
      return tdee;
  }
}

function calculateMacros(weight, calories, goal, discipline) {
  let proteinPerKg, fatPerKg;

  // proteína según objetivo y disciplina
  switch (goal) {
    case 'cut':
      proteinPerKg = 2.5;
      break;
    case 'bulk':
      proteinPerKg = 2.0;
      break;
    default:
      proteinPerKg = 2.2;
  }

  // ajuste para deportes de combate
  if (['mma', 'boxing', 'wrestling'].includes(discipline?.toLowerCase())) {
    proteinPerKg += 0.2;
  }

  // necesidades de grasa
  fatPerKg = goal === 'cut' ? 0.8 : 1.0;

  const protein = weight * proteinPerKg;
  const fats = weight * fatPerKg;

  // calorías restantes van a carbohidratos
  const remainingCalories = calories - (protein * 4) - (fats * 9);
  const carbs = Math.max(0, remainingCalories / 4);

  return { protein, carbs, fats };
}

function generateMealTiming(trainingDays, discipline) {
  return {
    preWorkout: {
      timing: '1-2 hours before training',
      focus: 'Moderate carbs, low fat, moderate protein',
      examples: ['Oats with banana', 'Rice with chicken', 'Toast with honey']
    },
    postWorkout: {
      timing: '30-60 minutes after training',
      focus: 'Fast carbs + protein for recovery',
      examples: ['Protein shake with banana', 'Chocolate milk', 'Rice with protein']
    },
    dailyMeals: {
      frequency: '4-6 smaller meals vs 3 large meals',
      reasoning: 'Better for maintaining energy and recovery',
      distribution: {
        breakfast: '25% of daily calories',
        lunch: '30% of daily calories',
        dinner: '25% of daily calories',
        snacks: '20% of daily calories'
      }
    },
    competitionDay: getCompetitionDayNutrition(discipline)
  };
}

function getCompetitionDayNutrition(discipline) {
  return {
    preCompetition: {
      timing: '3-4 hours before',
      meal: 'Familiar, easily digestible carbs with minimal fat/fiber',
      examples: ['White rice with small amount of chicken', 'Banana with honey', 'Sports drink']
    },
    betweenRounds: {
      timing: 'Between rounds/matches',
      focus: 'Quick energy + hydration',
      examples: ['Diluted sports drink', 'Banana pieces', 'Honey']
    },
    postCompetition: {
      timing: 'Immediately after',
      focus: 'Rehydration + glycogen replenishment',
      examples: ['Chocolate milk', 'Recovery shake', 'Electrolyte solution']
    }
  };
}

function calculateHydrationNeeds(weight, trainingDays) {
  const baseHydration = weight * 35;
  const trainingExtra = trainingDays * 500;

  return {
    dailyMinimum: `${Math.round(baseHydration / 1000 * 10) / 10}L`,
    withTraining: `${Math.round((baseHydration + trainingExtra) / 1000 * 10) / 10}L`,
    electrolyteNeeds: {
      sodium: '300-600mg per hour of training',
      potassium: '150-300mg per hour of training',
      magnesium: '50-100mg per hour of training'
    },
    timing: {
      preTraining: '500ml 2 hours before, 200ml 15 minutes before',
      duringTraining: '150-250ml every 15-20 minutes',
      postTraining: '150% of fluid lost through sweat'
    }
  };
}

function getSupplementRecommendations(goal, discipline) {
  const base = [
    {
      name: 'Whey Protein',
      purpose: 'Muscle recovery and growth',
      timing: 'Post-workout',
      dosage: '25-30g'
    },
    {
      name: 'Creatine Monohydrate',
      purpose: 'Power and strength',
      timing: 'Daily, any time',
      dosage: '5g'
    },
    {
      name: 'Multivitamin',
      purpose: 'Micronutrient insurance',
      timing: 'With breakfast',
      dosage: 'As directed'
    }
  ];

  const goalSpecific = {
    cut: [
      {
        name: 'Caffeine',
        purpose: 'Energy and fat oxidation',
        timing: 'Pre-workout',
        dosage: '200-400mg'
      },
      {
        name: 'L-Carnitine',
        purpose: 'Fat metabolism',
        timing: 'Pre-workout',
        dosage: '2-3g'
      }
    ],
    bulk: [
      {
        name: 'Weight Gainer',
        purpose: 'Extra calories',
        timing: 'Between meals',
        dosage: 'As needed for calorie goals'
      }
    ]
  };

  const disciplineSpecific = {
    mma: [
      {
        name: 'Beta-Alanine',
        purpose: 'Muscular endurance',
        timing: 'Pre-workout',
        dosage: '3-5g'
      }
    ],
    boxing: [
      {
        name: 'Citrulline Malate',
        purpose: 'Muscular endurance and pump',
        timing: 'Pre-workout',
        dosage: '6-8g'
      }
    ]
  };

  return {
    essential: base,
    goalSpecific: goalSpecific[goal] || [],
    disciplineSpecific: disciplineSpecific[discipline?.toLowerCase()] || [],
    notes: [
      'Supplements are not magic - focus on whole foods first',
      'Consult with a sports nutritionist for personalized advice',
      'Check with your athletic commission for banned substances'
    ]
  };
}

function getFightSpecificNutrition(discipline, goal) {
  const baseRecommendations = {
    weightCutting: {
      approach: 'Gradual reduction over time, not rapid dehydration',
      timeline: 'Start 8-12 weeks before competition',
      preservation: 'Maintain protein intake to preserve muscle mass'
    },
    peakWeek: {
      carbs: 'Deplete early week, reload 2-3 days before',
      water: 'Load early, manipulate final 24-48 hours',
      sodium: 'Reduce gradually in final week'
    },
    recovery: {
      immediate: 'Rehydrate and replenish glycogen within 2 hours',
      longTerm: 'Return to normal nutrition patterns within 24-48 hours'
    }
  };

  const disciplineSpecific = {
    mma: {
      focus: 'Sustained energy for multiple rounds',
      carbs: 'Moderate to high carb intake for glycogen',
      special: 'Consider gut training for competition day nerves'
    },
    boxing: {
      focus: 'Explosive power with endurance',
      carbs: 'Targeted carb timing around training',
      special: 'Emphasize quick energy sources between rounds'
    },
    wrestling: {
      focus: 'Strength endurance and weight management',
      carbs: 'Flexible carb cycling based on training phases',
      special: 'Practice competition day eating schedule'
    }
  };

  return {
    ...baseRecommendations,
    disciplineSpecific: disciplineSpecific[discipline?.toLowerCase()] || disciplineSpecific.mma
  };
}