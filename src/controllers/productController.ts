import { Request, Response } from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { Op, where } from "sequelize";
import { parse } from "path";

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const {categoryId, search, page, limit} = req.query
        const queryOptions: any = {
            include: [{model: Category, as: 'category'}]
        }
        let whereClause: any = {};
        console.log(req.query);

        if (categoryId) {
            whereClause = {
                categoryId: Number(categoryId)
            }
        }
        if (search) {
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        description: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
            }
        }

        // Check if we have anything in the whereClause
        if (Object.keys(whereClause).length > 0) {
            queryOptions.where = whereClause;
        }

        const parsedPage = parseInt(page as string, 10);
        const parsedLimit = parseInt(limit as string, 10);

        const defaultLimit = 10;
        const defaultPage = 1;

        const actualLimit = !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : defaultLimit;
        const actualPage = !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : defaultPage;
        const offset = (actualPage - 1) * actualLimit;

        queryOptions.limit = actualLimit;
        queryOptions.offset = offset;

        const {count, rows: products } = await Product.findAndCountAll(queryOptions);
        res.status(200).json({
            totalProducts: count,
            totalPages: Math.ceil(count / actualLimit),
            currentPage: actualPage,
            products: products
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getProductById = async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!id) {
        res.status(400).json({message: "Invalid Product ID"});
        return;
    }
    try {
        const product = await Product.findOne({where:{id}, include: [{model: Category, as: 'category'}]});
        if (!product) {
            res.status(404).json({message: "No product exists with id"});
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const createProduct = async (req: Request, res: Response) => {
    const { name, desription, price, categoryId } = req.body;
    if (!name || !price || !categoryId) {
        res.status(400).json({message: "Must include name, price, and categoryId"});
        return;
    }

    try {
        // Make sure category with this categoryId exists
        const category = await Category.findOne({where:{id: categoryId}});
        if (!category) {
            res.status(400).json({message: "Invalid categoryId"});
            return;
        }
        const product = await Product.create({
            name,
            description: desription || "",
            price,
            categoryId
        });
        res.status(201).json({message: "Product created", product});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!id) {
        res.status(400).json({message: "Invalid Product ID"});
        return;
    }
    const {name, description, price, categoryId} = req.body;
    try {
        const product = await Product.findOne({where:{id}});
        if (!product) {
            res.status(404).json({message: "Product does not exist"});
            return;
        }
        await product.update({name, description, price, categoryId});
        res.status(200).json({product});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const {id} = req.params;
    if (!id) {
        res.status(400).json({message: "Invalid Product ID"});
        return;
    }
    try {
        const deleted = await Product.destroy({where:{id}});
        if (deleted == 0) {
            res.status(404).json({message: "Product does not exist"});
            return;
        }
        res.status(200).json({message: "Product deleted"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}