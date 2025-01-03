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

/* Fonction pour supprimer un projet */
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
    const works = await updatedWorks.json();
    // Mettre à jour la galerie et les onglets de filtres
    createTabs(works);
    createWorks(works);
    filterWorks(works);
    console.log(`Project with id ${projectId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting project with id ${projectId}:`, error);
  }
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

/* Ajouter les catégories des projets à l'élément select */
function fillCategoriesSelect(categories) {
  const categoriesSelect = document.getElementById('categories');
  categories.forEach((categorie) => {
    const option = document.createElement('option');
    option.value = categorie.id;
    option.text = categorie.name;
    categoriesSelect.appendChild(option);
  });
}

/* Récupérer les categories depuis l'API */
async function getCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    fillCategoriesSelect(categories);
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

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

/* Ajouter les interactions des modales */
function addModalInteractions() {
  const modalFirst = document.getElementById('modal-1');
  const modalSecond = document.getElementById('modal-2');
  const closeButtons = document.querySelectorAll('.modal-button.close');
  const modals = document.querySelectorAll('.modal');
  const addButton = document.getElementById('add-button');
  const previousButton = document.getElementById('previous-button');

  // Fonction pour afficher la modale
  function showModal() {
    modalFirst.style.display = 'flex';
  }

  // Afficher la modale au clic sur le bouton "modifier"
  document.querySelector('#edit-button').addEventListener('click', showModal);

  // Fonction pour fermer une modale
  function closeModal(modalElement) {
    const targetModal = modalElement;
    targetModal.style.display = 'none';
  }

  // Fonction pour détecter les clics en dehors de "modal-content"
  function outsideClick(event, modal) {
    if (!event.target.closest('.modal-content')) {
      closeModal(modal);
    }
  }

  // Ajouter les événements de fermeture à chaque modale
  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => outsideClick(event, modal));
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const modal = event.target.closest('.modal');
      closeModal(modal);
    });
  });

  // Ouvrir la deuxième modale et fermer la première
  addButton.addEventListener('click', () => {
    modalFirst.style.display = 'none';
    modalSecond.style.display = 'flex';
  });

  // Revenir à la première modale depuis la deuxième
  previousButton.addEventListener('click', () => {
    modalSecond.style.display = 'none';
    modalFirst.style.display = 'flex';
  });

  /* Activer le bouton submit */
  function enableSubmit(fileError, titleError) {
    const inputSubmitWork = document.getElementById('input-submit-work');
    if (fileError.innerText === '' && titleError.style.display === 'none') {
      inputSubmitWork.removeAttribute('disabled');
      inputSubmitWork.removeAttribute('title');
      inputSubmitWork.classList.remove('button-disabled');
    }
  }

  /* Vérifier l'image et afficher la preview */
  function checkFile() {
    const fileInput = document.getElementById('img-file-input');
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
  checkFile();

  /* Vérifier le titre */
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
  checkTitle();
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

/* Ajouter un projet */
async function addWork() {
  const form = document.getElementById('add-work-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    console.log(formData);
    /* const titleInput = document.getElementById('title');
    const categoriesSelect = document.getElementById('categories');
    const fileInput = document.getElementById('img-file-input'); */

    // Récupérer les données du formulaire
    /* const title = titleInput.value;
    const categoryId = categoriesSelect.value;
    const file = fileInput.files[0]; */

    // Créer un objet FormData
    /* const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId); */

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
      /* if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Erreur lors de l'ajout du projet : ${errorDetails}`);
      }

      const result = await response.json();
      console.log('Projet ajouté avec succès :', result);

      // Réinitialiser le formulaire et actualiser la galerie
      titleInput.value = '';
      fileInput.value = '';
      document.getElementById('img-preview').style.display = 'none';
      document.getElementById('img-upload-zone-content').style.display = 'flex';

      const updatedWorks = await fetch('http://localhost:5678/api/works');
      const works = await updatedWorks.json();
      document.querySelector('.gallery').innerHTML = '';
      createWorks(works); */
    } catch (error) {
      console.error('Erreur :', error);
      console.log("Une erreur est survenue lors de l'ajout du projet.");
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  getWorks();
  getCategories();
  addWork();
});
