import type { HttpContext } from '@adonisjs/core/http'
import PdfConverterService from '#services/pdf_converter_service'
import { Application } from '@adonisjs/core/app'

export default class PdfConverterController {
  public async show({ request, view }: HttpContext) {
    if (request.header('X-Up-Version')) {
      return view.render('components/partials/pdf-converter')
    }
    return view.render('pages/pdf-converter')
  }

  public async convert({ request, response }: HttpContext) {
    try {
      const pdfFile = request.file('pdf', {
        size: '10mb',
        extnames: ['pdf'],
      })

      if (!pdfFile) {
        return response.badRequest('Aucun fichier PDF fourni')
      }

      // Déplace le fichier vers un dossier temporaire
      await pdfFile.move('./tmp/uploads', {
        name: `${new Date().getTime()}.pdf`,
      })

      const results = await PdfConverterService.convertToImage(pdfFile.filePath!, {
        savePath: './tmp/converted',
      })

      return response.json({
        status: 'success',
        data: results,
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erreur lors de la conversion',
        error: error.message,
      })
    }
  }
}
