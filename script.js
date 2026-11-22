/* =========================================================
   1. MENU BURGER : ouvrir / fermer le menu
   ========================================================= */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const liensMenu = document.querySelectorAll(".nav a");

// Au clic sur le burger : on ajoute ou on retire la classe "ouvert"
burger.addEventListener("click", function () {
  nav.classList.toggle("ouvert");
  burger.classList.toggle("ouvert");
});

// Quand on clique sur un lien du menu, le menu se referme
liensMenu.forEach(function (lien) {
  lien.addEventListener("click", function () {
    nav.classList.remove("ouvert");
    burger.classList.remove("ouvert");
  });
});

// Quand on clique ailleurs sur la page, le menu se referme aussi
document.addEventListener("click", function (evenement) {
  const clicDansLeMenu = nav.contains(evenement.target);
  const clicSurLeBurger = burger.contains(evenement.target);
  if (!clicDansLeMenu && !clicSurLeBurger) {
    nav.classList.remove("ouvert");
    burger.classList.remove("ouvert");
  }
});

/* =========================================================
   2. LIEN ACTIF : le lien de la section visible devient rose
   ========================================================= */
const sections = document.querySelectorAll("section[id]");

function mettreAJourLienActif() {
  let sectionActuelle = "accueil";

  // On cherche la dernière section dont le haut est passé sous le header
  sections.forEach(function (section) {
    const hautDeLaSection = section.offsetTop - 150;
    if (window.scrollY >= hautDeLaSection) {
      sectionActuelle = section.id;
    }
  });

  // On met la classe "active" sur le bon lien, et on l'enlève des autres
  liensMenu.forEach(function (lien) {
    if (lien.getAttribute("href") === "#" + sectionActuelle) {
      lien.classList.add("active");
    } else {
      lien.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", mettreAJourLienActif);
mettreAJourLienActif(); // une première fois au chargement

/* =========================================================
   3. FORMULAIRE DE CONTACT : envoi réel du message
   Le site n'a pas de serveur : on utilise FormSubmit (service gratuit)
   qui reçoit le message et me le transfère par e-mail.
   ========================================================= */
const formulaire = document.getElementById("formulaire");
const confirmation = document.getElementById("confirmation");
const boutonEnvoyer = formulaire.querySelector("button");

formulaire.addEventListener("submit", function (evenement) {
  evenement.preventDefault(); // on reste sur la page pendant l'envoi

  const nom = document.getElementById("nom").value.trim();

  // Les données à envoyer
  const donnees = {
    nom: nom,
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
    _subject: "Nouveau message depuis ton portfolio - " + nom,
    _template: "table" // e-mail reçu sous forme de tableau lisible
  };

  // Pendant l'envoi, le bouton est désactivé
  boutonEnvoyer.disabled = true;
  boutonEnvoyer.textContent = "Envoi en cours...";
  confirmation.style.color = "";
  confirmation.textContent = "";

  // fetch envoie les données à FormSubmit sans recharger la page
  fetch("https://formsubmit.co/ajax/konefatim.meraj@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(donnees)
  })
    .then(function (reponse) {
      if (!reponse.ok) {
        throw new Error("Erreur d'envoi");
      }
      confirmation.textContent = "Merci " + nom + " ! Ton message a bien été envoyé 💌";
      formulaire.reset(); // vide les champs
    })
    .catch(function () {
      confirmation.style.color = "#D64545";
      confirmation.textContent = "Oups, le message n'a pas pu partir. Écris-moi directement à konefatim.meraj@gmail.com";
    })
    .finally(function () {
      boutonEnvoyer.disabled = false;
      boutonEnvoyer.textContent = "Envoyer";
    });
});

/* =========================================================
   4. ANIMATIONS : les éléments apparaissent un par un
   quand on fait défiler la page
   ========================================================= */
document.body.classList.add("animations");

// Groupes d'éléments à animer : [sélecteur, direction]
// Dans un même groupe, les éléments arrivent l'un après l'autre.
const groupesAnimes = [
  [".hero-texte > *", ""],
  [".hero .photo", "depuis-droite"],
  [".apropos-texte > *", "depuis-gauche"],
  [".photo-apropos", "depuis-droite"],
  ["#outils .titre-section, #outils .note", ""],
  [".groupe-outils", ""],
  ["#projets .titre-section, #projets .note", ""],
  [".carte", ""],
  ["#cv > *", "depuis-gauche"],
  ["#contact > *", "depuis-droite"],
  [".footer > *", ""]
];

groupesAnimes.forEach(function (groupe) {
  const elements = document.querySelectorAll(groupe[0]);
  elements.forEach(function (element, numero) {
    element.classList.add("apparition");
    if (groupe[1]) {
      element.classList.add(groupe[1]);
    }
    // chaque élément attend un peu plus que le précédent (0,15 s de plus)
    element.style.setProperty("--delai", (numero * 0.15) + "s");
  });
});

// L'observateur surveille les éléments et les rend visibles
// dès qu'ils entrent à l'écran
const observateur = new IntersectionObserver(function (entrees) {
  entrees.forEach(function (entree) {
    if (entree.isIntersecting) {
      entree.target.classList.add("visible");
      observateur.unobserve(entree.target); // l'animation ne se joue qu'une fois
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".apparition").forEach(function (element) {
  observateur.observe(element);
});
