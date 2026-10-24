/* =============================================================================
   HUIZE SHOP – app.js
   « Ton style, ta signature. »

   Ce fichier rend le site interactif : menu mobile, recherche et filtres,
   panier (sauvegardé dans le navigateur), compteur, liens WhatsApp, et la
   logique prête pour les futures pages boutique, produit, panier et contact.

   Il est chargé avec <script src="app.js" defer></script> : le HTML est donc
   déjà lu quand ce code démarre.

   IMPORTANT :
   - Ce site n'a pas de serveur : aucun paiement réel n'est possible ici et
     aucune commande n'est enregistrée. La commande passe par WhatsApp.
   - Les 8 produits ci-dessous sont des produits de DÉMONSTRATION, identiques
     à ceux de index.html. À remplacer par les vrais produits.
   ============================================================================= */

(function () {
  "use strict";

  /* ===========================================================================
     1. RÉGLAGES (à modifier ici si besoin)
     =========================================================================== */
  const CONFIG = {
    // Numéro WhatsApp au format international, chiffres uniquement (sans "+").
    WHATSAPP_NUMBER: "22653742748",
    // Nom sous lequel le panier est enregistré dans le navigateur.
    STORAGE_KEY: "huizeShop.panier.v1",
    // Stock exact inconnu : on limite chaque article à cette quantité.
    MAX_QUANTITE_PAR_ARTICLE: 10,
    // Durée d'affichage des messages (en millisecondes).
    DUREE_MESSAGE_MS: 4000,
    // Délai pendant lequel un 2e clic rapide sur le même bouton est ignoré.
    DELAI_ANTI_DOUBLE_CLIC_MS: 400,
    // Message par défaut des liens WhatsApp généraux.
    MESSAGE_ACCUEIL: "Bonjour HUIZE SHOP, je voudrais passer commande."
  };

  /* ===========================================================================
     2. CATALOGUE DES PRODUITS (DONNÉES DE DÉMONSTRATION)
     Ces données sont la référence fiable pour les prix du panier.
     Si tu changes un prix dans index.html, change-le aussi ici.
     =========================================================================== */
  const DESCRIPTION_A_COMPLETER = "Description à compléter. Produit de démonstration.";

  const PRODUITS = [
    {
      id: "p001", nom: " Adidas Campus rose", categorie: "chaussures",
      prix: 15000, ancienPrix: null, description: " Des baskets roses qui ne passent pas inapercues. Dessus d'aspect daim,trois bandes blanches, gros lacets et semelle épaisse pour un look streetwear tendance. A porter au quotidien avec un jean, une jupe ou un ensemble décontracté. Stock limité.",
      images: [{ src: "images/chaussures/campus rose1.webp", alt: "Baskets rose" }],
      quantiteDisponible: null, disponibilite: "limited", nouveau: true,
      typeTaille: "Pointure", tailles: ["36", "37", "38", "39", "40", "41"], demo: true
    },
    {
      id: "p002", nom: "New balance 2000", categorie: "chaussures",
      prix: 18000, ancienPrix: null, description: "Affirmez votre style avec cette paire de New Balance ABZORB 2000 au coloris noir et argenté ultra-efficace. Directement inspiré du design running des années 2000, ce modèle mixe mesh respirant et empiècements géométriques pour un visuel fort et moderne.",
      images: [{ src: "images/chaussures/NB1.webp", alt: "New Balance ABZORB 2000 au coloris noir et argenté" }],
      quantiteDisponible: null, disponibilite: "in-stock", nouveau: false,
      typeTaille: "Pointure", tailles: ["40", "41", "42", "43", "44", "45"], demo: true
    },
    {
      id: "p003", nom: "Louis Vuitton Runner Tactic", categorie: "chaussures",
      prix: 18000, ancienPrix: null, description: "Paire de sneakers inspirée du modèle Runner Tatic de chez Louis Vuitton, arborant son look running rétro typique des années 90. La chaussure associe une base en maille respirante grise à des empiècements géométriques vert fluo, avec le logo initiales signature sur les côtés.",
      images: [{ src: "images/chaussures/LV.webp", alt: "Baskets de sport couleur gris vert" }],
      quantiteDisponible: null, disponibilite: "limited", nouveau: true,
      typeTaille: "Pointure", tailles: ["38", "39", "40", "41", "42", "43", "44", "45", "46"], demo: true
    },
    {
      id: "p004", nom: "Air Jordan 4", categorie: "chaussures",
      prix: 15000, ancienPrix: null, description: "Affirme ton style avec l’Air Jordan 4 ! Un design tendance, une allure élégante et un look qui ne passe pas inaperçu. Parfaite pour compléter tes tenues avec une touche de fraîcheur et d’originalité.",
      images: [{ src: "images/chaussures/JORDAN 1.webp", alt: "Air Jordan 4" }],
      quantiteDisponible: null, disponibilite: "in-stock", nouveau: false,
      typeTaille: "Pointure", tailles: ["38", "39", "40", "41", "42", "43", "44", "45", "46"], demo: true
    },
    {
      id: "p005", nom: "Baskets Chunky Streetwear", categorie: "chaussures",
      prix: 14000, ancienPrix: null, description: "Affirmez votre style avec ces baskets maximalistes au design rétro-futuriste. Conçues pour les amateurs de streetwear audacieux, elles se démarquent par leur silhouette surdimensionnée et leurs détails uniques.Le modèle parfait pour rehausser instantanément vos tenues urbaines et décontractées.",
      images: [{ src: "images/chaussures/BCS.webp", alt: "Baskets Chunky Streetwear" }],
      quantiteDisponible: null, disponibilite: "in-stock", nouveau: true,
      typeTaille: "Pointure", tailles: ["41", "42", "43", "44", "45", "46"], demo: true
    },
    {
      id: "p006", nom: "Sneakers Chunky OGIY™", categorie: "chaussures",
      prix: 14000, ancienPrix: null, description: "Affirmez votre style urbain avec la référence absolue du streetwear.Conçues pour ceux qui ne veulent pas choisir entre confort et esthétique, les baskets épaisses OGIY™ réinventent les codes de la mode urbaine. Avec leur silhouette chunky ultra-tendance, leur design monochrome noir intégral et leurs lacets XXL emblématiques, elles apportent une touche d'audace immédiate à toutes vos tenues.",
      images: [{ src: "images/chaussures/ogiy.webp", alt: "Sneakers Chunky OGIY™" }],
      quantiteDisponible: null, disponibilite: "in-stock", nouveau: true,
      typeTaille: "Pointure", tailles: ["41", "42", "43", "44", "45", "46"], demo: true
    },
    {
      id: "p007", nom: "Sneakers Urban Bleu", categorie: "chaussures",
      prix: 14000, ancienPrix: null, description: "Apportez une touche de fraîcheur à vos tenues avec les Sneakers Urban Blue & White. Leur association de bleu et de blanc crée un style urbain facile à porter au quotidien.",
      images: [{ src: "images/chaussures/Sneaker urbaine.webp", alt: "Sneakers Urban Blue & White" }],
      quantiteDisponible: null, disponibilite: "in-stock", nouveau: false,
      typeTaille: "Pointure", tailles: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], demo: true
    },
    {
      id: "p008", nom: "Sneakers Chunky Air Blanc", categorie: "chaussures",
      prix: 14000, ancienPrix: null, description: "Affirmez votre style avec ces sneakers blanches au design chunky. Le mesh texturé, les empiècements superposés et la semelle sculptée aux inserts transparents leur donnent une allure urbaine audacieuse, facile à associer au quotidien.",
      images: [{ src: "images/chaussures/sneakers-chunky-air-blanc.webp", alt: "Sneakers chunky blanches à semelle sculptée" }],
      quantiteDisponible: null, disponibilite: "in-stock", nouveau: true,
      typeTaille: "Pointure", tailles: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], demo: true
    },
    {
      id: "p009", nom: "Y-3", categorie: "sandales",
      prix: 15000, ancienPrix: null, description: DESCRIPTION_A_COMPLETER,
      images: [{ src: "images/sandales/Y-3.webp", alt: "chaussure pour homme mature " }],
      quantiteDisponible: null, disponibilite: "in-stock", nouveau: true,
      typeTaille: "Taille", tailles: ["40", "41", "42", "43"], demo: true
    },
    {
      id: "p010", nom: "Y-3", categorie: "sandales",
      prix: 15000, ancienPrix: null, description: DESCRIPTION_A_COMPLETER,
      images: [{ src: "images/sandales/Y-3.webp", alt: "chaussure pour homme mature " }],
      quantiteDisponible: , disponibilite: "", nouveau: true,
      typeTaille: "Taille", tailles: ["40", "41", "42", "43"], demo: true
    } 
  ];

  const CATEGORIES = {
    chaussures: "Baskets",
    sandales: "Sandales",
    vetements: "Vêtements"
  };

  const LIBELLES_DISPONIBILITE = {
    "in-stock": "En stock",
    "limited": "Stock limité",
    "out-of-stock": "Rupture de stock"
  };

  // Map = recherche par identifiant sûre (pas de risque avec des identifiants
  // bizarres venant de l'URL ou du navigateur).
  const produitsParId = new Map(PRODUITS.map(function (p) { return [p.id, p]; }));

  /* ===========================================================================
     3. OUTILS GÉNÉRAUX
     =========================================================================== */
  function $(selecteur, racine) {
    return (racine || document).querySelector(selecteur);
  }

  function $$(selecteur, racine) {
    return Array.from((racine || document).querySelectorAll(selecteur));
  }

  // Crée un élément HTML sans jamais utiliser innerHTML (textContent = sûr).
  function creer(balise, options, enfants) {
    const element = document.createElement(balise);
    const opts = options || {};
    if (opts.className) element.className = opts.className;
    if (opts.text !== undefined) element.textContent = opts.text;
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (nom) {
        element.setAttribute(nom, opts.attrs[nom]);
      });
    }
    (enfants || []).forEach(function (enfant) {
      if (enfant) element.appendChild(enfant);
    });
    return element;
  }

  // 12500 -> "12 500 F CFA" (espaces insécables : le prix ne se coupe pas).
  function formaterPrix(montant) {
    const entier = Math.round(Number(montant));
    if (!Number.isFinite(entier)) return "";
    return String(entier).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0") + "\u00A0F\u00A0CFA";
  }

  // Minuscules + sans accents, pour que "vetement" trouve "Vêtement".
  function normaliserTexte(texte) {
    return String(texte).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }

  function pluriel(nombre, singulier, plurielTexte) {
    return nombre + " " + (nombre > 1 ? plurielTexte : singulier);
  }

  /* ===========================================================================
     4. MESSAGES (confirmations et erreurs)
     Une petite zone fixe en bas de l'écran, créée par ce script. Elle est
     annoncée par les lecteurs d'écran (role="status").
     =========================================================================== */
  let zoneMessage = null;
  let minuteurMessage = null;

  function creerZoneMessage() {
    if (zoneMessage) return;
    zoneMessage = creer("div", {
      attrs: { id: "huize-message", role: "status", "aria-live": "polite", "aria-atomic": "true" }
    });
    Object.assign(zoneMessage.style, {
      position: "fixed",
      left: "50%",
      bottom: "1rem",
      transform: "translateX(-50%)",
      zIndex: "1000",
      maxWidth: "min(92vw, 32rem)",
      padding: "0.75rem 1.25rem",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-md)",
      fontSize: "0.95rem",
      fontWeight: "600",
      textAlign: "center",
      display: "none"
    });
    document.body.appendChild(zoneMessage);
  }

  // type : "success", "info" ou "error"
  function afficherMessage(texte, type) {
    creerZoneMessage();
    const estErreur = type === "error";
    zoneMessage.setAttribute("aria-live", estErreur ? "assertive" : "polite");
    zoneMessage.style.background = estErreur ? "var(--color-danger)" : "var(--color-green-deep)";
    zoneMessage.style.color = "var(--color-white)";
    zoneMessage.style.display = "block";
    zoneMessage.textContent = "";
    // Petit délai : les lecteurs d'écran annoncent mieux un texte qui apparaît.
    window.setTimeout(function () { zoneMessage.textContent = texte; }, 50);

    window.clearTimeout(minuteurMessage);
    minuteurMessage = window.setTimeout(function () {
      zoneMessage.style.display = "none";
      zoneMessage.textContent = "";
    }, CONFIG.DUREE_MESSAGE_MS);
  }

  /* ===========================================================================
     5. WHATSAPP
     =========================================================================== */
  function numeroWhatsAppValide() {
    return /^\d{8,15}$/.test(CONFIG.WHATSAPP_NUMBER);
  }

  function lienWhatsApp(message) {
    const base = "https://wa.me/" + CONFIG.WHATSAPP_NUMBER;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  // "22653742748" -> "+226 53 74 27 48"
  function numeroWhatsAppAffiche() {
    const numero = CONFIG.WHATSAPP_NUMBER;
    if (numero.indexOf("226") === 0 && numero.length === 11) {
      return "+226 " + numero.slice(3).match(/.{1,2}/g).join(" ");
    }
    return "+" + numero;
  }

  function ouvrirWhatsApp(message) {
    if (!numeroWhatsAppValide()) {
      afficherMessage("Le numéro WhatsApp de la boutique n'est pas encore configuré.", "error");
      return false;
    }
    window.open(lienWhatsApp(message), "_blank", "noopener");
    return true;
  }

  function initialiserWhatsApp() {
    // Si le numéro n'est pas valide, on laisse les emplacements « à configurer ».
    if (!numeroWhatsAppValide()) return;
    $$("[data-whatsapp-link]").forEach(function (lien) {
      lien.href = lienWhatsApp(CONFIG.MESSAGE_ACCUEIL);
      lien.target = "_blank";
      lien.rel = "noopener";
    });
    $$("[data-whatsapp-number]").forEach(function (zone) {
      zone.textContent = numeroWhatsAppAffiche();
    });
  }

  /* ===========================================================================
     6. PANIER
     Le navigateur ne garde que : identifiant, taille et quantité.
     Les prix et les noms sont TOUJOURS relus dans le catalogue ci-dessus.
     =========================================================================== */
  let panier = []; // liste de { id, taille, quantite }
  let avertiStockage = false;

  function cleLigne(id, taille) {
    return id + "|" + taille;
  }

  // Vérifie une ligne venant du navigateur. Renvoie une ligne propre ou null.
  function validerLigne(brut) {
    if (!brut || typeof brut !== "object") return null;
    const produit = produitsParId.get(brut.id);
    if (!produit) return null;

    const taille = typeof brut.taille === "string" ? brut.taille : "";
    const tailleOk = produit.tailles.length > 0
      ? produit.tailles.indexOf(taille) !== -1
      : taille === "";
    if (!tailleOk) return null;

    const quantite = Number(brut.quantite);
    if (!Number.isInteger(quantite) || quantite < 1) return null;

    return {
      id: produit.id,
      taille: taille,
      quantite: Math.min(quantite, CONFIG.MAX_QUANTITE_PAR_ARTICLE)
    };
  }

  // Nettoie toute la liste : enlève les lignes invalides et fusionne les doublons.
  function nettoyerPanier(donnees) {
    if (!Array.isArray(donnees)) return [];
    const fusion = new Map();
    donnees.forEach(function (brut) {
      const ligne = validerLigne(brut);
      if (!ligne) return;
      if (produitsParId.get(ligne.id).disponibilite === "out-of-stock") return;
      const cle = cleLigne(ligne.id, ligne.taille);
      const existante = fusion.get(cle);
      if (existante) {
        existante.quantite = Math.min(existante.quantite + ligne.quantite, CONFIG.MAX_QUANTITE_PAR_ARTICLE);
      } else {
        fusion.set(cle, ligne);
      }
    });
    return Array.from(fusion.values());
  }

  function chargerPanier() {
    try {
      const texte = window.localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!texte) return [];
      return nettoyerPanier(JSON.parse(texte));
    } catch (erreur) {
      // Données corrompues ou stockage bloqué : on repart d'un panier vide.
      console.warn("[HUIZE SHOP] Panier illisible, il a été réinitialisé.", erreur);
      try { window.localStorage.removeItem(CONFIG.STORAGE_KEY); } catch (e) { /* rien à faire */ }
      return [];
    }
  }

  function sauvegarderPanier() {
    try {
      window.localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(panier));
    } catch (erreur) {
      if (!avertiStockage) {
        avertiStockage = true;
        afficherMessage(
          "Ton navigateur ne permet pas d'enregistrer le panier. Il restera disponible tant que tu ne fermes pas cette page.",
          "error"
        );
      }
    }
  }

  function nombreArticles() {
    return panier.reduce(function (somme, ligne) { return somme + ligne.quantite; }, 0);
  }

  // Lignes enrichies avec les données FIABLES du catalogue.
  function detailsPanier() {
    return panier.map(function (ligne) {
      const produit = produitsParId.get(ligne.id);
      return {
        cle: cleLigne(ligne.id, ligne.taille),
        produit: produit,
        taille: ligne.taille,
        quantite: ligne.quantite,
        total: produit.prix * ligne.quantite
      };
    });
  }

  function sousTotal() {
    return detailsPanier().reduce(function (somme, ligne) { return somme + ligne.total; }, 0);
  }

  function mettreAJourCompteur() {
    const nombre = nombreArticles();
    const texte = nombre > 99 ? "99+" : String(nombre);
    $$("#cart-count, [data-cart-count]").forEach(function (zone) {
      zone.textContent = texte;
    });
  }

  // À appeler après chaque changement du panier.
  function panierModifie() {
    sauvegarderPanier();
    mettreAJourCompteur();
    document.dispatchEvent(new CustomEvent("huize:panier-modifie"));
  }

  function ajouterAuPanier(idProduit, taille, quantite) {
    const produit = produitsParId.get(idProduit);
    if (!produit) {
      return { ok: false, message: "Ce produit n'est pas encore disponible à la commande." };
    }
    if (produit.disponibilite === "out-of-stock") {
      return { ok: false, message: "Ce produit est en rupture de stock." };
    }
    if (!Number.isInteger(quantite) || quantite < 1 || quantite > CONFIG.MAX_QUANTITE_PAR_ARTICLE) {
      return { ok: false, message: "Quantité invalide : choisis un nombre entier entre 1 et " + CONFIG.MAX_QUANTITE_PAR_ARTICLE + "." };
    }
    const ligneValide = validerLigne({ id: idProduit, taille: taille, quantite: quantite });
    if (!ligneValide) {
      return { ok: false, message: "Choisis une " + produit.typeTaille.toLowerCase() + " valide." };
    }

    const cle = cleLigne(ligneValide.id, ligneValide.taille);
    const existante = panier.find(function (ligne) { return cleLigne(ligne.id, ligne.taille) === cle; });
    const dejaDansPanier = existante ? existante.quantite : 0;
    if (dejaDansPanier + quantite > CONFIG.MAX_QUANTITE_PAR_ARTICLE) {
      return { ok: false, message: "Maximum " + CONFIG.MAX_QUANTITE_PAR_ARTICLE + " exemplaires par article." };
    }

    if (existante) {
      existante.quantite += quantite;
    } else {
      panier.push(ligneValide);
    }
    panierModifie();
    return { ok: true, message: "« " + produit.nom + " » a été ajouté au panier." };
  }

  function modifierQuantite(cle, variation) {
    const ligne = panier.find(function (l) { return cleLigne(l.id, l.taille) === cle; });
    if (!ligne) return;
    const nouvelle = ligne.quantite + variation;
    if (nouvelle < 1) return;
    if (nouvelle > CONFIG.MAX_QUANTITE_PAR_ARTICLE) {
      afficherMessage("Maximum " + CONFIG.MAX_QUANTITE_PAR_ARTICLE + " exemplaires par article.", "error");
      return;
    }
    ligne.quantite = nouvelle;
    panierModifie();
  }

  function supprimerLigne(cle) {
    const avant = panier.length;
    panier = panier.filter(function (l) { return cleLigne(l.id, l.taille) !== cle; });
    if (panier.length !== avant) {
      panierModifie();
      afficherMessage("Article supprimé du panier.", "info");
    }
  }

  function viderPanier() {
    panier = [];
    panierModifie();
    afficherMessage("Le panier a été vidé.", "info");
  }

  // Texte du message WhatsApp de commande (noms et prix lus dans le catalogue).
  function construireMessageCommande() {
    const lignes = ["Bonjour HUIZE SHOP, je souhaite commander :", ""];
    detailsPanier().forEach(function (d) {
      const taille = d.taille ? " – " + d.produit.typeTaille.toLowerCase() + " " + d.taille : "";
      lignes.push("• " + d.quantite + " × " + d.produit.nom + taille +
        " (" + formaterPrix(d.produit.prix) + " l'unité)");
    });
    lignes.push("", "Total estimé : " + formaterPrix(sousTotal()) + " (livraison non comprise)");
    lignes.push("", "Merci de me confirmer la disponibilité, le prix final et la livraison.");
    return lignes.join("\n");
  }

  /* ===========================================================================
     7. MENU MOBILE
     responsive.css attend : la classe "js-menu" sur <html>, la classe
     "is-open" sur #main-nav et aria-expanded sur #menu-toggle.
     =========================================================================== */
  function initialiserMenu() {
    const bouton = $("#menu-toggle");
    const menu = $("#main-nav");
    if (!bouton || !menu) return; // pas de menu sur cette page : on ne fait rien

    document.documentElement.classList.add("js-menu");

    function estOuvert() {
      return bouton.getAttribute("aria-expanded") === "true";
    }

    function definirOuvert(ouvert) {
      menu.classList.toggle("is-open", ouvert);
      bouton.setAttribute("aria-expanded", String(ouvert));
    }

    bouton.addEventListener("click", function () {
      definirOuvert(!estOuvert());
    });

    // Fermer après un clic sur un lien du menu.
    menu.addEventListener("click", function (evenement) {
      if (evenement.target instanceof Element && evenement.target.closest("a")) {
        definirOuvert(false);
      }
    });

    // Fermer avec Échap (et remettre le focus sur le bouton si on était dans le menu).
    document.addEventListener("keydown", function (evenement) {
      if (evenement.key !== "Escape" || !estOuvert()) return;
      const focusDansMenu = menu.contains(document.activeElement);
      definirOuvert(false);
      if (focusDansMenu) bouton.focus();
    });

    // Fermer en cliquant ailleurs sur la page.
    document.addEventListener("click", function (evenement) {
      if (!estOuvert() || !(evenement.target instanceof Node)) return;
      if (!menu.contains(evenement.target) && !bouton.contains(evenement.target)) {
        definirOuvert(false);
      }
    });

    // Si l'écran devient large, le menu repart fermé.
    if (window.matchMedia) {
      const grandEcran = window.matchMedia("(min-width: 1101px)");
      const surChangement = function (e) { if (e.matches) definirOuvert(false); };
      if (grandEcran.addEventListener) grandEcran.addEventListener("change", surChangement);
    }
  }

  /* ===========================================================================
     8. AFFICHAGE DES PRODUITS (cartes et page produit)
     =========================================================================== */
  function creerBlocPrix(produit) {
    const bloc = creer("p", { className: "product-card__price" });
    if (produit.ancienPrix) {
      bloc.appendChild(creer("span", { className: "price price--old" },
        [creer("del", { text: formaterPrix(produit.ancienPrix) })]));
      bloc.appendChild(creer("span", { className: "price price--promo", text: formaterPrix(produit.prix) }));
    } else {
      bloc.appendChild(creer("span", { className: "price price--current", text: formaterPrix(produit.prix) }));
    }
    return bloc;
  }

  function creerBlocDisponibilite(produit, classeBase) {
    return creer("p", {
      className: classeBase + " availability availability--" + produit.disponibilite,
      text: LIBELLES_DISPONIBILITE[produit.disponibilite] || ""
    });
  }

  function creerListeTailles(produit, idChamp) {
    const select = creer("select", {
      className: "field__select",
      attrs: { id: idChamp, name: idChamp, "data-size-select": "" }
    });
    select.appendChild(creer("option", { text: "Choisir", attrs: { value: "" } }));
    produit.tailles.forEach(function (t) {
      select.appendChild(creer("option", { text: t, attrs: { value: t } }));
    });
    return select;
  }

  // Carte produit identique à celles de index.html (mêmes classes CSS).
  function creerCarteProduit(produit) {
    const carte = creer("article", {
      className: "product-card",
      attrs: {
        id: "product-card-" + produit.id,
        "data-product-id": produit.id,
        "data-category": produit.categorie,
        "data-price": String(produit.prix),
        "data-new": String(produit.nouveau)
      }
    });

    const image = produit.images[0];
    carte.appendChild(creer("img", {
      className: "product-card__image",
      attrs: { src: image.src, alt: image.alt, width: "400", height: "400", loading: "lazy" }
    }));

    const corps = creer("div", { className: "product-card__body" });
    corps.appendChild(creer("p", { className: "product-card__category", text: CATEGORIES[produit.categorie] || "" }));
    corps.appendChild(creer("h3", { className: "product-card__name", text: produit.nom }));
    corps.appendChild(creerBlocPrix(produit));
    corps.appendChild(creerBlocDisponibilite(produit, "product-card__availability"));

    if (produit.tailles.length > 0) {
      const idChamp = "size-" + produit.id;
      corps.appendChild(creer("div", { className: "product-card__sizes" }, [
        creer("label", { className: "field__label", text: produit.typeTaille, attrs: { for: idChamp } }),
        creerListeTailles(produit, idChamp)
      ]));
    }

    const boutonAjout = creer("button", {
      className: "btn btn--primary add-to-cart",
      text: "Ajouter au panier",
      attrs: { type: "button", "data-product-id": produit.id }
    });
    if (produit.disponibilite === "out-of-stock") boutonAjout.disabled = true;

    corps.appendChild(creer("div", { className: "product-card__actions" }, [
      creer("a", {
        className: "btn btn--outline",
        text: "Voir le produit",
        attrs: { href: "produit.html?id=" + encodeURIComponent(produit.id) }
      }),
      boutonAjout
    ]));

    carte.appendChild(corps);
    return carte;
  }

  // Remplit une grille vide (futur boutique.html) avec tout le catalogue.
  function afficherProduitsDansGrille(grille) {
    grille.setAttribute("aria-busy", "true");
    PRODUITS.forEach(function (produit) {
      grille.appendChild(creerCarteProduit(produit));
    });
    grille.removeAttribute("aria-busy");
  }

  /* ===========================================================================
     9. RECHERCHE, FILTRES ET TRI
     Fonctionne sur index.html (cartes déjà présentes dans le HTML) et sur le
     futur boutique.html (cartes créées par ce script).
     =========================================================================== */
  function initialiserCatalogue() {
    const grille = $("#product-grid");
    if (!grille) return;

    // Grille vide (ex. boutique.html) : on affiche le catalogue.
    // Grille déjà remplie (index.html) : on garde les cartes existantes.
    if (!$(".product-card", grille)) afficherProduitsDansGrille(grille);

    const cartes = $$(".product-card", grille).map(function (carte, index) {
      const id = carte.dataset.productId || "";
      const produit = produitsParId.get(id);
      const zoneNom = $(".product-card__name", carte);
      return {
        carte: carte,
        index: index,
        nom: zoneNom ? zoneNom.textContent : "",
        categorie: carte.dataset.category || "",
        // Prix fiable = catalogue (data-price peut contenir un ancien prix).
        prix: produit ? produit.prix : Number(carte.dataset.price) || 0,
        nouveau: carte.dataset.new === "true",
        promo: Boolean($(".price--promo", carte))
      };
    });

    const champRecherche = $("#product-search");
    const listeTri = $("#product-sort");
    const boutonsFiltre = $$(".filter-button");
    const messageVide = $("#catalogue-empty");

    const etat = { categorie: "all", recherche: "", tri: "default", promotionsSeulement: false };

    function marquerFiltreActif() {
      boutonsFiltre.forEach(function (bouton) {
        const actif = bouton.dataset.filter === etat.categorie;
        bouton.classList.toggle("is-active", actif);
        bouton.setAttribute("aria-pressed", String(actif));
      });
    }

    function appliquer() {
      const terme = normaliserTexte(etat.recherche);

      const visibles = cartes.filter(function (c) {
        const bonneCategorie = etat.categorie === "all" || c.categorie === etat.categorie;
        const bonnePromo = !etat.promotionsSeulement || c.promo;
        const bonneRecherche = terme === "" || normaliserTexte(c.nom).indexOf(terme) !== -1;
        return bonneCategorie && bonnePromo && bonneRecherche;
      });

      visibles.sort(function (a, b) {
        if (etat.tri === "price-asc") return a.prix - b.prix || a.index - b.index;
        if (etat.tri === "price-desc") return b.prix - a.prix || a.index - b.index;
        if (etat.tri === "newest") return Number(b.nouveau) - Number(a.nouveau) || a.index - b.index;
        return a.index - b.index;
      });

      cartes.forEach(function (c) { c.carte.hidden = true; });
      visibles.forEach(function (c) {
        c.carte.hidden = false;
        grille.appendChild(c.carte); // remet les cartes dans le bon ordre
      });

      if (messageVide) messageVide.hidden = visibles.length > 0;
    }

    // Lecture des paramètres de l'URL (liens du menu : ?categorie=..., ?tri=..., ?filtre=...).
    const params = new URLSearchParams(window.location.search);
    const categorieUrl = params.get("categorie");
    if (categorieUrl && Object.prototype.hasOwnProperty.call(CATEGORIES, categorieUrl)) {
      etat.categorie = categorieUrl;
    }
    const triUrl = params.get("tri");
    if (triUrl === "nouveautes") etat.tri = "newest";
    if (triUrl === "price-asc" || triUrl === "price-desc") etat.tri = triUrl;
    if (params.get("filtre") === "promotions") etat.promotionsSeulement = true;

    if (listeTri) listeTri.value = etat.tri;
    marquerFiltreActif();

    // Boutons de catégorie
    boutonsFiltre.forEach(function (bouton) {
      bouton.addEventListener("click", function () {
        etat.categorie = bouton.dataset.filter || "all";
        etat.promotionsSeulement = false;
        marquerFiltreActif();
        appliquer();
      });
    });

    // Recherche (petit délai pour ne pas recalculer à chaque lettre)
    if (champRecherche) {
      let minuteur = null;
      champRecherche.addEventListener("input", function () {
        window.clearTimeout(minuteur);
        minuteur = window.setTimeout(function () {
          etat.recherche = champRecherche.value;
          appliquer();
        }, 150);
      });
      if (window.location.hash === "#recherche-produits") champRecherche.focus();
    }

    // Tri
    if (listeTri) {
      listeTri.addEventListener("change", function () {
        etat.tri = listeTri.value;
        appliquer();
      });
    }

    appliquer();
  }

  /* ===========================================================================
     10. AJOUT AU PANIER (cartes produit et page produit)
     Un seul écouteur sur toute la page : il fonctionne aussi pour les cartes
     créées plus tard par ce script.
     =========================================================================== */
  const boutonsOccupes = new WeakSet();

  function gererAjoutAuPanier(bouton) {
    // Anti double-clic : un clic trop rapide sur le même bouton est ignoré.
    if (boutonsOccupes.has(bouton)) return;
    boutonsOccupes.add(bouton);
    window.setTimeout(function () { boutonsOccupes.delete(bouton); }, CONFIG.DELAI_ANTI_DOUBLE_CLIC_MS);

    const idProduit = bouton.dataset.productId || "";
    const produit = produitsParId.get(idProduit);
    if (!produit) {
      afficherMessage("Ce produit n'est pas encore disponible à la commande.", "error");
      return;
    }

    const conteneur = bouton.closest(".product-card, .product-detail") || bouton.parentElement;

    // Taille ou pointure obligatoire quand le produit en propose
    let taille = "";
    const listeTailles = conteneur ? $("select[data-size-select], .product-card__sizes select", conteneur) : null;
    if (listeTailles) {
      taille = listeTailles.value;
      if (!taille) {
        listeTailles.setAttribute("aria-invalid", "true");
        afficherMessage("Choisis ta " + produit.typeTaille.toLowerCase() + " avant d'ajouter au panier.", "error");
        listeTailles.focus();
        return;
      }
    }

    // Quantité (champ présent sur la page produit, sinon 1)
    const champQuantite = conteneur ? $("input[data-quantity-input]", conteneur) : null;
    const quantite = champQuantite ? Number(champQuantite.value) : 1;

    const resultat = ajouterAuPanier(idProduit, taille, quantite);
    afficherMessage(resultat.message, resultat.ok ? "success" : "error");
    if (!resultat.ok && champQuantite) champQuantite.focus();
  }

  function initialiserAjoutAuPanier() {
    document.addEventListener("click", function (evenement) {
      if (!(evenement.target instanceof Element)) return;
      const bouton = evenement.target.closest(".add-to-cart");
      if (bouton) gererAjoutAuPanier(bouton);
    });

    // Retire le signal d'erreur dès que la personne a choisi une taille.
    document.addEventListener("change", function (evenement) {
      const cible = evenement.target;
      if (cible instanceof Element && cible.matches("select[data-size-select], .product-card__sizes select")) {
        cible.removeAttribute("aria-invalid");
      }
    });
  }

  /* ===========================================================================
     11. PAGE PRODUIT (produit.html?id=p001)
     À utiliser avec un futur produit.html contenant <div id="product-detail">.
     =========================================================================== */
  function initialiserPageProduit() {
    const zone = $("#product-detail");
    if (!zone) return;

    const idDemande = new URLSearchParams(window.location.search).get("id");
    const produit = idDemande ? produitsParId.get(idDemande) : undefined;

    zone.textContent = "";

    if (!produit) {
      zone.appendChild(creer("p", {
        className: "notice notice--info",
        text: "Ce produit n'existe pas ou n'est plus disponible.",
        attrs: { role: "alert" }
      }));
      zone.appendChild(creer("a", {
        className: "btn btn--primary",
        text: "Retour à la boutique",
        attrs: { href: "boutique.html" }
      }));
      document.title = "Produit introuvable – HUIZE SHOP";
      return;
    }

    document.title = produit.nom + " – HUIZE SHOP";
    zone.classList.add("product-detail");

    // Image principale (+ vignettes s'il y a plusieurs images)
    const imagePrincipale = creer("img", {
      className: "product-detail__image",
      attrs: { src: produit.images[0].src, alt: produit.images[0].alt, width: "600", height: "600" }
    });
    const galerie = creer("div", { className: "product-detail__media" }, [imagePrincipale]);

    if (produit.images.length > 1) {
      const vignettes = creer("div", { className: "product-detail__thumbs" });
      produit.images.forEach(function (image, index) {
        const vignette = creer("button", {
          className: "product-detail__thumb",
          attrs: { type: "button", "aria-label": "Voir l'image " + (index + 1) }
        }, [creer("img", { attrs: { src: image.src, alt: "", width: "80", height: "80" } })]);
        vignette.addEventListener("click", function () {
          imagePrincipale.src = image.src;
          imagePrincipale.alt = image.alt;
        });
        vignettes.appendChild(vignette);
      });
      galerie.appendChild(vignettes);
    }

    const infos = creer("div", { className: "product-detail__info" });
    infos.appendChild(creer("p", { className: "product-card__category", text: CATEGORIES[produit.categorie] || "" }));
    infos.appendChild(creer("h1", { className: "product-detail__name", text: produit.nom }));
    infos.appendChild(creerBlocPrix(produit));
    infos.appendChild(creerBlocDisponibilite(produit, "product-detail__availability"));
    infos.appendChild(creer("p", { className: "product-detail__description", text: produit.description }));

    if (produit.quantiteDisponible !== null && produit.quantiteDisponible > 0 && produit.disponibilite === "limited") {
      infos.appendChild(creer("p", {
        className: "product-detail__stock",
        text: "Quantité disponible : " + produit.quantiteDisponible
      }));
    }

    if (produit.tailles.length > 0) {
      const idChamp = "detail-size-" + produit.id;
      infos.appendChild(creer("div", { className: "product-detail__sizes" }, [
        creer("label", { className: "field__label", text: produit.typeTaille, attrs: { for: idChamp } }),
        creerListeTailles(produit, idChamp)
      ]));
    }

    const idQuantite = "detail-quantity-" + produit.id;
    infos.appendChild(creer("div", { className: "product-detail__quantity" }, [
      creer("label", { className: "field__label", text: "Quantité", attrs: { for: idQuantite } }),
      creer("input", {
        className: "field__input",
        attrs: {
          id: idQuantite, type: "number", inputmode: "numeric", value: "1", min: "1",
          max: String(CONFIG.MAX_QUANTITE_PAR_ARTICLE), step: "1", "data-quantity-input": ""
        }
      })
    ]));

    const boutonAjout = creer("button", {
      className: "btn btn--primary add-to-cart",
      text: "Ajouter au panier",
      attrs: { type: "button", "data-product-id": produit.id }
    });
    if (produit.disponibilite === "out-of-stock") boutonAjout.disabled = true;

    infos.appendChild(creer("div", { className: "product-detail__actions" }, [
      boutonAjout,
      creer("a", { className: "btn btn--outline", text: "Continuer mes achats", attrs: { href: "boutique.html" } })
    ]));

    zone.appendChild(galerie);
    zone.appendChild(infos);
  }

  /* ===========================================================================
     12. PAGE PANIER (panier.html)
     Identifiants attendus dans le futur panier.html :
       #cart-items, #cart-empty, #cart-summary, #cart-total-items,
       #cart-subtotal, #cart-total, #cart-clear, #cart-order
     =========================================================================== */
  function creerLignePanier(detail) {
    const produit = detail.produit;
    const ligne = creer("article", { className: "cart-item", attrs: { "data-key": detail.cle } });

    ligne.appendChild(creer("img", {
      className: "cart-item__image",
      attrs: { src: produit.images[0].src, alt: produit.images[0].alt, width: "96", height: "96", loading: "lazy" }
    }));

    const infos = creer("div", { className: "cart-item__info" });
    infos.appendChild(creer("h3", { className: "cart-item__name" }, [
      creer("a", { text: produit.nom, attrs: { href: "produit.html?id=" + encodeURIComponent(produit.id) } })
    ]));
    if (detail.taille) {
      infos.appendChild(creer("p", { className: "cart-item__size", text: produit.typeTaille + " : " + detail.taille }));
    }
    infos.appendChild(creer("p", { className: "cart-item__price", text: formaterPrix(produit.prix) + " l'unité" }));
    ligne.appendChild(infos);

    const commandes = creer("div", {
      className: "cart-item__quantity",
      attrs: { role: "group", "aria-label": "Quantité de " + produit.nom }
    });
    const boutonMoins = creer("button", {
      className: "btn btn--outline cart-item__button",
      text: "−",
      attrs: { type: "button", "data-action": "decrease", "data-key": detail.cle, "aria-label": "Diminuer la quantité de " + produit.nom }
    });
    if (detail.quantite <= 1) boutonMoins.disabled = true;
    commandes.appendChild(boutonMoins);
    commandes.appendChild(creer("span", { className: "cart-item__quantity-value", text: String(detail.quantite) }));
    commandes.appendChild(creer("button", {
      className: "btn btn--outline cart-item__button",
      text: "+",
      attrs: { type: "button", "data-action": "increase", "data-key": detail.cle, "aria-label": "Augmenter la quantité de " + produit.nom }
    }));
    ligne.appendChild(commandes);

    ligne.appendChild(creer("p", { className: "cart-item__total", text: formaterPrix(detail.total) }));
    ligne.appendChild(creer("button", {
      className: "btn btn--outline cart-item__remove",
      text: "Supprimer",
      attrs: { type: "button", "data-action": "remove", "data-key": detail.cle, "aria-label": "Supprimer " + produit.nom + " du panier" }
    }));

    return ligne;
  }

  function initialiserPagePanier() {
    const liste = $("#cart-items");
    if (!liste) return;

    const zoneVide = $("#cart-empty");
    const zoneResume = $("#cart-summary");
    const boutonVider = $("#cart-clear");
    const boutonCommander = $("#cart-order");
    const boutonsOccupesPage = new WeakSet();

    function ecrire(selecteur, texte) {
      const zone = $(selecteur);
      if (zone) zone.textContent = texte;
    }

    function afficher(focusDemande) {
      liste.setAttribute("aria-busy", "true");
      liste.textContent = "";
      const details = detailsPanier();
      const vide = details.length === 0;

      details.forEach(function (detail) { liste.appendChild(creerLignePanier(detail)); });

      if (zoneVide) zoneVide.hidden = !vide;
      if (zoneResume) zoneResume.hidden = vide;
      if (boutonVider) boutonVider.hidden = vide;
      if (boutonCommander) boutonCommander.hidden = vide;

      ecrire("#cart-total-items", pluriel(nombreArticles(), "article", "articles"));
      ecrire("#cart-subtotal", formaterPrix(sousTotal()));
      ecrire("#cart-total", formaterPrix(sousTotal()));
      liste.removeAttribute("aria-busy");

      // Redonne le focus au clavier après le nouvel affichage
      if (focusDemande) {
        const meme = $('[data-key="' + focusDemande.cle + '"][data-action="' + focusDemande.action + '"]:not(:disabled)', liste);
        const autre = $('[data-key="' + focusDemande.cle + '"][data-action="increase"]', liste);
        const premier = $(".cart-item__remove", liste);
        const cible = meme || autre || premier || zoneVide;
        if (cible) {
          if (cible === zoneVide) cible.setAttribute("tabindex", "-1");
          cible.focus();
        }
      }
    }

    let focusPrecedent = null;

    liste.addEventListener("click", function (evenement) {
      if (!(evenement.target instanceof Element)) return;
      const bouton = evenement.target.closest("button[data-action]");
      if (!bouton) return;
      const cle = bouton.dataset.key || "";
      const action = bouton.dataset.action;
      focusPrecedent = { cle: cle, action: action };

      if (action === "increase") modifierQuantite(cle, 1);
      else if (action === "decrease") modifierQuantite(cle, -1);
      else if (action === "remove") supprimerLigne(cle);
    });

    document.addEventListener("huize:panier-modifie", function () {
      afficher(focusPrecedent);
      focusPrecedent = null;
    });

    if (boutonVider) {
      boutonVider.addEventListener("click", function () {
        if (panier.length === 0) return;
        if (window.confirm("Veux-tu vraiment vider tout le panier ?")) viderPanier();
      });
    }

    if (boutonCommander) {
      boutonCommander.addEventListener("click", function () {
        if (boutonsOccupesPage.has(boutonCommander)) return;
        boutonsOccupesPage.add(boutonCommander);
        window.setTimeout(function () { boutonsOccupesPage.delete(boutonCommander); }, 1000);

        if (panier.length === 0) {
          afficherMessage("Ton panier est vide.", "error");
          return;
        }
        // Aucun paiement ici : on ouvre WhatsApp avec le récapitulatif prêt.
        // Le message n'est envoyé que si la personne appuie sur « Envoyer ».
        if (ouvrirWhatsApp(construireMessageCommande())) {
          afficherMessage("WhatsApp s'ouvre avec ta commande prête. Elle ne sera envoyée que quand tu appuieras sur « Envoyer ».", "info");
        }
      });
    }

    afficher(null);
  }

  /* ===========================================================================
     13. PAGE CONTACT (contact.html)
     Identifiants attendus : #contact-form, #contact-name, #contact-info
     (téléphone ou e-mail), #contact-subject, #contact-message
     Sans serveur, le formulaire ne peut pas envoyer de message lui-même :
     une fois les champs valides, il ouvre WhatsApp avec le message prêt.
     =========================================================================== */
  function initialiserFormulaireContact() {
    const formulaire = $("#contact-form");
    if (!formulaire) return;

    const champs = [
      { id: "contact-name", libelle: "ton nom", verifier: function (v) { return v.length >= 2 ? "" : "Indique ton nom (au moins 2 lettres)."; } },
      {
        id: "contact-info", libelle: "ton téléphone ou ton e-mail",
        verifier: function (v) {
          if (v === "") return "Indique ton numéro de téléphone ou ton adresse e-mail.";
          // Avec un @ : on vérifie une adresse e-mail
          if (v.indexOf("@") !== -1) {
            const mailValide = v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
            return mailValide ? "" : "Cette adresse e-mail ne semble pas valide (exemple : nom@exemple.com).";
          }
          // Sinon : un numéro (chiffres, espaces, +, tirets, points, parenthèses ; 8 à 15 chiffres)
          const chiffres = v.replace(/\D/g, "").length;
          const telValide = /^\+?[\d\s().-]+$/.test(v) && chiffres >= 8 && chiffres <= 15;
          return telValide ? "" : "Indique un numéro valide (exemple : +226 01 23 45 67) ou une adresse e-mail.";
        }
      },
      { id: "contact-subject", libelle: "ton sujet", verifier: function (v) { return v !== "" ? "" : "Choisis un sujet."; } },
      { id: "contact-message", libelle: "ton message", verifier: function (v) { return v.length >= 10 ? "" : "Écris ton message (au moins 10 caractères)."; } }
    ];

    // Zone d'erreur liée au champ (créée si elle n'existe pas dans le HTML)
    function zoneErreur(champ) {
      const idErreur = "error-" + champ.id;
      let zone = document.getElementById(idErreur);
      if (!zone) {
        zone = creer("p", { className: "field__error", attrs: { id: idErreur } });
        zone.style.color = "var(--color-danger)";
        zone.style.fontSize = "0.9rem";
        champ.element.insertAdjacentElement("afterend", zone);
      }
      return zone;
    }

    function verifierChamp(champ) {
      const message = champ.verifier(champ.element.value.trim());
      const zone = zoneErreur(champ);
      zone.textContent = message;
      if (message) {
        champ.element.setAttribute("aria-invalid", "true");
        champ.element.setAttribute("aria-describedby", zone.id);
      } else {
        champ.element.removeAttribute("aria-invalid");
        champ.element.removeAttribute("aria-describedby");
      }
      return message === "";
    }

    const champsPresents = champs.filter(function (champ) {
      champ.element = document.getElementById(champ.id);
      return Boolean(champ.element);
    });

    champsPresents.forEach(function (champ) {
      // Une fois le champ visité, on re-vérifie quand la personne le quitte.
      champ.element.addEventListener("blur", function () {
        if (champ.element.value !== "") verifierChamp(champ);
      });
    });

    formulaire.setAttribute("novalidate", ""); // c'est ce script qui affiche les messages

    formulaire.addEventListener("submit", function (evenement) {
      evenement.preventDefault();

      let premierInvalide = null;
      champsPresents.forEach(function (champ) {
        if (!verifierChamp(champ) && !premierInvalide) premierInvalide = champ.element;
      });

      if (premierInvalide) {
        premierInvalide.focus();
        afficherMessage("Merci de corriger les champs indiqués.", "error");
        return;
      }

      const valeur = function (id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
      };
      const sujet = valeur("contact-subject");
      const message = "Bonjour HUIZE SHOP, je m'appelle " + valeur("contact-name") +
        " (" + valeur("contact-info") + ")." +
        (sujet ? "\nSujet : " + sujet : "") +
        "\n\n" + valeur("contact-message");

      if (ouvrirWhatsApp(message)) {
        afficherMessage("WhatsApp s'ouvre avec ton message prêt. Il ne sera envoyé que quand tu appuieras sur « Envoyer ».", "info");
      }
    });
  }

  /* ===========================================================================
     14. DIVERS
     =========================================================================== */
  function initialiserAnnee() {
    const zone = $("#copyright-year");
    if (zone) zone.textContent = String(new Date().getFullYear());
  }

  // Les liens « à venir » (href="#" + aria-disabled) ne font plus remonter la page.
  function initialiserLiensDesactives() {
    document.addEventListener("click", function (evenement) {
      if (!(evenement.target instanceof Element)) return;
      const lien = evenement.target.closest('a[aria-disabled="true"]');
      if (!lien) return;
      evenement.preventDefault();
      afficherMessage("Cette fonctionnalité sera bientôt disponible.", "info");
    });
  }

  // Le panier se met à jour si la boutique est ouverte dans un autre onglet.
  function initialiserSynchronisationOnglets() {
    window.addEventListener("storage", function (evenement) {
      if (evenement.key !== null && evenement.key !== CONFIG.STORAGE_KEY) return;
      panier = chargerPanier();
      mettreAJourCompteur();
      document.dispatchEvent(new CustomEvent("huize:panier-modifie"));
    });
  }

  // Image de remplacement : si une photo est absente ou mal nommée, on affiche
  // un cadre clair « Photo à venir » au lieu d'une image cassée.
  const IMAGE_DE_REMPLACEMENT = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">' +
    '<rect width="400" height="400" fill="#EEF1EC"/>' +
    '<text x="200" y="208" text-anchor="middle" font-family="Arial, sans-serif" ' +
    'font-size="22" fill="#5B6B62">Photo à venir</text></svg>'
  );

  function remplacerImageCassee(image) {
    if (image.dataset.remplacee === "true") return; // évite une boucle infinie
    image.dataset.remplacee = "true";
    image.src = IMAGE_DE_REMPLACEMENT;
  }

  function initialiserImagesDeRemplacement() {
    // L'événement "error" ne « remonte » pas : on l'écoute en phase de capture.
    // Cela couvre aussi les images créées plus tard par ce script.
    document.addEventListener("error", function (evenement) {
      if (evenement.target instanceof HTMLImageElement) remplacerImageCassee(evenement.target);
    }, true);

    // Images déjà en échec avant le démarrage du script
    $$("img").forEach(function (image) {
      if (image.complete && image.naturalWidth === 0 && image.getAttribute("src")) {
        remplacerImageCassee(image);
      }
    });
  }

  /* ===========================================================================
     15. DÉMARRAGE
     Chaque bloc est protégé : si l'un échoue, les autres continuent de marcher.
     =========================================================================== */
  function executer(nom, fonction) {
    try {
      fonction();
    } catch (erreur) {
      console.error("[HUIZE SHOP] Erreur dans « " + nom + " » :", erreur);
    }
  }

  function demarrer() {
    executer("panier (chargement)", function () { panier = chargerPanier(); });
    executer("zone de messages", creerZoneMessage);
    executer("année", initialiserAnnee);
    executer("images de remplacement", initialiserImagesDeRemplacement);
    executer("menu mobile", initialiserMenu);
    executer("WhatsApp", initialiserWhatsApp);
    executer("compteur du panier", mettreAJourCompteur);
    executer("catalogue", initialiserCatalogue);
    executer("page produit", initialiserPageProduit);
    executer("ajout au panier", initialiserAjoutAuPanier);
    executer("page panier", initialiserPagePanier);
    executer("formulaire de contact", initialiserFormulaireContact);
    executer("liens désactivés", initialiserLiensDesactives);
    executer("synchronisation des onglets", initialiserSynchronisationOnglets);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
/* Carrousel publicitaire HUIZE SHOP : les images changent toutes les 5 secondes. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ad-carousel]').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('[data-ad-slide]'));
    const dotsHost = carousel.querySelector('[data-ad-dots]');
    const prev = carousel.querySelector('[data-ad-prev]');
    const next = carousel.querySelector('[data-ad-next]');
    const pauseButton = carousel.querySelector('[data-ad-pause]');
    if (!slides.length || !dotsHost) return;
    let index = 0, timer = null, paused = false;
    const stopVideo = (slide) => { const video = slide.querySelector('video'); if (video) video.pause(); };
    const schedule = () => {
      clearTimeout(timer);
      if (!paused && !slides[index].querySelector('video')) timer = setTimeout(() => show(index + 1), 5000);
    };
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button'); dot.type = 'button'; dot.className = 'ad-carousel__dot';
      dot.setAttribute('aria-label', `Afficher la publicité ${i + 1}`);
      dot.addEventListener('click', () => show(i)); dotsHost.appendChild(dot); return dot;
    });
    function show(nextIndex) {
      stopVideo(slides[index]); index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== index; slide.classList.toggle('is-active', i === index); dots[i].setAttribute('aria-current', i === index ? 'true' : 'false'); });
      schedule();
    }
    prev?.addEventListener('click', () => show(index - 1));
    next?.addEventListener('click', () => show(index + 1));
    pauseButton?.addEventListener('click', () => { paused = !paused; pauseButton.setAttribute('aria-pressed', String(paused)); pauseButton.textContent = paused ? 'Reprendre le défilement' : 'Mettre en pause'; schedule(); });
    carousel.addEventListener('mouseenter', () => clearTimeout(timer));
    carousel.addEventListener('mouseleave', schedule);
    slides.forEach((slide) => { const video = slide.querySelector('video'); if (video) { video.addEventListener('play', () => clearTimeout(timer)); video.addEventListener('ended', () => show(index + 1)); } });
    show(0);
  });

});
