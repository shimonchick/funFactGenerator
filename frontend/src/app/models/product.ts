export class Product {
    public id: string;
    public likes: number;
    public liked: boolean;
    constructor(public name: string = '',
                public description: string = '',
                public price: number = 0) {}
}
