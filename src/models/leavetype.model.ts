import { ViewLeaveTypeSetupModel } from './view-leavetype-setup.model';

export class LeaveTypeModel {

    public leave_id: string;
    public leave_type: string;
    public leave_entitlement: Array<ViewLeaveTypeSetupModel>;

    constructor() {}
}
