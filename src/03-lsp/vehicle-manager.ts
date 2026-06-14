import { Vehicle } from './vehicle';

export class VehicleManager {

    static printVehicleDetails(vehicles: Vehicle[]) {
        vehicles.forEach(vehicle => {
            console.log(vehicle.describe());
        });
    }
}
