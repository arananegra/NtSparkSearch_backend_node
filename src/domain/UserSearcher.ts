export class UserSearcher {
    private _username_criteria: string;

    public constructor() {
        this._username_criteria = null;
    }

    get username_criteria(): string {
        return this._username_criteria;
    }

    set username_criteria(value: string) {
        this._username_criteria = value;
    }
}