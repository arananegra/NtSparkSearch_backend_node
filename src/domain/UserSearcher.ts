export class UserSearcher {
    private _username_criteria: string;
    private _email_criteria: string;

    public constructor() {
        this._username_criteria = null;
        this._email_criteria = null;
    }

    get username_criteria(): string {
        return this._username_criteria;
    }

    set username_criteria(value: string) {
        this._username_criteria = value;
    }

    get email_criteria(): string {
        return this._email_criteria;
    }

    set email_criteria(value: string) {
        this._email_criteria = value;
    }
}