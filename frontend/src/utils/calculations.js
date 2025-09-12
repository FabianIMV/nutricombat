export const weightCutCalculations = {
  // Calculate maximum safe weight cut (8% of body weight)
  getMaxSafeCut(currentWeight) {
    return currentWeight * 0.08;
  },

  // Calculate if weight cut is safe
  isSafeCut(currentWeight, targetWeight) {
    const difference = currentWeight - targetWeight;
    const maxSafe = this.getMaxSafeCut(currentWeight);
    return difference <= maxSafe;
  },

  // Calculate days remaining until competition
  getDaysRemaining(competitionDate) {
    const today = new Date();
    const competition = new Date(competitionDate);
    const diffTime = competition - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  },

  // Determine current phase based on days remaining
  getCurrentPhase(daysRemaining) {
    if (daysRemaining > 7) {
      return 'preparation';
    } else if (daysRemaining > 1) {
      return 'intensive';
    } else {
      return 'weigh_in';
    }
  },

  // Calculate weight cut plan
  calculateCutPlan(currentWeight, targetWeight, daysRemaining) {
    const totalCut = currentWeight - targetWeight;
    const dailyTarget = totalCut / Math.max(daysRemaining, 1);

    // Phase breakdown
    const preparationDays = Math.max(0, daysRemaining - 7);
    const intensiveDays = Math.min(7, Math.max(0, daysRemaining - 1));
    const weighInDay = daysRemaining > 0 ? 1 : 0;

    // Weight distribution by phase
    const preparationCut = preparationDays > 0 ? totalCut * 0.4 : 0;
    const intensiveCut = intensiveDays > 0 ? totalCut * 0.5 : totalCut - preparationCut;
    const weighInCut = weighInDay > 0 ? totalCut * 0.1 : 0;

    return {
      totalCut,
      dailyTarget,
      phases: {
        preparation: {
          days: preparationDays,
          weightCut: preparationCut,
          dailyTarget: preparationDays > 0 ? preparationCut / preparationDays : 0,
          description: 'Déficit calórico gradual, hidratación normal',
        },
        intensive: {
          days: intensiveDays,
          weightCut: intensiveCut,
          dailyTarget: intensiveDays > 0 ? intensiveCut / intensiveDays : 0,
          description: 'Restricción de sodio y carbohidratos, reducir agua',
        },
        weighIn: {
          days: weighInDay,
          weightCut: weighInCut,
          dailyTarget: weighInCut,
          description: 'Hidratación mínima, sauna si es necesario',
        },
      },
    };
  },

  // Calculate BMI
  calculateBMI(weight, height) {
    return weight / ((height / 100) * (height / 100));
  },

  // Calculate daily calorie needs
  calculateDailyCalories(weight, height, age, gender, activityLevel) {
    // Basal Metabolic Rate (Harris-Benedict)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    return bmr * (activityMultipliers[activityLevel] || 1.55);
  },

  // Water intake recommendations by phase
  getWaterRecommendation(phase, weight) {
    const baseIntake = weight * 35; // ml per kg
    
    switch (phase) {
      case 'preparation':
        return baseIntake;
      case 'intensive':
        return baseIntake * 0.7;
      case 'weigh_in':
        return baseIntake * 0.3;
      default:
        return baseIntake;
    }
  },

  // Check for dangerous symptoms
  checkDangerousSymptoms(symptoms) {
    const dangerousSymptoms = [
      'severe_dehydration',
      'dizziness',
      'nausea',
      'extreme_fatigue',
      'confusion',
      'heart_palpitations',
    ];

    return symptoms.some(symptom => dangerousSymptoms.includes(symptom));
  },
};