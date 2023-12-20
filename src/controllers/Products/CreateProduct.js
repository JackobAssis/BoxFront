const { statusCode } = require('../../config/statusCode/index.js')
const { database } = require('../../infra/database/index.js')
const { z } = require('zod')

const storage = require('../../utils/storage.js')
const getFileExtension = require('../../utils/get-file-extension.js')

const createProductBodySchema = z.object({
  descricao: z.string().min(2),
  quantidade_estoque: z.coerce.number().min(1),
  valor: z.coerce.number().min(1),
  categoria_id: z.coerce.number(),
})

async function createProduct({ body, file }, res) {
  const { categoria_id, descricao, quantidade_estoque, valor } =
    createProductBodySchema.parse(body)

  const categoryExists = await database('categorias')
    .where({
      id: categoria_id,
    })
    .first()

  if (!categoryExists) {
    return res.status(statusCode.BadRequest).json({
      message: 'Category not found',
    })
  }

  if (file) {
    const extension = getFileExtension(file.originalname)
    const { url } = await storage.uploadFile(
      `desafio-final/upload-img-produto.${extension}`,
      file.buffer,
      file.mimetype,
    )
    const [product] = await database('produtos')
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: url,
      })
      .returning('*')
    return res
      .status(statusCode.Created)
      .json({ message: 'Successfully creation of product!', product })
  }

  const [product] = await database('produtos')
    .insert({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      produto_imagem: null,
    })
    .returning('*')

  return res.status(statusCode.Created).json(product)
}

module.exports = { createProduct }
