export class CostCentreModel {

    public COST_CENTRE_GUID: string = null;
    public NAME: string = null;
    public CREATION_TS: string = null;
    public CREATION_USER_GUID: string = null;
    public UPDATE_TS: string = new Date().toISOString();
    public UPDATE_USER_GUID: string = null;
    public TENANT_GUID: string = null;
    public DEL_FLAG = 0;

    construct() {}
}
