function createWorks(works) {
  // console.log(project);
  for (let i = 0; i < works.length; i++) {
    console.log(works[i]);
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
    createWorks(works);
  } catch (error) {
    console.error(`Une erreur est survenue : ${error}`);
  }
}

getWorks();
