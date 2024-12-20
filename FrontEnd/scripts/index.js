/* Afficher les projets */
function createWorks(works) {
  for (let i = 0; i < works.length; i++) {
    const project = works[i];
    const gallery = document.querySelector('.gallery');
    const projectFigure = document.createElement('figure');
    const projectImg = document.createElement('img');
    projectImg.src = project.imageUrl;
    projectImg.alt = project.title;
    const projectFigCaption = document.createElement('figcaption');
    projectFigCaption.innerText = project.title;
    projectFigure.appendChild(projectImg);
    projectFigure.appendChild(projectFigCaption);
    gallery.appendChild(projectFigure);
  }
}

/* Créer les onglets de filtrage par catégories */
function createTabs(works) {
  // Récupérer les catégories
  const categoriesNames = works.map((work) => work.category.name);
  const projectsCategories = new Set(categoriesNames);
  // Créer le html
  const categoriesTabsWrapper = document.querySelector('.tabs');
  const categoriesTabs = document.createElement('ul');
  categoriesTabsWrapper.appendChild(categoriesTabs);
  // Créer le tab "Tous"
  const categoriesTabAll = document.createElement('li');
  const categoriesTabAllLink = document.createElement('a');
  categoriesTabAllLink.innerText = 'Tous';
  categoriesTabAll.appendChild(categoriesTabAllLink);
  categoriesTabs.appendChild(categoriesTabAll);
  // Ajouter les catégories aux tabs
  projectsCategories.forEach((element) => {
    const categoriesTab = document.createElement('li');
    const categoriesTabLink = document.createElement('a');
    categoriesTabLink.innerText = element;
    categoriesTab.appendChild(categoriesTabLink);
    categoriesTabs.appendChild(categoriesTab);
  });
}

/* Filtrer les projets par catégorie */
function filterWorks(works) {
  // Récupérer la gallerie de projet
  const gallery = document.querySelector('.gallery');
  // Récupérer les liens des tabs
  const tabs = document.querySelectorAll('.tabs ul li');
  // Filtrer la gallerie par catégorie
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      console.log(event.target.innerText);
      if (event.target.innerText === 'Tous') {
        console.log('Tous');
        gallery.innerHTML = '';
        createWorks(works);
      } else {
        console.log('Filtre');
        const worksFiltered = works.filter(
          (work) => work.category.name === event.target.innerText,
        );
        gallery.innerHTML = '';
        createWorks(worksFiltered);
      }
    });
  });
}

/* Afficher les prévisualisations des projets dans la galerie de la modale */
function createPreviews(works) {
  const modalGallery = document.querySelector('.modal-gallery');
  works.forEach((project) => {
    const previewWrapper = document.createElement('div');
    previewWrapper.classList.add('preview-wrapper');

    // Créer une img avec la classe "preview-img" et définir sa source
    const previewImg = document.createElement('img');
    previewImg.classList.add('preview-img');
    previewImg.src = project.imageUrl;

    // Créer un div avec la classe "delete-button"
    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete-button');

    // Créer une img pour le bouton de suppression et définir sa source
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/icons/trash-can-solid.svg';

    // Ajouter les éléments à la galerie de la modale
    modalGallery.appendChild(previewWrapper);
    previewWrapper.appendChild(previewImg);
    previewWrapper.appendChild(deleteButton);
    deleteButton.appendChild(deleteIcon);
  });
}

/* Récupérer les projets depuis l'API */
async function getWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    createTabs(works);
    createWorks(works);
    filterWorks(works);
    createPreviews(works);
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

getWorks();

/* Afficher la bannière de mode édition */
function createEditBanner() {
  const body = document.querySelector('body');
  const editBanner = document.createElement('div');
  editBanner.id = 'edition-banner';
  const editBannerIcon = document.createElement('img');
  editBannerIcon.src = 'assets/icons/edit.png';
  const editBannerText = document.createElement('p');
  editBannerText.innerText = 'Mode édition';
  body.appendChild(editBanner);
  editBanner.appendChild(editBannerIcon);
  editBanner.appendChild(editBannerText);
  body.style.marginTop = '97px';
}

/* Afficher le bouton d'édition */
function createEditButton() {
  const portfolio = document.getElementById('portfolio');
  const tabs = document.querySelector('.tabs');
  const heading = document.querySelector('#portfolio h2');
  const headingWrapper = document.createElement('div');
  headingWrapper.id = 'heading-wrapper';
  const editButton = document.createElement('a');
  editButton.id = 'edit-button';
  const editIcon = document.createElement('img');
  editIcon.src = 'assets/icons/edit-black.png';
  const editText = document.createElement('p');
  editText.innerText = 'modifier';
  portfolio.insertBefore(headingWrapper, tabs);
  editButton.appendChild(editIcon);
  editButton.appendChild(editText);
  headingWrapper.appendChild(heading);
  headingWrapper.appendChild(editButton);
}

/* Changer bouton login pour logout */
function changeLoginToLogout() {
  const loginLink = document.getElementById('login-link');
  loginLink.innerText = 'logout';
  loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.localStorage.removeItem('token');
    window.location.reload();
  });
}

/* Ajouter l'ouverture et fermeture de la modale */
function addModalInteractions() {
  const modalFirst = document.getElementById('modal-1');
  const closeButton = document.querySelector('.close-button');
  const modal = document.querySelector('.modal');
  // Fonction pour afficher la modale
  function showModal() {
    modalFirst.style.display = 'block';
  }
  // Afficher la modale au clic sur le bouton "modifier"
  document.querySelector('#edit-button').addEventListener('click', showModal);
  // Fonction pour fermer la modale
  function closeModal(event) {
    // Vérifie si le clic est en dehors de modal-content ou sur la close-button
    if (!event.target.closest('.modal-content')) {
      modal.style.display = 'none';
    }
  }
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  modal.addEventListener('click', closeModal);
}

/* Afficher les éléments du statut "connecté" */
function displayLogged() {
  const token = window.localStorage.getItem('token');
  if (token !== null) {
    createEditBanner();
    createEditButton();
    changeLoginToLogout();
    addModalInteractions();
  }
}

displayLogged();
