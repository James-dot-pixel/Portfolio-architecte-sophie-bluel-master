function createWorks(works) {
  // console.log(project);
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

async function getWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    // Récupérer les catégories
    const categoriesNames = works.map((work) => work.category.name);
    const projectsCategories = new Set(categoriesNames);
    // Créer le html
    const categoriesTabsWrapper = document.querySelector('.tabs');
    const categoriesTabs = document.createElement('ul');
    categoriesTabsWrapper.appendChild(categoriesTabs);
    // Ajouter les catégories aux tabs
    projectsCategories.forEach((element) => {
      const categoriesTab = document.createElement('li');
      categoriesTab.className = 'categories-tabs';
      const categoriesTabLink = document.createElement('a');
      categoriesTabLink.innerText = element;
      categoriesTab.appendChild(categoriesTabLink);
      categoriesTabs.appendChild(categoriesTab);
    });
    //
    createWorks(works);
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

getWorks();
