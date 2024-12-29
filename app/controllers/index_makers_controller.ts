import type { HttpContext } from '@adonisjs/core/http'

export default class IndexMakersController {
  public async show({ request, response, view }: HttpContext) {
    if (request.header('X-Up-Version')) {
      return view.render('components/partials/index-maker')
    }
    return view.render('pages/index-maker')
  }
}
