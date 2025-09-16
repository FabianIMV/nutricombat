const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const {
      currentWeight,
      targetWeight,
      daysRemaining,
      discipline,
      activityLevel,
      userId,
      competitionDate
    } = body;

    // validación de datos
    if (!currentWeight || !targetWeight || !daysRemaining) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Missing required fields'
        })
      };
    }

    // generar plan de corte completo
    const plan = generateWeightCuttingPlan({
      currentWeight,
      targetWeight,
      daysRemaining,
      discipline,
      activityLevel: activityLevel || 'moderate'
    });

    // guardar plan si hay userId
    if (userId) {
      await saveWeightPlan(userId, plan, competitionDate);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(plan)
    };

  } catch (error) {
    console.error('Weight plan generation error:', error);

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

function generateWeightCuttingPlan({ currentWeight, targetWeight, daysRemaining, discipline, activityLevel }) {
  const weightToLose = currentWeight - targetWeight;
  const dailyWeightLoss = weightToLose / daysRemaining;

  // TMB estimada
  const bmr = calculateBMR(currentWeight);
  const tdee = calculateTDEE(bmr, activityLevel);

  // plan diario
  const dailyPlans = [];
  for (let day = 1; day <= daysRemaining; day++) {
    const daysOut = daysRemaining - day + 1;
    dailyPlans.push(generateDayPlan(daysOut, weightToLose, dailyWeightLoss, tdee, discipline));
  }

  return {
    overview: {
      currentWeight,
      targetWeight,
      weightToLose,
      daysRemaining,
      dailyWeightLoss,
      estimatedTDEE: tdee
    },
    strategy: determineStrategy(daysRemaining, weightToLose),
    dailyPlans,
    nutritionGuidelines: getNutritionGuidelines(discipline),
    trainingRecommendations: getTrainingRecommendations(daysRemaining, discipline),
    supplementation: getSupplementationPlan(daysRemaining),
    warnings: generateWarnings(dailyWeightLoss, daysRemaining)
  };
}

function calculateBMR(weight) {
  // cálculo simplificado TMB
  return 88.362 + (13.397 * weight) + (4.799 * 175) - (5.677 * 25);
}

function calculateTDEE(bmr, activityLevel) {
  const activityMultipliers = {
    'low': 1.375,
    'moderate': 1.55,
    'high': 1.725,
    'extreme': 1.9
  };
  return bmr * (activityMultipliers[activityLevel] || 1.55);
}

function determineStrategy(daysRemaining, weightToLose) {
  if (daysRemaining >= 28) {
    return {
      type: 'long_term',
      approach: 'sustainable',
      description: 'Gradual weight loss focusing on fat loss while preserving muscle mass',
      phases: [
        { name: 'Fat Loss Phase', duration: `${daysRemaining - 7} days`, focus: 'Caloric deficit with high protein' },
        { name: 'Final Week', duration: '7 days', focus: 'Water manipulation and final adjustments' }
      ]
    };
  } else if (daysRemaining >= 14) {
    return {
      type: 'medium_term',
      approach: 'moderate',
      description: 'Balanced approach with moderate caloric deficit and strategic dehydration',
      phases: [
        { name: 'Caloric Restriction', duration: `${daysRemaining - 5} days`, focus: 'Moderate deficit' },
        { name: 'Water Manipulation', duration: '5 days', focus: 'Controlled dehydration' }
      ]
    };
  } else {
    return {
      type: 'short_term',
      approach: 'aggressive',
      description: 'Rapid weight loss through water manipulation and severe caloric restriction',
      warning: 'HIGH RISK - Requires medical supervision',
      phases: [
        { name: 'Rapid Loss', duration: `${Math.max(1, daysRemaining - 3)} days`, focus: 'Severe restriction' },
        { name: 'Water Cut', duration: '3 days', focus: 'Dehydration protocol' }
      ]
    };
  }
}

function generateDayPlan(daysOut, totalWeightLoss, dailyLoss, tdee, discipline) {
  const isWaterCutPhase = daysOut <= 3;
  const isFinalDay = daysOut === 1;

  if (isFinalDay) {
    return {
      day: `Day ${daysOut} (Weigh-in Day)`,
      target: 'Make weight',
      calories: 500,
      water: '0.2L',
      sodium: 'None',
      carbs: 'Minimal',
      training: 'Light movement only',
      notes: 'Final water restriction, minimal food, stay warm'
    };
  }

  if (isWaterCutPhase) {
    return generateWaterCutDay(daysOut, tdee);
  }

  return generateNormalCutDay(daysOut, tdee, dailyLoss);
}

function generateWaterCutDay(daysOut, tdee) {
  const waterCutPlans = {
    3: {
      calories: Math.round(tdee * 0.6),
      water: '4-5L',
      sodium: 'Normal',
      carbs: 'Low',
      training: 'Light cardio + sauna',
      notes: 'Load water, maintain normal sodium'
    },
    2: {
      calories: Math.round(tdee * 0.5),
      water: '2-3L',
      sodium: 'Very low',
      carbs: 'Minimal',
      training: 'Light training + hot bath',
      notes: 'Reduce water, cut sodium completely'
    },
    1: {
      calories: Math.round(tdee * 0.3),
      water: '0.5L',
      sodium: 'None',
      carbs: 'None',
      training: 'Sauna/hot bath sessions',
      notes: 'Minimal water, no sodium/carbs, controlled sweating'
    }
  };

  return {
    day: `Day ${daysOut} (Water Cut Phase)`,
    ...waterCutPlans[daysOut]
  };
}

function generateNormalCutDay(daysOut, tdee, dailyLoss) {
  const calorieDeficit = dailyLoss * 7700;
  const targetCalories = Math.max(1200, tdee - calorieDeficit);

  return {
    day: `Day ${daysOut}`,
    calories: Math.round(targetCalories),
    water: '3-4L',
    sodium: 'Moderate',
    carbs: 'Moderate',
    training: 'Full training',
    notes: 'Maintain training intensity, monitor energy levels'
  };
}

function getNutritionGuidelines(discipline) {
  return {
    protein: {
      amount: '2.2-2.5g per kg body weight',
      sources: 'Lean meats, fish, eggs, protein powder',
      timing: 'Distribute throughout the day'
    },
    carbs: {
      strategy: 'Carb cycling - lower on rest days',
      sources: 'Rice, oats, vegetables',
      timing: 'Around training sessions'
    },
    fats: {
      amount: '0.8-1g per kg body weight',
      sources: 'Nuts, olive oil, avocado',
      notes: 'Essential for hormone production'
    },
    hydration: {
      normal: '3-4L per day',
      training: '+500ml per hour of training',
      electrolytes: 'Maintain until final 48 hours'
    }
  };
}

function getTrainingRecommendations(daysRemaining, discipline) {
  if (daysRemaining >= 14) {
    return {
      intensity: 'Maintain normal intensity',
      volume: 'Slightly reduced volume in final week',
      focus: 'Sport-specific skills, maintain fitness',
      recovery: 'Prioritize sleep and recovery'
    };
  } else if (daysRemaining >= 7) {
    return {
      intensity: 'Reduce intensity by 20%',
      volume: 'Reduce volume by 30%',
      focus: 'Technique work, light sparring',
      recovery: 'Increase rest between sessions'
    };
  } else {
    return {
      intensity: 'Very light',
      volume: 'Minimal',
      focus: 'Movement, flexibility, mental preparation',
      recovery: 'Maximum rest, avoid injury risk'
    };
  }
}

function getSupplementationPlan(daysRemaining) {
  const base = [
    'Multivitamin',
    'Protein powder',
    'Electrolytes (until final 48h)'
  ];

  if (daysRemaining >= 14) {
    return [
      ...base,
      'Creatine (maintain)',
      'Fish oil',
      'Magnesium'
    ];
  } else {
    return [
      ...base,
      'Magnesium (for muscle function)',
      'B-vitamins (for energy)'
    ];
  }
}

function generateWarnings(dailyWeightLoss, daysRemaining) {
  const warnings = [];

  if (dailyWeightLoss > 0.2) {
    warnings.push('⚠️ DANGER: Daily weight loss exceeds safe limits');
  }

  if (daysRemaining < 7 && dailyWeightLoss > 0.15) {
    warnings.push('⚠️ HIGH RISK: Rapid weight cut requires medical supervision');
  }

  if (daysRemaining < 3) {
    warnings.push('⚠️ CRITICAL: Monitor for signs of severe dehydration');
    warnings.push('⚠️ Have medical support available');
  }

  if (warnings.length === 0) {
    warnings.push('✅ Weight cut parameters are within safe ranges');
  }

  return warnings;
}

async function saveWeightPlan(userId, plan, competitionDate) {
  try {
    await supabase
      .from('weight_plans')
      .insert([
        {
          user_id: userId,
          plan_data: plan,
          competition_date: competitionDate,
          created_at: new Date().toISOString()
        }
      ]);
  } catch (error) {
    console.error('Failed to save weight plan:', error);
  }
}