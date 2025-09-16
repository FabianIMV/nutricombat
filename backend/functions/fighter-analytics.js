const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  try {
    const { userId } = event.pathParameters;

    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'User ID is required'
        })
      };
    }

    // generar analíticas del usuario
    const analytics = await generateFighterAnalytics(userId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analytics)
    };

  } catch (error) {
    console.error('Analytics generation error:', error);

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

async function generateFighterAnalytics(userId) {
  try {
    // obtener perfil de usuario
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      throw new Error('User not found');
    }

    // historial de cálculos
    const { data: weightCalculations } = await supabase
      .from('weight_calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // historial de planes
    const { data: weightPlans } = await supabase
      .from('weight_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // procesar analíticas
    const analytics = {
      profile: {
        name: user.full_name,
        discipline: user.discipline,
        currentWeight: user.current_weight,
        targetWeight: user.target_weight,
        lastUpdated: user.updated_at
      },
      weightCutAnalytics: analyzeWeightCuts(weightCalculations || []),
      planHistory: analyzePlanHistory(weightPlans || []),
      recommendations: generateRecommendations(user, weightCalculations || []),
      riskAssessment: assessRisk(user, weightCalculations || []),
      performance: calculatePerformanceMetrics(weightCalculations || [], weightPlans || [])
    };

    return analytics;

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
}

function analyzeWeightCuts(calculations) {
  if (!calculations.length) {
    return {
      totalCalculations: 0,
      averageWeightLoss: 0,
      riskDistribution: { low: 0, medium: 0, high: 0 },
      trends: []
    };
  }

  const totalCalculations = calculations.length;
  let totalWeightLoss = 0;
  const riskCounts = { low: 0, medium: 0, high: 0 };
  const trends = [];

  calculations.forEach((calc, index) => {
    const data = calc.calculation_data;
    totalWeightLoss += data.calculation?.weightToLose || 0;

    const risk = data.safety?.riskLevel || 'low';
    riskCounts[risk]++;

    // tendencias en el tiempo
    trends.push({
      date: calc.created_at,
      weightToLose: data.calculation?.weightToLose || 0,
      daysRemaining: data.calculation?.daysRemaining || 0,
      riskLevel: risk,
      dailyLoss: data.calculation?.dailyWeightLoss || 0
    });
  });

  return {
    totalCalculations,
    averageWeightLoss: totalWeightLoss / totalCalculations,
    riskDistribution: {
      low: (riskCounts.low / totalCalculations) * 100,
      medium: (riskCounts.medium / totalCalculations) * 100,
      high: (riskCounts.high / totalCalculations) * 100
    },
    trends: trends.slice(0, 5),
    lastCalculation: calculations[0]?.created_at
  };
}

function analyzePlanHistory(plans) {
  if (!plans.length) {
    return {
      totalPlans: 0,
      averageDuration: 0,
      successfulCuts: 0,
      preferredStrategy: null
    };
  }

  const totalPlans = plans.length;
  let totalDuration = 0;
  const strategies = {};

  plans.forEach(plan => {
    const data = plan.plan_data;
    const duration = data.overview?.daysRemaining || 0;
    totalDuration += duration;

    const strategy = data.strategy?.type || 'unknown';
    strategies[strategy] = (strategies[strategy] || 0) + 1;
  });

  const preferredStrategy = Object.keys(strategies).reduce((a, b) =>
    strategies[a] > strategies[b] ? a : b, null);

  return {
    totalPlans,
    averageDuration: totalDuration / totalPlans,
    preferredStrategy,
    strategiesUsed: strategies,
    lastPlan: plans[0]?.created_at
  };
}

function generateRecommendations(user, calculations) {
  const recommendations = [];
  const latestCalc = calculations[0];

  // recomendaciones de manejo de peso
  if (user.current_weight && user.target_weight) {
    const weightDiff = user.current_weight - user.target_weight;

    if (weightDiff > 5) {
      recommendations.push({
        type: 'weight_management',
        priority: 'high',
        title: 'Consider gradual weight reduction',
        description: 'Your current weight is significantly above target. Consider starting weight cut earlier.',
        action: 'Plan a 8-12 week gradual weight reduction'
      });
    } else if (weightDiff > 2) {
      recommendations.push({
        type: 'weight_management',
        priority: 'medium',
        title: 'Moderate weight cut needed',
        description: 'You have a moderate amount to cut. Plan accordingly.',
        action: 'Start weight cut 4-6 weeks before competition'
      });
    }
  }

  // recomendaciones por nivel de riesgo
  if (latestCalc) {
    const riskLevel = latestCalc.calculation_data.safety?.riskLevel;

    if (riskLevel === 'high') {
      recommendations.push({
        type: 'safety',
        priority: 'critical',
        title: 'High-risk weight cut detected',
        description: 'Your recent calculation shows dangerous parameters.',
        action: 'Seek medical supervision and consider adjusting timeline'
      });
    }
  }

  // recomendaciones de frecuencia
  const recentCalculations = calculations.filter(calc => {
    const calcDate = new Date(calc.created_at);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return calcDate > oneMonthAgo;
  });

  if (recentCalculations.length > 5) {
    recommendations.push({
      type: 'planning',
      priority: 'medium',
      title: 'Consider long-term planning',
      description: 'You\'ve done many calculations recently. A structured long-term plan might help.',
      action: 'Create a quarterly weight management plan'
    });
  }

  // recomendaciones por disciplina
  if (user.discipline) {
    const disciplineRecs = getDisciplineRecommendations(user.discipline);
    recommendations.push(...disciplineRecs);
  }

  return recommendations;
}

function getDisciplineRecommendations(discipline) {
  const disciplineSpecific = {
    mma: [
      {
        type: 'training',
        priority: 'medium',
        title: 'MMA-specific weight cutting',
        description: 'Consider the multi-round endurance requirements',
        action: 'Focus on maintaining cardio during weight cut'
      }
    ],
    boxing: [
      {
        type: 'training',
        priority: 'medium',
        title: 'Boxing power preservation',
        description: 'Maintain explosive power during weight cut',
        action: 'Include power training throughout cut phase'
      }
    ],
    wrestling: [
      {
        type: 'training',
        priority: 'medium',
        title: 'Wrestling strength focus',
        description: 'Maintain functional strength for grappling',
        action: 'Emphasize compound movements during cut'
      }
    ]
  };

  return disciplineSpecific[discipline.toLowerCase()] || [];
}

function assessRisk(user, calculations) {
  let riskScore = 0;
  const factors = [];

  // cortes peligrosos frecuentes
  const highRiskCalculations = calculations.filter(calc =>
    calc.calculation_data.safety?.riskLevel === 'high'
  ).length;

  if (highRiskCalculations > 2) {
    riskScore += 30;
    factors.push('Multiple high-risk weight cuts detected');
  }

  // diferencias de peso grandes
  if (user.current_weight && user.target_weight) {
    const weightDiff = user.current_weight - user.target_weight;
    const percentageCut = (weightDiff / user.current_weight) * 100;

    if (percentageCut > 8) {
      riskScore += 25;
      factors.push('Extreme weight cut percentage (>8%)');
    } else if (percentageCut > 5) {
      riskScore += 15;
      factors.push('High weight cut percentage (>5%)');
    }
  }

  // patrones de cálculos recientes
  const recentHighRisk = calculations.slice(0, 3).filter(calc =>
    calc.calculation_data.safety?.riskLevel === 'high'
  ).length;

  if (recentHighRisk >= 2) {
    riskScore += 20;
    factors.push('Recent pattern of high-risk calculations');
  }

  // nivel de riesgo general
  let overallRisk = 'low';
  if (riskScore >= 40) {
    overallRisk = 'high';
  } else if (riskScore >= 20) {
    overallRisk = 'medium';
  }

  return {
    overallRisk,
    riskScore,
    factors,
    recommendations: getRiskRecommendations(overallRisk, factors)
  };
}

function getRiskRecommendations(riskLevel, factors) {
  const baseRecommendations = [
    'Monitor weight regularly',
    'Stay hydrated',
    'Get adequate sleep',
    'Consider professional guidance'
  ];

  if (riskLevel === 'high') {
    return [
      'SEEK IMMEDIATE MEDICAL CONSULTATION',
      'Consider adjusting competition schedule',
      'Implement gradual weight management',
      ...baseRecommendations
    ];
  } else if (riskLevel === 'medium') {
    return [
      'Consider medical supervision for weight cuts',
      'Plan weight cuts earlier',
      'Monitor for warning signs',
      ...baseRecommendations
    ];
  }

  return baseRecommendations;
}

function calculatePerformanceMetrics(calculations, plans) {
  const metrics = {
    planningEfficiency: 0,
    safetyConsistency: 0,
    improvementTrend: 'stable',
    averagePreparationTime: 0
  };

  if (calculations.length === 0) return metrics;

  // consistencia en seguridad
  const safeCalculations = calculations.filter(calc =>
    calc.calculation_data.safety?.riskLevel === 'low'
  ).length;
  metrics.safetyConsistency = (safeCalculations / calculations.length) * 100;

  // eficiencia de planificación
  if (plans.length > 0) {
    metrics.planningEfficiency = Math.min((plans.length / calculations.length) * 100, 100);
  }

  // tiempo promedio de preparación
  const preparationTimes = calculations.map(calc =>
    calc.calculation_data.calculation?.daysRemaining || 0
  );
  metrics.averagePreparationTime = preparationTimes.reduce((a, b) => a + b, 0) / preparationTimes.length;

  // tendencia de mejora
  if (calculations.length >= 3) {
    const recent = calculations.slice(0, 3);
    const older = calculations.slice(3, 6);

    const recentAvgRisk = recent.reduce((sum, calc) => {
      const risk = calc.calculation_data.safety?.riskLevel;
      return sum + (risk === 'high' ? 2 : risk === 'medium' ? 1 : 0);
    }, 0) / recent.length;

    const olderAvgRisk = older.reduce((sum, calc) => {
      const risk = calc.calculation_data.safety?.riskLevel;
      return sum + (risk === 'high' ? 2 : risk === 'medium' ? 1 : 0);
    }, 0) / (older.length || 1);

    if (recentAvgRisk < olderAvgRisk - 0.3) {
      metrics.improvementTrend = 'improving';
    } else if (recentAvgRisk > olderAvgRisk + 0.3) {
      metrics.improvementTrend = 'declining';
    }
  }

  return metrics;
}