import type { HttpContext } from '@adonisjs/core/http'
import ImageIndexerService from '#services/image_indexer_service'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

export default class IndexMakersController {
  public async show({ request, view }: HttpContext) {
    if (request.header('X-Up-Version')) {
      return view.render('components/partials/index-maker')
    }
    return view.render('pages/index-maker')
  }

  public async process({ request, session, view }: HttpContext) {
    try {
      const convertedPath = './tmp/converted'
      const files = await readdir(convertedPath)
      const imagePaths = files
        .filter((file) => file.match(/\.(jpg|jpeg|png)$/i))
        .map((file) => join(convertedPath, file))

      const results = await ImageIndexerService.batchIndexImages(imagePaths)

      session.flash('success', `${results.length} images ont été indexées avec succès`)
      session.flash('results', results)
    } catch (error) {
      session.flash('error', `Erreur lors de l'indexation: ${error.message}`)
    }

    if (request.header('X-Up-Version')) {
      return view.render('components/partials/index-maker')
    }
    return view.render('pages/index-maker')
  }
}
