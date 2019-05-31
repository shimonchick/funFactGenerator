export class Product {
    public id: string;
    public likes: number;
    constructor(public name: string = '',
                public description: string = '',
                public price: number = 0) {}
}
