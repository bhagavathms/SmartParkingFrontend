/**
 * Dynamic Pricing Service
 * Handles dynamic pricing predictions using ML model on HuggingFace
 */

const PRICING_API_URL = 'https://rashi-mishra-dynamicpricing.hf.space';

// Base prices per hour
const BASE_PRICES = {
  TWO_WHEELER: 20,
  FOUR_WHEELER: 50,
  HEAVY_VEHICLE: 70,
};

/**
 * Map backend vehicle type to pricing API format
 */
const mapVehicleType = (backendType) => {
  const mapping = {
    TWO_WHEELER: 'twoWheeler',
    FOUR_WHEELER: 'fourWheeler',
    HEAVY_VEHICLE: 'heavyVehicle',
  };
  return mapping[backendType] || 'fourWheeler';
};

/**
 * Format date to DD-MM-YYYY HH:MM format required by pricing API
 */
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

/**
 * Calculate base charge based on duration and vehicle type
 * IMPORTANT: Always charges minimum of 1 hour, even if parked for 1 second
 */
const calculateBaseCharge = (vehicleType, durationMinutes) => {
  const basePrice = BASE_PRICES[vehicleType] || BASE_PRICES.FOUR_WHEELER;
  const hours = durationMinutes / 60;

  // Minimum charge: 1 hour
  // Even if parked for 1 minute, charge for 1 full hour
  const billableHours = Math.max(hours, 1);

  return basePrice * billableHours;
};

/**
 * Get dynamic pricing prediction from ML model
 * @param {string} vehicleType - TWO_WHEELER, FOUR_WHEELER, or HEAVY_VEHICLE
 * @param {string} timeIn - Entry time (ISO format)
 * @param {string} timeOut - Exit time (ISO format)
 * @returns {Promise<{success: boolean, data: object, message: string}>}
 */
const getPricingPrediction = async (vehicleType, timeIn, timeOut) => {
  try {
    // Calculate duration in minutes
    const entryTime = new Date(timeIn);
    const exitTime = new Date(timeOut);
    const durationMinutes = (exitTime - entryTime) / (1000 * 60);

    // Calculate base charge
    const baseCharge = calculateBaseCharge(vehicleType, durationMinutes);

    // Format dates for pricing API
    const formattedTimeIn = formatDateTime(timeIn);
    const formattedTimeOut = formatDateTime(timeOut);
    const apiVehicleType = mapVehicleType(vehicleType);

    const requestBody = {
      vehicleType: apiVehicleType,
      timeIn: formattedTimeIn,
      timeOut: formattedTimeOut,
      paidAmt: Math.round(baseCharge), // Use calculated base charge
    };

    console.log('Pricing API Request:', requestBody);

    const response = await fetch(`${PRICING_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Pricing API error: ${response.status}`);
    }

    const data = await response.json();

    console.log('Pricing API Response:', data);

    // Apply minimum charge rule: at least 1 hour billing
    const basePrice = BASE_PRICES[vehicleType] || BASE_PRICES.FOUR_WHEELER;
    const actualDuration = data.duration_minutes;
    const billableHours = Math.max(actualDuration / 60, 1);

    // Recalculate with minimum charge
    const minimumBaseCharge = basePrice * billableHours;
    const minimumAdjustedCharge = minimumBaseCharge * data.multiplier;

    return {
      success: true,
      data: {
        multiplier: data.multiplier,
        baseCharge: minimumBaseCharge,
        adjustedCharge: minimumAdjustedCharge,
        durationMinutes: actualDuration,
        billableMinutes: Math.max(actualDuration, 60), // Show at least 60 minutes billed
        hourOfEntry: data.hour_of_entry,
        dayOfWeek: data.day_of_week,
        vehicleType: vehicleType,
      },
      message: 'Pricing calculated successfully',
    };
  } catch (error) {
    console.error('Pricing service error:', error);

    // Fallback to base pricing if ML model fails
    const entryTime = new Date(timeIn);
    const exitTime = new Date(timeOut);
    const durationMinutes = (exitTime - entryTime) / (1000 * 60);
    const baseCharge = calculateBaseCharge(vehicleType, durationMinutes); // Already has minimum charge logic

    return {
      success: false,
      data: {
        multiplier: 1.0,
        baseCharge: baseCharge,
        adjustedCharge: baseCharge,
        durationMinutes: durationMinutes,
        billableMinutes: Math.max(durationMinutes, 60), // Show at least 60 minutes billed
        vehicleType: vehicleType,
        fallback: true,
      },
      message: `Using base pricing (ML model unavailable): ${error.message}`,
    };
  }
};

/**
 * Check pricing API health
 */
const checkPricingHealth = async () => {
  try {
    const response = await fetch(`${PRICING_API_URL}/health`);
    if (!response.ok) {
      return { healthy: false, modelLoaded: false };
    }
    const data = await response.json();
    return {
      healthy: data.status === 'ok',
      modelLoaded: data.model_loaded,
    };
  } catch (error) {
    console.error('Pricing health check failed:', error);
    return { healthy: false, modelLoaded: false };
  }
};

const pricingService = {
  getPricingPrediction,
  checkPricingHealth,
  BASE_PRICES,
};

export default pricingService;
