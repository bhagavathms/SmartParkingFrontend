const PRICING_API_URL = 'https://rashi-mishra-dynamicpricing.hf.space';

const BASE_PRICES = {
  TWO_WHEELER: 20,
  FOUR_WHEELER: 50,
  HEAVY_VEHICLE: 70,
};

const mapVehicleType = (backendType) => {
  const mapping = {
    TWO_WHEELER: 'twoWheeler',
    FOUR_WHEELER: 'fourWheeler',
    HEAVY_VEHICLE: 'heavyVehicle',
  };
  return mapping[backendType] || 'fourWheeler';
};


const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};


const calculateBaseCharge = (vehicleType, durationMinutes) => {
  const basePrice = BASE_PRICES[vehicleType] || BASE_PRICES.FOUR_WHEELER;
  const hours = durationMinutes / 60;

  const billableHours = Math.max(hours, 1);

  return basePrice * billableHours;
};

const getPricingPrediction = async (vehicleType, timeIn, timeOut) => {
  try {
    const entryTime = new Date(timeIn);
    const exitTime = new Date(timeOut);
    const durationMinutes = (exitTime - entryTime) / (1000 * 60);

    const baseCharge = calculateBaseCharge(vehicleType, durationMinutes);

    const formattedTimeIn = formatDateTime(timeIn);
    const formattedTimeOut = formatDateTime(timeOut);
    const apiVehicleType = mapVehicleType(vehicleType);

    const requestBody = {
      vehicleType: apiVehicleType,
      timeIn: formattedTimeIn,
      timeOut: formattedTimeOut,
      paidAmt: Math.round(baseCharge),
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

    const basePrice = BASE_PRICES[vehicleType] || BASE_PRICES.FOUR_WHEELER;
    const actualDuration = data.duration_minutes;
    const billableHours = Math.max(actualDuration / 60, 1);

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
        billableMinutes: Math.max(durationMinutes, 60),
        vehicleType: vehicleType,
        fallback: true,
      },
      message: `Using base pricing (ML model unavailable): ${error.message}`,
    };
  }
};


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
