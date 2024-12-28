import type { HttpContext } from '@adonisjs/core/http'
import PdfConverterService from '#services/pdf_converter_service'

export default class PdfConverterController {
  public async show({ request, view }: HttpContext) {
    if (request.header('X-Up-Version')) {
      return view.render('components/partials/pdf-converter')
    }
    return view.render('pages/pdf-converter')
  }

  public async convert({ request, response, session, view }: HttpContext) {
    try {
      const pdfFile = request.file('pdf', {
        size: '10mb',
        extnames: ['pdf'],
      })

      if (!pdfFile) {
        session.flash('error', 'Aucun fichier PDF fourni')
        return response.redirect().back()
      }

      await pdfFile.move('./tmp/uploads', {
        name: `${new Date().getTime()}.pdf`,
      })

      const results = await PdfConverterService.convertToImage(pdfFile.filePath!, {
        savePath: './tmp/converted',
      })

      session.flash('success', 'Conversion réussie')
      session.flash('results', results)
      if (request.header('X-Up-Version')) {
        return view.render('components/partials/pdf-converter')
      }
      return view.render('pages/pdf-converter')
    } catch (error) {
      session.flash('error', 'Erreur lors de la conversion: ' + error.message)
      if (request.header('X-Up-Version')) {
        return view.render('components/partials/pdf-converter')
      }
      return view.render('pages/pdf-converter')
    }
  }
}
