# Backend Enum Values - IMPORTANT

## ⚠️ Correct Enum Values

The backend uses specific enum values that **must** be used exactly as shown:

### Vehicle Types
Use these values when calling parking APIs:

```javascript
'FOUR_WHEELER'   // For cars (NOT 'CAR')
'TWO_WHEELER'    // For bikes/motorcycles (NOT 'BIKE')
'HEAVY_VEHICLE'  // For trucks/buses (NOT 'TRUCK')
```

### Slot Types
```javascript
'COMPACT'    // Small parking slots (for TWO_WHEELER)
'STANDARD'   // Medium parking slots (for FOUR_WHEELER)
'LARGE'      // Large parking slots (for HEAVY_VEHICLE)
```

### Slot Status
```javascript
'AVAILABLE'    // Slot is free
'OCCUPIED'     // Slot is taken
'RESERVED'     // Slot is reserved
'MAINTENANCE'  // Slot under maintenance
```

### Vehicle Status
```javascript
'PARKED'      // Vehicle is currently parked
'EXITED'      // Vehicle has exited
'IN_PROCESS'  // Vehicle entry/exit in progress
```

### Gender (for Employee)
```javascript
'MALE'
'FEMALE'
'OTHER'
```

---

## 📝 Examples

### Correct Usage

```javascript
// ✅ CORRECT - Park a car
await parkingService.parkVehicle('FOUR_WHEELER', 'ABC123');

// ✅ CORRECT - Park a bike
await parkingService.parkVehicle('TWO_WHEELER', 'XYZ789');

// ✅ CORRECT - Park a truck
await parkingService.parkVehicle('HEAVY_VEHICLE', 'TRK001');
```

### Incorrect Usage (Will Fail)

```javascript
// ❌ WRONG - Will cause error
await parkingService.parkVehicle('CAR', 'ABC123');

// ❌ WRONG - Will cause error
await parkingService.parkVehicle('BIKE', 'XYZ789');

// ❌ WRONG - Will cause error
await parkingService.parkVehicle('TRUCK', 'TRK001');
```

---

## 🔧 Frontend Implementation

The frontend `EntryPage.jsx` has been updated to use correct values:

```javascript
// Vehicle type dropdown options
<option value="FOUR_WHEELER">Car (Four Wheeler)</option>
<option value="TWO_WHEELER">Bike (Two Wheeler)</option>
<option value="HEAVY_VEHICLE">Truck (Heavy Vehicle)</option>
```

---

## 🗺️ Mapping Reference

If you need to display user-friendly names:

```javascript
const vehicleTypeLabels = {
  'FOUR_WHEELER': 'Car',
  'TWO_WHEELER': 'Bike',
  'HEAVY_VEHICLE': 'Truck'
};

const slotTypeLabels = {
  'COMPACT': 'Small',
  'STANDARD': 'Medium',
  'LARGE': 'Large'
};

const statusLabels = {
  'PARKED': 'Parked',
  'EXITED': 'Exited',
  'IN_PROCESS': 'Processing'
};
```

---

## ⚠️ Important Notes

1. **Case Sensitive**: All enum values are UPPERCASE
2. **Exact Match Required**: Backend will reject incorrect values
3. **No Spaces**: Use underscores, not spaces
4. **Already Fixed**: The frontend `EntryPage.jsx` now uses correct values

---

## 🐛 Error You Might See

If using wrong values, you'll see:

```
JSON parse error: Cannot deserialize value of type `com.smartparking.enums.VehicleType`
from String "CAR": not one of the values accepted for Enum class:
[HEAVY_VEHICLE, TWO_WHEELER, FOUR_WHEELER]
```

**Solution**: Use the correct enum values from this document!

---

**Last Updated**: Fixed in EntryPage.jsx (November 14, 2025)
