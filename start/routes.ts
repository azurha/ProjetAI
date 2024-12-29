/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const HomeController = () => import('#controllers/home_controller')
const PdfConverterController = () => import('#controllers/pdf_convercters_controller')
const IndexMakerController = () => import('#controllers/index_makers_controller')
import router from '@adonisjs/core/services/router'

router.get('/', [HomeController, 'show']).as('home')

router.get('/pdf-converter-show', [PdfConverterController, 'show']).as('pdf-converter-show')
router.post('/pdf-converter', [PdfConverterController, 'convert']).as('pdf-converter')

router.get('/index-maker-show', [IndexMakerController, 'show']).as('index-maker-show')
router.post('/index-maker', [IndexMakerController, 'process']).as('index-maker')