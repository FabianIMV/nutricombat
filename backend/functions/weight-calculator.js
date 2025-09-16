const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { currentWeight, targetWeight, daysRemaining, discipline, userId } = body;

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
          error: 'Missing required fields: currentWeight, targetWeight, daysRemaining'
        })
      };
    }

    // métricas de corte de peso
    const weightToLose = currentWeight - targetWeight;
    const dailyWeightLoss = weightToLose / daysRemaining;
    const weeklyWeightLoss = dailyWeightLoss * 7;

    // límites de seguridad por disciplina
    const safetyLimits = {
      mma: { maxWeekly: 1.0, maxDaily: 0.15 },
      boxing: { maxWeekly: 1.2, maxDaily: 0.17 },
      wrestling: { maxWeekly: 1.0, maxDaily: 0.15 },
      muaythai: { maxWeekly: 1.0, maxDaily: 0.15 },
      default: { maxWeekly: 1.0, maxDaily: 0.15 }
    };

    const limits = safetyLimits[discipline?.toLowerCase()] || safetyLimits.default;

    // evaluación de riesgo
    const isSafeWeekly = weeklyWeightLoss <= limits.maxWeekly;
    const isSafeDaily = dailyWeightLoss <= limits.maxDaily;
    const isSafe = isSafeWeekly && isSafeDaily;

    let riskLevel = 'low';
    let riskMessage = 'This weight cut is within safe parameters.';

    if (weeklyWeightLoss > limits.maxWeekly * 1.5 || dailyWeightLoss > limits.maxDaily * 1.5) {
      riskLevel = 'high';
      riskMessage = 'WARNING: This weight cut is dangerous. Consider extending timeline or adjusting target weight.';
    } else if (weeklyWeightLoss > limits.maxWeekly || dailyWeightLoss > limits.maxDaily) {
      riskLevel = 'medium';
      riskMessage = 'CAUTION: This weight cut is aggressive. Monitor closely and consider medical supervision.';
    }

    // fases de pérdida gradual
    const phases = calculateWeightCutPhases(currentWeight, targetWeight, daysRemaining);

    // estrategia de hidratación
    const hydrationPlan = calculateHydrationPlan(daysRemaining, weightToLose);

    const result = {
      calculation: {
        currentWeight,
        targetWeight,
        weightToLose,
        daysRemaining,
        dailyWeightLoss,
        weeklyWeightLoss
      },
      safety: {
        isSafe,
        riskLevel,
        riskMessage,
        limits: {
          maxDailyLoss: limits.maxDaily,
          maxWeeklyLoss: limits.maxWeekly
        }
      },
      phases,
      hydrationPlan,
      recommendations: generateRecommendations(riskLevel, daysRemaining, weightToLose)
    };

    // guardar cálculo si hay userId
    if (userId) {
      await logWeightCalculation(userId, result);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Weight calculation error:', error);

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

function calculateWeightCutPhases(currentWeight, targetWeight, daysRemaining) {
  const totalLoss = currentWeight - targetWeight;

  if (daysRemaining <= 7) {
    // corte a corto plazo
    return {
      phase1: {
        days: Math.max(1, daysRemaining - 2),
        type: 'gradual_loss',
        targetLoss: totalLoss * 0.6,
        description: 'Gradual fat/muscle loss through diet and training'
      },
      phase2: {
        days: Math.min(2, daysRemaining),
        type: 'water_manipulation',
        targetLoss: totalLoss * 0.4,
        description: 'Water manipulation and final cut'
      }
    };
  } else {
    // corte a largo plazo
    const gradualDays = daysRemaining - 3;
    return {
      phase1: {
        days: gradualDays,
        type: 'sustainable_loss',
        targetLoss: totalLoss * 0.8,
        description: 'Sustainable weight loss through nutrition and training'
      },
      phase2: {
        days: 3,
        type: 'final_cut',
        targetLoss: totalLoss * 0.2,
        description: 'Final water manipulation and weight cut'
      }
    };
  }
}

function calculateHydrationPlan(daysRemaining, weightToLose) {
  const baseWaterIntake = 3.0;

  if (daysRemaining <= 3) {
    return {
      daysOut3: { water: baseWaterIntake * 1.5, sodium: 'normal', description: 'Load water' },
      daysOut2: { water: baseWaterIntake * 1.2, sodium: 'reduced', description: 'Maintain high water, reduce sodium' },
      daysOut1: { water: baseWaterIntake * 0.5, sodium: 'minimal', description: 'Reduce water intake' },
      dayOf: { water: 0.2, sodium: 'none', description: 'Minimal water, no sodium' }
    };
  } else {
    return {
      normal: {
        water: baseWaterIntake,
        sodium: 'normal',
        description: `Maintain ${baseWaterIntake}L daily water intake`
      },
      finalWeek: 'Switch to final week protocol 7 days before weigh-in'
    };
  }
}

function generateRecommendations(riskLevel, daysRemaining, weightToLose) {
  const baseRecommendations = [
    'Monitor weight daily at the same time',
    'Maintain proper nutrition to preserve muscle mass',
    'Stay hydrated unless in final water manipulation phase',
    'Get adequate sleep for recovery',
    'Consider professional supervision'
  ];

  if (riskLevel === 'high') {
    return [
      'SEEK MEDICAL SUPERVISION IMMEDIATELY',
      'Consider adjusting target weight or timeline',
      'Monitor for signs of dehydration and exhaustion',
      ...baseRecommendations
    ];
  } else if (riskLevel === 'medium') {
    return [
      'Consider medical supervision',
      'Monitor energy levels and performance closely',
      'Be prepared to adjust plan if needed',
      ...baseRecommendations
    ];
  }

  return baseRecommendations;
}

async function logWeightCalculation(userId, calculation) {
  try {
    await supabase
      .from('weight_calculations')
      .insert([
        {
          user_id: userId,
          calculation_data: calculation,
          created_at: new Date().toISOString()
        }
      ]);
  } catch (error) {
    console.error('Failed to log calculation:', error);
  }
}