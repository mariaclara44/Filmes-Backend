import { Prisma } from "@prisma/client";
import * as model from '../Models/moviesModel.js';

export const getAll = async (req, res) => {
    try {
        const movies = await model.findAll(req.query);

        if (!movies || movies.length === 0) {
            return res.status(200).json({
                message: 'Nenhum registro encontrado.',
            });
        }
        res.json(movies);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const data = await model.findById(id);
        if (!data) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        res.json({ data });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro' });
    }
};

export const create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'O corpo da requisição não contém dados. Envie as informações do exemplo.',
            });
        }

        const { title, description, duration, genre, rating, available } = req.body;
        if (!title) return res.status(400).json({ error: 'Título obrigatório!' });
        if (!description) return res.status(400).json({ error: 'Descrição obrigatória!' });
        if (!duration) return res.status(400).json({ error: 'Duração obrigatória!' });
        if (!genre) return res.status(400).json({ error: 'Gênero obrigatório!' });
        if (rating === undefined) return res.status(400).json({ error: 'Classificação obrigatória!' });
        if (!available) return res.status(400).json({ error: 'Avaliação obrigatório!' });

     // Titulo com mais de 3 caracteres 
        if (title.length < 3)
            return res.status(400).json({error: 'O título deve conter mais de três caracteres'})

        // Descrição deve estar com mais de 10 caracteres
        if (description.length < 10) {
            return res.status(400).json({ error: 'A descrição pode conter mais de 10 caracteres' });
        }

        //Duração deve ser um número inteiro positivo
        if (!Number.isInteger(duration) || duration <= 0)
            return res.status(400).json({ error: 'A duração deve ser número inteiro positivo' });


        // Verificação de genero
        const generosValidos = [
            'Ação',
            "Terror",
            'Comédia',
            'Suspense',
            'Romance',
            'Drama',
            'Ficção Cintífica',
            'Suspense',
        ];

        if (!generosValidos.includes(genre)) {
            return res.status(400).json({error: 'Gênero não é válido'});
        }

        //A nota deve ser entre 0 e 10
        if (rating < 0 || rating > 10)
            return res.status(400).json ({
        error: 'A nota deverá estar entre 0 e 10'});

        const data = await model.create({
            title,
            description,
            duration,
            genre,
            rating: Number(rating),
            available: true
        });

        res.status(201).json({
            message: 'Filme cadastrado com sucesso!',
            data,
        });
    } catch (error) {
        console.error('Erro ao criar:', error);
        res.status(500).json({ error: 'Erro interno no servidor ao salvar o filme.' });
    }
};





export const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'Corpo da requisição vazio. Envie os dados do filme!',
            });
        }

        if (isNaN(id)) return res.status(400).json({ error: 'ID não é válido' });


    // Verificar se o filme existe 
        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({error: 'Filme não encontrado para a atualização'});
        }

        // Filmes avaliados (false), não podem ser avaliados
        if (!exists.available === false) {
            return res.status(400).json({
                error: 'Filme não disponível para atualização'
            });
        }

        const {title, description, duration, genre, rating} = req.body;

        if (rating !== undefined && (rating < 0 || rating > 10)) {
            return res.status(400).json({error: 'A nota deverá estar entre 0 e 10!'})
        }

        // Duração positiva 
        if (duration !==undefined) {
            if (!Number.isInteger(duration) || !duration > 300 || duration <= 0) {
                return res.status(400).json ({error: 'Filme com duração superior a 300 minutos, não conseguem ser cadastrados' })
            }
        }

        // Titulo com minimo de 10 caracteres 
        if (title !== undefined && title.length < 3) {
            return res.status(400).json({error: 'O título deve conter mais de 3 caracteres.'})
        }

        // Descrição com no minimo 10 caracteres

        if (description !== undefined && description.length < 10) {
            return res.status(400).json ({ error: 'A descrição precisa ter mais de 10 caracteres'})
        }
    
        const generosValidos = [
             'Ação',
            "Terror",
            'Comédia',
            'Suspense',
            'Romance',
            'Drama',
            'Ficção Cintífica',
            'Suspense',
        ]

        if (genre !== undefined && !generosValidos.includes(genre)) {
            return res.status(400).json({error: 'Gênero não é válido'});
        }

        // titulo duplicado 
        if (title !== undefined && title !== exists.title) {
            const existsTitle = await model.findByTitle(title);
            if(existsTitle) {
                return res.status(400).json({error: 'Já existe um filme com esse título'})
            }
        }
        const data = await model.update(id, req.body);

        res.json ({
            message: `O filme ${data.title} foi atualizado com sucesso!!`,
            data,
        });

    } catch (error) {
        console.log('Erro ao atualizar', error);
        res.status(500).json ({error: 'Erro ao atualizar o filme'})
        }
    };

export const remove = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID não é válido' });

        const exists = await model.findById(id);
        if (!exists) {
            return res.status(404).json({ error: 'Filme não encotrado para deletar.' });
        }

        // Filme com rating > 9 podem ser deletados
        if (exists.rating >= 9)
            return res.status(400).json ({
        error: 'Filmes com nota maior ou igual a 9 não podem ser deletados'});

        await model.remove(id);
        res.json({
            message: `O registro '${exists.title}' foi removido com sucesso!`,
            delete: exists,
        });
    } catch (error) {
        console.error('Erro ao remover:', error);
        res.status(500).json({ error: 'Falha ao remover filme' });
    }
};