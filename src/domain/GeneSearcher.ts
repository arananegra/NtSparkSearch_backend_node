export class GeneSearcher {
    private _gene_id_criteria: string;

    public constructor() {
        this._gene_id_criteria = null;
    }

    get gene_id_criteria(): string {
        return this._gene_id_criteria;
    }

    set gene_id_criteria(value: string) {
        this._gene_id_criteria = value;
    }
}