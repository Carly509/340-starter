function vehicleSpecsHTML(vehicle) {
  return `
<div class="vehicle-specs">
  <div class="spec-row">
    <span class="spec-label">Mileage:</span>
    <span class="spec-value">${vehicle.miles ? vehicle.miles.toLocaleString() : 'N/A'}</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">MPG:</span>
    <span class="spec-value">${vehicle.mpg || '29/37'} (City/Hwy)</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">Ext. Color:</span>
    <span class="spec-value">${vehicle.color || 'Unknown'}</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">Int. Color:</span>
    <span class="spec-value">${vehicle.int_color || 'Black'}</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">Fuel Type:</span>
    <span class="spec-value">${vehicle.fuel_type || 'Gasoline'}</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">Drivetrain:</span>
    <span class="spec-value">${vehicle.drivetrain || 'Front Wheel Drive'}</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">Transmission:</span>
    <span class="spec-value">${vehicle.transmission || 'Automatic CVT'}</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">Stock #:</span>
    <span class="spec-value">${vehicle.stock || 'BD1280'}</span>
  </div>
  <div class="spec-row">
    <span class="spec-label">VIN:</span>
    <span class="spec-value">${vehicle.vin || '3N1AB7AP9MY362632'}</span>
  </div>
</div>
  `;
}

module.exports = { vehicleSpecsHTML };
