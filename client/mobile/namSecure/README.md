# Help Type - React Native avec TypeScript


// Database
// lancer le docker avec la DB




// mobile

// ios 26 est grandement recommandé
// ios 26.2 serait l'idéal
// mais ca fonctionne avec iso 26 et 26.1

npm i

npx expo run:ios


j'ai pas rencontré de problème particulier
il faut aussi mettre la commande pour compiler le /shared et le link

// reminder pour toi

cd /shared
npm i
npx tsc
npm link

cd ../client/mobile/namSecure
npm link '@namsecure/shared'

si tu peux essayer de ton coté de delete tout les packages (ceux en orange dans l'editeur) et de tout recompiler pour voir si ça marche de ton coté



// Met un message comme quoi le lien dans le mail pour le reset password ne fonctionne que avec le backoffice d'allumé