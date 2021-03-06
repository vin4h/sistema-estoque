import { getRepository } from 'typeorm';
import Product from '../../model/Product';
import User from '../../model/User';
import { v4 } from 'uuid';

interface Request {
    id: string;
    name: string;
    amount: number;
    value: number;
    user_id: string;
}

class UpdateProductService {
    public async execute({ id, name, amount, value, user_id }: Request): Promise<Product> {
        const userRepository = getRepository(User);

        const productRepository = getRepository(Product);

        const findUser = await userRepository.findOne({
            relations: ['products'],
            where: { id: user_id }
        });

        if (!findUser) {
            throw Error('Usuário informado não existe');
        }

        const findProduct: Product[] = findUser.products.filter(product => product.id === id);

        if (!findProduct) {
            throw Error('Produto não existe');
        }


        const product = productRepository.create({
            id: v4(),
            name,
            amount,
            value,
            user_id,
            user: findUser
        });

        await productRepository.save(product);

        return product;
    }
}

export default UpdateProductService;