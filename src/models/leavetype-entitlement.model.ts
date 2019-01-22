export class LeaveTypeEntitlementModel {
    constructor(
        public ENTITLEMENT_GUID: string = null,
        public LEAVE_TYPE_GUID: string = null,
        public TENANT_GUID: string = null,
        public TENANT_COMPANY_GUID = null,
        public CODE: string = null,
        public DESCRIPTION: string = null,
        public PROPERTIES_XML: string = null,
        public ACTIVE_FLAG: number = 1,
        public CREATION_TS: string = null,
        public CREATION_USER_GUID: string = null,
        public UPDATE_TS: string = null,
        public UPDATE_USER_GUID: string = null,
    ) { }
}
