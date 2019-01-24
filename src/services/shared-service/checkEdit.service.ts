export class CheckEdit {

    public checkMode(id: string) {

        // check if we in edit or add mode
        if (id != null && id !== '') {
            return true;
        } else {
            return false;
        }
    }

}
