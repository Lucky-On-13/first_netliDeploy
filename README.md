# Zero Trolls - Système de Filtrage de Commentaires

## Description
**Zero Trolls** est une application web qui filtre automatiquement les commentaires toxiques. Elle utilise l'API Perspective de Google pour analyser la toxicité d'un texte soumis par un utilisateur. Si un commentaire contient des mots offensants, ceux-ci sont modifiés en remplaçant leurs voyelles par des espaces. L'objectif est de sensibiliser les utilisateurs tout en préservant la lisibilité du texte.

## Fonctionnalités
- Analyse de la toxicité des commentaires en temps réel.
- Filtrage automatique des mots offensants.
- Remplacement des voyelles des mots offensants par des espaces.
- Affichage du nombre de mots inappropriés détectés.
- Enregistrement de l'heure et de la date du commentaire soumis.

## Technologies Utilisées
- **HTML/CSS/JavaScript** pour l'interface utilisateur.
- **API Perspective** de Google pour détecter la toxicité.

## Installation et Exécution
1. Clonez le référentiel :
   ```sh
   git clone https://github.com/votre-repo/zero-trolls.git
   ```
2. Ouvrez le fichier `index.html` dans un navigateur.
3. Entrez un commentaire dans le champ de texte et cliquez sur "Envoyer".

## Utilisation
1. **Saisie du commentaire** : L'utilisateur tape un commentaire dans le champ prévu.
2. **Analyse** : Le commentaire est envoyé à l'API Perspective pour déterminer son degré de toxicité.
3. **Filtrage** :
   - Si des mots offensants sont détectés (score de toxicité >= 0.75), leurs voyelles sont remplacées par des espaces.
   - Le nombre de mots offensants est affiché.
4. **Affichage du résultat** : Le commentaire filtré ainsi que la date et l'heure d'envoi sont affichés.

## Code Principal
### Analyse et Filtrage des Commentaires
```javascript
async function analyzeComment(comment) {
    const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;
    
    const body = {
        comment: { text: comment },
        languages: ["en"],
        requestedAttributes: { TOXICITY: {} }
    };
    
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return data.attributeScores.TOXICITY.summaryScore.value;
}

function ReplaceVowels(text) {
    return text.replace(/[aeiouAEIOU]/g, ' ');
}

async function filterComment(comment) {
    let words = comment.replace(/[^\w\s]/g, '').split(" ");
    let counter = 0;
    let containsOffensiveWord = false;

    for (let word of words) {
        const score = await analyzeComment(word);
        if (score >= 0.75) {
            counter++;
            containsOffensiveWord = true;
        }
    }
    let filteredComment = containsOffensiveWord 
        ? comment.split(" ").map(ReplaceVowels).join(" ") 
        : comment;

    return { filteredComment, counter };
}
```

## Améliorations Possibles
- Ajouter un support pour plusieurs langues.
- Implémenter un système de score de toxicité pour afficher différents niveaux d'alerte.
- Ajouter une base de données pour stocker les commentaires filtrés.

## Auteur
**Luc Victoire Ngami** - [LinkedIn](www.linkedin.com/in/victoire-luc-ngami-460a27282)

![Capture d'écran de l'application](./assets/images/Screenshot%20(628).png)
