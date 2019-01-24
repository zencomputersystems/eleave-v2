export class CostCentreModel {

    COST_CENTRE_GUID: string;
    CREATION_TS: string;
    CREATION_USER_GUID: string;
    UPDATE_TS: string = new Date().toISOString();
    UPDATE_USER_GUID: string;
    TENANT_GUID: string;
    DEL_FLAG = 0;
    NAME: string;

    construct() {

    }
}
