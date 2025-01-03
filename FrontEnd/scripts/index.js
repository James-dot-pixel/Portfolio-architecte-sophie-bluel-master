/* RÉCUPÉRER LES PROJETS DEPUIS L'API ET LES STOCKER DANS UNE VARIABLE */
let works = null;

async function getWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
    works = data;
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

/* RÉCUPÉRER LES CATÉGORIES DEPUIS L'API ET LES STOCKER DANS UNE VARIABLE */
let categories = null;

async function getCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const data = await response.json();
    categories = data;
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

/* MAIN - AFFICHER LES PROJETS */
function createWorks(worksArray) {
  for (let i = 0; i < worksArray.length; i++) {
    const project = worksArray[i];
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

/* MAIN - CRÉER LES ONGLETS DE FILTRAGE PAR CATÉGORIES */
function createTabs() {
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

/* MAIN - FILTRER LES PROJETS PAR CATÉGORIE */
function filterWorks() {
  // Récupérer la gallerie de projet
  const gallery = document.querySelector('.gallery');
  // Récupérer les liens des tabs
  const tabs = document.querySelectorAll('.tabs ul li');
  // Filtrer la gallerie par catégorie
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      if (event.target.innerText === 'Tous') {
        gallery.innerHTML = '';
        createWorks(works);
      } else {
        const worksFiltered = works.filter(
          (work) => work.category.name === event.target.innerText,
        );
        gallery.innerHTML = '';
        createWorks(worksFiltered);
      }
    });
  });
}

/* STATUT "CONNECTÉ" - Afficher la bannière de mode édition */
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

/* STATUT "CONNECTÉ" - Afficher le bouton d'édition */
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

/* STATUT "CONNECTÉ" - Changer bouton login pour logout */
function changeLoginToLogout() {
  const loginLink = document.getElementById('login-link');
  loginLink.innerText = 'logout';
  loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.localStorage.removeItem('token');
    window.location.reload();
  });
}

/* MODALES - VARIABLES */
const modalFirst = document.getElementById('modal-1');
const modalSecond = document.getElementById('modal-2');
const closeButtons = document.querySelectorAll('.modal-button.close');
const modals = document.querySelectorAll('.modal');
const addButton = document.getElementById('add-button');
const previousButton = document.getElementById('previous-button');

/* MODALES - AFFICHER LA PREMIÈRE MODALE */
function showModal() {
  modalFirst.style.display = 'flex';
}

/* MODALES - FERMER UNE MODALE */
function closeModal(modalElement) {
  const targetModal = modalElement;
  targetModal.style.display = 'none';
}

/* MODALES - DÉTECTER LES CLICS EN DEHORS DES MODALES */
function outsideClick(event, modal) {
  if (!event.target.closest('.modal-content')) {
    closeModal(modal);
  }
}

/* MODALE 1 - SUPPRIMER UN PROJET */
async function deleteWorks(projectId) {
  const apiUrl = `http://localhost:5678/api/works/${projectId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete project with id ${projectId}`);
    }
    // Récupérer les projets mis à jour depuis l'API
    const updatedWorks = await fetch('http://localhost:5678/api/works');
    works = await updatedWorks.json();
    // Mettre à jour la galerie et les onglets de filtres
    createTabs(works);
    createWorks(works);
    filterWorks(works);
    console.log(`Project with id ${projectId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting project with id ${projectId}:`, error);
  }
}

