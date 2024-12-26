import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
    async show({ request, response, view }: HttpContext) {
        return view.render('pages/home')
    }
}
