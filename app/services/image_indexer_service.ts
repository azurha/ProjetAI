import { readFile, writeFile } from 'node:fs/promises'
import http from 'node:http'

interface IndexResult {
  imagePath: string
  description: string
  timestamp: string
  metadata?: {
    model: string
    confidence?: number
  }
}

export default class ImageIndexerService {
  private static readonly OLLAMA_HOST = 'localhost'
  private static readonly OLLAMA_PORT = 11434
  private static readonly MODEL = 'llava'

  private static async generateImageDescription(imagePath: string): Promise<string> {
    console.log(`Lecture de l'image: ${imagePath}`)
    const imageBuffer = await readFile(imagePath)
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    return new Promise((resolve, reject) => {
      const requestData = JSON.stringify({
        model: this.MODEL,
        prompt: `USER: <image>
                Analyse ce document administratif en détail. Décris :
                1. L'en-tête (logo, identité de l'organisme)
                2. Les informations d'identification (références, dates)
                3. Les coordonnées (expéditeur et destinataire)
                4. L'objet et le contenu principal
                5. Les sections importantes
                6. Les éléments visuels particuliers (QR codes, signatures, etc.)
                Sois précis et structuré dans ta description.
                ASSISTANT:`,
        images: [base64Image],
        stream: false,
        temperature: 0.1,
        top_p: 0.1
      })

      const options = {
        hostname: this.OLLAMA_HOST,
        port: this.OLLAMA_PORT,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData)
        }
      }

      let fullResponse = ''

      const req = http.request(options, (res) => {
        res.on('data', chunk => {
          try {
            const response = JSON.parse(chunk.toString())
            if (response.response) {
              fullResponse += response.response
            }
          } catch (error) {
            console.error('Erreur de parsing chunk:', error)
          }
        })

        res.on('end', () => {
          if (fullResponse) {
            resolve(fullResponse.trim())
          } else {
            reject(new Error('Pas de description générée'))
          }
        })
      })

      req.on('error', (error) => {
        console.error('Erreur de requête:', error)
        reject(new Error(`Erreur lors de l'analyse de l'image: ${error.message}`))
      })

      req.write(requestData)
      req.end()
    })
  }

  public static async indexImage(imagePath: string): Promise<IndexResult> {
    console.log(`Début de l'indexation pour: ${imagePath}`)
    const description = await this.generateImageDescription(imagePath)

    const result: IndexResult = {
      imagePath,
      description,
      timestamp: new Date().toISOString(),
      metadata: {
        model: this.MODEL,
      },
    }

    const jsonPath = imagePath.replace(/\.[^/.]+$/, '.json')
    await writeFile(jsonPath, JSON.stringify(result, null, 2))
    console.log(`Indexation terminée pour: ${imagePath}`)

    return result
  }

  public static async batchIndexImages(imagesPaths: string[]): Promise<IndexResult[]> {
    const results: IndexResult[] = []

    for (const imagePath of imagesPaths) {
      try {
        console.log(`Traitement de l'image: ${imagePath}`)
        const result = await this.indexImage(imagePath)
        results.push(result)
      } catch (error) {
        console.error(`Erreur lors de l'indexation de ${imagePath}:`, error)
      }
    }

    return results
  }
}