/* MODALE 1 - AFFICHER LES PRÉVISUALISATIONS DES PROJETS */
function createPreviews() {
  const modalGallery = document.querySelector('.modal-gallery');
  works.forEach((project) => {
    const previewWrapper = document.createElement('div');
    previewWrapper.classList.add('preview-wrapper');

    // Créer une img avec la classe "preview-img" et définir sa source
    const previewImg = document.createElement('img');
    previewImg.classList.add('preview-img');
    previewImg.src = project.imageUrl;

    // Créer un div avec la classe "delete-button"
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteWorks(project.id));

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

/* MODALE 2 - AJOUTER LES CATÉGORIES DES PROJETS AU SELECT */
function fillCategoriesSelect() {
  const categoriesSelect = document.getElementById('category');
  categories.forEach((categorie) => {
    const option = document.createElement('option');
    option.setAttribute('value', categorie.id);
    option.text = categorie.name;
    categoriesSelect.appendChild(option);
  });
}

/* MODALE 2 - ACTIVER LE BOUTON SUBMIT */
function enableSubmit(fileError, titleError) {
  const inputSubmitWork = document.getElementById('input-submit-work');
  if (fileError.innerText === '' && titleError.style.display === 'none') {
    inputSubmitWork.removeAttribute('disabled');
    inputSubmitWork.removeAttribute('title');
    inputSubmitWork.classList.remove('button-disabled');
  }
}

/* MODALE 2 - VÉRIFIER L'IMAGE ET AFFICHER LA PRÉVISUALISATION */
function checkFile() {
  const fileInput = document.getElementById('image');
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const fileError = document.getElementById('upload-error');
    const titleError = document.getElementById('title-error');

    // Vérifier si l'image est en jpg ou png
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      fileError.innerText = 'Veuillez importer une image (JPEG ou PNG)';
      fileError.style.display = 'block';
      return;
    }

    // Vérifier si la taille de l'image est inférieure a 4Mo
    const maxSizeMB = 4;
    const maxSizeMO = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeMO) {
      fileError.innerText = 'Veuillez importer une image inférieure a 4Mo';
      fileError.style.display = 'block';
      return;
    }

    const reader = new FileReader();
    reader.onload = (element) => {
      const imgPreview = document.getElementById('img-preview');
      const imgUploadZoneContent = document.getElementById(
        'img-upload-zone-content',
      );
      imgPreview.src = element.target.result;
      imgPreview.style.display = 'block';
      imgUploadZoneContent.style.display = 'none';
    };
    reader.readAsDataURL(file);
    fileError.innerText = '';
    enableSubmit(fileError, titleError);
  });
}

/* MODALE 2 - VÉRIFIER LE TITRE */
function checkTitle() {
  const inputTitle = document.getElementById('title');
  const titleError = document.getElementById('title-error');
  const fileError = document.getElementById('upload-error');
  inputTitle.addEventListener('blur', () => {
    if (inputTitle.value === '') {
      titleError.innerText = 'Veuillez ajouter un titre';
      titleError.style.display = 'block';
    } else {
      titleError.style.display = 'none';
    }
    enableSubmit(fileError, titleError);
  });
}

/* MODALES - AJOUTER LES INTÉRACTIONS */
function addModalInteractions() {
  // Afficher la première modale au clic sur le bouton "modifier"
  document.querySelector('#edit-button').addEventListener('click', showModal);

  // Fermer la modale au clic en dehors de la modale
  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => outsideClick(event, modal));
  });

  // Fermer la modale au clic sur bouton "fermer"
  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const modal = event.target.closest('.modal');
      closeModal(modal);
    });
  });

  // Ouvrir la deuxième modale et fermer la première au clic sur bouton "Ajouter une photo"
  addButton.addEventListener('click', () => {
    modalFirst.style.display = 'none';
    modalSecond.style.display = 'flex';
  });

  // Revenir à la première modale depuis la deuxième au clic sur bouton précédent
  previousButton.addEventListener('click', () => {
    modalSecond.style.display = 'none';
    modalFirst.style.display = 'flex';
  });
  createPreviews();
  checkFile();
  checkTitle();
  fillCategoriesSelect();
}

/* STATUT "CONNECTÉ" - AFFICHER LES ÉLÉMENTS ET INTERACTIONS */
function displayLogged() {
  const token = window.localStorage.getItem('token');
  if (token !== null) {
    createEditBanner();
    createEditButton();
    changeLoginToLogout();
    addModalInteractions();
  }
}

/* STATUT "CONNECTÉ" - AJOUTER UN PROJET */
async function addWork() {
  const form = document.getElementById('add-work-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    console.log(formData);
    const titleInput = document.getElementById('title');
    const fileInput = document.getElementById('img-file-input');

    try {
      const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          accept: 'application/json',
        },
        body: formData,
      });
      console.log(response);
      const result = await response.json();
      console.log('Projet ajouté avec succès :', result);

      // Réinitialiser le formulaire et actualiser la galerie
      titleInput.value = '';
      fileInput.value = '';
      document.getElementById('img-preview').style.display = 'none';
      document.getElementById('img-upload-zone-content').style.display = 'flex';

      // Actualiser la galerie
      document.querySelector('.gallery').innerHTML = '';
      // await getWorks();
      // createWorks();
    } catch (error) {
      console.error('Erreur :', error);
      console.log("Une erreur est survenue lors de l'ajout du projet.");
    }
  });
}

/* ATTENDRE LE CHARGEMENT COMPLET DU DOM ET EXECUTER LES FONCTIONS */
document.addEventListener('DOMContentLoaded', async () => {
  // Attendre la récupération des projets et des catégories
  await getWorks();
  await getCategories();
  createTabs();
  createWorks(works);
  filterWorks();
  displayLogged();
  addWork();
});
