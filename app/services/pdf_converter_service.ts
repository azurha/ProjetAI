import { fromPath } from 'pdf2pic'

interface PdfOptions {
  density: number
  saveFilename: string
  savePath: string
  format: string
  width: number
  height: number
}

export default class PdfConverterService {
  private static defaultOptions: PdfOptions = {
    density: 600,
    saveFilename: 'converted',
    savePath: './tmp',
    format: 'png',
    width: 800,
    height: 1200,
  }

  public static async convertToImage(pdfPath: string, options: Partial<PdfOptions> = {}) {
    try {
      const converter = fromPath(pdfPath, {
        ...this.defaultOptions,
        ...options,
      })

      // Convertit toutes les pages
      const results = await converter.bulk(-1)
      return results
    } catch (error) {
      console.error('Erreur lors de la conversion:', error)
      throw error
    }
  }
}
