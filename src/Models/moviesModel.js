import prisma from '../utils/prima.config.js';

export const create = async (data) => {
    return await prisma.movie.create({ data });

};


export const findAll = async (filters = {}) => {
    const {title, description, duration, genre, rating, available, miniRating, maxDuration} = filters;
    const where = {};

    if (title) where.title = { contains: title, mode: 'insensitive'};
    if (description) where.description = { contains: description, mode: 'insensitive'};
    if (genre) where.genre = { contains: genre, mode: 'insensitive'};

    if (rating !== undefined) {
        where.rating = Number(rating);
    } else if (miniRating !== undefined)
        where.rating = {gte: Number(miniRating)};

    if (duration !== undefined) {
        where.duration = Number(duration);
    }else if (maxDuration !== undefined)
        where.duration = {lte: Number(maxDuration)};

    if (available !== undefined) {
        where.available = available === 'true'; }

    return await prisma.movie.findMany ({
        where,
        orderBy: {createdAt: 'desc'},
    });
};

export const findById = async (id) => {
    return await prisma.movie.findUnique({
        where: {id: parseInt(id)},
    });
};

export const findByTitle = async (title) => {
    return await prisma.movie.findUnique({
        where: {title}
    });
};

export const update = async (id, data) => {
    const updateData = {...data };
  
    return await prisma.movie.update({
        where: {id: parseInt(id) },
        data: updateData,
    });
};


export const remove = async (id) => {
    return await prisma.movie.delete({
        where: { id: parseInt(id) },
    });
};