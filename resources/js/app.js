import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import 'unpoly'
import 'unpoly/unpoly.css'

console.log('Unpoly version:', up.version)  // Vérifie si Unpoly est chargé
console.log('Unpoly ready:', !!up)  // Vérifie si l'objet up existe

up.on('up:link:follow', function(event) {  // Log chaque clic sur un lien Unpoly
  console.log('Following link:', event)
})

// Initialiser Unpoly après la configuration
up.boot()
