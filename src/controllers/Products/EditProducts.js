const { database } = require('../../infra/database/index')
const { statusCode } = require('../../config/statusCode')
const { z } = require('zod')
const storage = require('../../utils/storage.js')
const getFileExtension = require('../../utils/get-file-extension.js')

const editProductBodySchema = z.object({
  descricao: z.string().min(2),
  quantidade_estoque: z.coerce.number().min(1),
  valor: z.coerce.number().min(1),
  categoria_id: z.coerce.number(),
})

const editProductParamsSchema = z.object({
  id: z.coerce.number(),
})

async function editProducts(req, res) {
  const { file } = req
  const { id } = editProductParamsSchema.parse(req.params)
  const { descricao, quantidade_estoque, valor, categoria_id } =
    editProductBodySchema.parse(req.body)

  const product = await database('produtos').where({ id }).first()

  if (!product) {
    return res
      .status(statusCode.BadRequest)
      .json({ message: 'The product is not registered.' })
  }

  const category = await database('categorias')
    .where({ id: categoria_id })
    .first()

  if (!category) {
    return res
      .status(statusCode.BadRequest)
      .json({ message: 'The specified category does not exist.' })
  }

  if (file) {
    const extension = getFileExtension(file.originalname)
    const { url } = await storage.uploadFile(
      `desafio-final/upload-img-produto.${extension}`,
      file.buffer,
      file.mimetype,
    )
    const updateProduct = await database('produtos')
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: url,
      })
      .where({ id })
      .returning('*')

    return res.status(statusCode.OK).json(updateProduct[0])
  }

  const updateProduct = await database('produtos')
    .update({
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
      produto_imagem: null,
    })
    .where({ id })
    .returning('*')

  return res.status(statusCode.OK).json(updateProduct[0])
}

module.exports = { editProducts }
